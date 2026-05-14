---
title: CSS 架构与可维护性
date: 2024-03-12
category: CSS
tags: [CSS, BEM, 架构设计]
summary: 探讨如何构建可扩展、易维护的 CSS 架构，涵盖 BEM、CSS Modules 等方案。
---

## 问题所在

随着项目规模增长，CSS 的维护成本会急剧上升。常见的症状：

- 样式互相覆盖，`!important` 满天飞
- 改了某个组件，另一个不相干的页面崩了
- 新同事不敢删"可能有用"的样式

## BEM 命名规范

```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__content { }

/* Modifier */
.card--highlighted { }
.card__title--large { }
```

## CSS 层级控制

核心原则：**选择器尽量扁平，不超过两层嵌套**。

```css
/* ❌ 太深 */
.app .sidebar .nav .item .link { }

/* ✅ 扁平 */
.nav-link { }
.sidebar .nav-link { }
```

## 原子化 CSS

Tailwind CSS 代表了一种新思路——用工具类代替自定义样式：

```html
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
  <img class="w-12 h-12 rounded-full" src="avatar.jpg">
  <span class="text-lg font-medium">GZC</span>
</div>
```

优缺点都很明显，选择适合的就好。
