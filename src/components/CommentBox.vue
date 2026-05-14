<template>
  <section class="comment-box">
    <h3 class="section-title">评论 ({{ comments.length }})</h3>

    <!-- 评论输入 -->
    <form class="comment-form" @submit.prevent="submitComment">
      <div class="form-row">
        <input
          v-model="form.author"
          type="text"
          placeholder="昵称"
          class="form-input"
          required
          maxlength="30"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="邮箱（不会公开）"
          class="form-input"
          required
        />
      </div>
      <textarea
        v-model="form.content"
        placeholder="写下你的想法..."
        class="form-textarea"
        rows="3"
        required
        maxlength="1000"
      />
      <div class="form-footer">
        <span class="char-count">{{ form.content.length }}/1000</span>
        <button type="submit" class="submit-btn" :disabled="!form.content.trim()">
          发表评论
        </button>
      </div>
    </form>

    <!-- 评论列表 -->
    <div v-if="comments.length === 0" class="empty-comments">
      还没有评论，来抢沙发吧
    </div>
    <div v-else class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.author }}</span>
          <time class="comment-date">{{ timeAgo(comment.createdAt) }}</time>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Comment {
  id: string
  author: string
  email: string
  content: string
  createdAt: string
}

const props = defineProps<{ articleSlug: string }>()

const comments = ref<Comment[]>([])
const form = ref({ author: '', email: '', content: '' })

const STORAGE_KEY = `blog_comments_${props.articleSlug}`

function loadComments() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    comments.value = stored ? JSON.parse(stored) : []
  } catch {
    comments.value = []
  }
}

function saveComments() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments.value))
}

function submitComment() {
  if (!form.value.content.trim()) return

  const comment: Comment = {
    id: Date.now().toString(),
    author: form.value.author.trim(),
    email: form.value.email.trim(),
    content: form.value.content.trim(),
    createdAt: new Date().toISOString()
  }

  comments.value.push(comment)
  saveComments()
  form.value.content = ''
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

onMounted(loadComments)
</script>

<style scoped>
.comment-box {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.comment-form {
  margin-bottom: 32px;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--accent);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-tertiary);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  margin-bottom: 8px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.submit-btn {
  padding: 8px 20px;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-comments {
  text-align: center;
  padding: 40px 0;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  font-size: 0.9rem;
}

.comment-date {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.comment-content {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }
}
</style>
