import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainItemType } from '@ant-design/x';
import { CreateTaskContent, CheckTaskContent } from './taskData';

const items: ThoughtChainItemType[] = [
  {
    key: 'create',
    title: 'Create Task: Write New Component',
    description: 'Execute files needed for creating new component',
    content: <CreateTaskContent />,
  },
  {
    key: 'check',
    title: 'Checking Task Execution Steps',
    description: 'Verify overall task execution logic and feasibility',
    content: <CheckTaskContent />,
  },
];

export default function ConciseDemo() {
  return <ThoughtChain items={items} defaultExpandedKeys={['create', 'check']} style={{ width: '100%' }} />;
}
