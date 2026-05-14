---
title: Web 性能优化实用指南
date: 2024-03-15
category: 性能优化
tags: [性能优化, Web, 前端工程]
summary: 全面介绍 Web 性能优化的各个方面，包括资源加载、渲染性能、代码分割等实用技巧。
---

## Core Web Vitals

Google 提出的三个核心指标：

| 指标 | 含义 | 良好阈值 |
|------|------|----------|
| LCP | 最大内容绘制 | < 2.5s |
| FID | 首次输入延迟 | < 100ms |
| CLS | 累积布局偏移 | < 0.1 |

## 资源加载优化

### 图片优化

```html
<!-- 使用 webp 格式 -->
<picture>
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero" loading="lazy">
</picture>
```

### 关键资源优先加载

```html
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="prefetch" href="/next-page.js">
```

## 代码分割

利用 Vite 的路由懒加载：

```typescript
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]
```

## 渲染优化

- 避免大型 DOM 操作
- 使用 CSS transform 代替 left/top 做动画
- 长列表使用虚拟滚动
- 减少重排和重绘

## 缓存策略

合理设置 HTTP 缓存头，静态资源使用长效缓存（文件名加 hash），HTML 使用协商缓存。
