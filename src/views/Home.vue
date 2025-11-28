<template>
  <div class="home-container">
    <!-- 顶部 Hero 区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到我的博客</h1>
        <p class="hero-subtitle">分享技术 · 记录成长 · 探索未知</p>
        <div class="hero-search">
          <SearchBar />
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="content-wrapper">
      <!-- 左侧侧边栏 -->
      <div class="sidebar">
        <div class="profile-card">
          <div class="avatar-wrapper">
            <a-avatar :size="100" src="@/assets/avatar.jpg">
              <template #icon><user-outlined /></template>
            </a-avatar>
          </div>
          <h2 class="profile-name">GZC</h2>
          <p class="profile-bio">Full Stack Developer</p>

          <!-- 社交媒体图标 -->
          <div class="social-links">
            <a-tooltip title="GitHub" placement="bottom">
              <a href="https://github.com/yourusername" target="_blank" class="social-link">
                <github-filled />
              </a>
            </a-tooltip>
            <a-tooltip title="Gitee" placement="bottom">
              <a href="https://gitee.com/yourusername" target="_blank" class="social-link">
                <code-sandbox-outlined />
              </a>
            </a-tooltip>
            <a-tooltip title="微博" placement="bottom">
              <a href="https://weibo.com/yourusername" target="_blank" class="social-link">
                <weibo-outlined />
              </a>
            </a-tooltip>
          </div>

          <a-divider style="margin: 20px 0" />

          <!-- 快捷功能 -->
          <div class="quick-actions">
            <div class="action-item" @click="handleAction('theme')">
              <skin-outlined class="action-icon" />
              <span>更换主题</span>
            </div>
            <div class="action-item" @click="handleAction('music')">
              <customer-service-outlined class="action-icon" />
              <span>音乐播放</span>
            </div>
            <div class="action-item" @click="handleAction('categories')">
              <folder-outlined class="action-icon" />
              <span>文章分类</span>
            </div>
            <div class="action-item" @click="handleAction('tags')">
              <tags-outlined class="action-icon" />
              <span>标签云</span>
            </div>
          </div>
        </div>

        <!-- 统计信息卡片 -->
        <div class="stats-card">
          <div class="stat-item">
            <div class="stat-number">{{ stats.articles }}</div>
            <div class="stat-label">文章</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.tags }}</div>
            <div class="stat-label">标签</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.views }}</div>
            <div class="stat-label">访问</div>
          </div>
        </div>
      </div>

      <!-- 右侧主内容区 -->
      <div class="main-content">
        <div class="section-header">
          <h2 class="section-title">最新文章</h2>
          <a-button type="link" size="small" @click="router.push('/articles')">
            查看全部 →
          </a-button>
        </div>

        <div class="posts-grid">
          <div 
            class="post-card" 
            v-for="post in latestPosts" 
            :key="post.id"
            @click="goToArticle(post.id)"
          >
            <div class="post-header">
              <h3 class="post-title">{{ post.title }}</h3>
              <a-tag color="blue">{{ post.category }}</a-tag>
            </div>
            <p class="post-summary">{{ post.summary }}</p>
            <div class="post-footer">
              <span class="post-date">
                <calendar-outlined />
                {{ post.date }}
              </span>
              <span class="post-views">
                <eye-outlined />
                {{ post.views }} 阅读
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  GithubFilled,
  WeiboOutlined,
  CodeSandboxOutlined,
  SkinOutlined,
  CustomerServiceOutlined,
  FolderOutlined,
  TagsOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import { getArticles } from '@/data/articles'

// 统计数据
const stats = ref({
  articles: 42,
  tags: 18,
  views: '1.2k'
})

const router = useRouter()

// 最新文章列表
const latestPosts = ref(getArticles({ pageSize: 4 }).list)

// 处理快捷操作
const handleAction = (action: string) => {
  if (action === 'categories') {
    router.push('/articles')
  } else if (action === 'tags') {
    router.push('/articles')
  } else {
    console.log(`功能开发中: ${action}`)
  }
}

// 跳转到文章详情
const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}
</script>

<style scoped>
.home-container {
  width: 100%;
  margin: -20px;
}

/* Hero 区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.4;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3em;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 32px 0;
  font-weight: 300;
}

.hero-search {
  max-width: 600px;
  margin: 0 auto;
}

/* 内容区域 */
.content-wrapper {
  max-width: 1200px;
  margin: -40px auto 0;
  padding: 0 20px 40px;
  display: flex;
  gap: 30px;
  position: relative;
  z-index: 2;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.avatar-wrapper {
  margin-bottom: 20px;
}

.profile-name {
  margin: 0 0 8px;
  font-size: 1.8em;
  font-weight: 600;
  color: #1a1a1a;
}

.profile-bio {
  color: #666;
  margin: 0;
  font-size: 0.95em;
}

/* 社交链接 */
.social-links {
  margin: 24px 0;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  background: #f5f5f5;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 快捷功能 */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-size: 0.95em;
}

.action-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(4px);
}

.action-icon {
  font-size: 16px;
}

/* 统计信息卡片 */
.stats-card {
  margin-top: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* 主内容区 */
.main-content {
  flex: 1;
  min-width: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.8em;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

/* 文章网格 */
.posts-grid {
  display: grid;
  gap: 24px;
}

.post-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.post-title {
  flex: 1;
  margin: 0;
  font-size: 1.4em;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.post-summary {
  color: #666;
  line-height: 1.8;
  margin: 0 0 16px 0;
  font-size: 0.95em;
}

.post-footer {
  display: flex;
  gap: 24px;
  color: #999;
  font-size: 0.9em;
}

.post-date,
.post-views {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 响应式设计 */
@media screen and (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .stats-card {
    display: flex;
  }
}

@media screen and (max-width: 768px) {
  .hero-title {
    font-size: 2em;
  }

  .hero-subtitle {
    font-size: 1em;
  }

  .hero-section {
    padding: 60px 20px;
  }

  .content-wrapper {
    margin-top: -30px;
    padding: 0 16px 30px;
  }

  .section-title {
    font-size: 1.5em;
  }

  .post-card {
    padding: 20px;
  }

  .post-title {
    font-size: 1.2em;
  }
}
</style>
