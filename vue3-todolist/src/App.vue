<template>
  <div class="todo-container">
    <!-- 标题 -->
    <h1 class="todo-title">✅ 我的待办清单</h1>

    <!-- 新增待办输入框 -->
    <div class="todo-add">
      <input
        type="text"
        v-model="inputVal"
        placeholder="请输入待办内容，回车添加..."
        @keyup.enter="handleAddTodo"
        class="todo-input"
      />
      <button @click="handleAddTodo" class="add-btn">添加</button>
    </div>

    <!-- 筛选标签 -->
    <div class="todo-filter">
      <button 
        v-for="item in filterList" 
        :key="item.type"
        @click="todoStore.changeFilter(item.type)"
        :class="{ active: todoStore.filterType === item.type }"
        class="filter-btn"
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
      />
    </ul>

    <!-- 空数据提示 -->
    <div class="empty-tip" v-if="todoStore.filterTodoList.length === 0">
      📌 暂无待办任务，添加一个新任务吧～
    </div>

    <!-- 清空全部按钮 -->
    <div class="todo-footer" v-if="todoStore.todoList.length > 0">
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
import { ref } from 'vue'
import { useTodoStore } from './stores/todoStore'
import TodoItem from './components/TodoItem.vue'

// 获取仓库实例
const todoStore = useTodoStore()
// 输入框绑定的值
const inputVal = ref('')
// 筛选标签数据源
const filterList = ref([
  { type: 'all', name: '全部' },
  { type: 'undone', name: '未完成' },
  { type: 'done', name: '已完成' }
])

// 初始化：页面加载时从本地存储读取数据
todoStore.initTodoList()

// 新增待办的方法
const handleAddTodo = () => {
  todoStore.addTodo(inputVal.value)
  inputVal.value = '' // 新增后清空输入框
}

// 清空全部待办，带二次确认
const handleClearAll = () => {
  if (confirm('确定要清空所有待办吗？此操作不可恢复！')) {
    todoStore.clearAllTodo()
  }
}
</script>

<style scoped>
.todo-title {
  text-align: center;
  color: #165DFF;
  margin-bottom: 24px;
  font-size: 24px;
}

/* 新增待办样式 */
.todo-add {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.todo-input {
  flex: 1;
  height: 40px;
}
.add-btn {
  background-color: #165DFF;
  color: #fff;
  padding: 0 16px;
  border-radius: 4px;
}
.add-btn:hover {
  background-color: #0E42D2;
}

/* 筛选标签样式 */
.todo-filter {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}
.filter-btn {
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #e5e5e5;
}
.filter-btn.active {
  background-color: #165DFF;
  color: #fff;
  border-color: #165DFF;
}

/* 待办列表样式 */
.todo-list {
  margin-bottom: 20px;
}

/* 空数据提示 */
.empty-tip {
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 40px 0;
}

/* 底部清空按钮 */
.todo-footer {
  text-align: center;
}
.clear-btn {
  color: #ff4d4f;
  padding: 6px 16px;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
}
.clear-btn:hover {
  background-color: #fff2f0;
}
</style>