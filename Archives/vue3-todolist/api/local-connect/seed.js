import redis, { normalizeTodoId, TODO_HASH_KEY } from './redis.js';

/**
 * **功能**：初始化 Redis Hash 数据，写入 10 条待办事项。
 * **参数**：无。
 * **返回**：{Promise<void>} 无显式返回值。
 */

async function seed() {
  try {
    if (!redis) {
      console.error('❌ Redis 未配置');
      return;
    }

    console.log('开始清空旧数据...');
    await redis.del(TODO_HASH_KEY);

    const initialTodos = [
      { id: 1, content: '学习 Vue 3 组合式 API', isDone: true },
      { id: 2, content: '掌握 Pinia 状态管理', isDone: true },
      { id: 3, content: '配置 ESLint 和 Prettier', isDone: true },
      { id: 4, content: '实现本地 API 服务器', isDone: false },
      { id: 5, content: '连接 Redis 数据库', isDone: false },
      { id: 6, content: '完成待办事项增删改查', isDone: false },
      { id: 7, content: '学习 Vite 代理配置', isDone: false },
      { id: 8, content: '优化前端代码规范', isDone: false },
      { id: 9, content: '部署应用到 Vercel', isDone: false },
      { id: 10, content: '编写自动化测试用例', isDone: false },
    ];

    console.log('正在写入 10 条初始数据...');
    
    const todoMap = {};
    for (const todo of initialTodos) {
      todoMap[normalizeTodoId(todo.id)] = JSON.stringify(todo);
    }
    await redis.hset(TODO_HASH_KEY, todoMap);

    console.log('✅ 数据初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

seed();
