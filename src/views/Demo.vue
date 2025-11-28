<template>
  <div class="demo">
    <a-typography-title>Demo 展示</a-typography-title>

    <a-row :gutter="24">
      <!-- 左侧导航 -->
      <a-col :span="6">
        <div class="nav-wrapper">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            style="height: 100%"
          >
            <a-menu-item key="docCompare">
              <template #icon><file-sync-outlined /></template>
              文档对比
            </a-menu-item>
            <a-menu-item key="filePreview">
              <template #icon><file-search-outlined /></template>
              文件预览
            </a-menu-item>
            <a-menu-item key="css">
              <template #icon><bg-colors-outlined /></template>
              CSS 特效
            </a-menu-item>
            <a-menu-item key="animation">
              <template #icon><thunderbolt-outlined /></template>
              动画效果
            </a-menu-item>
            <a-menu-item key="components">
              <template #icon><appstore-outlined /></template>
              组件示例
            </a-menu-item>
            <a-menu-item key="utils">
              <template #icon><tool-outlined /></template>
              工具函数
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>

      <!-- 右侧内容区 -->
      <a-col :span="18">
        <div class="content-area">
          <a-typography-title :level="2">{{ currentTitle }}</a-typography-title>
          <div class="demo-container">
            <doc-compare v-if="selectedKeys[0] === 'docCompare'" />
            <file-preview v-else-if="selectedKeys[0] === 'filePreview'" />
            <css-demo v-else-if="selectedKeys[0] === 'css'" />
            <!-- 其他 demo 内容 -->
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  BgColorsOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  ToolOutlined,
  FileSyncOutlined,
  FileSearchOutlined,
} from "@ant-design/icons-vue";
import DocCompare from "./demo/DocCompare.vue";
import FilePreview from "./demo/FilePreview.vue";

// 当前选中的菜单项
const selectedKeys = ref<string[]>(["docCompare"]);
const currentTitle = ref("文档对比");

// 监听菜单选择变化，更新标题
watch(selectedKeys, (newVal) => {
  const titles: { [key: string]: string } = {
    docCompare: "文档对比",
    filePreview: "文件预览",
    css: "CSS 特效",
    animation: "动画效果",
    components: "组件示例",
    utils: "工具函数",
  };
  currentTitle.value = titles[newVal[0]] || "";
});
</script>

<style scoped>
.demo {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.nav-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.content-area {
  background: white;
  padding: 24px;
  min-height: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.demo-container {
  margin-top: 24px;
}

@media screen and (max-width: 768px) {
  .demo {
    padding: 10px;
  }

  :deep(.ant-col-6) {
    width: 100%;
    margin-bottom: 20px;
  }

  :deep(.ant-col-18) {
    width: 100%;
  }
}
</style>
