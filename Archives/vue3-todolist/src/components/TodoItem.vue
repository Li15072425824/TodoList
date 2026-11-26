<template>
  <li class="todo-item">
    <!-- 勾选框：点击切换完成状态 -->
    <input 
      type="checkbox" 
      :checked="todo.isDone"
      class="todo-checkbox"
      @change="$emit('toggle', todo.id)"
    />
    <!-- 待办内容：完成状态自动划线变灰 -->
    <span class="todo-content" :class="{ done: todo.isDone }">{{ todo.content }}</span>
    <!-- 删除按钮：鼠标悬浮显示，点击删除 -->
    <button class="todo-delete" @click="$emit('delete', todo.id)">×</button>
  </li>
</template>

<script setup>
/**
 * 待办项组件
 * 负责展示单个待办任务，并将交互事件向上抛出
 */

defineProps({
  /**
   * 待办对象数据
   * @type {Object}
   * @property {number} id - 任务ID
   * @property {string} content - 任务内容
   * @property {boolean} isDone - 是否完成
   */
  todo: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'delete'])
</script>

<style scoped>
/* 单个待办项样式 */
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
  transition: all 0.2s;
}
.todo-item:hover {
  background-color: #fafafa;
}

/* 勾选框样式 */
.todo-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* 待办内容样式 */
.todo-content {
  flex: 1;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}
/* 完成状态的样式：划线+灰色 */
.todo-content.done {
  text-decoration: line-through;
  color: #999;
}

/* 删除按钮样式 */
.todo-delete {
  color: #ff4d4f;
  font-size: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
}
.todo-delete:hover {
  background-color: #fff2f0;
}
</style>
