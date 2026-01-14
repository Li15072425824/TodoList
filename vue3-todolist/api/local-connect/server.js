import http from 'http';
import { URL } from 'url';
import handler from './get-data.js';

/**
 * 创建响应对象适配器
 *
 * 将 Node.js 原生 http.ServerResponse 封装为类似 Express/Vercel 的接口，
 * 以便复用 Serverless Function 的 handler 逻辑。
 *
 * @param {http.ServerResponse} res - Node.js 原生响应对象
 * @returns {Object} 包含 status(code), json(body), setHeader(name, value) 方法的适配器对象
 */

function createResAdapter(res) {
  let statusCode = 200;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(body));
    },
    setHeader(name, value) {
      res.setHeader(name, value);
    },
  };
}

/**
 * HTTP 服务器请求处理回调
 *
 * 处理所有进入服务器的 HTTP 请求，包括 CORS 预检、路由分发和错误处理。
 * 目前仅支持 GET /api/get-data 路由。
 *
 * @param {http.IncomingMessage} req - Node.js 原生请求对象
 * @param {http.ServerResponse} res - Node.js 原生响应对象
 * @returns {void} 无返回值
 */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (url.pathname === '/api/get-data' && req.method === 'GET') {
    try {
      await handler(req, createResAdapter(res));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, message: 'Server error', error: String(e) }));
    }
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: false, message: 'Not Found' }));
});

const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3000;
server.listen(port, () => {
  console.log(`Local API server listening at http://localhost:${port}`);
});
