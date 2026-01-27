import axios from 'axios';

/**
 * 获取 Redis 中的待办数据
 *
 * 调用后端 /api/get-data 接口，获取存储在 Redis 中的数据。
 *
 * @returns {Promise<Object>} 返回包含数据的 Promise 对象
 */

export const fetchRedisData = async () => {
  try {
    // 优先使用环境变量中的完整地址，若未配置则使用相对路径走代理
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    // 注意：如果 VITE_API_BASE_URL 包含路径（如 https://.../api），这里需要适配
    // 但通常 VITE_API_BASE_URL 只是域名+端口。
    // 这里简单处理：如果 apiBase 不为空，就拼接 /api/get-data；否则直接用 /api/get-data
    // 如果 apiBase 是 https://.../api/get-data 这种全路径，用户配置时需注意。
    // 根据 .env.development，VITE_API_BASE_URL=https://todo-list-psi-sooty-85.vercel.app
    // 所以我们需要拼接 /api/get-data
    
    // 处理末尾斜杠
    const baseUrl = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    const url = baseUrl ? `${baseUrl}/api/get-data` : '/api/get-data';

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Redis data:', error);
    throw error;
  }
};
