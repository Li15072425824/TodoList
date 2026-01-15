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
    const response = await axios.get('/api/get-data');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Redis data:', error);
    throw error;
  }
};
