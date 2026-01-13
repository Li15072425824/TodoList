// 引入 Upstash Redis SDK
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端实例（仅在配置存在时初始化）
const redisUrl = 'https://flowing-flea-26381.upstash.io';
const redisToken = 'AWcNAAIncDExOWQwYzc0NmE4MDg0NDdkYmFhM2VkNmVjOTA2Y2IyZXAxMjYzODE';

const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

export default async function handler(req, res) {
  try {
    if (!redis) {
      res.status(500).json({
        success: false,
        message:
          'Redis 未正确配置，请在部署环境中设置 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN',
      });
      return;
    }

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
