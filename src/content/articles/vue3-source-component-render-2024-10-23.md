---
title: Vue3 源码笔记：组件是怎么从 setup 走到 render 和 patch 的
date: 2024-10-23
category: Vue.js
tags: [Vue3, 源码学习, 组件更新, runtime-core, setup]
summary: 顺着 runtime-core 里组件初始化和渲染副作用的调用链，梳理 Vue3 组件从 createVNode、mountComponent、setupComponent 到 renderComponentRoot、patch subTree 的执行过程，以及 setup、render 和响应式更新在这里是怎样接上的。
---

今天读 Vue 3 源码时，我没有继续往响应式细节里钻，而是回到组件入口重新过了一遍。原因很现实：平时业务里写一个组件，脑子里默认是“`setup` 返回状态，模板自动渲染出来”，但这句话只适合写代码时快速理解，一旦真去看运行时，很多关键动作都被这句概括给抹平了。

我今天更关心的问题其实是这几个：

- 一个组件实例到底在什么时候创建出来；
- `setup()` 返回的内容是怎么挂到实例上的；
- render 函数什么时候真正执行；
- 首次挂载和后续更新，共用的是不是同一条主链路。

把这段源码重新串起来之后，我最大的感受是：**Vue 3 组件运行时最核心的工作，不是“把模板变成 DOM”，而是先把组件实例这台机器搭起来，再让渲染副作用驱动它进入稳定更新。**

## 我今天为什么想回头看组件入口

这一段平时容易被忽略，是因为很多资料一上来就讲响应式、diff、编译器。它们当然都重要，但如果不先把组件这一层的执行边界看清，后面很多结论都容易飘。

比如这些问题，放在项目里都挺常见：

- 为什么 `setup()` 里拿不到 `this`；
- 为什么 `props` 在组件里是响应式读取，但又不建议直接改；
- 为什么父组件更新后，子组件不是“重新创建一次”，而是复用实例进入 update；
- 为什么 render 里访问到的响应式数据，会自动和当前组件更新绑定起来。

这些问题最后都要回到 `runtime-core` 里的组件创建和渲染副作用。

## 从 vnode 开始：组件在 Vue 眼里先是一个描述对象

我今天重新看这段代码，一个很直观的感受是：**Vue 在真正创建组件实例前，先把组件当成 vnode 来处理。**

不管是模板编译结果，还是手写 `h()`，最后都会先得到一个 vnode。这个 vnode 至少会带着几类信息：

- 组件类型，也就是 `type`；
- `props`；
- `children`；
- shape flag，用来标记当前 vnode 是元素、组件、插槽子节点还是别的类型。

这里有个很重要的工程视角：vnode 不是实例，它只是一次渲染意图的描述。Vue 后续所有 mount / patch 动作，几乎都围绕“旧 vnode 和新 vnode 的关系”展开。

所以组件真正开始进入运行态，不是写下 `<Demo />` 那一刻，而是 patch 流程判断“这个 vnode 是组件”，然后转到组件分支的时候。

## 真正开始搭组件机器的是 `mountComponent`

一旦 patch 发现当前 vnode 是组件，主链路会进入 `processComponent`，首次挂载时再走到 `mountComponent`。

这一步我觉得可以理解成：**开始把静态描述的 vnode，转成一个可运行、可更新、可追踪依赖的组件实例。**

大致链路可以记成这样：

```ts
patch(n1, n2, container, ...)
  -> processComponent(...)
    -> mountComponent(initialVNode, container, ...)
      -> createComponentInstance(vnode, parent)
      -> setupComponent(instance)
      -> setupRenderEffect(instance, initialVNode, container, ...)
```

这条链路里，前两步决定“组件是谁”，最后一步决定“组件以后怎么更新”。

## `createComponentInstance` 做的不是业务逻辑，而是把运行时上下文一次性备齐

