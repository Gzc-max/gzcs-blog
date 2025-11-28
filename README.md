# GZC 个人博客

一个基于 Vue 3 + TypeScript + Vite 的现代化个人博客系统，具有丰富的功能和优雅的界面设计。

## ✨ 主要特性

### 🎨 界面设计
- **现代化 UI**：采用 Ant Design Vue 组件库，界面简洁美观
- **响应式设计**：完美适配桌面端和移动端
- **深色模式**：支持亮色/暗色主题切换，保护眼睛
- **流畅动画**：页面过渡和交互动画流畅自然

### 📝 核心功能
- **文章系统**
  - 文章列表展示（支持封面图）
  - 文章详情页（支持 Markdown 渲染）
  - 文章分类和标签管理
  - 文章搜索功能
  - 相关文章推荐
  
- **搜索系统**
  - 全局搜索框
  - 实时搜索建议
  - 按标题、标签搜索
  
- **分类与标签**
  - 标签云展示
  - 分类列表导航
  - 点击筛选文章
  
- **评论系统**
  - 发表评论
  - 评论回复
  - 点赞功能
  
- **其他功能**
  - 个人简历展示
  - Demo 演示页面
  - GoJS 图表展示
  - 面试题模块

## 🛠️ 技术栈

- **前端框架**：Vue 3.3 (Composition API)
- **开发语言**：TypeScript 5.0
- **构建工具**：Vite 5.0
- **UI 组件库**：Ant Design Vue 4.0
- **路由管理**：Vue Router 4.0
- **图表库**：GoJS 2.3
- **HTTP 客户端**：Axios 1.7
- **文档处理**：Mammoth.js (Word 文档预览)
- **差异对比**：diff.js

## 📦 项目结构

```
src/
├── assets/              # 静态资源
├── components/          # 公共组件
│   ├── SearchBar.vue       # 搜索组件
│   ├── TagCloud.vue        # 标签云组件
│   ├── CategoryList.vue    # 分类列表组件
│   └── CommentBox.vue      # 评论组件
├── composables/         # 组合式函数
│   └── useTheme.ts         # 主题管理 Hook
├── data/                # 模拟数据
│   └── articles.ts         # 文章数据
├── router/              # 路由配置
│   └── router.ts
├── types/               # TypeScript 类型定义
│   ├── article.ts          # 文章相关类型
│   └── ...
├── utils/               # 工具函数
│   └── formatDate.ts       # 日期格式化
├── views/               # 页面组件
│   ├── Home.vue            # 首页
│   ├── Articles.vue        # 文章列表
│   ├── ArticleDetail.vue   # 文章详情
│   ├── About.vue           # 关于页面
│   ├── Resume.vue          # 简历页面
│   ├── Interview.vue       # 面试题页面
│   ├── Demo.vue            # Demo 页面
│   └── Gojs.vue            # GoJS 页面
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0
- npm >= 8.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 🎯 功能展示

### 1. 首页
- Hero 区域展示
- 全局搜索框
- 个人信息卡片
- 最新文章列表
- 统计数据展示

### 2. 文章列表
- 网格布局展示
- 分类筛选
- 标签筛选
- 关键词搜索
- 分页功能

### 3. 文章详情
- Markdown 内容渲染
- 文章元信息（作者、日期、阅读量等）
- 标签展示
- 点赞和分享
- 相关文章推荐
- 评论区

### 4. 主题切换
- 亮色/暗色模式
- 一键切换
- 状态持久化

## 🎨 设计特点

- **渐变色主题**：采用紫色渐变作为主色调
- **卡片式布局**：信息层次清晰
- **圆角设计**：柔和的视觉体验
- **悬停效果**：丰富的交互反馈
- **阴影立体**：增强空间感

## 📱 响应式断点

- 桌面端：>= 992px
- 平板端：768px - 992px
- 移动端：< 768px

## 🔧 配置说明

### 路由配置
路由文件位于 `src/router/router.ts`，采用懒加载方式导入组件。

### 主题配置
主题切换逻辑在 `src/composables/useTheme.ts`，支持本地存储持久化。

### 数据配置
文章数据在 `src/data/articles.ts`，可以连接后端 API 替换模拟数据。

## 📝 待完善功能

- [ ] Markdown 编辑器集成
- [ ] 用户认证系统
- [ ] 后端 API 集成
- [ ] 文章目录自动生成
- [ ] 代码高亮功能
- [ ] 图片懒加载
- [ ] SEO 优化
- [ ] 网站统计分析

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

## 👨‍💻 作者

GZC - 全栈开发工程师

## 推荐 IDE 配置

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vue 3 支持)
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
