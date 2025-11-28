<template>
  <div class="comment-box">
    <!-- 评论输入 -->
    <div class="comment-input">
      <a-textarea
        v-model:value="newComment"
        placeholder="写下你的评论..."
        :rows="4"
        :maxlength="500"
        show-count
      />
      <div class="input-actions">
        <a-button type="primary" @click="handleSubmit" :loading="submitting">
          发表评论
        </a-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <div class="comments-header">
        <span class="comments-count">共 {{ comments.length }} 条评论</span>
      </div>

      <div v-if="comments.length === 0" class="empty-comments">
        <a-empty description="还没有评论，快来抢沙发吧！" />
      </div>

      <div v-else class="comment-items">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <a-avatar :size="40" :src="comment.avatar">
            <template #icon><user-outlined /></template>
          </a-avatar>

          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-date">{{ formatTimeAgo(comment.date) }}</span>
            </div>

            <div class="comment-text">{{ comment.content }}</div>

            <div class="comment-actions">
              <a-button
                type="text"
                size="small"
                :icon="h(LikeOutlined)"
                @click="handleLike(comment)"
              >
                {{ comment.likes || 0 }}
              </a-button>
              <a-button
                type="text"
                size="small"
                @click="handleReply(comment)"
              >
                回复
              </a-button>
            </div>

            <!-- 回复列表 -->
            <div v-if="comment.replies && comment.replies.length" class="replies">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <a-avatar :size="32" :src="reply.avatar">
                  <template #icon><user-outlined /></template>
                </a-avatar>

                <div class="reply-content">
                  <div class="reply-header">
                    <span class="reply-author">{{ reply.author }}</span>
                    <span class="reply-date">{{ formatTimeAgo(reply.date) }}</span>
                  </div>
                  <div class="reply-text">{{ reply.content }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { UserOutlined, LikeOutlined } from '@ant-design/icons-vue'
import type { Comment } from '@/types/article'
import { timeAgo } from '@/utils/formatDate'

interface Props {
  articleId: number
}

defineProps<Props>()

const newComment = ref('')
const submitting = ref(false)

// 模拟评论数据
const comments = ref<Comment[]>([
  {
    id: 1,
    articleId: 1,
    author: '张三',
    content: '这篇文章写得很好，学到了很多东西！',
    date: '2024-03-21',
    likes: 15,
    replies: [
      {
        id: 11,
        articleId: 1,
        author: '作者',
        content: '感谢支持！',
        date: '2024-03-21',
        likes: 3
      }
    ]
  },
  {
    id: 2,
    articleId: 1,
    author: '李四',
    content: '代码示例非常实用，已收藏！',
    date: '2024-03-20',
    likes: 8
  }
])

const handleSubmit = async () => {
  if (!newComment.value.trim()) {
    return
  }

  submitting.value = true

  // 模拟提交延迟
  setTimeout(() => {
    const comment: Comment = {
      id: Date.now(),
      articleId: 1,
      author: '游客',
      content: newComment.value,
      date: new Date().toISOString(),
      likes: 0
    }

    comments.value.unshift(comment)
    newComment.value = ''
    submitting.value = false
  }, 500)
}

const handleLike = (comment: Comment) => {
  comment.likes = (comment.likes || 0) + 1
}

const handleReply = (comment: Comment) => {
  console.log('Reply to:', comment.id)
  // 实际项目中应该打开回复输入框
}

const formatTimeAgo = (date: string) => {
  return timeAgo(date)
}
</script>

<style scoped>
.comment-box {
  width: 100%;
}

.comment-input {
  margin-bottom: 32px;
}

.input-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.comments-list {
  margin-top: 24px;
}

.comments-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.comments-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.empty-comments {
  padding: 40px 0;
}

.comment-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.comment-date {
  font-size: 13px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.replies {
  margin-top: 16px;
  padding-left: 20px;
  border-left: 2px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reply-item {
  display: flex;
  gap: 12px;
}

.reply-content {
  flex: 1;
  min-width: 0;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.reply-author {
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.reply-date {
  font-size: 12px;
  color: #999;
}

.reply-text {
  font-size: 13px;
  line-height: 1.6;
  color: #666;
}

/* 暗色模式 */
[data-theme='dark'] .comments-header {
  border-bottom-color: #333;
}

[data-theme='dark'] .comments-count,
[data-theme='dark'] .comment-author,
[data-theme='dark'] .reply-author {
  color: #e0e0e0;
}

[data-theme='dark'] .comment-text {
  color: #d0d0d0;
}

[data-theme='dark'] .reply-text {
  color: #c0c0c0;
}

[data-theme='dark'] .replies {
  border-left-color: #333;
}
</style>
