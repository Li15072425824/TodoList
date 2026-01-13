// api/todos.js - Vercel Serverless 后端接口，对接 Upstash Redis
const UPSTASH_URL = "https://flowing-flea-26381.upstash.io"
const UPSTASH_TOKEN = "AWcNAAIncDExOWQwYzc0NmE4MDg0NDdkYmFhM2VkNmVjOTA2Y2IyZXAxMjYzODE"


// 封装：调用 Upstash Redis REST API 的通用方法
async function upstashRequest(command, args = []) {
  const response = await fetch(`${UPSTASH_URL}/${command}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  const data = await response.json();
  return data.result; // Upstash 返回的核心数据在 result 字段里
}

// 主接口处理函数（Vercel 规定必须导出 default 的 async 函数）
export default async function handler(req, res) {
  const { method } = req;

  // 设置跨域（本地开发+线上部署都不会有跨域问题）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 处理 OPTIONS 预检请求
  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // ========== 1. GET 请求：查询所有 Todo 列表 ==========
    if (method === "GET") {
      // Redis 命令：LRANGE todos 0 -1 读取 todos 列表的所有元素
      const todos = await upstashRequest("LRANGE", ["todos", 0, -1]);
      // 把 Redis 里的字符串转成 JSON 对象
      const todoList = todos.map(item => JSON.parse(item));
      return res.status(200).json({ success: true, data: todoList });
    }

    // ========== 2. POST 请求：新增 Todo 事项 ==========
    if (method === "POST") {
      const { text } = req.body;
      if (!text) return res.status(400).json({ success: false, msg: "内容不能为空" });
      
      // 构造 Todo 对象：id=时间戳，text=内容，completed=是否完成
      const newTodo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false
      };
      // Redis 命令：RPUSH todos xxx 往 todos 列表尾部追加一条数据
      await upstashRequest("RPUSH", ["todos", JSON.stringify(newTodo)]);
      return res.status(201).json({ success: true, data: newTodo });
    }

    // ========== 3. DELETE 请求：删除指定 Todo ==========
    if (method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ success: false, msg: "ID不能为空" });
      
      // 先查所有Todo，过滤掉要删除的，再重新写入
      const todos = await upstashRequest("LRANGE", ["todos", 0, -1]);
      const newTodos = todos
        .map(item => JSON.parse(item))
        .filter(todo => todo.id !== id);
      // Redis 命令：DEL todos 删除原列表，再重新写入
      await upstashRequest("DEL", ["todos"]);
      if (newTodos.length) {
        await upstashRequest("RPUSH", ["todos", ...newTodos.map(t => JSON.stringify(t))]);
      }
      return res.status(200).json({ success: true, msg: "删除成功" });
    }

    // 其他请求方法
    res.status(405).json({ success: false, msg: "不支持的请求方法" });
  } catch (error) {
    console.error("Redis操作失败：", error);
    res.status(500).json({ success: false, msg: "服务器内部错误" });
  }
}