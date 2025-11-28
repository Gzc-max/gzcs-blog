<template>
  <div class="gojs">
    <a-typography-title>GOJS 学习笔记</a-typography-title>

    <a-row :gutter="24">
      <!-- 左侧导航 -->
      <a-col :span="6">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          style="height: 100%"
        >
          <a-sub-menu key="basic" :title="'基础概念'">
            <a-menu-item key="diagram">Diagram 类</a-menu-item>
            <a-menu-item key="node">Node 类</a-menu-item>
            <a-menu-item key="link">Link 类</a-menu-item>
            <a-menu-item key="group">Group 类</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="layout" :title="'布局相关'">
            <a-menu-item key="treeLayout">树形布局</a-menu-item>
            <a-menu-item key="forceLayout">力导向布局</a-menu-item>
            <a-menu-item key="layeredLayout">分层布局</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="interaction" :title="'交互功能'">
            <a-menu-item key="tools">工具使用</a-menu-item>
            <a-menu-item key="events">事件处理</a-menu-item>
            <a-menu-item key="commands">命令系统</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-col>

      <!-- 右侧内容区 -->
      <a-col :span="18">
        <div class="content-area">
          <div class="diagram-container" ref="diagramDiv"></div>
          <div class="description">
            <a-typography-title :level="3">{{
              currentTitle
            }}</a-typography-title>
            <a-typography-paragraph>
              {{ currentDescription }}
            </a-typography-paragraph>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as go from 'gojs'

// DOM 引用
const diagramDiv = ref<HTMLElement | null>(null)

// 菜单状态
const selectedKeys = ref<string[]>(['diagram'])
const openKeys = ref<string[]>(['basic'])

// 当前内容
const currentTitle = ref('Diagram 类')
const currentDescription = ref(
  'Diagram 是 GoJS 中最基础的类，用于创建和管理图表。'
)

// GoJS 实例
let myDiagram: go.Diagram | null = null

// 初始化图表
const initDiagram = () => {
  if (!diagramDiv.value) return

  // 创建画布
  myDiagram = new go.Diagram(diagramDiv.value, {
    'undoManager.isEnabled': true,
    'clickCreatingTool.archetypeNodeData': {
      text: 'new node',
      color: 'lightblue'
    },
    model: new go.GraphLinksModel(
      [
        { key: 1, text: 'Alpha', color: 'lightblue' },
        { key: 2, text: 'Beta', color: 'orange' },
        { key: 3, text: 'Gamma', color: 'lightgreen' }
      ],
      [
        { from: 1, to: 2 },
        { from: 2, to: 3 }
      ]
    )
  })

  // 定义节点模板
  myDiagram.nodeTemplate = new go.Node('Auto')
    .add(
      new go.Shape('RoundedRectangle', {
        strokeWidth: 0,
        fill: 'white'
      })
    )
    .add(
      new go.TextBlock({
        margin: 8,
        font: 'bold 14px sans-serif'
      }).bind('text')
    )
}

// 监听菜单选择变化
watch(selectedKeys, (newVal) => {
  const titles: { [key: string]: string } = {
    diagram: 'Diagram 类',
    node: 'Node 类',
    link: 'Link 类',
    group: 'Group 类'
    // ... 其他标题
  }
  currentTitle.value = titles[newVal[0]] || ''
})

// 组件挂载时初始化
onMounted(() => {
  initDiagram()
})
</script>

<style scoped>
.gojs {
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
}

.content-area {
  background: #fff;
  padding: 24px;
  min-height: 600px;
  border-radius: 2px;
  box-sizing: border-box;
}

.diagram-container {
  width: 100%;
  height: 400px;
  border: 1px solid #d9d9d9;
  margin-bottom: 20px;
}

.description {
  margin-top: 20px;
}

:deep(.ant-menu-inline) {
  border-right: none;
}

@media screen and (max-width: 768px) {
  .gojs {
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
