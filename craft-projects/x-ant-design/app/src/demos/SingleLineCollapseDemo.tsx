import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainItemType } from '@ant-design/x';

const items: ThoughtChainItemType[] = [
  {
    key: 'single',
    title: 'Click to expand',
    collapsible: true,
    content: 'Single line content.',
  },
];

export default function SingleLineCollapseDemo() {
  return <ThoughtChain items={items} defaultExpandedKeys={[]} style={{ width: '100%' }} />;
}
