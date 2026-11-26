import { useState } from 'react';
import { ThoughtChain } from '@ant-design/x';
import { Button } from 'antd';
import type { ThoughtChainItemType } from '@ant-design/x';
import { CreateTaskContent, CheckTaskContent, TaskChip } from './taskData';

const items: ThoughtChainItemType[] = [
  {
    key: 'create_task',
    title: 'Create Task: Develop New Component',
    description: 'Execute files needed for new component creation',
    collapsible: true,
    content: <CreateTaskContent zhDoc continueEn />,
  },
  {
    key: 'check_task',
    title: 'Check Task Execution Steps Completion',
    description: 'Verify the overall task execution logic and feasibility',
    collapsible: true,
    content: <CheckTaskContent />,
  },
  {
    key: 'use',
    title: 'Using the New Component',
    description: 'Using the generated component to complete the task',
    collapsible: true,
    content: <TaskChip icon="check" label="File created" arg="component" />,
  },
];

export default function CollapsibleDemo() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['create_task']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button onClick={() => setExpandedKeys(['create_task', 'check_task'])}>
        Open "check_task" details
      </Button>
      <ThoughtChain
        items={items}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        style={{ width: '100%' }}
      />
    </div>
  );
}
