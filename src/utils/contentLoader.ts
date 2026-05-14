import { parseFrontmatter, type Frontmatter } from './frontmatter'
import { renderMarkdown } from './markdown'

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  summary: string
}

export interface Article extends ArticleMeta {
  contentHtml: string
}

// Vite: glob import all markdown as raw text
const articlesRaw: Record<string, string> = import.meta.glob('@/content/articles/*.md', { query: '?raw', import: 'default', eager: true })

function parseArticle(slug: string, raw: string): Article {
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    title: String(data.title || slug),
    date: String(data.date || ''),
    category: String(data.category || '未分类'),
    tags: Array.isArray(data.tags) ? data.tags as string[] : [],
    summary: String(data.summary || ''),
    contentHtml: renderMarkdown(content)
  }
}

/** Load all articles metadata (sorted by date desc) */
export function loadArticlesMeta(): ArticleMeta[] {
  return Object.entries(articlesRaw).map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace('.md', '')
    const { data } = parseFrontmatter(raw)
    return {
      slug,
      title: String(data.title || slug),
      date: String(data.date || ''),
      category: String(data.category || '未分类'),
      tags: Array.isArray(data.tags) ? data.tags as string[] : [],
      summary: String(data.summary || '')
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
}

/** Load a single article with rendered HTML content */
export function loadArticle(slug: string): Article | undefined {
  const entry = Object.entries(articlesRaw).find(([path]) => path.includes(`${slug}.md`))
  if (!entry) return undefined
  return parseArticle(slug, entry[1])
}

/** Get all unique categories */
export function getCategories(): string[] {
  const articles = loadArticlesMeta()
  return [...new Set(articles.map(a => a.category))].sort()
}

/** Get all tags with counts */
export function getAllTags(): { name: string; count: number }[] {
  const articles = loadArticlesMeta()
  const tagMap = new Map<string, number>()
  articles.forEach(a => {
    a.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  return [...tagMap.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}
