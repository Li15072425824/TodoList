import { Redis } from '@upstash/redis';

const redisUrl = 'https://flowing-flea-26381.upstash.io';
const redisToken = 'AWcNAAIncDExOWQwYzc0NmE4MDg0NDdkYmFhM2VkNmVjOTA2Y2IyZXAxMjYzODE';

const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

export const TODO_HASH_KEY = 'todo:data';

/**
 * **功能**：校验 Redis 是否可用并返回客户端实例。
 * **参数**：
 * - `res` {Object} 响应对象，用于返回错误信息。
 * **返回**：{Redis|null} Redis 客户端或 null。
 */

export function ensureRedis(res) {
  if (!redis) {
    sendError(res, 'Redis 未配置');
    return null;
  }
  return redis;
}

/**
 * **功能**：安全解析 JSON 字符串，失败时原样返回。
 * **参数**：
 * - `value` {unknown} 待解析值。
 * **返回**：{unknown} 解析结果或原值。
 */

export function parseJsonSafe(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

/**
 * **功能**：规范化待办 ID，统一转换为字符串。
 * **参数**：
 * - `id` {number|string} 待办 ID。
 * **返回**：{string} 规范化后的 ID。
 */

export function normalizeTodoId(id) {
  return String(id);
}

/**
 * **功能**：将 Redis Hash 数据转换为待办列表。
 * **参数**：
 * - `hashData` {Object|null} Redis Hash 返回值。
 * **返回**：{Array} 待办数组。
 */

export function mapHashToList(hashData) {
  if (!hashData) return [];
  return Object.values(hashData).map(parseJsonSafe);
}

/**
 * **功能**：发送成功响应。
 * **参数**：
 * - `res` {Object} 响应对象。
 * - `message` {string} 成功消息。
 * - `data` {any} 返回的数据。
 * **返回**：{void}
 */

export function sendSuccess(res, message, data = null) {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  res.status(200).json(response);
}

/**
 * **功能**：发送错误响应。
 * **参数**：
 * - `res` {Object} 响应对象。
 * - `message` {string} 错误消息。
 * - `error` {any} 详细错误信息。
 * - `status` {number} HTTP 状态码，默认为 500。
 * **返回**：{void}
 */

export function sendError(res, message, error = null, status = 500) {
  const response = { success: false, message };
  if (error !== null) response.error = error;
  res.status(status).json(response);
}

export default redis;
