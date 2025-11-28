<template>
  <div class="doc-compare">
    <!-- 标题区域 -->
    <div class="header">
      <a-typography-title :level="3">文档对比</a-typography-title>
    </div>

    <div class="upload-area">
      <a-row :gutter="24">
        <!-- 左侧文档 -->
        <a-col :span="12">
          <a-card title="1.4 必要性">
            <template #extra>
              <a-upload
                accept=".docx"
                :before-upload="handleLeftUpload"
                :show-upload-list="false"
              >
                <a-button type="primary">
                  <upload-outlined /> 上传文档
                </a-button>
              </a-upload>
            </template>
            <div v-if="leftDoc" class="doc-content">
              <div class="content-preview">
                <div v-html="selectedLeftContent"></div>
              </div>
            </div>
            <a-empty v-else description="请上传文档" />
          </a-card>
        </a-col>

        <!-- 右侧文档 -->
        <a-col :span="12">
          <a-card title="1.4 必要性">
            <template #extra>
              <a-upload
                accept=".docx"
                :before-upload="handleRightUpload"
                :show-upload-list="false"
              >
                <a-button type="primary">
                  <upload-outlined /> 上传文档
                </a-button>
              </a-upload>
            </template>
            <div v-if="rightDoc" class="doc-content">
              <div class="content-preview">
                <div v-html="selectedRightContent"></div>
              </div>
            </div>
            <a-empty v-else description="请上传文档" />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 对比结果 -->
    <div class="compare-result" v-if="showDiff">
      <a-divider>对比结果</a-divider>
      <div class="diff-content">
        <pre
          v-for="(line, index) in diffResult"
          :key="index"
          :class="line.type"
        >
          {{ line.content }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue/es/upload'
import message from 'ant-design-vue/es/message'
import * as diff from 'diff'
import mammoth from 'mammoth'
import type { DocContent, TreeNode } from '@/types/doc'

type UploadFile = Parameters<Required<UploadProps>['beforeUpload']>[0]

// 文档状态
const leftDoc = ref<DocContent | null>(null)
const rightDoc = ref<DocContent | null>(null)
const selectedLeftContent = ref('')
const selectedRightContent = ref('')

// 是否显示差异
const showDiff = computed(
  () => selectedLeftContent.value && selectedRightContent.value
)

// 计算差异结果
const diffResult = computed(() => {
  if (!showDiff.value) return []

  const changes = diff.diffLines(
    selectedLeftContent.value,
    selectedRightContent.value
  )
  return changes.map((part) => ({
    content: part.value,
    type: part.added ? 'added' : part.removed ? 'removed' : 'unchanged'
  }))
})

// 提取目录
const extractTOC = async (arrayBuffer: ArrayBuffer) => {
  const result = await mammoth.convertToHtml({ arrayBuffer })
  const html = result.value

  // 简单的目录提取逻辑，可以根据实际文档结构调整
  const headings = html.match(/<h[1-6].*?>.*?<\/h[1-6]>/g) || []
  const toc = headings.map((h, index) => {
    const level = parseInt(h.match(/<h(\d)/)?.[1] || '1')
    const title = h.replace(/<[^>]+>/g, '')
    return {
      key: index.toString(),
      title,
      level,
      children: []
    }
  })

  // 构建目录树结构
  const buildTree = (items: TreeNode[], level = 1): TreeNode[] => {
    const result = []
    while (items.length) {
      if (items[0].level === level) {
        result.push(items.shift()!)
      } else if (items[0].level > level) {
        const lastItem = result[result.length - 1]
        lastItem.children = buildTree(items, level + 1)
      } else {
        break
      }
    }
    return result
  }

  return {
    toc: buildTree(toc),
    content: html
  }
}

// 处理文件上传
const handleBeforeUpload = async (
  file: UploadFile,
  side: 'left' | 'right'
) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const docContent = await extractTOC(arrayBuffer)

    if (side === 'left') {
      leftDoc.value = docContent
      selectedLeftContent.value = docContent.content
    } else {
      rightDoc.value = docContent
      selectedRightContent.value = docContent.content
    }

    message.success(`${file.name} 上传成功`)
  } catch (error) {
    message.error('文档解析失败')
    console.error(error)
  }
  return false
}

// 左侧文档上传处理
const handleLeftUpload = (file: UploadFile) => handleBeforeUpload(file, 'left')

// 右侧文档上传处理
const handleRightUpload = (file: UploadFile) => handleBeforeUpload(file, 'right')
</script>

<style scoped>
.doc-compare {
  padding: 20px 0;
}

.header {
  margin-bottom: 20px;
  padding: 0 20px;
}

.doc-content {
  max-height: 600px;
  overflow-y: auto;
}

.content-preview {
  flex: 1;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
}

/* 表格样式 */
:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

:deep(th),
:deep(td) {
  padding: 12px;
  border: 1px solid #e8e8e8;
  text-align: left;
}

:deep(th) {
  background-color: #fafafa;
  font-weight: 500;
}

:deep(tr:hover) {
  background-color: #fafafa;
}

/* 段落样式 */
:deep(p) {
  margin: 8px 0;
  line-height: 1.8;
}

/* 列表样式 */
:deep(ul),
:deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

:deep(li) {
  margin: 4px 0;
  line-height: 1.6;
}

/* 标题样式 */
:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  margin: 16px 0 8px;
  font-weight: 500;
  color: #1a1a1a;
}

:deep(h1) {
  font-size: 24px;
}
:deep(h2) {
  font-size: 20px;
}
:deep(h3) {
  font-size: 18px;
}
:deep(h4) {
  font-size: 16px;
}
:deep(h5) {
  font-size: 14px;
}
:deep(h6) {
  font-size: 14px;
}

.diff-content {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
}

pre {
  margin: 0;
  padding: 4px 8px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.added {
  background-color: #e6ffe6;
  color: #28a745;
}

.removed {
  background-color: #ffe6e6;
  color: #dc3545;
}

.unchanged {
  color: #666;
}

:deep(.ant-card-head-title) {
  font-weight: bold;
}

:deep(.ant-typography) {
  margin-bottom: 0 !important;
}
</style>
