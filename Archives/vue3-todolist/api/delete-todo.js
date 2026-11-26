import { ensureRedis, normalizeTodoId, TODO_HASH_KEY, sendSuccess, sendError } from './local-connect/redis.js';

/**
 * **功能**：删除待办事项并移除 Redis Hash 字段。
 * **参数**：
 * - `req` {Object} 请求对象，body 需包含 id。
 * - `res` {Object} 响应对象。
 * **返回**：{Promise<void>} 无显式返回值。
 */

export default async function handler(req, res) {
  try {
    const redis = ensureRedis(res);
    if (!redis) return;

    const { id } = req.body;
    const todoId = normalizeTodoId(id);
    const deletedCount = await redis.hdel(TODO_HASH_KEY, todoId);
    if (!deletedCount) {
      return sendError(res, '任务不存在', null, 404);
    }

    sendSuccess(res, '✅ 删除成功');
  } catch (error) {
    sendError(res, '❌ 删除失败', error.message);
  }
}
