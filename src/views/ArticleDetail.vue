<template>
  <div class="article-detail" v-if="article">
    <div class="article-container">
      <!-- 文章头部 -->
      <div class="article-header">
        <a-breadcrumb class="breadcrumb">
          <a-breadcrumb-item>
            <router-link to="/">首页</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link to="/articles">文章</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ article.title }}</a-breadcrumb-item>
        </a-breadcrumb>

        <h1 class="article-title">{{ article.title }}</h1>

        <div class="article-meta">
          <a-space :size="16">
            <span>
              <user-outlined />
              {{ article.author }}
            </span>
            <span>
              <calendar-outlined />
              {{ article.date }}
            </span>
            <span>
              <eye-outlined />
              {{ article.views }} 阅读
            </span>
            <span>
              <heart-outlined />
              {{ article.likes }} 点赞
            </span>
          </a-space>
        </div>

        <div class="article-tags">
          <a-tag
            v-for="tag in article.tags"
            :key="tag"
            color="blue"
            @click="handleTagClick(tag)"
          >
            {{ tag }}
          </a-tag>
        </div>
      </div>

      <!-- 文章内容 -->
      <div class="article-content">
        <div class="content-body" v-html="renderedContent"></div>
      </div>

      <!-- 文章底部操作 -->
      <div class="article-actions">
        <a-space :size="16">
          <a-button
            type="primary"
            size="large"
            :icon="h(HeartOutlined)"
            @click="handleLike"
          >
            点赞 ({{ article.likes }})
          </a-button>
          <a-button
            size="large"
            :icon="h(ShareAltOutlined)"
            @click="handleShare"
          >
            分享
          </a-button>
        </a-space>
      </div>

      <!-- 相关推荐 -->
      <div class="recommended-articles" v-if="recommended.length">
        <h3 class="section-title">相关推荐</h3>
        <div class="recommended-list">
          <div
            v-for="item in recommended"
            :key="item.id"
            class="recommended-item"
            @click="goToArticle(item.id)"
          >
            <h4 class="recommended-title">{{ item.title }}</h4>
            <p class="recommended-summary">{{ item.summary }}</p>
            <div class="recommended-meta">
              <span>{{ item.date }}</span>
              <span>{{ item.views }} 阅读</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comments-section">
        <h3 class="section-title">
          <comment-outlined />
          评论区
        </h3>
        <CommentBox :article-id="article.id" />
      </div>
    </div>

    <!-- 侧边栏 -->
    <div class="sidebar">
      <!-- 目录 -->
      <div class="toc-card">
        <h4 class="toc-title">目录</h4>
        <div class="toc-content">
          <div class="toc-item">文章目录功能待完善</div>
        </div>
      </div>

      <!-- 标签云 -->
      <TagCloud />

      <!-- 分类列表 -->
      <CategoryList />
    </div>
  </div>

  <a-empty v-else description="文章不存在" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CommentOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue/es'
import { getArticleById, getRecommendedArticles } from '@/data/articles'
import TagCloud from '@/components/TagCloud.vue'
import CategoryList from '@/components/CategoryList.vue'
import CommentBox from '@/components/CommentBox.vue'
import type { Article } from '@/types/article'

const route = useRoute()
const router = useRouter()

const article = ref<Article | null>(null)
const recommended = ref<Article[]>([])

// 简单的 Markdown 渲染（实际项目中应使用 marked 或 markdown-it）
const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  
  // 简单处理换行和段落
  return article.value.content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/# (.*?)(<br>|<\/p>)/g, '<h1>$1</h1>')
    .replace(/## (.*?)(<br>|<\/p>)/g, '<h2>$1</h2>')
    .replace(/### (.*?)(<br>|<\/p>)/g, '<h3>$1</h3>')
})

onMounted(() => {
  const id = Number(route.params.id)
  article.value = getArticleById(id) || null
  
  if (article.value) {
    recommended.value = getRecommendedArticles(id)
  }
})

const handleTagClick = (tag: string) => {
  router.push({
    path: '/articles',
    query: { tag }
  })
}

const handleLike = () => {
  if (article.value) {
    article.value.likes++
    message.success('点赞成功！')
  }
}

const handleShare = () => {
  message.info('分享功能待完善')
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.article-detail {
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.article-container {
  flex: 1;
  min-width: 0;
}

.article-header {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.breadcrumb {
  margin-bottom: 24px;
}

.article-title {
  font-size: 2.5em;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.article-meta {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.article-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.article-content {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  min-height: 400px;
}

.content-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.content-body :deep(h1) {
  font-size: 2em;
  margin: 24px 0 16px;
  font-weight: 600;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.content-body :deep(h2) {
  font-size: 1.6em;
  margin: 20px 0 12px;
  font-weight: 600;
}

.content-body :deep(h3) {
  font-size: 1.3em;
  margin: 16px 0 8px;
  font-weight: 600;
}

.content-body :deep(p) {
  margin: 12px 0;
}

.article-actions {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  text-align: center;
}

.recommended-articles {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.recommended-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.recommended-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.recommended-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.recommended-title {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.recommended-summary {
  font-size: 0.9em;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommended-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: #999;
}

.comments-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toc-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 84px;
}

.toc-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.toc-content {
  font-size: 14px;
  color: #666;
}

.toc-item {
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.3s;
}

.toc-item:hover {
  color: #667eea;
}

/* 暗色模式 */
[data-theme='dark'] .article-header,
[data-theme='dark'] .article-content,
[data-theme='dark'] .article-actions,
[data-theme='dark'] .recommended-articles,
[data-theme='dark'] .comments-section,
[data-theme='dark'] .toc-card {
  background: #1f1f1f;
  border: 1px solid #333;
}

[data-theme='dark'] .article-title,
[data-theme='dark'] .section-title,
[data-theme='dark'] .toc-title {
  color: #e0e0e0;
}

[data-theme='dark'] .content-body {
  color: #d0d0d0;
}

[data-theme='dark'] .recommended-item {
  background: #2a2a2a;
  border-color: #333;
}

[data-theme='dark'] .recommended-title {
  color: #e0e0e0;
}

/* 响应式 */
@media screen and (max-width: 992px) {
  .article-detail {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .toc-card {
    position: relative;
    top: 0;
  }
}

@media screen and (max-width: 768px) {
  .article-header,
  .article-content,
  .recommended-articles,
  .comments-section {
    padding: 20px;
  }

  .article-title {
    font-size: 1.8em;
  }

  .recommended-list {
    grid-template-columns: 1fr;
  }
}
</style>
