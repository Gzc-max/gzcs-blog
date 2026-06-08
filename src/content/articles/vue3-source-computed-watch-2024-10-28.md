---
title: Vue3 源码笔记：computed 和 watch 为什么一个偏缓存一个偏副作用
date: 2024-10-28
category: Vue.js
tags: [Vue3, 源码学习, computed, watch, reactivity]
summary: 顺着 computed.ts 和 watch.ts 的实现往下看，梳理 Vue3 是怎么用同一套响应式底座分化出“带缓存的派生值”和“可调度的副作用观察者”两类能力。
---

今天读下来，我没有继续往组件 patch 那层走，而是回头补了一段自己平时最常用、但源码里很容易被想当然的能力：`computed` 和 `watch`。

业务里天天写这两个 API，很容易形成一种过于顺手的印象: `computed` 就是自动算出来的值，`watch` 就是值变化后执行回调。这个理解对使用没问题，但一旦放回源码，很快就会冒出几个更硬的问题：

- 为什么 `computed` 连续读取多次不会反复执行 getter；
- 为什么它依赖变了之后不是立刻重算，而是先“脏掉”；
- 为什么 `watch` 能拿到 `newValue` 和 `oldValue`；
- 为什么 `watch` 又能接上 `flush: 'pre' | 'post' | 'sync'` 这套调度时机。

我理解下来，`computed` 和 `watch` 并不是两套互不相干的设计。它们都站在 `ReactiveEffect` 这套响应式底座上，只是一个把重点放在“缓存和按需求值”，另一个把重点放在“依赖变更后的副作用调度”。

## 为什么今天先看这段

最近顺着 Vue3 源码往下看时，我越来越觉得很多运行时行为不能只停在 API 记忆层。尤其是这两个场景，项目里太常见了：

- 一个 `computed` 里包了点重逻辑，大家默认它“应该很省”；
- 一个 `watch` 里顺手做异步请求、DOM 读取或者状态回写，最后时序开始打架。

这些问题表面看像“使用习惯”，其实源码层早就把边界写得很清楚了。只是不把 `computed.ts` 和 `watch.ts` 真正串一下，很容易把它们都混成“响应式变化后会自动做点事”。

## 先看 `computed`：它不是普通 effect，而是一个可订阅的派生值容器

`computed` 的入口在 `packages/reactivity/src/computed.ts`。如果先不看实现细节，我觉得最重要的认知是：**computed 本身既是一个订阅者，也是一个可被继续订阅的响应式来源。**

这句话初看有点绕，拆开就好理解：

- 它会订阅自己的上游依赖，比如 `state.count`；
- 它本身又暴露 `.value`，供下游 effect、组件 render 或其他 computed 继续依赖。

所以它不是“包了一层 getter 的 ref”这么简单，而是站在响应式图中间的一层节点。

## `ComputedRefImpl` 的核心不是 getter，而是脏标记

我今天重新看这段时，最想强调的其实不是 `get value()`，而是内部那套 dirty 语义。

可以先把核心结构压成这样：

```ts
class ComputedRefImpl<T> {
  _value: T
  dep: Dep
  flags: EffectFlags
  globalVersion: number

  constructor(getter, setter) {
    this.fn = getter
    this.setter = setter
  }

  get value() {
    this.dep.track()
    refreshComputed(this)
    return this._value
  }
}
```

真正关键的是 `refreshComputed(this)`。读取 `computed.value` 时，Vue 不是每次都直接执行 getter，而是先判断这个 computed 现在是不是“脏的”，以及当前全局响应式版本有没有变化。

也就是说，**computed 的缓存不是靠“记住上一次结果就完事”，而是靠一套明确的失效机制。**

## 为什么依赖变了，computed 先失效而不是立刻重算

很多人第一次接触实现时会下意识觉得：既然依赖变了，那就马上重新执行 getter 不就好了？但 Vue3 没这么做。

上游依赖触发时，computed 的 scheduler 更像是在做这件事：

```ts
scheduler = () => {
  if (!(flags & DIRTY)) {
    flags |= DIRTY
    dep.trigger()
  }
}
```

它先把当前 computed 标成 dirty，再通知依赖它的下游“这个值可能变了，你们后面要是读它，就重新求一次”。

这里的取舍我觉得非常工程化：

