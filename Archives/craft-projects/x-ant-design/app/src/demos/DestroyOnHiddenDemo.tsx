import { useState } from 'react';
import { ThoughtChain } from '@ant-design/x';
import { Switch } from 'antd';
import type { ThoughtChainItemType } from '@ant-design/x';
import { CreateTaskContent, CheckTaskContent } from './taskData';

function ThinkingProcess() {
  return (
    <div style={{ color: 'rgba(0,0,0,0.88)', fontSize: 14, lineHeight: 1.5715 }}>
      <div style={{ fontWeight: 500, marginBottom: 8 }}>Thinking Process</div>
      <div>1. Analyze task, understand task workflow</div>
      <div>2. Task creation, files needed for task</div>
      <div>3. Task execution, using new component</div>
    </div>
  );
}

export default function DestroyOnHiddenDemo() {
  const [destroy, setDestroy] = useState(true);

  const items: ThoughtChainItemType[] = [
    {
      key: 'create_task',
      title: 'Create Task',
      description: 'description',
      collapsible: true,
      destroyOnHidden: destroy,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ThinkingProcess />
          <CreateTaskContent zhDoc continueZh enDoc continueEn />
        </div>
      ),
      footer: 'Thought Chain Item Footer',
    },
    {
      key: 'check_task',
      title: 'Checking Task Execution Steps Completion',
      description: 'Verify the overall task execution logic and feasibility',
      collapsible: true,
      destroyOnHidden: destroy,
      content: <CheckTaskContent word="creation completed" />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>destroyOnHidden</span>
        <Switch checked={destroy} onChange={setDestroy} />
      </div>
      <ThoughtChain
        items={items}
        defaultExpandedKeys={['create_task']}
        style={{ width: '100%' }}
      />
    </div>
  );
}
