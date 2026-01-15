import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE_URL || '/api'
  let proxyTarget = ''
  if (apiBase.startsWith('http')) {
    try {
      const u = new URL(apiBase)
      u.pathname = '/'
      proxyTarget = u.toString().replace(/\/$/, '')
    } catch {}
  } else if (env.VITE_DEV_API_TARGET) {
    proxyTarget = env.VITE_DEV_API_TARGET
  }
  return {
    plugins: [vue()],
    server: {
      proxy: proxyTarget
        ? {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false
            }
          }
        : undefined
    }
  }
})
