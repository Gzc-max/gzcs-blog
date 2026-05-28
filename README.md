# GZC 个人博客

基于 Vue 3、TypeScript 和 Vite 构建的个人博客，用来记录前端开发、AI 全栈探索、工程实践和职业思考。

## 功能

- Markdown 文章内容与 frontmatter 元数据
- 文章列表、分类筛选、标签筛选和关键词搜索
- 文章详情页、阅读进度、目录锚点和代码高亮
- 亮色/暗色主题切换
- 关于页和简历页
- 基础 SEO、Open Graph、robots 和 sitemap
- Vercel / Netlify 单页应用刷新兜底配置

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- marked
- highlight.js

## 环境要求

当前项目使用 Vite 6，建议使用：

- Node.js >= 20
- npm >= 10

项目已包含 `.nvmrc` 和 `.node-version`，如果你使用 nvm：

```bash
nvm use
```

## 本地启动

```bash
npm install
npm run dev
```

访问 `http://localhost:5173`。

## 构建

```bash
npm run build
```

## 预览生产构建

```bash
npm run preview
```

## 项目结构

```text
src/
├── assets/styles/       # 全局样式
├── components/          # 公共组件
├── composables/         # 组合式函数
├── content/articles/    # Markdown 文章
├── router/              # 路由配置
├── types/               # 类型声明
├── utils/               # 内容加载、Markdown、SEO 等工具
├── views/               # 页面
├── App.vue
└── main.ts
```

## 写文章

在 `src/content/articles/` 下新增 Markdown 文件，并添加 frontmatter：

```md
---
title: 文章标题
date: 2026-05-19
category: 前端开发
tags: [Vue3, TypeScript]
summary: 文章摘要，会用于列表展示和 SEO description。
---

## 正文标题

这里开始写正文。
```

文件名会作为文章 slug，例如 `hello-world.md` 对应 `/article/hello-world`。

## 部署提示

`vercel.json` 和 `netlify.toml` 已配置 SPA rewrite，刷新 `/article/:slug` 这类页面不会直接 404。

正式上线后建议把 `public/sitemap.xml` 里的站点地址替换成你的真实域名，或改成构建时自动生成。
