<template>
  <div class="todo-container">
    <!-- 标题 -->
    <h1 class="todo-title">✅ 我的待办清单</h1>

    <!-- 新增待办输入框 -->
    <div class="todo-add">
      <input
        v-model="inputVal"
        type="text"
        placeholder="请输入待办内容，回车添加..."
        class="todo-input"
        @keyup.enter="handleAddTodo"
      />
      <button class="add-btn" @click="handleAddTodo">添加</button>
    </div>

    <!-- 筛选标签 -->
    <div class="todo-filter">
      <button 
        v-for="item in filterList" 
        :key="item.type"
        :class="{ active: todoStore.filterType === item.type }"
        class="filter-btn"
        @click="todoStore.changeFilter(item.type)"
      >
        {{ item.name }}
      </button>
    </div>

    <!-- 待办列表 -->
    <ul class="todo-list">
      <TodoItem 
        v-for="todo in todoStore.filterTodoList" 
        :key="todo.id"
        :todo="todo"
        @toggle="todoStore.toggleTodoDone"
        @delete="todoStore.deleteTodo"
      />
    </ul>

    <!-- 空数据提示 -->
    <div v-if="todoStore.filterTodoList.length === 0" class="empty-tip">
      📌 暂无待办任务，添加一个新任务吧～
    </div>

    <!-- 清空全部按钮 -->
    <div v-if="todoStore.todoList.length > 0" class="todo-footer">
      <button 
        class="clear-btn"
        @click="handleClearAll"
      >
        清空全部待办
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * 应用主组件
 * 负责整体布局、输入交互以及与 Store 的协作
 */

import { ref, onMounted } from 'vue'
import { useTodoStore } from './stores/todoStore'
import TodoItem from './components/TodoItem.vue'

// 获取仓库实例
const todoStore = useTodoStore()

// 输入框绑定的值
const inputVal = ref('')

// 筛选标签数据源
const filterList = [
  { type: 'all', name: '全部' },
  { type: 'undone', name: '未完成' },
  { type: 'done', name: '已完成' }
]

// 初始化：页面挂载时从接口获取数据
onMounted(() => {
  todoStore.initTodoList()
})

/**
 * 新增待办的方法
 */
const handleAddTodo = () => {
  const content = inputVal.value.trim()
  if (!content) return
  
  todoStore.addTodo(content)
  inputVal.value = '' // 新增后清空输入框
}

/**
 * 清空全部待办，带二次确认
 */
const handleClearAll = () => {
  if (confirm('确定要清空所有待办吗？此操作不可恢复！')) {
    todoStore.clearAllTodo()
  }
}
</script>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.todo-title {
  text-align: center;
  color: #165dff;
  margin-bottom: 24px;
  font-size: 24px;
}

/* 新增待办样式 */
.todo-add {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.todo-input:focus {
  border-color: #165dff;
}

.add-btn {
  width: 80px;
  height: 40px;
  background-color: #165dff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-btn:hover {
  opacity: 0.8;
}

/* 筛选样式 */
.todo-filter {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
}

.filter-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
}

.filter-btn.active {
  background-color: #e8f3ff;
  color: #165dff;
  font-weight: bold;
}

/* 列表样式 */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 底部样式 */
.todo-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.clear-btn {
  background: none;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background-color: #ff4d4f;
  color: #fff;
}
</style>
