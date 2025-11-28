export interface Article {
  id: number
  title: string
  summary: string
  content?: string
  category: string
  tags: string[]
  date: string
  author: string
  views: number
  likes: number
  coverImage?: string
}

export interface Category {
  id: number
  name: string
  count: number
  icon?: string
}

export interface Tag {
  id: number
  name: string
  count: number
  color?: string
}

export interface Comment {
  id: number
  articleId: number
  author: string
  avatar?: string
  content: string
  date: string
  likes: number
  replies?: Comment[]
}
