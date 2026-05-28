<template>
  <div class="home">
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Frontend / AI Lab</span>
        <h1>把前端工程、AI 工具和产品系统写成可复用的经验。</h1>
        <p>
          这里记录我在 Vue、TypeScript、可视化、AI Agent 和工程协作里的实践：
          不追热点的烟花，更关心能长期工作的结构、方法和判断。
        </p>
        <div class="hero-actions">
          <router-link to="/articles" class="primary-action">浏览文章</router-link>
          <router-link to="/resume" class="secondary-action">查看履历</router-link>
        </div>
      </div>

      <aside class="lab-panel" aria-label="个人技术工作台">
        <div class="panel-topline">
          <span>GZC.LOG</span>
          <span>ONLINE</span>
        </div>
        <div class="signal-card">
          <span class="signal-label">Current Focus</span>
          <strong>AI-ready frontend workflows</strong>
          <p>把复杂系统拆成更容易被人和 Agent 协作维护的形态。</p>
        </div>
        <div class="metric-grid">
          <div class="metric">
            <strong>{{ articles.length }}</strong>
            <span>Entries</span>
          </div>
          <div class="metric">
            <strong>{{ categories.length }}</strong>
            <span>Tracks</span>
          </div>
          <div class="metric">
            <strong>{{ topTags.length }}</strong>
            <span>Signals</span>
          </div>
        </div>
        <div class="topic-strip">
          <span v-for="tag in topTags" :key="tag">{{ tag }}</span>
        </div>
      </aside>
    </section>

    <section class="tracks">
      <article v-for="track in tracks" :key="track.title" class="track-card">
        <span class="track-index">{{ track.index }}</span>
        <h2>{{ track.title }}</h2>
        <p>{{ track.description }}</p>
      </article>
    </section>

    <section class="latest">
      <div class="section-heading">
        <span class="eyebrow">Recent Notes</span>
        <div>
          <h2>最新研究日志</h2>
          <p>从问题、方案到复盘，保留工程现场里的思考纹理。</p>
        </div>
        <router-link to="/articles" class="section-link">全部文章</router-link>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else class="article-stream">
        <article
          v-for="(article, index) in recentArticles"
          :key="article.slug"
          class="article-card"
          @click="goToArticle(article.slug)"
        >
          <div class="article-index">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="article-main">
            <div class="article-meta">
              <time>{{ formatDate(article.date) }}</time>
              <span>{{ article.category }}</span>
              <span>{{ article.readingMinutes }} min read</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <div class="article-tags">
              <span v-for="tag in article.tags.slice(0, 4)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadArticlesMeta, getCategories, type ArticleMeta } from '@/utils/contentLoader'
import { formatDate } from '@/utils/formatDate'
import { setSeo } from '@/utils/seo'

const router = useRouter()
const articles = ref<ArticleMeta[]>([])
const recentArticles = ref<ArticleMeta[]>([])
const categories = ref<string[]>([])
const loading = ref(true)

const tracks = [
  {
    index: '01',
    title: 'Frontend Systems',
    description: '记录组件设计、性能优化、工程化和复杂前端系统的长期维护方法。'
  },
  {
    index: '02',
    title: 'AI Workflows',
    description: '探索 Agent-ready repo、AI 编程协作、RAG 和面向工具的产品设计。'
  },
  {
    index: '03',
    title: 'Career Notes',
    description: '沉淀职业判断、团队协作、技术表达和从经验里长出来的方法论。'
  }
]

const topTags = computed(() => {
  const counts = new Map<string, number>()
  articles.value.forEach(article => {
    article.tags.forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1))
  })

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag)
})

onMounted(() => {
  setSeo({
    title: '高子晨的网络日志',
    description: '高子晨的个人博客，记录前端开发、AI 全栈探索、工程实践和职业思考。'
  })

  const all = loadArticlesMeta()
  articles.value = all
  recentArticles.value = all.slice(0, 5)
  categories.value = getCategories()
  loading.value = false
})

function goToArticle(slug: string) {
  router.push(`/article/${slug}`)
}
</script>

<style scoped>
.home {
  padding: 54px 0 76px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) 420px;
  gap: 56px;
  align-items: stretch;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px 56px;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 430px;
}