- 如果依赖虽然变了，但这轮里根本没人再读这个 computed，就没必要白算；
- 如果同一轮里上游改了很多次，computed 也不需要跟着重复执行多次 getter；
- 真正的求值延迟到下一次访问 `.value` 时发生，这才叫按需计算。

这也是为什么 `computed` 适合承载派生状态，而不是副作用。它的设计目标从一开始就是“需要时给你一个最新结果”，不是“上游一变立刻做动作”。

## 读取 `computed.value` 时发生了什么

把链路顺一下，大概是这样：

1. 下游代码读取 `computed.value`。
2. `computed.dep.track()` 记录“谁在依赖这个 computed”。
3. `refreshComputed()` 检查 dirty 状态和版本号。
4. 如果需要重算，就执行 getter。
5. getter 内部读取到的响应式值，会把当前 computed 收集为订阅者。
6. 新结果写回 `_value`，清掉 dirty 标记。

这条链路里我觉得很容易忽略的一点是：**computed 的 getter 执行时，当前活跃订阅者不再是外层组件 render 或 effect，而是这个 computed 自己。**

所以依赖关系其实是分层的：

```txt
state.count -> computed(total) -> component render
```

而不是组件 render 直接同时依赖了 `state.count` 和 `total.value`。这也是 computed 能起到“中间缓存层”作用的原因。

## 一个容易误解的点：computed 不是“天然便宜”，只是避免了无效重算

这算是我今天重新确认的一件事。业务里经常有人把重逻辑往 `computed` 里塞，然后默认它一定不会有成本问题。源码层看，这个结论并不严谨。

更准确地说：

- 同一批依赖没变时，重复读取 computed，确实能直接复用缓存；
- 但只要依赖失效，下一次读取还是要老老实实重新执行 getter；
- 如果 getter 本身很重，而且依赖又频繁变化，它依然可能成为性能热点。

所以 `computed` 的价值是减少无意义的重复求值，不是给重计算开免死金牌。

## 再看 `watch`：它本质上是带回调和调度策略的 effect

`watch` 这层主要在 `packages/reactivity/src/watch.ts`。今天我理解下来，`watch` 最核心的工作其实有两件：

- 先定义“该追踪什么”；
- 再定义“追踪到变化后怎么调回调”。

如果压成一个比较粗的伪代码，思路大概像这样：

```ts
function doWatch(source, cb, options) {
  const getter = normalizeSource(source)
  let oldValue

  const job = () => {
    const newValue = effect.run()
    if (hasChanged(newValue, oldValue)) {
      cb(newValue, oldValue)
      oldValue = newValue
    }
  }

  const effect = new ReactiveEffect(getter, schedulerFor(job, options.flush))
}
```

真实源码比这复杂很多，要处理多数据源、深度遍历、cleanup、立即执行、SSR 和错误边界，但主线就是：

- `getter` 决定 watch 到底依赖谁；
- `ReactiveEffect` 负责收集这些依赖；
- `job` 负责在依赖变化后比较新旧值并触发用户回调；
- scheduler 决定这个 job 是同步跑，还是放进调度队列里。

## `watch` 和 `watchEffect` 的分界，在“值比较”这一步

这两个 API 平时用起来很像，但源码思路差异其实挺清楚。

### `watchEffect`

它没有显式 source，传入的函数会直接作为响应式副作用执行。运行时访问到什么，就订阅什么。它更接近“自动依赖收集版副作用”。

### `watch`

它会先把 `source` 归一成一个 getter，然后通过 getter 的返回值参与对比。只有当新旧值判定为发生变化时，回调才会触发。

所以我更愿意把它们理解成：

- `watchEffect` 关心的是执行过程依赖了谁；
- `watch` 关心的是指定观察源的值有没有变化。

这也是为什么 `watch` 能更稳定地提供 `newValue` 和 `oldValue`，而 `watchEffect` 更适合写那种“依赖变了我就重跑整段副作用”的逻辑。

## `watch` 为什么能拿到旧值

答案其实不复杂，但很值得回到实现上确认。它没有什么额外魔法，就是 effect 初次运行后把结果缓存到 `oldValue`，后续每次 job 执行时再重新跑一遍 getter 拿到 `newValue`。

大致过程是：

