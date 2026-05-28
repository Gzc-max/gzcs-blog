<template>
  <div class="article-detail">
    <div class="container-wide">
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="!article" class="not-found">
        <p>文章不存在</p>
        <router-link to="/articles" class="back-link">返回文章索引</router-link>
      </div>
      <div v-else class="article-layout">
        <article class="article-content">
          <header class="article-header">
            <router-link to="/articles" class="back-link">Articles / {{ article.category }}</router-link>
            <div class="article-meta">
              <time>{{ formatDate(article.date) }}</time>
              <span>{{ article.wordCount }} 字</span>
              <span>{{ article.readingMinutes }} min read</span>
            </div>
            <h1>{{ article.title }}</h1>
            <p class="article-summary">{{ article.summary }}</p>
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

          <div class="article-body" v-html="article.contentHtml" />

          <footer class="article-footer">
            <router-link to="/articles" class="back-link">返回文章索引</router-link>
          </footer>

          <CommentBox :article-slug="article.slug" />
        </article>

        <aside v-if="article.toc.length" class="toc">
          <div class="toc-title">FIELD MAP</div>
          <nav class="toc-nav" aria-label="文章目录">
            <a
              v-for="item in article.toc"
              :key="item.id"
              :href="`#${item.id}`"
              class="toc-link"
              :class="`depth-${item.depth}`"
            >
              {{ item.text }}
            </a>
          </nav>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { loadArticle, type Article } from '@/utils/contentLoader'
import { formatDate } from '@/utils/formatDate'
import { setSeo } from '@/utils/seo'
import CommentBox from '@/components/CommentBox.vue'

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)

onMounted(() => {
  const slug = route.params.slug as string
  article.value = loadArticle(slug) || null
  if (article.value) {
    setSeo({
      title: article.value.title,
      description: article.value.summary,
      type: 'article'
    })
  } else {
    setSeo({
      title: '文章不存在',
      description: '这篇文章不存在或已经被移动。'
    })
  }
  loading.value = false
})
</script>

<style scoped>
.article-detail {
  padding: 52px 0 76px;
}

.loading-state,
.not-found {
  padding: 90px 24px;
  color: var(--text-tertiary);
  text-align: center;
}

.not-found p {
  margin-bottom: 16px;
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 820px) 260px;
  gap: 58px;
  align-items: start;
  justify-content: center;
}

.article-content {
  min-width: 0;
}

.article-header {
  position: relative;
  margin-bottom: 44px;
  padding: 34px;
  border: 1px solid var(--border-strong);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
}

.article-header::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 110px;
  height: 4px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3));
}

.back-link,
.article-meta,
.toc-title {
  font-family: var(--font-mono);
}

.back-link {
  display: inline-flex;
  margin-bottom: 18px;
  color: var(--accent);
  font-size: 0.78rem;
  text-transform: uppercase;
}

.article-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  color: var(--text-tertiary);
  font-size: 0.74rem;
  text-transform: uppercase;
}

.article-header h1 {
  max-width: 760px;
  margin-bottom: 18px;
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 4.2rem);
  font-weight: 800;
  line-height: 1.05;
}

.article-summary {
  max-width: 720px;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.85;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.tag {
  padding: 4px 10px;
  border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
  border-radius: 999px;
  background: var(--tag-bg);
  color: var(--tag-text);
  font-size: 0.8rem;
  transition: border-color 0.2s, color 0.2s;
}

.tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.article-body {
  padding: 8px 6px 0;
  color: var(--text);
  font-size: 1.04rem;
  line-height: 1.9;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  scroll-margin-top: 96px;
  margin-top: 2.25em;
  margin-bottom: 0.75em;
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0;
}

.article-body :deep(h1) {
  font-size: 2rem;
}

.article-body :deep(h2) {
  position: relative;
  padding-left: 18px;
  font-size: 1.55rem;
}

.article-body :deep(h2)::before {
  content: '';
  position: absolute;
  top: 0.32em;
  left: 0;
  width: 5px;
  height: 1.1em;
  background: var(--accent);
}

.article-body :deep(h3) {
  font-size: 1.24rem;
}

.article-body :deep(p) {
  margin-bottom: 1.25em;
}

.article-body :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

.article-body :deep(code) {
  padding: 2px 7px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--tag-bg);
  color: var(--tag-text);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.article-body :deep(pre) {
  position: relative;
  margin: 1.8em 0;
  padding: 48px 18px 18px;
  border: 1px solid color-mix(in srgb, var(--accent) 24%, transparent);
  border-radius: 0;
  background: var(--code-bg);
  box-shadow: 8px 8px 0 color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--code-text);
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.7;
}

.article-body :deep(pre)::before {
  content: 'CODE BLOCK';
  position: absolute;
  top: 14px;
  left: 18px;
  color: color-mix(in srgb, var(--code-text) 62%, transparent);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
}

.article-body :deep(pre code) {
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: inherit;
}

.article-body :deep(blockquote) {
  margin: 1.8em 0;
  padding: 18px 22px;
  border-left: 4px solid var(--accent-2);
  background: color-mix(in srgb, var(--card-bg) 72%, transparent);
  color: var(--text-secondary);
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 1em 0 1.35em;
  padding-left: 24px;
}

.article-body :deep(li) {
  margin-bottom: 0.45em;
}

.article-body :deep(table) {
  width: 100%;
  margin: 1.6em 0;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.article-body :deep(th),
.article-body :deep(td) {
  padding: 11px 14px;
  border: 1px solid var(--border);
  text-align: left;
}

.article-body :deep(th) {
  background: var(--bg-secondary);
  color: var(--text);
  font-weight: 700;
}

.article-body :deep(hr) {
  margin: 2.2em 0;
  border: 0;
  border-top: 1px solid var(--border-strong);
}

.article-body :deep(img) {
  margin: 1.6em 0;
  border: 1px solid var(--border);
  box-shadow: var(--card-shadow);
}

.article-footer {
  margin-top: 56px;
  padding-top: 26px;
  border-top: 1px solid var(--border-strong);
}

.toc {
  position: sticky;
  top: 98px;
  padding: 20px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
}

.toc-title {
  margin-bottom: 14px;
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-link {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
  transition: color 0.2s, transform 0.2s;
}

.toc-link:hover {
  color: var(--accent);
  transform: translateX(3px);
}

.toc-link.depth-3 {
  padding-left: 14px;
  font-size: 0.8rem;
}

@media (max-width: 960px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .toc {
    display: none;
  }
}

@media (max-width: 640px) {
  .article-detail {
    padding: 34px 0 54px;
  }

  .article-header {
    padding: 24px 20px;
  }

  .article-header h1 {
    font-size: 2.15rem;
  }

  .article-body {
    padding-inline: 0;
    font-size: 1rem;
  }

  .article-body :deep(h1) {
    font-size: 1.55rem;
  }

  .article-body :deep(h2) {
    font-size: 1.28rem;
  }
}
</style>
