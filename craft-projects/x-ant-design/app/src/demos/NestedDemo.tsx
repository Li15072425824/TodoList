import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainItemType } from '@ant-design/x';
import { CreateTaskContent } from './taskData';

const items: ThoughtChainItemType[] = [
  {
    key: 'create',
    title: 'Create Task: Write New Component',
    content: <CreateTaskContent />,
  },
];

export default function NestedDemo() {
  return <ThoughtChain items={items} defaultExpandedKeys={['create']} style={{ width: '100%' }} />;
}
