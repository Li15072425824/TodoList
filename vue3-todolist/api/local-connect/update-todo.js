import { ensureRedis, normalizeTodoId, parseJsonSafe, TODO_HASH_KEY, sendSuccess, sendError } from './redis.js';

/**
 * **功能**：更新待办事项状态并写入 Redis Hash。
 * **参数**：
 * - `req` {Object} 请求对象，body 需包含 id 和 isDone。
 * - `res` {Object} 响应对象。
 * **返回**：{Promise<void>} 无显式返回值。
 */

export default async function handler(req, res) {
  try {
    const redis = ensureRedis(res);
    if (!redis) return;

    const { id, isDone } = req.body;
    const todoId = normalizeTodoId(id);
    const rawData = await redis.hget(TODO_HASH_KEY, todoId);
    
    if (!rawData) {
      return sendError(res, '任务不存在', null, 404);
    }

    const currentTodo = parseJsonSafe(rawData);
    
    const updatedTodo = { ...currentTodo, isDone };

    await redis.hset(TODO_HASH_KEY, {
      [todoId]: JSON.stringify(updatedTodo)
    });

    sendSuccess(res, '✅ 更新成功', updatedTodo);
  } catch (error) {
    sendError(res, '❌ 更新失败', error.message);
  }
}
