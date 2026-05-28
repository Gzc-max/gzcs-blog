<template>
  <div class="articles-page">
    <div class="container-wide">
      <header class="page-header">
        <span class="eyebrow">Knowledge Index</span>
        <div class="page-header-main">
          <div>
            <h1>文章索引</h1>
            <p>按主题、标签和关键词检索所有工程笔记，把灵感从列表里重新捞出来。</p>
          </div>
          <div class="index-status">
            <strong>{{ filtered.length }}</strong>
            <span>/ {{ allArticles.length }} entries</span>
          </div>
        </div>
      </header>

      <div class="index-layout">
        <aside class="filters">
          <label class="search-box">
            <span>QUERY</span>
            <input
              v-model="keyword"
              type="text"
              placeholder="Search notes, tags, ideas..."
              @input="onSearch"
            />
          </label>

          <section v-if="categories.length" class="filter-section">
            <h2>Tracks</h2>
            <div class="filter-list">
              <button
                class="filter-btn"
                :class="{ active: selectedCategory === '' }"
                @click="selectCategory('')"
              >
                <span>全部</span>
                <em>{{ allArticles.length }}</em>
              </button>
              <button
                v-for="cat in categories"
                :key="cat"
                class="filter-btn"
                :class="{ active: selectedCategory === cat }"
                @click="selectCategory(cat)"
              >
                <span>{{ cat }}</span>
                <em>{{ countByCategory(cat) }}</em>
              </button>
            </div>
          </section>

          <section v-if="tags.length" class="filter-section">
            <h2>Signals</h2>
            <div class="tag-list">
              <button
                class="tag-btn"
                :class="{ active: selectedTag === '' }"
                @click="selectTag('')"
              >
                全部
              </button>
              <button
                v-for="t in tags.slice(0, 18)"
                :key="t.name"
                class="tag-btn"
                :class="{ active: selectedTag === t.name }"
                @click="selectTag(t.name)"
              >
                {{ t.name }} <span>{{ t.count }}</span>
              </button>
            </div>
          </section>
        </aside>

        <main class="article-index">
          <div class="active-query">
            <span>{{ queryLabel }}</span>
            <button v-if="hasActiveFilter" @click="clearFilters">清除筛选</button>
          </div>

          <div v-if="filtered.length === 0" class="empty-state">
            没有找到匹配的文章
          </div>
          <article
            v-for="(article, index) in filtered"
            :key="article.slug"
            class="article-card"
            @click="goToArticle(article.slug)"
          >
            <div class="article-date">
              <strong>{{ getDay(article.date) }}</strong>
              <span>{{ getYearMonth(article.date) }}</span>
            </div>
            <div class="article-content">
              <div class="article-meta">
                <span>#{{ String(index + 1).padStart(2, '0') }}</span>
                <span>{{ article.category }}</span>
                <span>{{ article.wordCount }} 字</span>
                <span>{{ article.readingMinutes }} min read</span>
              </div>
              <h2>{{ article.title }}</h2>
              <p>{{ article.summary }}</p>
              <div class="article-tags">
                <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { loadArticlesMeta, getAllTags, getCategories, type ArticleMeta } from '@/utils/contentLoader'
import { setSeo } from '@/utils/seo'

const router = useRouter()
const route = useRoute()

const allArticles = ref<ArticleMeta[]>([])
const categories = ref<string[]>([])
const tags = ref<{ name: string; count: number }[]>([])

const keyword = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')

