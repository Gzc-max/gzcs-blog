---
title: Vue3 源码笔记：响应式 effect 是如何收集和触发依赖的
date: 2024-10-18
category: Vue.js
tags: [Vue3, 源码学习, 响应式, effect]
summary: 记录一次阅读 Vue3 reactivity 源码时对 reactive 读写、effect 执行、Dep/Link 依赖关系、批量触发和依赖清理的理解。
---

## 为什么今天先把 effect 理顺

如果只从使用层看 Vue3 响应式，很容易把它理解成一句话：读取时收集依赖，修改时触发更新。这个说法没错，但太粗了。真正读源码时，会马上遇到几个更细的问题：

- 谁代表一个副作用函数？
- 一个对象属性怎么知道自己被哪些副作用函数依赖？
- effect 重新执行后，旧依赖怎么清理？
- 多次触发为什么不会立刻失控地重复执行？
- computed 和普通 effect 为什么可以共用同一套依赖系统？

这些问题的答案主要在 `packages/reactivity/src/effect.ts`、`dep.ts`、`baseHandlers.ts` 里。今天先不急着往组件更新和 `watch` 上跳，先把响应式系统最底层的“订阅关系”看清楚。

## 先建立一条最小调用链

下面这段代码，是理解源码的最小切片：

```ts
import { reactive, effect } from 'vue'

const state = reactive({ count: 0 })

effect(() => {
  console.log(state.count)
})

state.count++
```

它背后的调用链可以先压成四步：

1. `reactive()` 把普通对象包成 Proxy。
2. `effect(fn)` 创建一个 `ReactiveEffect`，并立即执行一次 `fn`。
3. 执行 `fn` 时读取 `state.count`，触发 Proxy 的 `get`，调用 `track()` 记录依赖。
4. 修改 `state.count` 时触发 Proxy 的 `set`，调用 `trigger()` 找到依赖并调度 effect。

这条链路里，`reactive` 负责拦截读写，`effect` 负责描述“需要重跑的副作用”，`track/trigger` 负责把两边连起来。

## reactive 的读写拦截

Vue3 响应式的入口不是神秘的编译魔法，而是 Proxy。对象被 `reactive()` 包装后，访问属性会进入 handler。

可以把 `get` 的核心逻辑简化成这样：

```ts
get(target, key, receiver) {
  const value = Reflect.get(target, key, receiver)

  track(target, 'get', key)

  if (isObject(value)) {
    return reactive(value)
  }

  return value
}
```

真正源码里还会处理只读、浅层响应式、数组方法、ref 自动解包、内置 Symbol 等分支，但主线就是：只要不是 readonly，读取属性时就尝试收集依赖。

`set` 的核心逻辑可以简化成这样：

```ts
set(target, key, value, receiver) {
  const oldValue = target[key]
  const hadKey = hasOwn(target, key)
  const result = Reflect.set(target, key, value, receiver)

  if (!hadKey) {
    trigger(target, 'add', key, value)
  } else if (hasChanged(value, oldValue)) {
    trigger(target, 'set', key, value, oldValue)
  }

  return result
}
```

这里有一个很重要的细节：Vue 不只是知道“某个对象变了”，它会区分是 `ADD`、`SET`、`DELETE`，还会区分具体的 `key`。这就是为什么读取 `state.name` 的 effect，不应该因为 `state.age` 改变而重跑。

## effect 到底是什么

`effect(fn)` 并不是简单地执行 `fn`。它会把 `fn` 包成一个 `ReactiveEffect` 实例。

可以先把 `ReactiveEffect` 理解成一个订阅者：

```ts
class ReactiveEffect {
  deps = undefined
  depsTail = undefined
  flags = ACTIVE | TRACKING

  constructor(fn) {
    this.fn = fn
  }

  run() {
    activeSub = this
    shouldTrack = true

    try {
      return this.fn()
    } finally {
      activeSub = previousEffect
      shouldTrack = previousShouldTrack
    }
  }
}
```

`activeSub` 是阅读这段源码时最关键的全局状态。它表示“当前正在执行的副作用”。当 `effect` 的函数运行时，里面访问到的响应式属性，就能通过 `activeSub` 知道应该把谁收集进去。

也就是说，依赖收集不是 `effect` 主动声明“我要订阅 count”，而是：

1. effect 先运行起来，把自己设成当前活跃订阅者。
2. 用户函数读取响应式属性。
3. Proxy 的 `get` 捕获这次读取。
4. `track()` 发现当前有活跃订阅者，于是建立依赖关系。

