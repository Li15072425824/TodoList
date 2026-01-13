// 引入 Upstash Redis SDK
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端实例
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
try {
// ✅ 核心：Redis 取数据操作 (GET 命令)
// 格式：redis.get(键名)
const value = await redis.get('test_node_key');

// 返回读取结果
res.status(200).json({
    success: true,
    message: '✅ 从 Redis 读取数据成功！',
    redis_get_result: value, // 读取到的真实数据，无数据时为 null
    data: { key: 'test_key', value: value }
});
} catch (error) {
res.status(501).json({
    success: false,
    message: '❌ 数据读取失败',
    error: error.message
});
}
export default async function handler(req, res) {
  try {
    // ✅ 核心：Redis 取数据操作 (GET 命令)
    // 格式：redis.get(键名)
    const value = await redis.get('test_node_key');

    // 返回读取结果
    res.status(200).json({
      success: true,
      message: '✅ 从 Redis 读取数据成功！',
      redis_get_result: value, // 读取到的真实数据，无数据时为 null
      data: { key: 'test_key', value: value }
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: '❌ 数据读取失败',
      error: error.message
    });
  }
}