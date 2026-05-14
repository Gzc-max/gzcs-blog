---
title: Vue 3 组合式 API 最佳实践
date: 2024-03-18
category: Vue.js
tags: [Vue3, Composition API, 前端框架]
summary: 从实战角度分享 Vue 3 Composition API 的使用心得，涵盖响应式原理和自定义 Hooks 设计。
---

## 为什么使用 Composition API

Composition API 提供了更好的逻辑复用和代码组织方式，相比 Options API，它能让我们把相关逻辑组织在一起。

## ref vs reactive

```typescript
import { ref, reactive } from 'vue'

// ref - 适合基本类型
const count = ref(0)

// reactive - 适合对象
const state = reactive({
  name: 'GZC',
  age: 25
})
```

### 使用建议

- 基本类型（string, number, boolean）用 `ref`
- 对象类型用 `reactive`，但如果需要整体替换，用 `ref` 更方便
- 不要混用，保持团队风格一致

## 自定义 Composable

一个好的 Composable 应该：

1. 以 `use` 开头
2. 返回响应式数据或方法
3. 内部可以组合其他 composables

```typescript
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

## 避免的坑

- 不要在 setup 外层使用解构 reactive 对象
- watch 和 watchEffect 的区别要搞清楚
- 组件卸载时记得清理事件监听和定时器
