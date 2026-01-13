<!-- src/App.vue 完整修正版，直接复制覆盖 -->
<template>
  <div class="redis-test">
    <h2>Vue3-Todolist 连接 Redis 测试</h2>
    <button @click="connectRedis" style="padding:8px 16px;cursor:pointer;margin:10px;">
      🚀 点击测试 Redis 连接
    </button>
    <div class="result" v-if="result">
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const result = ref(null)

const connectRedis = async () => {
  try {
    // ✅ 核心修正：读取环境变量（无空格、无引号、无后缀/）
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    // ✅ 核心修正：地址拼接  baseUrl + '/redis' （中间一个/即可）
    const requestUrl = `${baseUrl}/redis`
    console.log('👉 当前请求的真实地址：', requestUrl) // 打印地址，方便你检查
    const { data } = await axios.get(requestUrl)
    result.value = data
    console.log('✅ 连接成功，Redis返回数据：', data)
  } catch (err) {
    result.value = { msg: '❌ 请求失败', error: err.message }
    console.error('❌ 请求失败原因：', err)
  }
}
</script>

<style scoped>
.result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
pre { white-space: pre-wrap; font-size: 14px; }
</style>