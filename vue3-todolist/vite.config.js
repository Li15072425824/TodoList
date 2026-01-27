import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { HttpsProxyAgent } from 'https-proxy-agent' // 引入代理依赖

// 1. 替换成你的 Vercel 线上地址
const proxyTarget = 'https://todo-list-psi-sooty-85.vercel.app'
// 2. 替换成你的梯子本地代理地址（必改！）
const localProxy = 'http://127.0.0.1:7897'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: proxyTarget
      ? {
          '/api': {
            target: proxyTarget,
            changeOrigin: true,
            secure: true, // 访问 Vercel 的 HTTPS 必须设为 true
            // 核心：让请求走梯子代理，突破网络限制
            agent: new HttpsProxyAgent(localProxy),
            rewrite: (path) => {
              console.log(`[vite] 代理请求 Vercel：${path}`)
              return path // 不修改路径，直接转发
            },
            // 调试用：查看响应状态
            configure: (proxy, options) => {
              proxy.on('proxyRes', (proxyRes, req, res) => {
                console.log(`[vite] Vercel 响应：${req.method} ${req.url} -> ${proxyRes.statusCode}`)
              })
            }
          }
        }
      : undefined
  }
})