这也是为什么下面这种代码能被自动追踪：

```ts
effect(() => {
  if (state.visible) {
    console.log(state.title)
  }
})
```

第一次执行时，读到了什么，就订阅什么。条件变化后，effect 重新执行，依赖还会被重新整理。

## targetMap：从对象属性找到依赖集合

依赖关系需要一个全局索引。Vue 使用的主结构可以理解成：

```ts
WeakMap<object, Map<key, Dep>>
```

也就是：

```txt
targetMap
└── rawState
    ├── count -> Dep
    └── title -> Dep
```

为什么最外层用 `WeakMap`？因为响应式对象如果在业务里已经不可达，依赖索引不应该强行阻止它被垃圾回收。

当读取 `state.count` 时，`track(target, type, key)` 会做几件事：

1. 从 `targetMap` 里拿到当前原始对象对应的 `depsMap`。
2. 从 `depsMap` 里拿到 `count` 对应的 `Dep`。
3. 如果不存在，就创建新的 `Map` 或 `Dep`。
4. 调用 `dep.track()`，把当前 `activeSub` 记录进去。

早期学习资料经常把 `Dep` 简化成 `Set<ReactiveEffect>`，这个模型适合入门，但现在的 Vue3 源码已经更精细：`Dep` 和订阅者之间不是直接塞一个 effect，而是通过 `Link` 连接。

## Dep 和 Link：现在的源码不只是 Set

当前 Vue3 reactivity 里，`Dep` 代表“一个响应式来源”，例如某个对象的某个属性；`ReactiveEffect` 或 computed 代表“订阅者”；`Link` 代表它们之间的一条订阅关系。

可以这样理解：

```txt
Dep(count) <---- Link ----> ReactiveEffect(render/update)
```

为什么要多一个 `Link`？因为这是多对多关系：

- 一个 effect 可能依赖多个属性。
- 一个属性也可能被多个 effect 依赖。

如果只用 Set，能表达“属性有哪些订阅者”，但不方便高效表达“某个 effect 这次运行后还保留了哪些依赖、哪些依赖已经不用了”。`Link` 同时挂在两条双向链表上：

- 一条属于订阅者：这个 effect 依赖了哪些 Dep。
- 一条属于 Dep：这个 Dep 被哪些订阅者依赖。

所以清理依赖时，Vue 不需要在很多 Set 里盲目查找，它可以沿着 effect 自己的依赖链表走，把失效的关系断开。

## 一次 effect.run 里的依赖清理

响应式系统最容易被忽略的部分，不是收集，而是清理。

看这个例子：

```ts
const state = reactive({
  visible: true,
  title: 'Vue',
  count: 0
})

effect(() => {
  if (state.visible) {
    console.log(state.title)
  } else {
    console.log(state.count)
  }
})
```

当 `visible` 是 `true` 时，effect 依赖 `visible` 和 `title`。当 `visible` 变成 `false` 并重新执行后，它应该依赖 `visible` 和 `count`，不应该继续依赖 `title`。

源码里的处理大致是：

1. 运行前，`prepareDeps()` 把旧的依赖链接标记成“暂时未使用”。
2. 运行中，每次读取响应式属性，`dep.track()` 会把对应链接标记为“本轮仍然使用”。
3. 运行后，`cleanupDeps()` 清掉那些本轮没有再被访问到的链接。

这个过程保证了 effect 的依赖是动态的，不是第一次运行后就固定不变。

这也解释了一个常见误解：条件分支里的属性，不是永远都被追踪。只有当前执行路径真正读取过的属性，才会成为当前依赖。

## trigger：写入时怎么找回 effect

当执行 `state.count++` 时，Proxy 的 `set` 会进入 `trigger(target, type, key, newValue, oldValue)`。

核心过程是：

1. 从 `targetMap` 找到这个对象的 `depsMap`。
2. 根据变更的 `key` 找到对应的 `Dep`。
3. 某些操作需要额外触发迭代依赖，例如新增对象属性、数组 length 变化、Map key 变化。
4. 对命中的 `Dep` 调用 `dep.trigger()`。
5. `Dep` 通知自己的订阅者，让 effect 进入批处理或调度。

为什么新增属性还要触发迭代依赖？看这个例子：

```ts
effect(() => {
  console.log(Object.keys(state))
})

state.extra = 'new field'
```

这个 effect 并没有读取 `state.extra`，但它读取了对象的 key 列表。新增属性会影响迭代结果，所以 Vue 需要用类似 `ITERATE_KEY` 的特殊 key 来表示“对象结构被迭代过”。

