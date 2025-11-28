import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'blog-theme'

// 全局主题状态
const theme = ref<Theme>((localStorage.getItem(THEME_KEY) as Theme) || 'light')

export function useTheme() {
  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  // 监听主题变化并持久化
  watch(theme, (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }, { immediate: true })

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: () => theme.value === 'dark'
  }
}