1. 初始化阶段先执行一次 getter，得到 `oldValue`。
2. 依赖变化后，scheduler 安排 `job` 执行。
3. `job` 再次调用 `effect.run()`，拿到 `newValue`。
4. 对比 `newValue` 和 `oldValue`。
5. 如果需要触发回调，就把两者传进去，然后更新 `oldValue`。

这里也能看出 `watch` 和 `computed` 的一个本质差别：

- `computed` 关注“当前派生值是多少”；
- `watch` 关注“这次和上次相比变成了什么”。

前者偏状态读取，后者偏变更通知。

## 深度监听不是神奇开关，本质上是主动遍历

`watch(source, cb, { deep: true })` 这类写法平时很常见，但源码里并不存在“对象深层属性自动被全部追踪”的特殊捷径。

Vue3 的做法更朴素：如果需要深度监听，就在 getter 阶段对结果做一次递归遍历，把可能访问到的嵌套属性都读一遍。这样 Proxy 的 `get` 才有机会把这些深层依赖全部收集进来。

这也解释了两个很现实的工程现象：

- 深度 watch 不是免费的，它可能引入可观的遍历成本；
- 数据结构一复杂，`deep: true` 往往就不该成为默认解法。

源码读到这里，我会更倾向于把深度 watch 当成“必要时使用的兜底能力”，而不是响应式系统默认就擅长处理的路径。

## cleanup 机制解决的是副作用重入问题

`watch` 另一个我今天比较在意的点，是回调里的 cleanup。

常见场景是这样的：

```ts
watch(query, async (value, _, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())

  await fetch(`/search?q=${value}`, {
    signal: controller.signal
  })
})
```

源码层它解决的不是语法糖问题，而是“上一次副作用还没收尾，下一次变化又来了”这个非常真实的工程问题。每次 job 重新执行前，Vue 会先调用上一次注册的 cleanup，把旧副作用残留清理掉。

这套机制对异步请求、事件订阅、定时器都很关键。否则 watch 回调一旦和外部系统打交道，很容易出现过期结果回写、重复订阅或者资源泄漏。

## `watch` 能接上调度器，关键在 scheduler 而不是回调本身

前面看 scheduler 那篇时，我更关心的是组件更新队列。今天再回到 `watch`，会发现它和调度器接得非常自然。

`flush: 'pre' | 'post' | 'sync'` 并不是 watch 特有的“附加属性”，本质上是在决定 job 用哪种 scheduler：

- `pre`：在组件更新前执行；
- `post`：排到组件更新后执行；
- `sync`：依赖一触发就直接执行。

这也解释了为什么 `watch` 的设计比 `computed` 更偏副作用系统。它不是只返回一个值，而是明确允许你把“变化后要做的事”挂进 Vue 的更新时序里。

## 一个小例子：为什么这两个能力应该分开用

```ts
const price = ref(10)
const count = ref(2)

const total = computed(() => price.value * count.value)

watch(total, (value) => {
  console.log('total changed:', value)
})
```

放回源码视角，这里其实分成了两层：

- `computed(total)` 负责缓存派生值，并在依赖失效后按需重算；
- `watch(total, cb)` 负责观察这个派生值何时真正发生变化，并在变化后执行副作用。

如果把所有事情都塞进 `watch`，你会失去缓存和派生值复用；如果把副作用硬塞进 `computed`，又会把“读取值”和“执行动作”混在一起。源码层这两层职责切得很明确，我觉得业务代码里也应该顺着这个边界写。

## 今天这段源码给我的结论

- `computed` 的核心不是“自动计算”，而是“脏标记 + 按需求值 + 可继续被订阅”；
- `watch` 的核心不是“监听某个值”，而是“通过 getter 收集依赖，再把变化交给带调度能力的 job”；
- 两者都建立在同一套 `ReactiveEffect` 和 `Dep` 之上，只是一个偏派生状态，一个偏副作用时序；
- 深度 watch、同步 flush、在 watch 里随手写复杂副作用，这些都不是源码鼓励你默认走的轻路径。

今天把这段放回源码里看完之后，我会更愿意把 `computed` 和 `watch` 当成两类不同的运行时语义，而不是两个顺手可互换的 API。前者解决“值怎么高效地算出来并复用”，后者解决“值变化后怎样稳定地做事”。这个边界一清楚，很多业务里的时序问题和性能问题其实会少掉一大截。