数组也有类似处理。修改数组索引、增加新元素、改变 `length`，触发范围都不是简单的“只看这个 key”。

## 批处理：为什么触发不是立刻无脑重跑

`Dep.notify()` 不会简单地对每个订阅者立即 `run()`。Vue 会进入 batch：

```txt
startBatch()
  收集需要通知的 subscriber
endBatch()
  统一触发 effect 或 scheduler
```

这层批处理很重要。它让多个依赖通知可以先合并到队列，再在批处理结束时执行。普通 effect 会在没有自定义 scheduler 时调用 `runIfDirty()`；如果 effect 配了 scheduler，就交给 scheduler 处理。

组件渲染更新就会利用 scheduler。组件的 render effect 不是每次响应式写入都同步重渲染，而是把更新任务放入运行时的 job queue，等待合适的时机统一 flush。这里先记住一点：`effect` 负责发现“谁脏了”，scheduler 决定“什么时候真正执行”。

## 用一个迷你版本复盘主线

如果暂时拿掉 Vue 源码里的链表、版本号、调度和各种边界处理，一个极简响应式可以这样写：

```ts
type EffectFn = () => void

let activeEffect: EffectFn | undefined
const targetMap = new WeakMap<object, Map<PropertyKey, Set<EffectFn>>>()

function effect(fn: EffectFn) {
  activeEffect = fn
  fn()
  activeEffect = undefined
}

function track(target: object, key: PropertyKey) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

function trigger(target: object, key: PropertyKey) {
  const depsMap = targetMap.get(target)
  const dep = depsMap?.get(key)
  dep?.forEach(fn => fn())
}

function reactive<T extends object>(raw: T): T {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      track(target, key)
      return value
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    }
  })
}
```

这个版本能说明最基本的 `get -> track`、`set -> trigger`，但它离真实 Vue 还有很远：

- 没有依赖清理，条件分支会残留旧依赖。
- 没有嵌套 effect 的上下文恢复。
- 没有 scheduler，写入后只能同步执行。
- 没有数组、Map、Set、迭代 key 的特殊处理。
- 没有 computed 的脏检查和缓存。
- 没有停止、暂停、恢复、cleanup 等生命周期控制。

所以学习源码时可以先用 Set 模型建立直觉，但不能停在那里。真实源码的 `Dep + Link + version + batch`，正是为了解决这些工程问题。

## 几个容易误解的点

### 不是所有读操作都会被追踪

readonly 不会收集依赖，某些内置 Symbol 和内部标记也会被跳过。数组方法、ref 解包、浅层响应式都有单独逻辑。

### effect 的依赖不是静态的

每次 `run()` 都可能重新整理依赖。条件分支变化后，旧分支里的依赖会被清理掉。

### trigger 不等于马上重新渲染组件

对普通 effect 来说，可能会直接重跑；对组件更新来说，通常会走 scheduler，再进入运行时的更新队列。

### computed 不是另一套系统

computed 也是订阅者，只是它有自己的 dirty 标记、缓存值和依赖通知方式。把这一点放回源码里看，会发现它并没有另起炉灶，而是在复用 `Dep`、`Subscriber`、`ReactiveEffect` 这套基础设施。

## 今天整理下来的源码模型

可以把 Vue3 响应式 effect 的核心模型压成这张图：

```txt
reactive object
  |
  | get
  v
track(target, key)
  |
  v
targetMap: WeakMap<object, Map<key, Dep>>
  |
  v
Dep <---- Link ----> ReactiveEffect
  ^
  |
trigger(target, key)
  ^
  | set/add/delete
reactive object
```

读源码时，不要只盯着 `effect()` 这个 API。真正的主线是：

- Proxy handler 捕获读写。
- `track()` 把当前活跃订阅者连接到属性 Dep。
- `trigger()` 从属性 Dep 找回订阅者。
- `ReactiveEffect.run()` 管理活跃上下文和依赖清理。
- `batch/scheduler` 控制触发时机。

这次读下来，我觉得 `effect` 最值得记住的不是 API 形式，而是它把“读取过什么”和“谁需要重跑”连接成了一张可清理、可调度的依赖图。很多 Vue3 响应式行为看起来很自然，底层其实都在维护这张图的准确性。

## 参考源码入口

- `packages/reactivity/src/baseHandlers.ts`
- `packages/reactivity/src/dep.ts`
- `packages/reactivity/src/effect.ts`
