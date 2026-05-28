<template>
  <div class="app">
    <!-- 阅读进度条 -->
    <div v-if="isActive" class="reading-progress">
      <div class="reading-progress-bar" :style="{ width: scrollProgress + '%' }" />
    </div>

    <!-- 导航栏 -->
    <header class="header">
      <div class="header-inner">
        <router-link to="/" class="logo" aria-label="返回首页">
          <span class="logo-mark">G</span>
          <span class="logo-text">GZC.LOG</span>
        </router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">首页</router-link>
          <router-link to="/articles" class="nav-link" active-class="active">文章</router-link>
          <router-link to="/about" class="nav-link" active-class="active">关于</router-link>
          <router-link to="/resume" class="nav-link" active-class="active">简历</router-link>
        </nav>
        <button class="theme-btn" @click="toggleTheme" :aria-label="isDark() ? '切换亮色模式' : '切换暗色模式'">
          {{ isDark() ? 'Light' : 'Dark' }}
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
        <span>© {{ new Date().getFullYear() }} GZC.LOG</span>
        <span class="footer-dot">·</span>
        <span>Frontend · AI · Engineering Notes</span>
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
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3));
  transition: width 0.1s ease;
}

/* 导航栏 */
.header {
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 78%, transparent);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  padding: 0 32px;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.logo-mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid var(--border-strong);
  background: var(--card-bg);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 800;
  box-shadow: 5px 5px 0 color-mix(in srgb, var(--accent) 18%, transparent);
}

.logo-text {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.nav {
  display: flex;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  font-size: 0.86rem;
  color: var(--text-secondary);
  transition: color 0.2s;
  white-space: nowrap;
  padding: 7px 12px;
  position: relative;
  border: 1px solid transparent;
  border-radius: 999px;
}

.nav-link::after {
  content: none;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text);
  border-color: var(--border);
  background: color-mix(in srgb, var(--card-bg) 72%, transparent);
}

.nav-link.active {
  color: var(--accent);
}

.theme-btn {
  background: var(--card-bg);
  border: 1px solid var(--border);
  cursor: pointer;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 8px 12px;
  line-height: 1;
  border-radius: 999px;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}

.theme-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
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
  padding: 26px 0;
  margin-top: auto;
  background: color-mix(in srgb, var(--bg-secondary) 52%, transparent);
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.85rem;
  flex-wrap: wrap;
  color: var(--text-tertiary);
}

.footer-dot {
  color: var(--border);
}

/* 页面过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* 响应式 */
@media (max-width: 640px) {
  .header-inner {
    gap: 10px;
    height: auto;
    min-height: 62px;
    padding: 10px 16px;
    flex-wrap: wrap;
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .nav-link {
    font-size: 0.82rem;
  }

  .logo {
    margin-right: auto;
  }
}
</style>
