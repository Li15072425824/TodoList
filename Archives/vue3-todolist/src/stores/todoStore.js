import { defineStore } from 'pinia'
import { fetchRedisData, addRedisTodo, updateRedisTodo, deleteRedisTodo } from '../api/redisData'

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
        const res = await fetchRedisData()
        // 兼容不同的后端返回结构
        const serverList = res.data || []
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
    async addTodo(content) {    
      if (!content.trim()) return
      
      const newTodo = {
        id: Date.now(),
        content: content.trim(),
        isDone: false
      }

      try {
        await addRedisTodo(newTodo)
        // 接口成功后更新本地状态
        this.todoList.unshift(newTodo)
      } catch (e) {
        console.error('新增待办失败:', e)
      }
    },

    /**
     * 切换待办完成状态
     * @param {number} id - 待办项ID
     */
    async toggleTodoDone(id) {
      const todo = this.todoList.find(item => item.id === id)
      if (todo) {
        const newStatus = !todo.isDone
        try {
          await updateRedisTodo(id, newStatus)
          // 接口成功后更新本地状态
          todo.isDone = newStatus
        } catch (e) {
          console.error('更新待办状态失败:', e)
        }
      }
    },

    /**
     * 删除单个待办
     * @param {number} id - 待办项ID
     */
    async deleteTodo(id) {
      try {
        await deleteRedisTodo(id)
        // 接口成功后更新本地状态
        this.todoList = this.todoList.filter(item => item.id !== id)
      } catch (e) {
        console.error('删除待办失败:', e)
      }
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
     * 注：此处仅清空本地，若需持久化清空可扩展接口
     */
    clearAllTodo() {
      this.todoList = []
    }
  }
})