onMounted(() => {
  setSeo({
    title: '文章',
    description: '浏览高子晨关于前端开发、AI 全栈、性能优化和职业思考的文章。'
  })

  allArticles.value = loadArticlesMeta()
  categories.value = getCategories()
  tags.value = getAllTags()

  syncFromQuery()
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

const hasActiveFilter = computed(() => Boolean(keyword.value || selectedCategory.value || selectedTag.value))

const queryLabel = computed(() => {
  const parts = [
    selectedCategory.value || '全部主题',
    selectedTag.value ? `#${selectedTag.value}` : '',
    keyword.value ? `"${keyword.value}"` : ''
  ].filter(Boolean)

  return `${filtered.value.length} entries · ${parts.join(' · ')}`
})

function countByCategory(category: string) {
  return allArticles.value.filter(article => article.category === category).length
}

function getDay(date: string) {
  return date ? date.slice(-2) : '--'
}

function getYearMonth(date: string) {
  return date ? date.slice(0, 7).replace('-', '.') : 'unknown'
}

function syncFromQuery() {
  keyword.value = typeof route.query.keyword === 'string' ? route.query.keyword : ''
  selectedCategory.value = typeof route.query.category === 'string' ? route.query.category : ''
  selectedTag.value = typeof route.query.tag === 'string' ? route.query.tag : ''
}

function syncToQuery() {
  router.replace({
    query: {
      ...(keyword.value ? { keyword: keyword.value } : {}),
      ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
      ...(selectedTag.value ? { tag: selectedTag.value } : {})
    }
  })
}

function onSearch() {
  syncToQuery()
}

function selectCategory(category: string) {
  selectedCategory.value = category
  syncToQuery()
}

function selectTag(tag: string) {
  selectedTag.value = tag
  syncToQuery()
}

function clearFilters() {
  keyword.value = ''
  selectedCategory.value = ''
  selectedTag.value = ''
  syncToQuery()
}

function goToArticle(slug: string) {
  router.push(`/article/${slug}`)
}

watch(() => route.query, syncFromQuery)
</script>

<style scoped>
.articles-page {
  padding: 56px 0 72px;
}

.page-header {
  margin-bottom: 34px;
}

.page-header-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: end;
  margin-top: 16px;
}

.page-header h1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.8rem);
  line-height: 1;
}

.page-header p {
  max-width: 680px;
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.75;
}

.index-status {
  min-width: 170px;
  padding: 18px;
  border: 1px solid var(--border-strong);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  text-align: right;
}

.index-status strong {
  display: block;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 2.2rem;
  line-height: 1;
}

.index-status span {
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.index-layout {
  display: grid;
  grid-template-columns: 310px minmax(0, 1fr);
  gap: 34px;
  align-items: start;
}

.filters {
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding: 20px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
}

.search-box span,
.filter-section h2,
.active-query,
.article-meta,
.article-date {
  font-family: var(--font-mono);
}

.search-box {
  display: block;
}

.search-box span {
  display: block;
  margin-bottom: 8px;
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 800;
}

.search-box input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid var(--border-strong);
  border-radius: 4px;
  outline: none;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

.search-box input:focus {
  border-color: var(--accent);
}

.filter-section h2 {
  margin-bottom: 12px;
  color: var(--text-tertiary);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.filter-list,
.tag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-btn,
.tag-btn {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.filter-btn {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 11px;
  border-radius: 4px;
  text-align: left;
}

.filter-btn em {
  color: var(--text-tertiary);
  font-style: normal;
}

.tag-list {
  flex-direction: row;
  flex-wrap: wrap;
}

.tag-btn {
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.tag-btn span {
  opacity: 0.55;
}

.filter-btn:hover,
.tag-btn:hover,
.filter-btn.active,
.tag-btn.active {
  border-color: var(--accent);
  background: var(--tag-bg);
  color: var(--accent);
}

.article-index {
  min-width: 0;
}

.active-query {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-strong);
  color: var(--text-tertiary);
  font-size: 0.76rem;
  text-transform: uppercase;
}

.active-query button {
  border: 0;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  font-family: inherit;
}

.empty-state {
  padding: 70px 0;
  color: var(--text-tertiary);
  text-align: center;
}

.article-card {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.article-card:hover {
  border-color: var(--accent);
  transform: translateX(6px);
}

.article-date {
  padding-top: 4px;
}

.article-date strong {
  display: block;
  color: var(--accent-2);
  font-size: 2.1rem;
  line-height: 1;
}

.article-date span {
  color: var(--text-tertiary);
  font-size: 0.72rem;
}

.article-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  color: var(--text-tertiary);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.article-card h2 {
  margin-bottom: 8px;
  font-size: 1.35rem;
  line-height: 1.35;
}

.article-card p {
  max-width: 780px;
  margin-bottom: 14px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.75;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 3px 9px;
  border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
  border-radius: 999px;
  background: var(--tag-bg);
  color: var(--tag-text);
  font-size: 0.76rem;
}

@media (max-width: 940px) {
  .index-layout {
    grid-template-columns: 1fr;
  }

  .filters {
    position: static;
  }
}

@media (max-width: 640px) {
  .articles-page {
    padding: 36px 0 54px;
  }

  .page-header-main {
    grid-template-columns: 1fr;
  }

  .index-status {
    text-align: left;
  }

  .article-card {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
