import { defineStore } from 'pinia'
import { fetchRedisData } from '../api/redisData'

/**
 * 待办事项状态管理仓库
 * 负责维护全局待办列表、筛选状态以及相关的增删改查逻辑
 */
export const useTodoStore = defineStore('todo', {
  /**
   * 状态定义
   */
  state: () => ({
    // 待办列表：{ id: number, content: string, isDone: boolean }[]
    todoList: [],
    // 筛选类型：'all' | 'done' | 'undone'
    filterType: 'all'
  }),

  /**
   * 计算属性
   */
  getters: {
    /**
     * 根据当前筛选类型返回过滤后的列表
     * @returns {Array} 过滤后的待办数组
     */
    filterTodoList() {
      switch (this.filterType) {
        case 'done':
          return this.todoList.filter(item => item.isDone)
        case 'undone':
          return this.todoList.filter(item => !item.isDone)
        default:
          return this.todoList
      }
    }
  },

  /**
   * 业务逻辑
   */
  actions: {
    /**
     * 初始化：从远端接口获取待办数据
     */
    async initTodoList() {
      try {
        const data = await fetchRedisData()
        // 兼容不同的后端返回结构
        const serverList =
          (data && Array.isArray(data.redis_get_result) && data.redis_get_result) ||
          (data && data.data && Array.isArray(data.data.value) && data.data.value) ||
          []
        this.todoList = serverList
      } catch (e) {
        console.error('初始化待办失败:', e)
        this.todoList = []
      }
    },

    /**
     * 新增待办
     * @param {string} content - 待办内容
     */
    addTodo(content) {    
      if (!content.trim()) return
      
      const newTodo = {
        id: Date.now(),
        content: content.trim(),
        isDone: false
      }
      this.todoList.unshift(newTodo)
    },

    /**
     * 切换待办完成状态
     * @param {number} id - 待办项ID
     */
    toggleTodoDone(id) {
      const todo = this.todoList.find(item => item.id === id)
      if (todo) {
        todo.isDone = !todo.isDone
      }
    },

    /**
     * 删除单个待办
     * @param {number} id - 待办项ID
     */
    deleteTodo(id) {
      this.todoList = this.todoList.filter(item => item.id !== id)
    },

    /**
     * 切换筛选类型
     * @param {string} type - 筛选类型 ('all' | 'done' | 'undone')
     */
    changeFilter(type) {
      this.filterType = type
    },

    /**
     * 清空所有待办
     */
    clearAllTodo() {
      this.todoList = []
    }
  }
})
