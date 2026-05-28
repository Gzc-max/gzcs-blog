<template>
  <div class="about-page">
    <div class="container">
      <h1 class="page-title">关于</h1>

      <div class="about-content">
        <p>
          你好，我是 GZC，一名前端工程师。
        </p>
        <p>
          平时主要使用 Vue 生态，也接触过 React 和 Node.js。喜欢折腾工具链、性能优化和界面细节。
        </p>
        <p>
          这个博客用来记录技术思考和项目经验，也算是一个个人作品展示。
        </p>

        <section class="about-section">
          <h2>技术栈</h2>
          <ul class="tech-list">
            <li>Vue 3 / TypeScript / Vite</li>
            <li>HTML5 / CSS3 / 响应式设计</li>
            <li>Node.js / Express</li>
            <li>Git / Docker / CI/CD</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>联系我</h2>
          <ul class="contact-list">
            <li><a href="mailto:your@email.com">your@email.com</a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="https://gitee.com" target="_blank" rel="noopener">Gitee</a></li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { setSeo } from '@/utils/seo'

onMounted(() => {
  setSeo({
    title: '关于',
    description: '了解高子晨的技术栈、开发经历和联系方式。'
  })
})
</script>

<style scoped>
.about-page {
  padding: 48px 0 60px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 32px;
}

.about-content p {
  margin-bottom: 1.2em;
  color: var(--text-secondary);
  line-height: 1.8;
}

.about-section {
  margin-top: 40px;
}

.about-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.tech-list,
.contact-list {
  list-style: none;
  padding: 0;
}

.tech-list li {
  padding: 6px 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.contact-list li {
  padding: 6px 0;
}

.contact-list a {
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  transition: border-color 0.2s;
}

.contact-list a:hover {
  border-color: var(--accent);
}

@media (max-width: 640px) {
  .about-page {
    padding: 32px 0 40px;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