.hero h1 {
  max-width: 860px;
  margin: 18px 0 22px;
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 6vw, 5.8rem);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: 0;
}

.hero-copy p {
  max-width: 720px;
  color: var(--text-secondary);
  font-size: 1.08rem;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 34px;
}

.primary-action,
.secondary-action,
.section-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid var(--border-strong);
  border-radius: 4px;
  font-size: 0.92rem;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.primary-action {
  background: var(--text);
  color: var(--bg);
  box-shadow: 6px 6px 0 color-mix(in srgb, var(--accent) 28%, transparent);
}

.secondary-action,
.section-link {
  background: var(--card-bg);
  color: var(--text-secondary);
}

.primary-action:hover,
.secondary-action:hover,
.section-link:hover {
  border-color: var(--accent);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 color-mix(in srgb, var(--accent) 22%, transparent);
}

.lab-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--border-strong);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--card-bg) 82%, transparent), color-mix(in srgb, var(--bg-secondary) 70%, transparent)),
    var(--card-bg);
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.lab-panel::before {
  content: '';
  position: absolute;
  inset: 12px;
  border: 1px dashed color-mix(in srgb, var(--accent) 30%, transparent);
  pointer-events: none;
}

.panel-topline,
.signal-label,
.metric span,
.article-meta,
.article-index,
.track-index {
  font-family: var(--font-mono);
}

.panel-topline {
  display: flex;
  justify-content: space-between;
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.signal-card {
  position: relative;
  z-index: 1;
  margin-top: 28px;
  padding: 24px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 62%, transparent);
}

.signal-label {
  display: block;
  margin-bottom: 16px;
  color: var(--text-tertiary);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.signal-card strong {
  display: block;
  color: var(--text);
  font-size: 1.65rem;
  line-height: 1.12;
}

.signal-card p {
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
}

.metric-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--border);
}

.metric {
  padding: 18px 14px;
  border-right: 1px solid var(--border);
}

.metric:last-child {
  border-right: 0;
}

.metric strong {
  display: block;
  font-size: 1.7rem;
  line-height: 1;
}

.metric span {
  color: var(--text-tertiary);
  font-size: 0.68rem;
  text-transform: uppercase;
}

.topic-strip {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.topic-strip span,
.tag {
  border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 999px;
  font-size: 0.76rem;
}

.topic-strip span {
  padding: 5px 10px;
}

.tracks,
.latest {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
}

.tracks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 70px;
}

.track-card {
  min-height: 190px;
  padding: 24px;
  border-top: 3px solid var(--accent);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
}

.track-index {
  color: var(--accent-2);
  font-size: 0.78rem;
  font-weight: 800;
}

.track-card h2 {
  margin: 28px 0 10px;
  font-size: 1.15rem;
}

.track-card p {
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.75;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: end;
  margin-bottom: 28px;
}

.section-heading .eyebrow {
  grid-column: 1 / -1;
}

.section-heading h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1.1;
}

.section-heading p {
  margin-top: 8px;
  color: var(--text-secondary);
}

.article-stream {
  border-top: 1px solid var(--border-strong);
}

.article-card {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.article-card:hover {
  transform: translateX(6px);
}

.article-index {
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 800;
}

.article-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  color: var(--text-tertiary);
  font-size: 0.74rem;
  text-transform: uppercase;
}

.article-card h3 {
  margin-bottom: 8px;
  font-size: 1.3rem;
  line-height: 1.35;
}

.article-card p {
  max-width: 780px;
  margin-bottom: 14px;
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.75;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 3px 9px;
}

.loading {
  padding: 40px;
  color: var(--text-tertiary);
  text-align: center;
}

@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    min-height: auto;
  }

  .tracks {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .home {
    padding: 34px 0 54px;
  }

  .hero,
  .tracks,
  .latest {
    padding-inline: 18px;
  }

  .hero {
    gap: 32px;
    padding-bottom: 42px;
  }

  .hero h1 {
    font-size: 2.55rem;
  }

  .lab-panel {
    padding: 18px;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }

  .metric {
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }

  .metric:last-child {
    border-bottom: 0;
  }

  .section-heading {
    grid-template-columns: 1fr;
  }

  .section-link {
    justify-self: start;
  }

  .article-card {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>
