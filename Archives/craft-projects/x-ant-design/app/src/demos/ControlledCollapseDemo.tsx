import { useState } from 'react';
import { ThoughtChain } from '@ant-design/x';
import { Button } from 'antd';
import type { ThoughtChainItemType } from '@ant-design/x';

const items: ThoughtChainItemType[] = [
  {
    key: 'collapse',
    title: 'Collapsible Task',
    description: 'Content will be removed from DOM when collapsed',
    collapsible: true,
    content: 'Task detail content.',
  },
  {
    key: 'normal',
    title: 'Normal Task',
    description: "destroyOnHidden keep 1",
    collapsible: true,
    destroyOnHidden: false,
    content: 'Task2 content.',
  },
];

export default function ControlledCollapseDemo() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['collapse', 'normal']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button
        onClick={() =>
          setExpandedKeys((keys) =>
            keys.length === 0 ? ['collapse', 'normal'] : [],
          )
        }
      >
        Collapse
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
