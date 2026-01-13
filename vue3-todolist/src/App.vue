<!-- src/App.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 响应式数据：Todo列表、新增输入框内容
const todos = ref([])
const inputText = ref('')

// 1. 加载所有Todo：页面初始化时调用
const getTodos = async () => {
  try {
    const res = await axios.get('/api/get-data')
    if (res.data.success) {
      todos.value = res.data.data
    }
  } catch (err) {
    alert('加载Todo失败')
    console.error(err)
  }
}

// 2. 新增Todo
const addTodo = async () => {
  if (!inputText.value.trim()) return alert('请输入内容')
  try {
    await axios.post('/api/todos', { text: inputText.value })
    inputText.value = '' // 清空输入框
    getTodos() // 重新加载列表
  } catch (err) {
    alert('新增Todo失败')
    console.error(err)
  }
}

// 3. 删除指定Todo
const deleteTodo = async (id) => {
  try {
    await axios.delete('/api/todos', { data: { id } })
    getTodos() // 重新加载列表
  } catch (err) {
    alert('删除Todo失败')
    console.error(err)
  }
}

// 4. 切换Todo完成状态
const toggleComplete = (id) => {
  todos.value = todos.value.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed }
    }
    return todo
  })
}

// 页面挂载时加载数据
onMounted(() => {
  getTodos()
})
</script>

<template>
  <div class="todo-container" style="width: 500px; margin: 50px auto;">
    <h1>TodoList (Vue+Vercel+Upstash Redis)</h1>
    <!-- 新增Todo -->
    <div class="todo-add">
      <input
        v-model="inputText"
        type="text"
        placeholder="请输入待办事项..."
        style="width: 380px; padding: 8px; font-size: 16px;"
      />
      <button @click="addTodo" style="padding: 8px 16px; margin-left: 8px;">添加</button>
    </div>
    <!-- Todo列表 -->
    <div class="todo-list" style="margin-top: 20px;">
      <div 
        v-for="todo in todos" 
        :key="todo.id"
        style="padding: 8px; border: 1px solid #eee; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;"
      >
        <div>
          <input 
            type="checkbox" 
            v-model="todo.completed"
            @change="toggleComplete(todo.id)"
          />
          <span :style="{ textDecoration: todo.completed ? 'line-through' : 'none' }">
            {{ todo.text }}
          </span>
        </div>
        <button @click="deleteTodo(todo.id)" style="color: red; border: none; background: none; cursor: pointer;">删除</button>
      </div>
      <div v-if="todos.length === 0" style="text-align: center; color: #999;">暂无待办事项</div>
    </div>
  </div>
</template>