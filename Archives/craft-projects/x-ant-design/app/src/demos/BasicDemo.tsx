import { useState } from 'react';
import { ThoughtChain } from '@ant-design/x';
import { Button } from 'antd';
import type { ThoughtChainItemType } from '@ant-design/x';

const MORE: ThoughtChainItemType[] = [
  {
    title: 'Thought Chain Item - 1',
    description: 'status: success',
    status: 'success',
  },
  {
    title: 'Thought Chain Item - 2',
    description: 'status: error',
    status: 'error',
  },
];

export default function BasicDemo() {
  const [items, setItems] = useState<ThoughtChainItemType[]>([MORE[0]]);
  const [count, setCount] = useState(1);

  const runNext = () => {
    setItems((prev) => [
      ...prev,
      count >= MORE.length ? { ...MORE[count % MORE.length] } : { ...MORE[count] },
    ]);
    setCount((c) => c + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button type="primary" onClick={runNext}>
        Run Next
      </Button>
      <ThoughtChain items={items} style={{ width: '100%' }} />
    </div>
  );
}
