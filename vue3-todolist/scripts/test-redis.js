import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// 读取 .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.error('❌ 未找到 Redis 配置，请检查 .env.local 文件')
    process.exit(1)
  }

  console.log('🔗 正在连接 Redis...')
  console.log(`📍 URL: ${url}`)
  
  const redis = new Redis({ url, token })

  try {
    // 1. 写入测试
    const key = 'test_node_key'
    const value = { msg: 'Hello from Node.js script', time: new Date().toISOString() }
    
    console.log(`📝 正在写入数据 key="${key}"...`)
    await redis.set(key, value)
    console.log('✅ 写入成功')

    // 2. 读取测试
    console.log(`📖 正在读取数据 key="${key}"...`)
    const result = await redis.get(key)
    console.log('✅ 读取结果:', result)

    // 3. 列表操作演示 (模拟 Todo)
    const listKey = 'node_todo_list'
    console.log(`📋 正在向列表 "${listKey}" 添加项...`)
    await redis.lpush(listKey, `Todo item ${Date.now()}`)
    const list = await redis.lrange(listKey, 0, 100) // 取前3条
    console.log('✅ 当前列表前3项:', list)

  } catch (error) {
    console.error('❌ 操作失败:', error)
  }
}

main()
