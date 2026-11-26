import http from 'http';
import { URL } from 'url';
import getDataHandler from './get-data.js';
import addTodoHandler from './add-todo.js';
import updateTodoHandler from './update-todo.js';
import deleteTodoHandler from './delete-todo.js';

/**
 * **功能**：解析请求体，返回 JSON 对象。
 * **参数**：
 * - `req` {http.IncomingMessage} 原生请求对象。
 * **返回**：{Promise<Object>} 解析后的对象。
 */
async function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const content = body.trim();
        resolve(content ? JSON.parse(content) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

/**
 * **功能**：创建响应适配器，统一 JSON 响应与 CORS 处理。
 * **参数**：
 * - `res` {http.ServerResponse} 原生响应对象。
 * **返回**：{Object} 适配器对象。
 */
function createResAdapter(res) {
  let statusCode = 200;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      const finalStatus = statusCode;
      res.statusCode = finalStatus;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.end(JSON.stringify(body));
    },
    setHeader(name, value) {
      res.setHeader(name, value);
    },
  };
}

/**
 * **功能**：HTTP 服务器请求处理回调，负责路由分发与错误处理。
 * **参数**：
 * - `req` {http.IncomingMessage} 原生请求对象。
 * - `res` {http.ServerResponse} 原生响应对象。
 * **返回**：{void} 无返回值。
 */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method || 'GET';
  const adapter = createResAdapter(res);

  // 处理 CORS 预检请求
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  // 解析请求体 (针对非 GET 请求)
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    req.body = await getRequestBody(req);
  }

  try {
    // 路由分发
    if (url.pathname === '/api/get-data' && method === 'GET') {
      await getDataHandler(req, adapter);
    } else if (url.pathname === '/api/add-todo' && method === 'POST') {
      await addTodoHandler(req, adapter);
    } else if (url.pathname === '/api/update-todo' && method === 'PUT') {
      await updateTodoHandler(req, adapter);
    } else if (url.pathname === '/api/delete-todo' && method === 'DELETE') {
      await deleteTodoHandler(req, adapter);
    } else {
      adapter.status(404).json({ success: false, message: 'Not Found' });
    }
  } catch (e) {
    console.error('Server error:', e);
    adapter.status(500).json({ success: false, message: 'Server error', error: String(e) });
  }
});

const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3000;
server.listen(port, () => {
  console.log(`Local API server listening at http://localhost:${port}`);
});
