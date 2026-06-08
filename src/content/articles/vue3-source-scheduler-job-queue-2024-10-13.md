---
title: Vue3 源码笔记：调度器是怎么把响应式更新收束起来的
date: 2024-10-13
category: Vue.js
tags: [Vue3, 源码学习, Scheduler, 响应式系统, 运行时]
summary: 今天把 Vue3 runtime-core 里的 scheduler 重新顺了一遍，重点看清组件更新、watch 回调和 nextTick 为什么能被稳定地收束进同一轮微任务刷新。
---

今天读下来，`scheduler.ts` 这段代码比我之前印象里更关键。很多人会把 Vue3 的性能收益直接归到“响应式足够细”或者“diff 足够快”，但放回源码里看，真正把频繁状态变更变成“可控更新成本”的，是这层调度器。

如果没有它，响应式依赖一触发就立刻重跑副作用，组件会在同一个调用栈里反复进入 render，`watch` 也会跟着穿插执行，最后页面虽然也许能对，但更新时机会非常混乱。Vue3 做的事不是简单“异步更新”，而是先把该执行的工作收进队列，再在一个稳定的刷新点统一清掉。

## 为什么我今天会卡在这段源码

最近在看组件更新链路时，我一直想把三个问题放到一张图里解释清楚：

- 为什么一个响应式字段连续改三次，组件通常只会更新一次
- 为什么 `watch(..., { flush: 'post' })` 能稳定拿到更新后的 DOM
- 为什么 `await nextTick()` 往往等到的是“这一轮更新彻底刷完”

这三个问题表面上分属组件、侦听器和异步 API，实际上都汇到 `runtime-core/src/scheduler.ts`。我理解下来，这个文件不是边角料，而是运行时更新节奏的总开关。

## 先看入口：副作用不是直接跑，而是交给 scheduler

组件首次挂载时会创建渲染副作用。关键点不在 effect 本身，而在它的 scheduler。

可以把核心路径粗略理解成这样：

```ts
setupRenderEffect()
  -> new ReactiveEffect(componentUpdateFn)
  -> effect.scheduler = () => queueJob(instance.update)
  -> instance.update = effect.run.bind(effect)
```

也就是说，后续响应式依赖触发的不是“直接重新 render”，而是把 `instance.update` 这个 job 放进队列。

这一层设计很值钱，因为它把“依赖发生变化”与“何时真正执行更新”拆开了：

- 响应式系统负责发现谁该重新执行
- 调度器负责决定执行顺序、去重和刷新时机

工程上这就是典型的解耦。否则组件更新、用户 `watch`、生命周期回调会彼此抢执行时机，最后很难保证一致性。

## queueJob 做的第一件事不是入队，而是避免脏活重复做

`queueJob(job)` 的核心价值不只是塞进数组，而是尽量保证同一个 job 在一轮刷新里只出现一次。

这点很容易被一句“Vue 会批量更新”糊弄过去，但源码里的批量不是抽象概念，而是明确依赖两个动作：

- 去重：同一个 job 不反复入队
- 延后：统一放到微任务里刷新

可以把它想成：

```ts
const queue: SchedulerJob[] = []

function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}
```

真实源码当然比这更细，会结合 `flushIndex`、`job.id`、`allowRecurse` 处理插入位置和递归场景，但主线就是这个意思。

这里的收益非常直接。比如下面这段代码：

```ts
state.count++
state.count++
state.count++
```

如果三次 trigger 都立刻执行 render effect，组件会同步跑三次更新；有了队列和去重后，三次变化最终只会留下一个待执行的组件更新 job。

这也是我读源码时一个很重要的判断：Vue3 的“批量更新”并不神秘，本质上就是把重复工作在调度层消掉，而不是指望 render 足够便宜。

## queueFlush：真正的刷新边界是微任务

`queueJob` 之后通常会调用 `queueFlush()`。这一层很关键，因为它决定“不是现在执行，而是在本轮同步代码结束后执行”。

源码思路可以概括成：

```ts
let isFlushing = false
let isFlushPending = false
let currentFlushPromise: Promise<void> | null = null

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    currentFlushPromise = Promise.resolve().then(flushJobs)
  }
}
```

这里我最在意的是 `currentFlushPromise`。`nextTick` 本质上就是去等这个 promise，所以它等到的不是“某个单独组件更新完成”，而是“当前这轮被调度的刷新任务跑完”。

这解释了为什么很多时候下面的写法成立：

```ts
state.visible = true
await nextTick()
// 这里通常已经能拿到更新后的 DOM
```

不是 `nextTick` 有什么魔法，而是它挂在了调度器这轮 flush 的 promise 后面。

## flushJobs 不是简单 for 循环，它在维护更新顺序

