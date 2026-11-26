import { ensureRedis, normalizeTodoId, TODO_HASH_KEY, sendSuccess, sendError } from './local-connect/redis.js';

/**
 * **功能**：新增待办事项并写入 Redis Hash。
 * **参数**：
 * - `req` {Object} 请求对象，body 包含 todo 数据。
 * - `res` {Object} 响应对象。
 * **返回**：{Promise<void>} 无显式返回值。
 */

export default async function handler(req, res) {
  try {
    const redis = ensureRedis(res);
    if (!redis) return;

    const { todo } = req.body;
    if (!todo || !todo.id || !todo.content) {
      return sendError(res, '无效的任务数据', null, 400);
    }

    const todoId = normalizeTodoId(todo.id);
    await redis.hset(TODO_HASH_KEY, {
      [todoId]: JSON.stringify(todo)
    });

    sendSuccess(res, '✅ 添加成功', todo);
  } catch (error) {
    sendError(res, '❌ 添加失败', error.message);
  }
}
