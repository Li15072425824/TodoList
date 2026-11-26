import request from './request';

/**
 * 获取 Redis 中的待办数据
 * @returns {Promise<Object>} 包含 data 数组的响应对象
 */
export const fetchRedisData = async () => {
  return request({
    url: '/api/get-data',
    method: 'get'
  });
};

/**
 * 向 Redis 添加一条待办数据
 * @param {Object} todo - 待办事项对象 { id, content, isDone }
 * @returns {Promise<Object>}
 */
export const addRedisTodo = async (todo) => {
  return request({
    url: '/api/add-todo',
    method: 'post',
    data: { todo }
  });
};

/**
 * 更新 Redis 中的待办数据状态
 * @param {number} id - 任务 ID
 * @param {boolean} isDone - 新的完成状态
 * @returns {Promise<Object>}
 */
export const updateRedisTodo = async (id, isDone) => {
  return request({
    url: '/api/update-todo',
    method: 'put',
    data: { id, isDone }
  });
};

/**
 * 从 Redis 删除一条待办数据
 * @param {number} id - 任务 ID
 * @returns {Promise<Object>}
 */
export const deleteRedisTodo = async (id) => {
  return request({
    url: '/api/delete-todo',
    method: 'delete',
    data: { id }
  });
};
