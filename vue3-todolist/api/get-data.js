import { ensureRedis, mapHashToList, TODO_HASH_KEY, sendSuccess, sendError } from './local-connect/redis.js';

/**
 * **功能**：获取待办列表，从 Redis Hash 读取所有数据。
 * **参数**：
 * - `req` {Object} 请求对象。
 * - `res` {Object} 响应对象。
 * **返回**：{Promise<void>} 无显式返回值。
 */

export default async function handler(req, res) {
  try {
    const redis = ensureRedis(res);
    if (!redis) return;

    const hashData = await redis.hgetall(TODO_HASH_KEY);
    const todoList = mapHashToList(hashData).sort((a, b) => b.id - a.id);

    sendSuccess(res, '✅ 获取待办列表成功', todoList);
  } catch (error) {
    sendError(res, '❌ 获取数据失败', error.message);
  }
}
