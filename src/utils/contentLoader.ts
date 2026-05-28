import { parseFrontmatter } from './frontmatter'
import { renderMarkdownWithToc, type TocItem } from './markdown'

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  summary: string
  readingMinutes: number
  wordCount: number
}

export interface Article extends ArticleMeta {
  contentHtml: string
  toc: TocItem[]
}

// Vite: glob import all markdown as raw text
const articlesRaw: Record<string, string> = import.meta.glob('@/content/articles/*.md', { query: '?raw', import: 'default', eager: true })

function getContentStats(content: string) {
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_[\]()~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0
  const latinWords = text.match(/[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*/g)?.length || 0
  const wordCount = chineseChars + latinWords

  return {
    wordCount,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 450))
  }
}

function parseArticle(slug: string, raw: string): Article {
  const { data, content } = parseFrontmatter(raw)
  const rendered = renderMarkdownWithToc(content)
  const stats = getContentStats(content)
  return {
    slug,
    title: String(data.title || slug),
    date: String(data.date || ''),
    category: String(data.category || '未分类'),
    tags: Array.isArray(data.tags) ? data.tags as string[] : [],
    summary: String(data.summary || ''),
    ...stats,
    contentHtml: rendered.html,
    toc: rendered.toc
  }
}

/** Load all articles metadata (sorted by date desc) */
export function loadArticlesMeta(): ArticleMeta[] {
  return Object.entries(articlesRaw).map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace('.md', '')
    const { data, content } = parseFrontmatter(raw)
    const stats = getContentStats(content)
    return {
      slug,
      title: String(data.title || slug),
      date: String(data.date || ''),
      category: String(data.category || '未分类'),
      tags: Array.isArray(data.tags) ? data.tags as string[] : [],
      summary: String(data.summary || ''),
      ...stats
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
