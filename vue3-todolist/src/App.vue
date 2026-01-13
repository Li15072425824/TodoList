<template>
  <div class="redis-test">
    <h2>Vue3-Todolist 连接 Redis 测试</h2>
    <button @click="addTodo" style="padding:8px 16px;cursor:pointer;margin:10px;">
      🚀 点击测试：向 Redis 写入一条 Todo
    </button>
    <button @click="getTodos" style="padding:8px 16px;cursor:pointer;margin:10px;">
      📥 查询 Redis 中的 Todo 列表
    </button>
    <div class="result" v-if="result">
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const result = ref(null)
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

// 页面加载查询
onMounted(() => getTodos())

// 添加Todo
const addTodo = async () => {
  const res = await fetch(`${baseURL}/todos`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
     },
    body: JSON.stringify({ content: '来自 Vue3 测试按钮的 Todo', isDone: false })
  })
  const data = await res.json()
  result.value = data
  await getTodos()
}

// 查询Todo
const getTodos = async () => {
  const res = await fetch(`${baseURL}/todos`)
  const data = await res.json()
  result.value = data
}

// 修改状态/删除同理，和上面原生JS一致
</script>

<style scoped>
.result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
pre { white-space: pre-wrap; font-size: 14px; }
</style>
