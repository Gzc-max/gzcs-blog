import type { Article, Category, Tag } from '@/types/article'

// 模拟文章数据
export const articles: Article[] = [
  {
    id: 1,
    title: 'TypeScript 高级类型与实践技巧',
    summary: '深入探讨 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等核心概念，帮助你写出更加类型安全的代码。',
    content: `# TypeScript 高级类型与实践技巧

## 引言
TypeScript 的类型系统非常强大，掌握高级类型能让我们写出更加安全和优雅的代码...

## 泛型
泛型是 TypeScript 中最强大的特性之一...

## 条件类型
条件类型允许我们根据类型关系来选择不同的类型...

## 映射类型
映射类型能够基于旧类型创建新类型...`,
    category: '前端开发',
    tags: ['TypeScript', '类型系统', '前端'],
    date: '2024-03-20',
    author: 'GZC',
    views: 1234,
    likes: 89,
    coverImage: 'https://via.placeholder.com/800x400/667eea/ffffff?text=TypeScript'
  },
  {
    id: 2,
    title: 'Vue 3 组合式 API 最佳实践',
    summary: '从实战角度分享 Vue 3 Composition API 的使用心得，涵盖响应式原理、自定义 Hooks 设计模式等内容。',
    content: `# Vue 3 组合式 API 最佳实践

## 为什么使用 Composition API
Composition API 提供了更好的逻辑复用和代码组织方式...`,
    category: 'Vue.js',
    tags: ['Vue3', 'Composition API', '前端框架'],
    date: '2024-03-18',
    author: 'GZC',
    views: 856,
    likes: 67,
    coverImage: 'https://via.placeholder.com/800x400/42b883/ffffff?text=Vue3'
  },
  {
    id: 3,
    title: '现代化 Web 应用性能优化指南',
    summary: '全面介绍 Web 性能优化的各个方面，包括资源加载优化、渲染性能优化、代码分割策略等实用技巧。',
    content: `# 现代化 Web 应用性能优化指南

## 性能优化的重要性
在当今快节奏的互联网时代，用户体验直接影响产品成败...`,
    category: '性能优化',
    tags: ['性能优化', 'Web', '前端工程'],
    date: '2024-03-15',
    author: 'GZC',
    views: 2103,
    likes: 156,
    coverImage: 'https://via.placeholder.com/800x400/f39c12/ffffff?text=Performance'
  },
  {
    id: 4,
    title: '构建可维护的 CSS 架构',
    summary: '探讨如何使用 BEM、CSS Modules、Tailwind CSS 等方案构建可扩展、易维护的样式系统。',
    content: `# 构建可维护的 CSS 架构

## CSS 架构的挑战
随着项目规模的增长，CSS 的维护成本会急剧上升...`,
    category: 'CSS',
    tags: ['CSS', 'BEM', 'Tailwind'],
    date: '2024-03-12',
    author: 'GZC',
    views: 678,
    likes: 45,
    coverImage: 'https://via.placeholder.com/800x400/e74c3c/ffffff?text=CSS'
  },
  {
    id: 5,
    title: 'Node.js 微服务架构实践',
    summary: '基于 Node.js 构建微服务架构的实践经验，包括服务拆分、通信机制、服务治理等方面。',
    content: `# Node.js 微服务架构实践

## 微服务架构概述
微服务架构是一种将应用拆分为多个小型服务的架构模式...`,
    category: '后端开发',
    tags: ['Node.js', '微服务', '架构设计'],
    date: '2024-03-10',
    author: 'GZC',
    views: 1456,
    likes: 112,
    coverImage: 'https://via.placeholder.com/800x400/27ae60/ffffff?text=NodeJS'
  },
  {
    id: 6,
    title: 'React Hooks 深入解析',
    summary: 'React Hooks 的工作原理、使用技巧和常见陷阱，帮助你更好地理解和使用 Hooks。',
    content: `# React Hooks 深入解析

## Hooks 的诞生背景
React Hooks 在 React 16.8 版本引入，彻底改变了我们编写组件的方式...`,
    category: 'React',
    tags: ['React', 'Hooks', '前端框架'],
    date: '2024-03-08',
    author: 'GZC',
    views: 923,
    likes: 78,
    coverImage: 'https://via.placeholder.com/800x400/61dafb/000000?text=React'
  }
]

// 分类数据
export const categories: Category[] = [
  { id: 1, name: '前端开发', count: 12, icon: 'code' },
  { id: 2, name: 'Vue.js', count: 8, icon: 'thunderbolt' },
  { id: 3, name: '性能优化', count: 6, icon: 'rocket' },
  { id: 4, name: 'CSS', count: 5, icon: 'bg-colors' },
  { id: 5, name: '后端开发', count: 7, icon: 'database' },
  { id: 6, name: 'React', count: 4, icon: 'fire' }
]

// 标签数据
export const tags: Tag[] = [
  { id: 1, name: 'TypeScript', count: 15, color: 'blue' },
  { id: 2, name: 'Vue3', count: 12, color: 'green' },
  { id: 3, name: 'React', count: 10, color: 'cyan' },
  { id: 4, name: 'Node.js', count: 8, color: 'orange' },
  { id: 5, name: 'CSS', count: 7, color: 'purple' },
  { id: 6, name: '性能优化', count: 6, color: 'red' },
  { id: 7, name: '前端工程', count: 9, color: 'geekblue' },
  { id: 8, name: 'Hooks', count: 5, color: 'magenta' }
]

// 获取文章列表
export function getArticles(params?: {
  category?: string
  tag?: string
  keyword?: string
  page?: number
  pageSize?: number
}): { list: Article[]; total: number } {
  let filtered = [...articles]

  // 按分类筛选
  if (params?.category) {
    filtered = filtered.filter(a => a.category === params.category)
  }

  // 按标签筛选
  if (params?.tag) {
    filtered = filtered.filter(a => a.tags.includes(params.tag!))
  }

  // 按关键词搜索
  if (params?.keyword) {
    const keyword = params.keyword.toLowerCase()
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(keyword) ||
      a.summary.toLowerCase().includes(keyword) ||
      a.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  // 分页
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    list: filtered.slice(start, end),
    total: filtered.length
  }
}

// 获取文章详情
export function getArticleById(id: number): Article | undefined {
  return articles.find(a => a.id === id)
}

// 获取热门文章
export function getHotArticles(limit = 5): Article[] {
  return [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

// 获取推荐文章
export function getRecommendedArticles(currentId: number, limit = 4): Article[] {
  const current = articles.find(a => a.id === currentId)
  if (!current) return []

  // 根据相同标签推荐
  return articles
    .filter(a => a.id !== currentId)
    .filter(a => a.tags.some(tag => current.tags.includes(tag)))
    .slice(0, limit)
}
