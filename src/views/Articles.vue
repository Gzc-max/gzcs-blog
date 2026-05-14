<template>
  <div class="articles-page">
    <div class="container">
      <h1 class="page-title">文章</h1>

      <!-- 搜索 -->
      <div class="search-box">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索文章..."
          class="search-input"
          @input="onSearch"
        />
      </div>

      <!-- 分类筛选 -->
      <div v-if="categories.length" class="filter-section">
        <span class="filter-label">分类</span>
        <div class="filter-list">
          <button
            class="filter-btn"
            :class="{ active: selectedCategory === '' }"
            @click="selectedCategory = ''"
          >
            全部
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-btn"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- 标签筛选 -->
      <div v-if="tags.length" class="filter-section">
        <span class="filter-label">标签</span>
        <div class="tag-list">
          <button
            class="tag-btn"
            :class="{ active: selectedTag === '' }"
            @click="selectedTag = ''"
          >
            全部
          </button>
          <button
            v-for="t in tags"
            :key="t.name"
            class="tag-btn"
            :class="{ active: selectedTag === t.name }"
            @click="selectedTag = t.name"
          >
            {{ t.name }} <span class="tag-count">{{ t.count }}</span>
          </button>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="article-list">
        <div v-if="filtered.length === 0" class="empty-state">
          没有找到匹配的文章
        </div>
        <article
          v-for="article in filtered"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { loadArticlesMeta, getAllTags, getCategories, type ArticleMeta } from '@/utils/contentLoader'
import { formatDate } from '@/utils/formatDate'

const router = useRouter()
const route = useRoute()

const allArticles = ref<ArticleMeta[]>([])
const categories = ref<string[]>([])
const tags = ref<{ name: string; count: number }[]>([])

const keyword = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')

onMounted(() => {
  allArticles.value = loadArticlesMeta()
  categories.value = getCategories()
  tags.value = getAllTags()

  // 从 URL 参数恢复搜索状态
  if (route.query.keyword) keyword.value = route.query.keyword as string
  if (route.query.category) selectedCategory.value = route.query.category as string
  if (route.query.tag) selectedTag.value = route.query.tag as string
})

const filtered = computed(() => {
  let result = allArticles.value

  if (selectedCategory.value) {
    result = result.filter(a => a.category === selectedCategory.value)
  }

  if (selectedTag.value) {
    result = result.filter(a => a.tags.includes(selectedTag.value))
  }

  if (keyword.value.trim()) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(kw) ||
      a.summary.toLowerCase().includes(kw) ||
      a.tags.some(t => t.toLowerCase().includes(kw))
    )
  }

  return result
})

function onSearch() {
  router.replace({
    query: {
      ...(keyword.value ? { keyword: keyword.value } : {}),
      ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
      ...(selectedTag.value ? { tag: selectedTag.value } : {})
    }
  })
}

function goToArticle(slug: string) {
  router.push(`/article/${slug}`)
}
</script>

<style scoped>
.articles-page {
  padding: 48px 0 60px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 32px;
}

.search-box {
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.search-input:focus {
  border-color: var(--accent);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.filter-section {
  margin-bottom: 24px;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 10px;
}

.filter-list,
.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn,
.tag-btn {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.filter-btn:hover,
.tag-btn:hover {
  border-color: var(--accent);
  color: var(--text);
}

.filter-btn.active,
.tag-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
}

.tag-count {
  margin-left: 4px;
  opacity: 0.5;
}

.article-list {
  padding-top: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--text-tertiary);
  font-size: 0.95rem;
}

.article-card {
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}

.article-card:last-child {
  border-bottom: none;
}

.article-card:hover .article-title {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.article-category {
  padding: 2px 8px;
  background: var(--tag-bg);
  border-radius: 4px;
  font-size: 0.75rem;
}

.article-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.article-summary {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 4px;
}

@media (max-width: 640px) {
  .articles-page {
    padding: 32px 0 40px;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
