<template>
  <div class="article-detail">
    <div class="container">
    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-else-if="!article" class="not-found">
      <p>文章不存在</p>
      <router-link to="/articles" class="back-link">← 返回文章列表</router-link>
    </div>
    <article v-else class="article-content">
      <!-- 文章头部 -->
      <header class="article-header">
        <div class="article-meta">
          <time class="article-date">{{ formatDate(article.date) }}</time>
          <span class="article-category">{{ article.category }}</span>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-tags">
          <router-link
            v-for="tag in article.tags"
            :key="tag"
            :to="{ path: '/articles', query: { tag } }"
            class="tag"
          >
            {{ tag }}
          </router-link>
        </div>
      </header>

      <!-- 正文 -->
      <div class="article-body" v-html="article.contentHtml" />

      <!-- 返回链接 -->
      <div class="article-footer">
        <router-link to="/articles" class="back-link">← 返回文章列表</router-link>
      </div>

      <!-- 评论区 -->
      <CommentBox :article-slug="article.slug" />
    </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { loadArticle, type Article } from '@/utils/contentLoader'
import { formatDate } from '@/utils/formatDate'
import CommentBox from '@/components/CommentBox.vue'

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)

onMounted(() => {
  const slug = route.params.slug as string
  article.value = loadArticle(slug)
  loading.value = false
})
</script>

<style scoped>
.article-detail {
  padding: 48px 0 60px;
}

.loading-state,
.not-found {
  text-align: center;
  padding: 80px 24px;
  color: var(--text-tertiary);
}

.not-found p {
  margin-bottom: 16px;
}

.back-link {
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--text);
}

.article-header {
  margin-bottom: 40px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
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
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.3;
  margin-bottom: 16px;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.8rem;
  padding: 3px 12px;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 4px;
  transition: all 0.2s;
}

.tag:hover {
  background: var(--accent);
  color: var(--bg);
}

.article-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

/* Markdown 正文样式 */
.article-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  margin-top: 2em;
  margin-bottom: 0.6em;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.article-body :deep(h1) { font-size: 1.6rem; }
.article-body :deep(h2) { font-size: 1.3rem; }
.article-body :deep(h3) { font-size: 1.1rem; }

.article-body :deep(p) {
  margin-bottom: 1.2em;
}

.article-body :deep(a) {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-body :deep(code) {
  padding: 2px 6px;
  background: var(--tag-bg);
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
}

.article-body :deep(pre) {
  margin: 1.5em 0;
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.88rem;
  line-height: 1.6;
}

.article-body :deep(pre code) {
  background: none;
  padding: 0;
  font-size: inherit;
}

.article-body :deep(blockquote) {
  margin: 1.5em 0;
  padding: 12px 20px;
  border-left: 3px solid var(--accent);
  color: var(--text-secondary);
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 1em 0;
  padding-left: 24px;
}

.article-body :deep(li) {
  margin-bottom: 0.4em;
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: 0.9rem;
}

.article-body :deep(th),
.article-body :deep(td) {
  padding: 10px 14px;
  border: 1px solid var(--border);
  text-align: left;
}

.article-body :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
}

.article-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2em 0;
}

.article-body :deep(img) {
  border-radius: 8px;
  margin: 1.5em 0;
}

@media (max-width: 640px) {
  .article-detail {
    padding: 32px 0 40px;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .article-body :deep(h1) { font-size: 1.3rem; }
  .article-body :deep(h2) { font-size: 1.15rem; }
}
</style>
