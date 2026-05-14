---
title: TypeScript 高级类型与实践技巧
date: 2024-03-20
category: 前端开发
tags: [TypeScript, 类型系统, 前端]
summary: 深入探讨 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等核心概念。
---

## 引言

TypeScript 的类型系统非常强大，掌握高级类型能让我们写出更加安全和优雅的代码。本文将从实战出发，逐一拆解常用的高级类型技巧。

## 泛型

泛型是 TypeScript 中最强大的特性之一。它允许我们编写灵活且类型安全的代码：

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 类型推断
const result = identity<string>("hello");
```

### 泛型约束

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

## 条件类型

条件类型允许我们根据类型参数来选择不同的类型：

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"
```

## 映射类型

映射类型能够基于已有类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

## 实战：类型安全的 Event Emitter

```typescript
type EventMap = {
  click: { x: number; y: number };
  hover: { element: HTMLElement };
  keydown: { key: string };
};

class TypedEmitter<Events extends Record<string, any>> {
  private handlers = new Map<keyof Events, Function[]>();

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    const list = this.handlers.get(event) || [];
    list.push(handler);
    this.handlers.set(event, list);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.handlers.get(event)?.forEach(h => h(payload));
  }
}
```

掌握这些技巧，你的 TypeScript 水平会提升一个档次。
