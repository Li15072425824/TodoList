// test-redis.js 完整代码，直接复制
import Redis from 'ioredis'; // 如果你用的是ioredis (推荐)
// 如果用的是官方 redis 包，就换成下面这行：
// import { createClient } from 'redis'

// 填入你的 Upstash Redis_URL
const REDIS_URL="rediss://default:AWcNAAIncDExOWQwYzc0NmE4MDg0NDdkYmFhM2VkNmVjOTA2Y2IyZXAxMjYzODE@flowing-flea-26381.upstash.io:6379"
// 1. ioredis 版本（推荐）
const redis = new Redis(REDIS_URL, {
  tls: { rejectUnauthorized: false } // 核心：开启TLS加密
});
async function testRedis() {
  try {
    // 测试写入
    await redis.set('local_test', '我是本地连接Upstash Redis写入的数据', 'EX', 3600);
    // 测试读取
    const value = await redis.get('local_test');
    console.log('✅ Redis连接成功！读取到的数据：', value);
  } catch (error) {
    console.error('❌ Redis连接失败：', error.message);
  } finally {
    await redis.quit(); // 关闭连接
  }
}

// 2. 如果是官方 redis v4+ 版本，用这段代码
// const redisClient = createClient({ url: redisUrl })
// async function testRedis() {
//   try {
//     await redisClient.connect()
//     await redisClient.set('local_test', '本地连接成功')
//     const value = await redisClient.get('local_test')
//     console.log('✅ 连接成功：', value)
//   } catch (err) {
//     console.error('❌ 连接失败：', err)
//   } finally {
//     await redisClient.disconnect()
//   }
// }

// 执行测试
testRedis();