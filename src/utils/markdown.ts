import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.min.css'

export interface TocItem {
  id: string
  text: string
  depth: number
}

export interface RenderedMarkdown {
  html: string
  toc: TocItem[]
}

// 只注册常用语言，大幅减小打包体积
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)

marked.setOptions({ breaks: true, gfm: true })

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim()
}

function slugify(value: string): string {
  return stripHtml(value)
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function highlightCode(code: string, lang?: string): string {
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang }).value
  }
  return hljs.highlightAuto(code).value
}

function createRenderer(toc?: TocItem[]): InstanceType<typeof marked.Renderer> {
  const slugCounts = new Map<string, number>()
  const renderer = new marked.Renderer()

  renderer.code = function ({ text, lang }) {
    const language = lang?.trim()
    const highlighted = language || text.trim()
      ? highlightCode(text, language)
      : escapeHtml(text)
    const className = language ? ` class="language-${escapeHtml(language)}"` : ''
    return `<pre><code${className}>${highlighted}</code></pre>`
  }

  renderer.heading = function ({ text, depth }) {
    const title = stripHtml(text)
    const baseSlug = slugify(title) || `heading-${toc ? toc.length + 1 : 1}`
    const count = slugCounts.get(baseSlug) || 0
    slugCounts.set(baseSlug, count + 1)
    const id = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`

    if (toc && depth >= 2 && depth <= 3) {
      toc.push({ id, text: title, depth })
    }

    return `<h${depth} id="${id}">${marked.parseInline(text)}</h${depth}>`
  }

  return renderer
}

export function renderMarkdown(content: string): string {
  return marked(content, { renderer: createRenderer() }) as string
}

export function renderMarkdownWithToc(content: string): RenderedMarkdown {
  const toc: TocItem[] = []

  return {
    html: marked(content, { renderer: createRenderer(toc) }) as string,
    toc
  }
}
