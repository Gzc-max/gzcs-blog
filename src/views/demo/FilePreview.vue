<template>
  <div class="file-preview">
    <!-- URL输入区域 -->
    <div class="url-input-section">
      <a-card title="在线文件预览">
        <a-input-group compact>
          <a-input
            v-model:value="fileUrl"
            placeholder="请输入文件URL地址（支持PDF、图片等格式）"
            style="width: calc(100% - 100px)"
            @press-enter="handleUrlPreview"
          />
          <a-button type="primary" @click="handleUrlPreview" :loading="urlLoading">
            <link-outlined /> 预览
          </a-button>
        </a-input-group>
        <div class="url-examples">
          <a-typography-text type="secondary">
            示例：https://example.com/document.pdf
          </a-typography-text>
        </div>
      </a-card>
    </div>

    <a-divider>或</a-divider>

    <div class="upload-section">
      <a-upload-dragger
        :before-upload="handleBeforeUpload"
        :show-upload-list="false"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.bmp"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p class="ant-upload-hint">
          支持 PDF、Word、Excel、图片等格式，支持大文件分片上传
        </p>
      </a-upload-dragger>
    </div>

    <!-- 文件信息 -->
    <div v-if="currentFile" class="file-info">
      <a-card>
        <template #title>
          <file-outlined />
          {{ currentFile.name }}
        </template>
        <template #extra>
          <a-space>
            <a-tag>{{ formatFileSize(currentFile.size) }}</a-tag>
            <a-tag :color="getFileTypeColor(currentFile.type)">
              {{ getFileTypeName(currentFile.type) }}
            </a-tag>
          </a-space>
        </template>
        
        <!-- 上传进度 -->
        <a-progress 
          v-if="uploadProgress > 0 && uploadProgress < 100"
          :percent="uploadProgress" 
          status="active"
        />
      </a-card>
    </div>

    <!-- 预览区域 -->
    <div v-if="previewUrl && uploadProgress === 100" class="preview-section">
      <a-card>
        <template #title>
          <file-outlined />
          {{ currentFile?.name || '文件预览' }}
        </template>
        <template #extra>
          <a-space>
            <a-button @click="downloadFile" :disabled="!currentFile">
              <download-outlined /> 下载
            </a-button>
            <a-button @click="clearPreview">
              <close-outlined /> 清除
            </a-button>
          </a-space>
        </template>

        <!-- 图片预览 -->
        <div v-if="isImage" class="image-preview">
          <img :src="previewUrl" :alt="currentFile?.name" />
        </div>

        <!-- PDF预览 -->
        <div v-else-if="isPdf" class="pdf-preview">
          <div class="pdf-header">
            <div class="pdf-title-bar">
              <file-pdf-outlined class="pdf-icon" />
              <span class="pdf-title">{{ currentFile?.name }}</span>
              <a-tag color="red">PDF</a-tag>
            </div>
          </div>
          <div class="pdf-iframe-container">
            <iframe 
              :src="previewUrl + '#toolbar=0&navpanes=0&scrollbar=0'" 
              width="100%" 
              height="520px"
              frameborder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>

        <!-- Office文档预览 -->
        <div v-else-if="isOfficeDoc" class="office-preview">
          <iframe 
            :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`"
            width="100%" 
            height="600px"
            frameborder="0"
          ></iframe>
        </div>

        <!-- 其他文件类型 -->
        <div v-else class="unsupported-preview">
          <a-result
            status="info"
            title="暂不支持此文件类型的预览"
            sub-title="您可以下载文件查看内容"
          >
            <template #extra>
              <a-button type="primary" @click="downloadFile">
                <download-outlined /> 下载文件
              </a-button>
            </template>
          </a-result>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  InboxOutlined, 
  FileOutlined, 
  DownloadOutlined, 
  CloseOutlined,
  FilePdfOutlined,
  LinkOutlined
} from '@ant-design/icons-vue'
import message from 'ant-design-vue/es/message'

interface FileChunk {
  chunk: Blob
  index: number
  hash: string
}

const currentFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const uploadProgress = ref<number>(0)
const chunks = ref<FileChunk[]>([])
const fileUrl = ref<string>('')
const urlLoading = ref<boolean>(false)
const isFromUrl = ref<boolean>(false)

// 根据URL或文件类型判断文件类型
const getFileTypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase() || ''
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  const officeExts = ['doc', 'docx', 'xls', 'xlsx']
  
  if (imageExts.includes(extension)) return 'image'
  if (extension === 'pdf') return 'pdf'
  if (officeExts.includes(extension)) return 'office'
  return 'other'
}

// 文件类型判断
const isImage = computed(() => {
  if (isFromUrl.value && previewUrl.value) {
    return getFileTypeFromUrl(previewUrl.value) === 'image'
  }
  return currentFile.value?.type.startsWith('image/') || false
})

const isPdf = computed(() => {
  if (isFromUrl.value && previewUrl.value) {
    return getFileTypeFromUrl(previewUrl.value) === 'pdf'
  }
  return currentFile.value?.type === 'application/pdf' || false
})

const isOfficeDoc = computed(() => {
  if (isFromUrl.value && previewUrl.value) {
    return getFileTypeFromUrl(previewUrl.value) === 'office'
  }
  const officeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.ms-excel'
  ]
  return officeTypes.includes(currentFile.value?.type || '') || false
})

// 文件大小格式化
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取文件类型颜色
const getFileTypeColor = (type: string): string => {
  if (type.startsWith('image/')) return 'green'
  if (type === 'application/pdf') return 'red'
  if (type.includes('word')) return 'blue'
  if (type.includes('excel') || type.includes('sheet')) return 'orange'
  return 'default'
}

// 获取文件类型名称
const getFileTypeName = (type: string): string => {
  if (type.startsWith('image/')) return '图片'
  if (type === 'application/pdf') return 'PDF'
  if (type.includes('word')) return 'Word'
  if (type.includes('excel') || type.includes('sheet')) return 'Excel'
  return '其他'
}

// 计算文件哈希
const calculateHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 创建文件分片
const createFileChunks = async (file: File, chunkSize: number = 2 * 1024 * 1024): Promise<FileChunk[]> => {
  const chunks: FileChunk[] = []
  let index = 0
  
  for (let start = 0; start < file.size; start += chunkSize) {
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    const hash = await calculateHash(new File([chunk], `chunk-${index}`))
    
    chunks.push({
      chunk,
      index,
      hash
    })
    index++
  }
  
  return chunks
}

// 模拟分片上传
const uploadChunks = async (fileChunks: FileChunk[]): Promise<string> => {
  const totalChunks = fileChunks.length
  let uploadedChunks = 0
  
  for (const chunk of fileChunks) {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 100))
    
    uploadedChunks++
    uploadProgress.value = Math.round((uploadedChunks / totalChunks) * 100)
  }
  
  // 模拟合并文件并返回URL
  return URL.createObjectURL(currentFile.value!)
}

// 处理URL预览
const handleUrlPreview = async () => {
  if (!fileUrl.value.trim()) {
    message.warning('请输入文件URL地址')
    return
  }

  // 简单的URL验证
  try {
    new URL(fileUrl.value)
  } catch {
    message.error('请输入有效的URL地址')
    return
  }

  urlLoading.value = true
  
  try {
    // 检查URL是否可访问
    const response = await fetch(fileUrl.value, { method: 'HEAD' })
    if (!response.ok) {
      throw new Error('文件无法访问')
    }

    // 创建虚拟文件对象用于显示信息
    const fileName = fileUrl.value.split('/').pop() || 'unknown'
    const fileType = getFileTypeFromUrl(fileUrl.value)
    
    currentFile.value = {
      name: fileName,
      size: parseInt(response.headers.get('content-length') || '0'),
      type: getContentTypeFromExtension(fileName)
    } as File

    previewUrl.value = fileUrl.value
    uploadProgress.value = 100
    isFromUrl.value = true
    
    message.success('URL预览加载成功')
    
  } catch (error) {
    message.error('无法加载该URL，请检查地址是否正确')
    console.error('URL preview error:', error)
  } finally {
    urlLoading.value = false
  }
}

// 根据文件扩展名获取Content-Type
const getContentTypeFromExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  const typeMap: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
  return typeMap[extension] || 'application/octet-stream'
}

// 处理文件上传
const handleBeforeUpload = async (file: File) => {
  try {
    currentFile.value = file
    uploadProgress.value = 0
    previewUrl.value = ''
    isFromUrl.value = false
    
    message.loading('正在处理文件...', 0)
    
    // 大文件使用分片上传
    if (file.size > 10 * 1024 * 1024) { // 10MB以上
      chunks.value = await createFileChunks(file)
      previewUrl.value = await uploadChunks(chunks.value)
    } else {
      // 小文件直接上传
      uploadProgress.value = 50
      await new Promise(resolve => setTimeout(resolve, 500))
      previewUrl.value = URL.createObjectURL(file)
      uploadProgress.value = 100
    }
    
    message.destroy()
    message.success('文件上传成功')
    
  } catch (error) {
    message.destroy()
    message.error('文件上传失败')
    console.error('Upload error:', error)
  }
  
  return false
}

// 下载文件
const downloadFile = () => {
  if (!currentFile.value || !previewUrl.value) return
  
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = currentFile.value.name
  
  // 如果是从URL预览的文件，需要处理跨域问题
  if (isFromUrl.value) {
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  }
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 清除预览
const clearPreview = () => {
  if (previewUrl.value && !isFromUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  currentFile.value = null
  previewUrl.value = ''
  uploadProgress.value = 0
  chunks.value = []
  fileUrl.value = ''
  isFromUrl.value = false
}
</script>

<style scoped>
.file-preview {
  padding: 20px 0;
}

.url-input-section {
  margin-bottom: 24px;
}

.url-examples {
  margin-top: 8px;
  text-align: center;
}

.upload-section {
  margin-bottom: 24px;
}

.file-info {
  margin-bottom: 24px;
}

.preview-section {
  margin-top: 24px;
}

.image-preview {
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pdf-preview,
.office-preview {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pdf-header {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  padding: 16px 20px;
  border-bottom: 2px solid #ff4d4f;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.2);
}

.pdf-title-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pdf-icon {
  font-size: 20px;
  color: white;
}

.pdf-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pdf-iframe-container {
  position: relative;
  background: #f5f5f5;
}

.unsupported-preview {
  text-align: center;
  padding: 40px 20px;
}

:deep(.ant-upload-drag) {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s;
}

:deep(.ant-upload-drag:hover) {
  border-color: #1890ff;
  background: #f0f8ff;
}

:deep(.ant-upload-drag-icon) {
  font-size: 48px;
  color: #1890ff;
}

:deep(.ant-progress) {
  margin-top: 16px;
}
</style>
