interface SeoOptions {
  title: string
  description?: string
  type?: 'website' | 'article'
  url?: string
}

const SITE_NAME = '高子晨的网络日志'
const DEFAULT_DESCRIPTION = '高子晨的个人博客，记录前端开发、AI 全栈探索、工程实践和职业思考。'

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attribute, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function setSeo(options: SeoOptions) {
  const description = options.description || DEFAULT_DESCRIPTION
  const title = options.title === SITE_NAME ? SITE_NAME : `${options.title} | ${SITE_NAME}`
  const url = options.url || window.location.href
  const type = options.type || 'website'

  document.title = title
  setMeta('description', description)
  setMeta('og:site_name', SITE_NAME, 'property')
  setMeta('og:title', title, 'property')
  setMeta('og:description', description, 'property')
  setMeta('og:type', type, 'property')
  setMeta('og:url', url, 'property')
  setMeta('twitter:card', 'summary')
  setMeta('twitter:title', title)
  setMeta('twitter:description', description)
  setLink('canonical', url)
}
