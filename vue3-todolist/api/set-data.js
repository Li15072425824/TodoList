// 引入 Upstash Redis SDK
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端实例（自动读取 Vercel 环境变量）
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Vercel 的无服务函数入口，默认导出 async 函数即可
export default async function handler(req, res) {
  try {
    // ✅ 核心：Redis 存数据操作 (SET 命令)
    // 格式：redis.set(键名, 键值, { 可选配置 })
    // EX:60 表示：这条数据60秒后自动过期，可删除这个配置（永久存储）
    const result = await redis.set('test_key', 'hello_upstash_vercel', { ex: 3600 });

    // 返回成功响应，浏览器能直接看到结果
    res.status(200).json({
      success: true,
      message: '✅ 数据存入 Redis 成功！',
      redis_set_result: result, // 返回 Redis 的执行结果（成功时为 OK）
      data: { key: 'test_key', value: 'hello_upstash_vercel' }
    });
  } catch (error) {
    // 捕获错误，返回失败响应
    res.status(500).json({
      success: false,
      message: '❌ 数据存入失败',
      error: error.message
    });
  }
}