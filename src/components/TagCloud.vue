<template>
  <div class="tag-cloud">
    <h3 class="cloud-title">
      <tags-outlined />
      <span>标签云</span>
    </h3>
    <div class="tags-wrapper">
      <a-tag
        v-for="tag in tags"
        :key="tag.id"
        :color="tag.color"
        class="tag-item"
        @click="handleTagClick(tag.name)"
      >
        {{ tag.name }} ({{ tag.count }})
      </a-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TagsOutlined } from '@ant-design/icons-vue'
import { tags } from '@/data/articles'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleTagClick = (tagName: string) => {
  router.push({
    path: '/articles',
    query: { tag: tagName }
  })
}
</script>

<style scoped>
.tag-cloud {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.cloud-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

[data-theme='dark'] .tag-cloud {
  background: #1f1f1f;
  border: 1px solid #333;
}

[data-theme='dark'] .cloud-title {
  color: #e0e0e0;
}
</style>
