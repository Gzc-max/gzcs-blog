import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'blog-theme'
const theme = ref<Theme>((localStorage.getItem(THEME_KEY) as Theme) || 'light')

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (val) => {
    localStorage.setItem(THEME_KEY, val)
    document.documentElement.setAttribute('data-theme', val)
  }, { immediate: true })

  return { theme, toggleTheme, isDark: () => theme.value === 'dark' }
}
