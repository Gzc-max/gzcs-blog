<template>
  <div class="interview">
    <div class="page-header">
      <div class="header-content">
        <a-typography-title :level="1" class="page-title">
          前端面试题集
        </a-typography-title>
        <p class="subtitle">系统化整理前端面试知识，助力职业发展</p>
      </div>
    </div>

    <a-row :gutter="24" class="main-content">
      <!-- 左侧导航 -->
      <a-col :span="6">
        <div class="nav-wrapper">
          <div class="nav-header">
            <p class="nav-title">知识导航</p>
          </div>
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            style="height: 100%"
            class="custom-menu"
          >
            <a-menu-item key="vue2">
              <template #icon><html5-outlined /></template>
              Vue2
            </a-menu-item>
            <a-menu-item key="vue3">
              <template #icon><html5-outlined /></template>
              Vue3
            </a-menu-item>
            <a-menu-item key="javascript">
              <template #icon><code-outlined /></template>
              JavaScript
            </a-menu-item>
            <a-menu-item key="leetcode">
              <template #icon><calculator-outlined /></template>
              LeetCode
            </a-menu-item>
            <a-menu-item key="typescript">
              <template #icon><code-outlined /></template>
              TypeScript
            </a-menu-item>
            <a-menu-item key="browser">
              <template #icon><chrome-outlined /></template>
              浏览器
            </a-menu-item>
            <a-menu-item key="algorithm">
              <template #icon><apartment-outlined /></template>
              算法
            </a-menu-item>
            <a-menu-item key="network">
              <template #icon><cloud-server-outlined /></template>
              服务端与网络
            </a-menu-item>
            <a-menu-item key="react">
              <template #icon><html5-outlined /></template>
              React
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>

      <!-- 右侧内容区 -->
      <a-col :span="18">
        <div class="content-area">
          <a-typography-title :level="2">{{ currentTitle }}</a-typography-title>
          <div class="question-list">
            <a-collapse v-model:activeKey="activeKeys">
              <a-collapse-panel
                v-for="question in questions"
                :key="question.id"
                :header="question.title"
              >
                <a-typography-paragraph>
                  <strong>答案：</strong>
                  {{ question.answer }}
                </a-typography-paragraph>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  Html5Outlined,
  CodeOutlined,
  CalculatorOutlined,
  ChromeOutlined,
  ApartmentOutlined,
  CloudServerOutlined
} from '@ant-design/icons-vue'
import axios from 'axios'

// 类型定义
interface Question {
  id: number
  title: string
  answer: string
  category?: string
}

interface Category {
  id: string
  name: string
}

// 状态管理
const selectedKeys = ref<string[]>(['vue3'])
const activeKeys = ref<string[]>([])
const currentTitle = ref('Vue3 相关面试题')
const questions = ref<Question[]>([])
const categories = ref<Category[]>([])

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await axios.get(
      'http://localhost:3000/api/interview/categories'
    )
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// 获取问题列表
const fetchQuestions = async (categoryId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/interview/questions/${categoryId}`
    )
    questions.value = response.data
  } catch (error) {
    console.error('Error fetching questions:', error)
  }
}

// 组件挂载时获取分类
onMounted(() => {
  fetchCategories()
})

// 监听分类选择变化
watch(selectedKeys, (newVal) => {
  if (newVal[0]) {
    fetchQuestions(newVal[0])
  }
})
</script>

<style scoped>
.interview {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.page-header {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.header-content {
  position: relative;
  padding: 40px;
  color: white;
}

.page-title {
  color: white !important;
  margin-bottom: 16px !important;
}

.subtitle {
  font-size: 16px;
  opacity: 0.8;
}

.nav-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.nav-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.nav-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.nav-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.custom-menu {
  padding: 12px 0;
}

.content-area {
  background: #fff;
  padding: 24px;
  min-height: 600px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.question-list {
  margin-top: 20px;
}

:deep(.ant-menu-inline) {
  border-right: none;
}

:deep(.ant-collapse) {
  background: transparent;
}

:deep(.ant-collapse-item) {
  margin-bottom: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px !important;
  overflow: hidden;
}

:deep(.ant-collapse-header) {
  font-weight: 500;
  background: #fafafa;
}

@media screen and (max-width: 768px) {
  .interview {
    padding: 10px;
  }

  :deep(.ant-col-6) {
    width: 100%;
    margin-bottom: 20px;
  }

  :deep(.ant-col-18) {
    width: 100%;
  }
}
</style>