如果只看命名，`createComponentInstance` 好像只是 new 一个对象，但今天放回源码里看，我觉得它更像在初始化组件运行时的总控制台。

实例上会准备很多字段，比如：

- `vnode`、`type`、`parent`、`appContext`；
- `props`、`attrs`、`slots`；
- `setupState`、`ctx`、`proxy`；
- `isMounted`、`subTree`、`update`；
- 各种生命周期钩子容器。

这些字段的意义不只是“先占个位”，它决定了后面所有运行时能力挂在哪里。

尤其是 `proxy` 这一层很值得注意。平时我们在模板或者 render 里直接写 `count`、`props.foo`、`setup` 返回值，看起来像是同一个作用域里自然可用，实际上背后靠的就是实例代理把这些访问统一转发到了不同来源。

这也是为什么 Vue 组件不是简单地“执行一下 setup 再 render”，而是先建立一层稳定的实例语义，再让 render 在这层语义之上运行。

## `setupComponent` 才开始处理 `props`、`slots` 和 `setup()`

今天我理解下来，`setupComponent` 可以拆成两半看：

- 先初始化组件输入；
- 再处理 stateful component 的 `setup()`。

### 先处理输入：`props` 和 `slots`

组件实例刚创建出来时，还只是空壳。`initProps` 和 `initSlots` 会先把父组件传进来的输入整理好。

这里一个很容易误解的点是：`props` 看起来像普通对象，但在组件内部读取时又有响应式行为。这不是说 `props` 可以被子组件随便改，而是 Vue 需要让渲染阶段感知“父组件传入值变了，我该更新了”。

工程上可以把它理解成：

- `props` 对子组件来说是只读输入；
- 但它仍然会参与依赖收集，保证 render 和相关逻辑能被重新调度。

### 再执行 `setup()`

如果当前是 stateful component，Vue 会继续进入 `setupStatefulComponent`。这里面最关键的动作，是创建代理上下文，然后执行用户写的 `setup(props, context)`。

这里我今天又确认了一遍一个经常被口头带过的事实：**`setup()` 本质上不是组件渲染，它更像组件状态装配阶段。**

`setup()` 可以返回两种东西：

- 返回函数：这个函数会被当成组件 render；
- 返回对象：这些字段会被代理到模板 / render 上下文里。

这点如果不放回源码里看，很容易把“`setup` 返回函数”和“组件已有 `render` 选项”混成一件事。其实 Vue 后面会明确地把它们归并到 `instance.render` 上，只是来源不同。

## render 真正第一次跑，是在 `setupRenderEffect`

这是今天我觉得最值得记的一段。

很多人会自然以为，组件在 `setupComponent` 结束后就已经“渲染完成一半了”。但从源码节奏看，真正把 render 和 patch 接起来的，不在 `setupComponent`，而在 `setupRenderEffect`。

这里 Vue 会创建一个组件级别的渲染副作用。这个副作用包裹的是整条组件渲染逻辑，而不是单纯调一下 render：

```ts
componentUpdateFn = () => {
  if (!instance.isMounted) {
    // 首次挂载
    const subTree = renderComponentRoot(instance)
    patch(null, subTree, container, ...)
    initialVNode.el = subTree.el
    instance.subTree = subTree
    instance.isMounted = true
  } else {
    // 后续更新
    const nextTree = renderComponentRoot(instance)
    const prevTree = instance.subTree
    instance.subTree = nextTree
    patch(prevTree, nextTree, container, ...)
  }
}
```

这里最关键的不是分支本身，而是这个函数会被包进 `ReactiveEffect`。于是组件 render 阶段访问到的响应式数据，会自动把“当前组件的 update job”登记成依赖响应方。

也就是说，**组件之所以能因为 `ref`、`reactive` 变更而重渲染，不是 render 有魔法，而是 render 被放进了响应式副作用里。**

## `renderComponentRoot` 解决的是“这次组件想渲染成什么”

