import { mount } from '@vue/test-utils';
import TodoItem from '../../src/components/TodoItem.vue';

/**
 * **功能**：TodoItem 组件单元测试套件。
 * **参数**：无
 * **返回**：void
 */

describe('TodoItem.vue', () => {
  /**
   * **功能**：验证组件能否正确渲染待办事项内容。
   * **参数**：无
   * **返回**：void
   */

  it('renders todo content', () => {
    const todo = { id: 1, content: 'Test Todo', isDone: false };
    const wrapper = mount(TodoItem, {
      props: { todo }
    });
    expect(wrapper.find('.todo-content').text()).toBe('Test Todo');
  });

  /**
   * **功能**：验证当待办事项完成时，是否正确应用 "done" 样式类。
   * **参数**：无
   * **返回**：void
   */

  it('applies "done" class when todo.isDone is true', () => {
    const todo = { id: 1, content: 'Test Todo', isDone: true };
    const wrapper = mount(TodoItem, {
      props: { todo }
    });
    expect(wrapper.find('.todo-content').classes()).toContain('done');
  });

  /**
   * **功能**：验证点击勾选框时，是否正确触发 "toggle" 事件并传递 ID。
   * **参数**：无
   * **返回**：void
   */

  it('emits "toggle" event when checkbox is changed', async () => {
    const todo = { id: 2, content: 'Test Todo', isDone: false };
    const wrapper = mount(TodoItem, {
      props: { todo }
    });
    
    await wrapper.find('.todo-checkbox').trigger('change');
    
    // 验证是否触发了 toggle 事件
    expect(wrapper.emitted().toggle).toBeTruthy();
    // 验证 toggle 事件携带的参数是否为待办事项 ID
    expect(wrapper.emitted().toggle[0]).toEqual([2]);
  });

  /**
   * **功能**：验证点击删除按钮时，是否正确触发 "delete" 事件并传递 ID。
   * **参数**：无
   * **返回**：void
   */

  it('emits "delete" event when delete button is clicked', async () => {
    const todo = { id: 1, content: 'Test Todo', isDone: false };
    const wrapper = mount(TodoItem, {
      props: { todo }
    });
    
    await wrapper.find('.todo-delete').trigger('click');
    
    expect(wrapper.emitted().delete).toBeTruthy();
    expect(wrapper.emitted().delete[0]).toEqual([1]);
  });
});
