import { createApp } from 'vue'
// 引入Pinia状态管理核心方法
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// 创建Vue实例 + 创建Pinia实例
const app = createApp(App)
const pinia = createPinia()

// 挂载Pinia到Vue
app.use(pinia)
// 挂载Vue到页面
app.mount('#app')