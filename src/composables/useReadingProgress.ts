import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export function useReadingProgress() {
  const scrollProgress = ref(0)
  const route = useRoute()

  const isActive = computed(() => route.name === 'ArticleDetail')

  function onScroll() {
    if (!isActive.value) return
    const el = document.documentElement
    const scrollTop = el.scrollTop || document.body.scrollTop
    const scrollHeight = el.scrollHeight - el.clientHeight
    scrollProgress.value = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0
  }

  function reset() {
    scrollProgress.value = 0
  }

  return { scrollProgress, isActive, onScroll, reset }
}
