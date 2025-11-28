# 快速使用指南

## 🎯 立即开始

### 1. 启动项目

```bash
# 安装依赖（如果还没安装）
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 即可看到博客首页。

---

## 🎨 功能演示路径

### 首页 `/`
- 查看 Hero 区域的搜索框
- 尝试在搜索框输入关键词（如"TypeScript"）
- 点击侧边栏的快捷操作按钮
- 点击文章卡片跳转详情页

### 文章列表 `/articles`
- 使用顶部搜索框搜索文章
- 点击分类按钮筛选文章
- 查看侧边栏的标签云和分类列表
- 点击标签或分类筛选
- 测试分页功能

### 文章详情 `/article/1`
- 查看文章内容和元信息
- 点击标签跳转筛选
- 测试点赞和分享按钮
- 查看相关文章推荐
- 在评论区发表评论
- 查看侧边栏的目录、标签云、分类列表

### 关于页面 `/about`
- 查看个人信息展示

### 主题切换
- 点击导航栏右侧的灯泡图标
- 观察页面从亮色切换到暗色模式
- 刷新页面，主题状态会保持

---

## 📝 自定义配置

### 修改个人信息

编辑 `src/views/About.vue`：

```vue
const name = ref('你的名字')
const title = ref('你的职位')
const description = ref('你的简介')
const contacts = ref([
  { type: 'Email', value: 'your@email.com' },
  { type: 'GitHub', value: 'github.com/username' }
])
```

### 修改首页统计数据

编辑 `src/views/Home.vue`：

```typescript
const stats = ref({
  articles: 42,  // 文章数
  tags: 18,      // 标签数
  views: '1.2k'  // 访问量
})
```

### 添加文章数据

编辑 `src/data/articles.ts`，在 `articles` 数组中添加：

```typescript
{
  id: 7,
  title: '你的文章标题',
  summary: '文章摘要...',
  content: '文章内容...',
  category: '分类名称',
  tags: ['标签1', '标签2'],
  date: '2024-03-20',
  author: '作者名',
  views: 0,
  likes: 0,
  coverImage: '图片URL'
}
```

### 修改主题颜色

编辑各组件的 CSS 中的渐变色：

```css
/* 当前主色调 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 修改为你喜欢的颜色 */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

---

## 🔌 连接后端 API

### 1. 创建 API 服务

创建 `src/api/article.ts`：

```typescript
import axios from 'axios'
import type { Article } from '@/types/article'

const api = axios.create({
  baseURL: 'http://your-api.com/api'
})

export const articleApi = {
  // 获取文章列表
  getList(params: any) {
    return api.get<{ list: Article[]; total: number }>('/articles', { params })
  },
  
  // 获取文章详情
  getDetail(id: number) {
    return api.get<Article>(`/articles/${id}`)
  },
  
  // 其他 API...
}
```

### 2. 在组件中使用

```typescript
import { articleApi } from '@/api/article'

const loadArticles = async () => {
  const { data } = await articleApi.getList({
    page: currentPage.value,
    pageSize: pageSize.value
  })
  articles.value = data.list
  total.value = data.total
}
```

---

## 🎨 样式定制

### 全局样式

编辑 `src/assets/styles/global.css` 添加全局样式。

### 组件样式

所有组件都使用 scoped 样式，可以直接在组件的 `<style scoped>` 中修改。

### 暗色模式样式

使用属性选择器：

```css
/* 亮色模式 */
.my-component {
  background: white;
  color: #333;
}

/* 暗色模式 */
[data-theme='dark'] .my-component {
  background: #1f1f1f;
  color: #e0e0e0;
}
```

---

## 🚀 部署上线

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

### 部署到 Vercel

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 部署：
```bash
vercel
```

### 部署到 Netlify

1. 在 Netlify 创建新站点
2. 连接 GitHub 仓库
3. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`

### 部署到 Nginx

1. 上传 `dist` 目录到服务器
2. 配置 Nginx：

```nginx
server {
  listen 80;
  server_name your-domain.com;
  
  root /path/to/dist;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 🐛 常见问题

### Q: 路由跳转后页面空白？
A: 检查路由配置是否正确，组件路径是否存在。

### Q: 图片不显示？
A: 确保图片路径正确，或使用在线图片 URL。

### Q: 暗色模式切换不生效？
A: 检查是否所有组件都添加了暗色模式样式。

### Q: 搜索功能不工作？
A: 确保文章数据中有内容可以搜索。

---

## 📚 扩展阅读

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Ant Design Vue 文档](https://antdv.com/)
- [Vite 官方文档](https://vitejs.dev/)

---

## 💡 开发建议

1. **使用 TypeScript**
   - 充分利用类型提示
   - 定义清晰的接口
   
2. **组件化思维**
   - 保持组件职责单一
   - 合理拆分大组件
   
3. **代码规范**
   - 使用 ESLint 检查
   - 遵循命名规范
   
4. **性能优化**
   - 避免不必要的重渲染
   - 使用 v-memo 优化列表
   - 图片懒加载

5. **用户体验**
   - 加载状态反馈
   - 错误处理提示
   - 响应式适配

---

## 🎓 学习路径

如果你是初学者，建议按以下顺序学习：

1. **基础页面** → 先看 `Home.vue` 和 `About.vue`
2. **数据管理** → 研究 `src/data/articles.ts`
3. **路由配置** → 了解 `src/router/router.ts`
4. **功能组件** → 学习 `SearchBar.vue`、`TagCloud.vue` 等
5. **高级功能** → 深入 `ArticleDetail.vue` 和 `CommentBox.vue`
6. **状态管理** → 理解 `useTheme.ts` composable

---

## 🤝 获取帮助

- 查看 `OPTIMIZATION_SUMMARY.md` 了解项目架构
- 阅读组件内的注释
- 参考各组件的 Props 和 Emits 定义

祝你使用愉快！🎉