很多人第一次看 scheduler，会以为 `flushJobs()` 只是把队列遍历一遍。真放回源码里看，复杂度主要都在“按什么顺序刷”。

Vue3 这里至少在维护几件事：

- 父组件优先于子组件更新
- 组件更新 job 和侦听器回调要落在合适阶段
- 已经被卸载的组件，其无效 job 要尽量跳过
- 递归更新要做上限保护，避免死循环把浏览器打满

源码里会基于 `job.id` 排序。组件实例是有递增 uid 的，所以父组件通常先创建、id 更小，刷新时也就自然排在前面。这个顺序不是锦上添花，而是 correctness 的一部分。

否则子组件先更新，父组件后更新，父组件一旦又改了传给子组件的 props，子组件前面那次计算就白做了，严重时还会出现更新视图短暂不一致的问题。

## pre flush 和 post flush 是 watch 时机的关键

我之前对 `flush: 'pre' | 'post' | 'sync'` 的理解偏 API 层，今天重新对着源码看，感觉它其实就是在往不同阶段的队列里塞回调。

调度器里不只有主 `queue`，还维护了：

- `pendingPreFlushCbs`
- `pendingPostFlushCbs`

所以更新一轮里，顺序大致是：

1. 先执行 pre flush callbacks
2. 再执行组件更新等主队列 job
3. 最后执行 post flush callbacks

这样 `watchEffect` 或 `watch` 在不同 flush 配置下，行为就说得很清楚了。

### `flush: 'pre'`

适合依赖变更后、组件视图更新前做一些派生处理。它的回调会比组件 render 更早进场。

### `flush: 'post'`

这个在业务里非常实用。比如你要在状态变化后读取最新 DOM 尺寸，或者等列表渲染完再滚动到某个位置，`post` 就比默认时机更稳，因为它明确落在组件更新之后。

### `flush: 'sync'`

这个最容易被滥用。它跳过调度，依赖一变就直接执行。看起来“及时”，但会把批量更新、去重和统一时序都打散。除非非常确认需要同步副作用，否则工程里我基本会把它当成高风险选项。

## 一个容易误解的点：`nextTick` 不等于“下一个宏任务”

这算是我今天重新确认的一处认知细节。

很多文章会把 `nextTick` 简化成“等下一次事件循环”，这话不能说全错，但太粗了。Vue3 在这里主要依赖的是微任务，因此它更接近：

- 等当前同步调用栈结束
- 等当前这轮调度器的 flush promise 完成

这和 `setTimeout(fn, 0)` 不是一回事。后者进入的是更靠后的宏任务队列，时序更松，也会把很多本来能在同一轮收束的事情拆散。

## 放到一个小例子里看，时序会更直观

下面这段代码很适合拿来对照理解：

```ts
const count = ref(0)

watch(
  count,
  () => {
    console.log('pre watch')
  },
  { flush: 'pre' }
)

watch(
  count,
  () => {
    console.log('post watch')
  },
  { flush: 'post' }
)

count.value++
count.value++

await nextTick()
console.log('after nextTick')
```

按我的理解，这一轮里关键现象是：

- 连续两次 `count.value++` 不会导致组件更新 job 入队两次
- `pre watch` 会先于组件更新阶段执行
- `post watch` 会在组件更新后执行
- `after nextTick` 会落在这轮 flush 完成之后

如果这里把 `post` 改成 `sync`，整个时序味道就完全变了。副作用会直接在触发点执行，调度器提供的“统一收口”能力基本就被绕开了。

## 递归更新保护也很有工程意味

源码里还有一段容易被忽略，但我觉得很体现框架作者工程经验的逻辑：递归更新检测。

某些场景下，job 在执行过程中又触发了自己或彼此触发，理论上很容易把刷新流程卷进死循环。Vue3 不是简单放任它炸掉，而是通过计数和上限判断尽早报警。

这类保护看起来像“边角异常处理”，实际上非常重要。框架层一旦没有这种兜底，业务里一个时序不当的 watch 就可能把页面直接拖死，而且排查成本极高。

## 今天这段源码给我的一个判断

今天读完 `scheduler`，我会更愿意把 Vue3 的运行时看成两层：

- reactivity 决定“谁变了”
- scheduler 决定“什么时候、按什么顺序把变化兑现”

前者解决依赖追踪，后者解决更新秩序。真正让组件系统稳定运行的，不只是能触发更新，而是能把更新收束成一轮可预测的刷新流程。

如果只盯着响应式 API，很容易觉得 Vue3 的核心不过是 `track` / `trigger`。但源码再往 runtime-core 里走一步就会发现，组件更新体验、`watch` 时机、`nextTick` 语义，最后都要落到这套调度器上才能闭环。
