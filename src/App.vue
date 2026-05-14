<template>
  <div class="app">
    <!-- 阅读进度条 -->
    <div v-if="isActive" class="reading-progress">
      <div class="reading-progress-bar" :style="{ width: scrollProgress + '%' }" />
    </div>

    <!-- 导航栏 -->
    <header class="header">
      <div class="header-inner">
        <router-link to="/" class="logo">GZC</router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">首页</router-link>
          <router-link to="/articles" class="nav-link" active-class="active">文章</router-link>
          <router-link to="/about" class="nav-link" active-class="active">关于</router-link>
          <router-link to="/resume" class="nav-link" active-class="active">简历</router-link>
        </nav>
        <button class="theme-btn" @click="toggleTheme" :aria-label="isDark() ? '切换亮色模式' : '切换暗色模式'">
          {{ isDark() ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-inner">
        <span>© {{ new Date().getFullYear() }} GZC</span>
        <span class="footer-dot">·</span>
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useReadingProgress } from '@/composables/useReadingProgress'

const route = useRoute()
const { toggleTheme, isDark } = useTheme()
const { scrollProgress, isActive, onScroll, reset } = useReadingProgress()

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// 路由变化时重置进度
import { watch } from 'vue'
watch(() => route.path, reset)
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 阅读进度条 */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--progress-bg);
  z-index: 9999;
}

.reading-progress-bar {
  height: 100%;
  background: var(--accent);
  transition: width 0.1s ease;
}

/* 导航栏 */
.header {
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  padding: 0 32px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.nav {
  display: flex;
  gap: 24px;
  flex: 1;
}

.nav-link {
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: color 0.2s;
  white-space: nowrap;
  padding: 4px 0;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text);
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.nav-link.active::after {
  transform: scaleX(1);
}

.theme-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  line-height: 1;
  border-radius: 6px;
  transition: background 0.2s;
}

.theme-btn:hover {
  background: var(--tag-bg);
}

/* 全局容器 */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 32px;
}

/* 主内容 */
.main {
  flex: 1;
}

/* 页脚 */
.footer {
  border-top: 1px solid var(--border);
  padding: 24px 0;
  margin-top: auto;
}

.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.footer-dot {
  color: var(--border);
}

/* 页面过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 640px) {
  .header-inner {
    gap: 16px;
    padding: 0 16px;
  }

  .nav {
    gap: 16px;
  }

  .nav-link {
    font-size: 0.85rem;
  }
}
</style>
