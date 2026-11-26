import { setActivePinia, createPinia } from 'pinia';
import { useTodoStore } from '../../src/stores/todoStore';
import * as api from '../../src/api/redisData';

// Mock API calls
jest.mock('../../src/api/redisData', () => ({
  fetchRedisData: jest.fn(),
  addRedisTodo: jest.fn(),
  updateRedisTodo: jest.fn(),
  deleteRedisTodo: jest.fn(),
}));

/**
 * **功能**：Todo Store 单元测试套件。
 * **参数**：无
 * **返回**：void
 */

describe('Todo Store', () => {
  /**
   * **功能**：在每个测试用例运行前初始化 Pinia 环境并清除 Mock 记录。
   * **参数**：无
   * **返回**：void
   */

  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  /**
   * **功能**：验证 Store 初始化时的默认状态。
   * **参数**：无
   * **返回**：void
   */

  it('initializes with empty todo list', () => {
    const store = useTodoStore();
    expect(store.todoList).toEqual([]);
    expect(store.filterType).toBe('all');
  });

  /**
   * **功能**：验证从 API 获取并初始化待办列表的功能。
   * **参数**：无
   * **返回**：void
   */

  it('fetches todo list from API', async () => {
    const store = useTodoStore();
    const mockData = [{ id: 1, content: 'Test Todo', isDone: false }];
    api.fetchRedisData.mockResolvedValue({ data: mockData });

    await store.initTodoList();

    expect(api.fetchRedisData).toHaveBeenCalled();
    expect(store.todoList).toEqual(mockData);
  });

  /**
   * **功能**：验证新增待办事项的功能。
   * **参数**：无
   * **返回**：void
   */

  it('adds a new todo', async () => {
    const store = useTodoStore();
    api.addRedisTodo.mockResolvedValue({ success: true });

    const content = 'New Todo';
    await store.addTodo(content);

    expect(api.addRedisTodo).toHaveBeenCalledWith(expect.objectContaining({
      content: 'New Todo',
      isDone: false
    }));
    expect(store.todoList).toHaveLength(1);
    expect(store.todoList[0].content).toBe('New Todo');
  });

  /**
   * **功能**：验证根据筛选类型过滤待办列表的功能。
   * **参数**：无
   * **返回**：void
   */

  it('filters todo list correctly', () => {
    const store = useTodoStore();
    store.todoList = [
      { id: 1, content: 'Todo 1', isDone: true },
      { id: 2, content: 'Todo 2', isDone: false },
    ];

    store.filterType = 'done';
    expect(store.filterTodoList).toHaveLength(1);
    expect(store.filterTodoList[0].id).toBe(1);

    store.filterType = 'undone';
    expect(store.filterTodoList).toHaveLength(1);
    expect(store.filterTodoList[0].id).toBe(2);

    store.filterType = 'all';
    expect(store.filterTodoList).toHaveLength(2);
  });

  /**
   * **功能**：验证切换待办事项完成状态的功能。
   * **参数**：无
   * **返回**：void
   */

  it('toggles todo status', async () => {
    const store = useTodoStore();
    const todo = { id: 1, content: 'Todo 1', isDone: false };
    store.todoList = [todo];
    api.updateRedisTodo.mockResolvedValue({ success: true });

    await store.toggleTodoDone(1);

    expect(api.updateRedisTodo).toHaveBeenCalledWith(1, true);
    expect(store.todoList[0].isDone).toBe(true);
  });
});
