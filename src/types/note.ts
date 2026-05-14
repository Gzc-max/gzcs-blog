// 笔记接口定义
export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  pinned: boolean
}

// 笔记分类接口
export interface NoteCategory {
  id: string
  name: string
  color: string
  count: number
}
