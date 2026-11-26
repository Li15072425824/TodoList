import axios from 'axios';

// 从环境变量获取基础地址
const apiBase = import.meta.env.VITE_API_BASE_URL || '';
const baseUrl = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;

/**
 * 创建 axios 实例
 * 
 * 注意：在开发环境下，为了使用 Vite 的 proxy 代理解决跨域问题，
 * 我们不设置 baseURL，让请求以 /api 开头走相对路径。
 */
const service = axios.create({
  // baseURL: baseUrl, // 关键：开发环境注释掉，改走相对路径代理
  timeout: 10000,
});

/**
 * 封装通用请求方法
 *
 * 提供统一的请求入口，处理基础配置和可能的通用逻辑。
 *
 * @param {Object} config - axios 请求配置对象，包含 url, method, data, params 等
 * @returns {Promise<any>} 返回包含响应数据的 Promise 对象
 */

const request = async (config) => {
  try {
    const response = await service(config);
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default request;
