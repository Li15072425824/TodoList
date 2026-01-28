import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { HttpsProxyAgent } from 'https-proxy-agent'

// ================= 配置区域 =================

// 模式切换开关：true = 连线上 Vercel 后端；false = 连本地 Node 后端
const USE_ONLINE_BACKEND = process.env.VITE_USE_ONLINE_BACKEND === 'true'

// 配置参数
const CONFIG = {
  online: {
    target: 'https://todo-list-psi-sooty-85.vercel.app',
    localProxy: 'http://127.0.0.1:7897' // 你的本地梯子地址
  },
  local: {
    target: 'http://localhost:3000'
  }
}

// ===========================================

// 根据开关获取当前目标配置
const targetConfig = USE_ONLINE_BACKEND ? CONFIG.online : CONFIG.local

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: targetConfig.target,
        changeOrigin: true,
        secure: USE_ONLINE_BACKEND, // 线上 HTTPS 需要 secure=true
        // 仅在线上模式且配置了代理地址时启用 Agent
        agent: (USE_ONLINE_BACKEND && targetConfig.localProxy) 
          ? new HttpsProxyAgent(targetConfig.localProxy) 
          : undefined,
        rewrite: (path) => {
          const targetName = USE_ONLINE_BACKEND ? '线上 Vercel' : '本地 Node'
          console.log(`[vite] 代理请求 ${targetName}：${path}`)
          return path
        },
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const targetName = USE_ONLINE_BACKEND ? '线上 Vercel' : '本地 Node'
            console.log(`[vite] ${targetName} 响应：${req.method} ${req.url} -> ${proxyRes.statusCode}`)
          })
        }
      }
    }
  }
})
