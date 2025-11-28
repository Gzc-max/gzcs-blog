<template>
  <div class="about">
    <a-typography-title>关于我</a-typography-title>
    <div class="content">
      <div class="profile">
        <a-typography-title :level="2">{{ name }}</a-typography-title>
        <a-typography-text type="secondary" class="title">{{
          title
        }}</a-typography-text>
      </div>

      <div class="description">
        <a-typography-title :level="3">个人简介</a-typography-title>
        <a-typography-paragraph>{{ description }}</a-typography-paragraph>
      </div>

      <div class="contact">
        <a-typography-title :level="3">联系方式</a-typography-title>
        <a-space direction="vertical">
          <a-tag v-for="(contact, index) in contacts" :key="index">
            <template #icon>
              <mail-outlined v-if="contact.type === 'Email'" />
              <github-outlined v-else-if="contact.type === 'GitHub'" />
            </template>
            {{ contact.type }}: {{ contact.value }}
          </a-tag>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MailOutlined, GithubOutlined } from '@ant-design/icons-vue'

// 个人信息
const name = ref('您的名字')
const title = ref('全栈开发工程师')
const description = ref(
  '这里是您的个人简介，可以介绍您的专业背景、技能特长、工作经历等。'
)

// 联系方式
const contacts = ref([
  { type: 'Email', value: 'your.email@example.com' },
  { type: 'GitHub', value: 'github.com/yourusername' }
])
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.content {
  margin-top: 30px;
}

.profile {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  display: block;
  margin-top: 8px;
}

.description {
  margin: 30px 0;
  line-height: 1.6;
}
</style>
