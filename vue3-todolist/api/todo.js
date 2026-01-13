// 项目根目录/api/todos.js
import { Redis } from '@upstash/redis';

// ✅ 1. 初始化Redis客户端，自动读取Vercel的环境变量
// 线上环境：直接读取Vercel配置的 UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
// 本地环境：读取项目根目录的 .env.local 文件中的对应变量
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ✅ 2. Vercel的API路由默认导出一个异步函数，处理所有请求（GET/POST/DELETE等）
export default async function handler(req, res) {
  // 设置跨域+响应格式
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // ===== 【核心操作1：添加Todo（你当前最需要的功能）】 =====
    if (req.method === 'POST') {
      const { content } = req.body; // 接收前端传的todo内容，比如：{content: "学习Redis"}
      if (!content) {
        return res.status(400).json({ ok: false, msg: 'Todo内容不能为空' });
      }
      // 生成唯一ID（时间戳+随机数，简单够用）
      const todoId = `todo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      // Redis存入数据：哈希结构（推荐，Todo有id/content/状态等属性）
      await redis.hset(todoId, {
        id: todoId,
        content: content,
        completed: false, // 是否完成
        createTime: new Date().toLocaleString(),
      });
      // 同时维护一个todo列表，存储所有todo的id，方便查询全部
      await redis.lpush('todo_list', todoId);
      return res.status(200).json({ ok: true, msg: '添加Todo成功', data: { id: todoId, content } });
    }

    // ===== 【核心操作2：查询所有Todo】 =====
    if (req.method === 'GET') {
      const todoIds = await redis.lrange('todo_list', 0, -1); // 获取所有todo的id
      const todos = await Promise.all(
        todoIds.map((id) => redis.hgetall(id)) // 批量查询每个todo的详情
      );
      return res.status(200).json({ ok: true, data: todos });
    }

    // ===== 【核心操作3：删除Todo】 =====
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ ok: false, msg: '缺少Todo ID' });
      await redis.del(id); // 删除哈希数据
      await redis.lrem('todo_list', 1, id); // 从列表中移除id
      return res.status(200).json({ ok: true, msg: '删除成功' });
    }

    // ===== 【核心操作4：修改Todo完成状态】 =====
    if (req.method === 'PUT') {
      const { id, completed } = req.body;
      if (!id) return res.status(400).json({ ok: false, msg: '缺少Todo ID' });
      await redis.hset(id, 'completed', completed);
      return res.status(200).json({ ok: true, msg: '状态更新成功' });
    }

    // 其他请求方式
    res.status(405).json({ ok: false, msg: '不支持的请求方式' });
  } catch (error) {
    console.error('Redis操作失败：', error);
    res.status(500).json({ ok: false, msg: '服务器内部错误', error: error.message });
  }
}