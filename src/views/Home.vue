<template>
  <div class="home">
    <div class="hero">
      <h1 class="hero-title">你好，我是 GZC</h1>
      <p class="hero-desc">前端工程师 · 写代码也写文字</p>
    </div>

    <div class="home-layout">
      <!-- 左侧简介卡片 -->
      <aside class="sidebar">
        <div class="intro-card">
          <div class="intro-avatar">
            <img src="/favicon.png" alt="GZC" />
          </div>
          <div class="intro-content">
            <h2 class="intro-name">高子晨</h2>
            <p class="intro-role">前端工程师 · 可视化开发 · 全栈探索中</p>
            <p class="intro-bio">
              6 年前端开发经验，擅长 Vue / React / TypeScript，深耕数据可视化领域。
              喜欢折腾技术、写代码也写文章，这里是我的技术笔记和思考碎片的聚集地。
            </p>
            <div class="intro-stats">
              <div class="stat-item">
                <span class="stat-num">6+</span>
                <span class="stat-label">年经验</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num">{{ articles.length }}</span>
                <span class="stat-label">篇文章</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num">10+</span>
                <span class="stat-label">个项目</span>
              </div>
            </div>
            <div class="intro-links">
              <a href="https://github.com" target="_blank" rel="noopener" class="link-btn">GitHub ↗</a>
              <router-link to="/resume" class="link-btn">查看简历 →</router-link>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧文章列表 -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">最新文章</h2>
          <router-link to="/articles" class="section-link">全部 →</router-link>
        </div>

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else class="article-list">
          <article
            v-for="article in recentArticles"
            :key="article.slug"
            class="article-card"
            @click="goToArticle(article.slug)"
          >
            <div class="article-meta">
              <time class="article-date">{{ formatDate(article.date) }}</time>
              <span class="article-category">{{ article.category }}</span>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loadArticlesMeta, type ArticleMeta } from '@/utils/contentLoader'
import { formatDate } from '@/utils/formatDate'

const router = useRouter()
const articles = ref<ArticleMeta[]>([])
const recentArticles = ref<ArticleMeta[]>([])
const loading = ref(true)

onMounted(() => {
  const all = loadArticlesMeta()
  articles.value = all
  recentArticles.value = all.slice(0, 5)
  loading.value = false
})

function goToArticle(slug: string) {
  router.push(`/article/${slug}`)
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 80px 24px 60px;
}

.hero-title {
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* 首页两列布局 */
.home-layout {
  display: flex;
  gap: 64px;
  padding: 40px 32px 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  flex: 0 0 320px;
}

.sidebar .intro-card {
  position: sticky;
  top: 80px;
}

.section {
  flex: 1;
  min-width: 0;
  padding-top: 0;
}

/* 简介卡片 */
.intro-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: border-color 0.2s;
}

.intro-card:hover {
  border-color: var(--accent);
}

.intro-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--border);
  align-self: center;
}

.intro-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro-content {
  text-align: center;
}

.intro-name {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
}

.intro-role {
  font-size: 0.85rem;
  color: var(--accent);
  margin: 0 0 12px;
}

.intro-bio {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 16px;
}

.intro-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: var(--border);
}

.intro-links {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.link-btn {
  font-size: 0.85rem;
  padding: 6px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
}

.link-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.section-link {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  transition: color 0.2s;
}

.section-link:hover {
  color: var(--text);
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.article-card {
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: opacity 0.2s;
}

.article-card:last-child {
  border-bottom: none;
}

.article-card:hover {
  opacity: 0.7;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.article-category {
  padding: 2px 8px;
  background: var(--tag-bg);
  border-radius: 4px;
  font-size: 0.75rem;
}

.article-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.article-summary {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.8rem;
  padding: 2px 10px;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 4px;
}

@media (max-width: 960px) {
  .home-layout {
    flex-direction: column;
    gap: 32px;
  }

  .sidebar {
    flex: none;
    max-width: 400px;
  }

  .sidebar .intro-card {
    position: static;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 60px 16px 40px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .home-layout {
    padding: 32px 16px 40px;
    gap: 24px;
  }

  .intro-card {
    padding: 24px;
  }

  .article-title {
    font-size: 1.1rem;
  }
}
</style>
