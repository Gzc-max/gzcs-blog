<template>
  <div class="category-list">
    <h3 class="list-title">
      <folder-outlined />
      <span>文章分类</span>
    </h3>
    <div class="categories">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        @click="handleCategoryClick(category.name)"
      >
        <div class="category-name">
          <component :is="getIcon(category.icon)" class="category-icon" />
          <span>{{ category.name }}</span>
        </div>
        <a-badge :count="category.count" :number-style="{ backgroundColor: '#667eea' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  FolderOutlined, 
  CodeOutlined, 
  ThunderboltOutlined, 
  RocketOutlined,
  BgColorsOutlined,
  DatabaseOutlined,
  FireOutlined
} from '@ant-design/icons-vue'
import { categories } from '@/data/articles'
import { useRouter } from 'vue-router'

const router = useRouter()

const iconMap: Record<string, any> = {
  code: CodeOutlined,
  thunderbolt: ThunderboltOutlined,
  rocket: RocketOutlined,
  'bg-colors': BgColorsOutlined,
  database: DatabaseOutlined,
  fire: FireOutlined
}

const getIcon = (iconName?: string) => {
  return iconName ? iconMap[iconName] || CodeOutlined : CodeOutlined
}

const handleCategoryClick = (categoryName: string) => {
  router.push({
    path: '/articles',
    query: { category: categoryName }
  })
}
</script>

<style scoped>
.category-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.list-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
}

.category-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(4px);
}

.category-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.category-icon {
  font-size: 16px;
}

[data-theme='dark'] .category-list {
  background: #1f1f1f;
  border: 1px solid #333;
}

[data-theme='dark'] .list-title {
  color: #e0e0e0;
}

[data-theme='dark'] .category-item {
  background: #2a2a2a;
  color: #e0e0e0;
}

[data-theme='dark'] .category-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
