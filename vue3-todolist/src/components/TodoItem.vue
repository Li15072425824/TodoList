<template>
  <li class="todo-item">
    <!-- 勾选框：点击切换完成状态 -->
    <input 
      type="checkbox" 
      v-model="todo.isDone"
      @change="handleToggle"
      class="todo-checkbox"
    />
    <!-- 待办内容：完成状态自动划线变灰 -->
    <span class="todo-content" :class="{ done: todo.isDone }">{{ todo.content }}</span>
    <!-- 删除按钮：鼠标悬浮显示，点击删除 -->
    <button class="todo-delete" @click="handleDelete">×</button>
  </li>
</template>

<script setup>
import { defineProps } from 'vue'
import { useTodoStore } from '../stores/todoStore'

// 接收父组件传递的待办数据
const props = defineProps({
  todo: {
    type: Object,
    required: true,
    // 约束待办对象的结构
    shape: {
      id: Number,
      content: String,
      isDone: Boolean
    }
  }
})

// 获取Pinia仓库实例
const todoStore = useTodoStore()

// 切换完成状态
const handleToggle = () => {
  todoStore.toggleTodoDone(props.todo.id)
}

// 删除当前待办
const handleDelete = () => {
  todoStore.deleteTodo(props.todo.id)
}
</script>

<style scoped>
/* 单个待办项样式 */
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
  transition: all 0.2s;
}
.todo-item:hover {
  background-color: #fafafa;
}

/* 勾选框样式 */
.todo-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* 待办内容样式 */
.todo-content {
  flex: 1;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}
/* 完成状态的样式：划线+灰色 */
.todo-content.done {
  text-decoration: line-through;
  color: #999;
}

/* 删除按钮样式 */
.todo-delete {
  color: #ff4d4f;
  font-size: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.todo-delete:hover {
  background-color: #fff2f0;
}
</style>