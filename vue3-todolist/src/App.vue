<!-- src/App.vue 或者 新建组件 src/components/RedisTest.vue -->
<template>
  <div class="redis-test">
    <h2>Vue+Vite 对接 Vercel+Upstash Redis 测试</h2>
    <!-- 点击按钮触发测试 -->
    <button @click="connectRedis" style="padding:8px 16px;cursor:pointer;">
      🚀 点击测试 Redis 连接
    </button>
    <!-- 展示请求结果 -->
    <div class="result" v-if="result">
      <h3>请求结果：</h3>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios' // 引入axios

// 定义变量，存储请求结果
const result = ref(null)

// 核心：测试连接的方法
const connectRedis = async () => {
  try {
    // 读取环境变量里的Vercel接口地址
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    // 发送请求：拼接完整地址 -> baseUrl + /redis
    const { data } = await axios.get(`${baseUrl}/redis`)
    // 把结果赋值给变量，页面展示
    result.value = data
    console.log('✅ 连接成功，返回数据：', data)
  } catch (err) {
    // 捕获错误，页面展示
    result.value = { msg: '请求失败', error: err.message }
    console.error('❌ 请求失败：', err)
  }
}
</script>

<style scoped>
.redis-test { padding: 20px; }
.result { margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 6px; }
pre { white-space: pre-wrap; }
</style>