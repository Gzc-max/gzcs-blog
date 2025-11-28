<template>
  <div class="articles-page">
    <!-- 搜索和筛选区 -->
    <div class="header-section">
      <h1 class="page-title">文章列表</h1>
      <SearchBar />
      
      <div class="filter-section">
        <a-space wrap :size="12">
          <a-button
            :type="!currentCategory ? 'primary' : 'default'"
            @click="filterByCategory('')"
          >
            全部
          </a-button>
          <a-button
            v-for="cat in categories"
            :key="cat.id"
            :type="currentCategory === cat.name ? 'primary' : 'default'"
            @click="filterByCategory(cat.name)"
          >
            {{ cat.name }} ({{ cat.count }})
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content-wrapper">
      <!-- 文章列表 -->
      <div class="articles-main">
        <div v-if="filteredArticles.length === 0" class="empty-state">
          <a-empty description="暂无文章" />
        </div>

        <div v-else class="articles-grid">
          <a-card
            v-for="article in filteredArticles"
            :key="article.id"
            class="article-card"
            :hoverable="true"
            @click="goToArticle(article.id)"
          >
            <div class="article-cover" v-if="article.coverImage">
              <img :src="article.coverImage" :alt="article.title" />
            </div>

            <div class="article-body">
              <h2 class="article-title">{{ article.title }}</h2>

              <div class="article-meta">
                <a-space :size="12">
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

              <p class="article-summary">{{ article.summary }}</p>

              <div class="article-footer">
                <a-tag color="blue">{{ article.category }}</a-tag>
                <a-space :size="4">
                  <a-tag v-for="tag in article.tags.slice(0, 3)" :key="tag" size="small">
                    {{ tag }}
                  </a-tag>
                </a-space>
              </div>
            </div>
          </a-card>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="filteredArticles.length > 0">
          <a-pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :total="totalArticles"
            show-size-changer
            :page-size-options="['6', '12', '24']"
            @change="handlePageChange"
          />
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="articles-sidebar">
        <TagCloud />
        <CategoryList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined
} from '@ant-design/icons-vue'
import { getArticles, categories } from '@/data/articles'
import SearchBar from '@/components/SearchBar.vue'
import TagCloud from '@/components/TagCloud.vue'
import CategoryList from '@/components/CategoryList.vue'

const router = useRouter()
const route = useRoute()

const currentCategory = ref('')
const currentTag = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const totalArticles = ref(0)
const allArticles = ref<any[]>([])

// 筛选后的文章列表
const filteredArticles = computed(() => {
  return allArticles.value
})

// 加载文章
const loadArticles = () => {
  const result = getArticles({
    category: currentCategory.value || undefined,
    tag: currentTag.value || undefined,
    keyword: route.query.keyword as string,
    page: currentPage.value,
    pageSize: pageSize.value
  })
  allArticles.value = result.list
  totalArticles.value = result.total
}

// 按分类筛选
const filterByCategory = (category: string) => {
  currentCategory.value = category
  currentPage.value = 1
  router.push({
    path: '/articles',
    query: category ? { category } : {}
  })
  loadArticles()
}

// 页码变化
const handlePageChange = () => {
  loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 跳转到文章详情
const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

// 监听路由变化
watch(() => route.query, () => {
  if (route.query.category) {
    currentCategory.value = route.query.category as string
  }
  if (route.query.tag) {
    currentTag.value = route.query.tag as string
  }
  if (route.query.keyword) {
    currentCategory.value = ''
    currentTag.value = ''
  }
  loadArticles()
}, { immediate: false })

onMounted(() => {
  // 初始化筛选条件
  if (route.query.category) {
    currentCategory.value = route.query.category as string
  }
  if (route.query.tag) {
    currentTag.value = route.query.tag as string
  }
  loadArticles()
})
</script>

<style scoped>
.articles-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2.5em;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: #1a1a1a;
}

.filter-section {
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.content-wrapper {
  display: flex;
  gap: 30px;
}

.articles-main {
  flex: 1;
  min-width: 0;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.article-card {
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin: -24px -24px 16px -24px;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.article-body {
  padding: 0;
}

.article-title {
  font-size: 1.4em;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1a1a1a;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  margin-bottom: 12px;
  color: #666;
  font-size: 13px;
}

.article-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.article-summary {
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.articles-sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 暗色模式 */
[data-theme='dark'] .page-title {
  color: #e0e0e0;
}

[data-theme='dark'] .filter-section {
  background: #1f1f1f;
  border: 1px solid #333;
}

[data-theme='dark'] .article-card {
  background: #1f1f1f;
  border-color: #333;
}

[data-theme='dark'] .article-title {
  color: #e0e0e0;
}

[data-theme='dark'] .article-meta,
[data-theme='dark'] .article-summary {
  color: #999;
}

/* 响应式 */
@media screen and (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
  }

  .articles-sidebar {
    width: 100%;
  }

  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media screen and (max-width: 768px) {
  .articles-page {
    padding: 16px;
  }

  .page-title {
    font-size: 2em;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
