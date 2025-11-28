<template>
  <div class="search-bar">
    <a-input-search
      v-model:value="keyword"
      placeholder="搜索文章标题、标签..."
      size="large"
      :loading="loading"
      @search="handleSearch"
      enter-button
    >
      <template #prefix>
        <search-outlined />
      </template>
    </a-input-search>

    <!-- 搜索建议下拉 -->
    <div v-if="showSuggestions && suggestions.length" class="suggestions">
      <div
        v-for="item in suggestions"
        :key="item.id"
        class="suggestion-item"
        @click="selectSuggestion(item)"
      >
        <file-text-outlined class="suggestion-icon" />
        <div class="suggestion-content">
          <div class="suggestion-title">{{ item.title }}</div>
          <div class="suggestion-tags">
            <a-tag v-for="tag in item.tags" :key="tag" size="small">
              {{ tag }}
            </a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import { getArticles } from '@/data/articles'
import type { Article } from '@/types/article'

const router = useRouter()
const keyword = ref('')
const loading = ref(false)
const showSuggestions = ref(false)
const suggestions = ref<Article[]>([])

// 监听输入变化，显示搜索建议
watch(keyword, (val) => {
  if (val.trim()) {
    const result = getArticles({ keyword: val, pageSize: 5 })
    suggestions.value = result.list
    showSuggestions.value = true
  } else {
    showSuggestions.value = false
  }
})

// 处理搜索
const handleSearch = (value: string) => {
  showSuggestions.value = false
  if (value.trim()) {
    router.push({
      path: '/articles',
      query: { keyword: value }
    })
  }
}

// 选择建议项
const selectSuggestion = (article: Article) => {
  showSuggestions.value = false
  router.push(`/article/${article.id}`)
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.suggestion-icon {
  font-size: 18px;
  color: #999;
  margin-top: 2px;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestion-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* 暗色模式 */
[data-theme='dark'] .suggestions {
  background: #1f1f1f;
  border: 1px solid #333;
}

[data-theme='dark'] .suggestion-item {
  border-bottom-color: #333;
}

[data-theme='dark'] .suggestion-item:hover {
  background: #2a2a2a;
}

[data-theme='dark'] .suggestion-title {
  color: #e0e0e0;
}
</style>
