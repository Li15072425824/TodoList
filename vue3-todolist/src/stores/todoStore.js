import { defineStore } from 'pinia'
import mockTodos from '../mocks/todos'

// 定义并导出Pinia仓库，id必须唯一
export const useTodoStore = defineStore('todo', {
  // state：存储全局状态（所有待办数据、当前筛选状态）
  state: () => ({
    // 待办列表，数组形式，每个元素是对象，包含id/内容/完成状态
    todoList: [],
    // 筛选状态：all-全部，done-已完成，undone-未完成
    filterType: 'all'
  }),

  // getters：计算属性，基于state派生新数据，自动缓存
  getters: {
    // 筛选后的待办列表，页面展示的就是这个数据
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

  // actions：处理业务逻辑，修改state，支持同步/异步
  actions: {
    // ========== 1. 初始化：Mock 与 localStorage 合并（受开关控制） ==========
    initTodoList() {
      const useMock = (import.meta.env && import.meta.env.VITE_USE_MOCK === 'true')
      const mockTodoList = useMock ? mockTodos : []
      let merged = []
      try {
        const localTodo = localStorage.getItem('todoList')
        const localArr = localTodo ? JSON.parse(localTodo) : null
        if (Array.isArray(localArr)) {
          // 使用 Map 按 id 去重合并：先写入 mock 数据，再用本地数据覆盖同 id 项
          const byId = new Map()
          // 将 mock 数据写入 Map
          for (const t of mockTodoList) byId.set(t.id, t)
          // 用本地数据覆盖，实现“本地优先”合并策略
          for (const t of localArr) byId.set(t.id, t)
          // 将合并后的值转回数组
          merged = Array.from(byId.values())
        } else {
          merged = mockTodoList
        }
      } catch {
        merged = mockTodoList
      }
      console.log('todoList:', merged)
      this.todoList = merged
      this.saveToLocal()
    },

    // ========== 2. 新增待办 ==========
    addTodo(content) {
      // 判空：内容为空时不添加
      if (!content.trim()) return
      // 构造待办对象
      const newTodo = {
        id: Date.now(), // 用时间戳做唯一ID，简单高效
        content: content.trim(),
        isDone: false // 默认未完成
      }
      // 添加到数组头部，最新的待办在最上面
      this.todoList.unshift(newTodo)
      // 同步到本地存储
      this.saveToLocal()
    },

    // ========== 3. 切换待办完成状态 ===========
    toggleTodoDone(id) {
      const todo = this.todoList.find(item => item.id === id)
      if (todo) {
        todo.isDone = !todo.isDone
        this.saveToLocal()
      }
    },

    // ========== 4. 删除单个待办 ==========
    deleteTodo(id) {
      this.todoList = this.todoList.filter(item => item.id !== id)
      this.saveToLocal()
    },

    // ========== 5. 切换筛选类型 ==========
    changeFilter(type) {
      this.filterType = type
    },

    // ========== 6. 清空所有待办 ==========
    clearAllTodo() {
      this.todoList = []
      this.saveToLocal()
    },

    // ========== 公共方法：把待办数据同步到localStorage ==========
    saveToLocal() {
      localStorage.setItem('todoList', JSON.stringify(this.todoList))
    }
  }
})