到了这一步，Vue 才真正执行 render。

`renderComponentRoot` 会结合实例当前状态，调用最终的 `instance.render`，得到组件子树 vnode，也就是 `subTree`。这个 `subTree` 才是当前组件真正要交给 patch 的渲染结果。

这里有个我觉得特别重要的理解：**组件本身不是直接 patch DOM，它先 render 出自己的 vnode 子树，再把真正的 DOM 工作下发给 patch。**

所以从运行时职责上看：

- 组件负责根据当前状态生成下一版 vnode 子树；
- patch 负责比较前后子树，并把差异落实到宿主环境。

这个职责切分很漂亮。它意味着组件更新逻辑可以专注于“我要长成什么”，而不用直接关心 DOM 细枝末节。

## 首次挂载和更新，其实共享同一个渲染副作用

这也是今天我重新看完之后觉得很顺的一点。

很多人脑子里会把“mount”和“update”当成两套几乎独立的流程，但从组件这层源码看，它们其实是同一个 `componentUpdateFn` 的两个阶段：

- 首次进来时，`isMounted` 为 `false`，走初始化挂载；
- 后续响应式依赖变更后，再次触发同一个副作用，走更新分支。

这意味着组件实例通常不会在每次父组件变更时都重建。大多数时候它只是：

- 保留原实例；
- 更新新的 vnode / props / slots 输入；
- 重新执行 render；
- 用新旧 `subTree` 做 patch。

这个认知对理解性能和生命周期都很重要。因为很多行为不是“重新创建组件”，而是“同一实例进入下一轮渲染”。

## 容易踩坑的一个点：`setup()` 和 render 不在一个时机层面

平时写代码时，这两个阶段挨得很近，所以容易产生一种错觉，觉得它们只是连续执行的普通函数。

但源码里它们的职责其实差很多：

- `setup()` 更偏初始化和状态装配；
- render 更偏声明当前视图输出；
- render 对响应式依赖的订阅，会决定组件后续更新；
- `setup()` 本身不是组件重复更新的主入口。

这也是为什么把副作用乱塞进 `setup()` 往往会让行为变得难判断。真正会反复发生、跟更新节奏强绑定的，是 render 和由 render 触发的后续 patch，而不是组件每次都重新执行 `setup()`。

## 用一个很小的例子看，会更容易把调用链对上

```vue
<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

放回运行时去理解，大概会经历这些动作：

- 模板先被编译成 render 函数；
- 组件首次进入 patch 时创建实例；
- `setup()` 执行，拿到 `count`；
- `setupRenderEffect` 创建组件渲染副作用；
- render 首次执行，产出按钮对应的 `subTree`；
- patch 把 `subTree` 挂到真实 DOM；
- 点击按钮后 `count` 变化，触发 render effect；
- 同一组件实例再次 render，生成新的 `subTree`；
- patch 对比前后子树，只更新文本节点。

这个例子很基础，但我今天反而觉得这类基础链路最值得反复确认。因为很多高级特性最后都只是建立在这条主链上往外扩。

## 我今天读完这段源码后的结论

- Vue3 组件先是 vnode 描述，进入 patch 组件分支后才真正创建实例；
- `createComponentInstance` 和 `setupComponent` 解决的是“把组件运行时环境搭起来”；
- `setupRenderEffect` 才是 render、patch 和响应式更新真正接轨的地方；
- 首次挂载和后续更新共用一个组件渲染副作用，只是在 `isMounted` 前后走不同分支；
- 如果想理解组件为什么会更新，盯着模板还不够，得回到 render effect 和 `subTree` 这层。

今天读下来，我对 Vue3 组件的理解比以前更像一条机器链路了。以前更习惯从 API 视角描述组件，现在会更明确地把它看成三步：先创建实例，再装配输入和状态，最后让 render effect 持续驱动视图更新。这个顺序一旦在脑子里立住，很多运行时行为都会变得更好解释。
