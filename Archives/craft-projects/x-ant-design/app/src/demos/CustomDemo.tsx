import { ThoughtChain } from '@ant-design/x';
import { HeartFilled } from '@ant-design/icons';
import type { ThoughtChainItemType } from '@ant-design/x';

const items: ThoughtChainItemType[] = [
  {
    key: '1',
    icon: (
      <HeartFilled
        style={{ color: '#ff4d80', fontSize: 16 }}
      />
    ),
    title: '1',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>Thought Chain Item description 1</div>
        <div style={{ paddingLeft: 24 }}>
          <ThoughtChain

            items={[
              {
                key: '1-1',
                title: '1-1',
                content: 'Thought Chain Item description 1',
              },
              {
                key: '1-2',
                title: '1-2',
                content: 'Thought Chain Item description 2',
              },
            ]}
          />
        </div>
      </div>
    ),
    footer: 'Thought Chain Item Footer',
  },
  {
    key: '2',
    icon: <HeartFilled style={{ color: '#ff4d80', fontSize: 16 }} />,
    title: '2',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>Thought Chain Item description 1</div>
        <div style={{ paddingLeft: 24 }}>
          <ThoughtChain

            items={[
              { key: '2-1', title: '2-1', content: 'Thought Chain Item description 1' },
              { key: '2-2', title: '2-2', content: 'Thought Chain Item description 2' },
              { key: '2-3', title: '2-3', content: 'Thought Chain Item description 3' },
            ]}
          />
        </div>
        <div>Thought Chain Item description 2</div>
      </div>
    ),
    footer: '2',
  },
];

export default function CustomDemo() {
  return <ThoughtChain items={items} defaultExpandedKeys={['1', '2']} style={{ width: '100%' }} />;
}
