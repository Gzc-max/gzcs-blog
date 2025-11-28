export interface TreeNode {
  key: string
  title: string
  level: number
  children: TreeNode[]
}

export interface DocContent {
  toc: TreeNode[]
  content: string
}
