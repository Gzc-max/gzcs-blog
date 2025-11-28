<template>
  <a-layout class="app-container">
    <a-layout-header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">💻</span>
          <span class="logo-text">GZC Blog</span>
        </div>
        <a-menu 
          mode="horizontal" 
          v-model:selectedKeys="selectedKeys"
          class="nav-menu"
        >
          <a-menu-item key="home">
            <router-link to="/">
              <home-outlined />
              <span>首页</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="articles">
            <router-link to="/articles">
              <read-outlined />
              <span>文章</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="gojs">
            <router-link to="/gojs">
              <apartment-outlined />
              <span>GOJS</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="demo">
            <router-link to="/demo">
              <experiment-outlined />
              <span>Demo</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="resume">
            <router-link to="/resume">
              <solution-outlined />
              <span>简历</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="interview">
            <router-link to="/interview">
              <question-outlined />
              <span>面试题</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="about">
            <router-link to="/about">
              <user-outlined />
              <span>关于</span>
            </router-link>
          </a-menu-item>
        </a-menu>

        <!-- 主题切换按钮 -->
        <div class="theme-toggle" @click="toggleTheme">
          <a-tooltip :title="isDark() ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
            <component :is="isDark() ? BulbFilled : BulbOutlined" class="theme-icon" />
          </a-tooltip>
        </div>
      </div>
    </a-layout-header>

    <a-layout-content class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </a-layout-content>

    <a-layout-footer class="footer">
      <div class="footer-content">
        <p class="copyright">© 2024 GZC 个人博客. All rights reserved.</p>
        <p class="footer-links">
          <router-link to="/about">关于</router-link>
          <span class="divider">·</span>
          <a href="mailto:your.email@example.com">联系</a>
          <span class="divider">·</span>
          <a href="https://github.com" target="_blank">GitHub</a>
        </p>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  HomeOutlined,
  ReadOutlined,
  ApartmentOutlined,
  ExperimentOutlined,
  SolutionOutlined,
  QuestionOutlined,
  UserOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons-vue'
import { useTheme } from '@/composables/useTheme'

// 当前选中的菜单项
const selectedKeys = ref<string[]>(['home'])

// 主题管理
const { toggleTheme, isDark } = useTheme()
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  transition: background 0.3s ease;
}

/* 暗色模式 */
[data-theme='dark'] .app-container {
  background: #141414;
}

[data-theme='dark'] .header {
  background: #1f1f1f;
  border-bottom: 1px solid #333;
}

[data-theme='dark'] :deep(.ant-menu-item a) {
  color: #e0e0e0;
}

[data-theme='dark'] .footer {
  background: #1f1f1f;
  border-top-color: #333;
}

[data-theme='dark'] .copyright,
[data-theme='dark'] .footer-links,
[data-theme='dark'] .footer-links a {
  color: #999;
}

[data-theme='dark'] .footer-links a:hover {
  color: #667eea;
}

/* Header 样式 */
.header {
  background: #ffffff;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.logo-icon {
  font-size: 28px;
  line-height: 1;
}

.logo-text {
  font-size: 1.5em;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 导航菜单样式 */
:deep(.nav-menu) {
  flex: 1;
  justify-content: flex-end;
  line-height: 64px;
  background: transparent;
  border-bottom: none;
}

:deep(.ant-menu-item) {
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

/* 隐藏 Ant Design 默认的选中下划线 */
:deep(.ant-menu-item::after) {
  display: none !important;
}

:deep(.ant-menu-item a) {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.ant-menu-item:hover) {
  background: rgba(102, 126, 234, 0.05);
  border-bottom-color: #667eea;
}

:deep(.ant-menu-item:hover a) {
  color: #667eea;
}

:deep(.ant-menu-item-selected) {
  background: rgba(102, 126, 234, 0.08) !important;
  border-bottom-color: #667eea !important;
}

:deep(.ant-menu-item-selected a) {
  color: #667eea !important;
}

:deep(.anticon) {
  font-size: 16px;
}

/* 主题切换按钮 */
.theme-toggle {
  margin-left: 16px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: rgba(102, 126, 234, 0.1);
}

.theme-icon {
  font-size: 20px;
  color: #667eea;
  transition: all 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(20deg);
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 20px;
  background: transparent;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* 页面过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Footer 样式 */
.footer {
  background: #ffffff;
  padding: 32px 20px;
  border-top: 1px solid #e8e8e8;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.copyright {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 0.9em;
}

.footer-links {
  margin: 0;
  color: #999;
  font-size: 0.9em;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #667eea;
}

.divider {
  margin: 0 12px;
  color: #ddd;
}

/* 响应式设计 */
@media screen and (max-width: 992px) {
  .header-content {
    padding: 0 16px;
  }

  :deep(.nav-menu .ant-menu-item span) {
    display: none;
  }

  :deep(.nav-menu .ant-menu-item) {
    padding: 0 12px;
  }

  .logo-text {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .footer {
    padding: 24px 16px;
  }

  .footer-links {
    font-size: 0.85em;
  }

  .divider {
    margin: 0 8px;
  }
}
</style>
