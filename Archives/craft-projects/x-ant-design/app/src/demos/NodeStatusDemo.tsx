import { ThoughtChain } from '@ant-design/x';
import { LinkOutlined } from '@ant-design/icons';
import type { ThoughtChainItemProps } from '@ant-design/x';

const URL = 'https://x.ant.design/docs/playground/copilot';

type Cell = ThoughtChainItemProps;

interface Row {
  label: string;
  cell: (variant: 'solid' | 'outlined' | 'text') => Cell;
}

const CustomIcon = () => (
  <span style={{ color: '#52c41a', fontSize: 14 }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const ROWS: Row[] = [
  { label: 'loading status:', cell: () => ({ title: 'Tool Calling', status: 'loading' }) },
  { label: 'success status:', cell: () => ({ title: 'Tool Call Finished', status: 'success' }) },
  { label: 'error status:', cell: () => ({ title: 'Tool Call Error', status: 'error' }) },
  { label: 'abort status', cell: () => ({ title: 'Agent Response Aborted', status: 'abort' }) },
  { label: 'custom icon:', cell: () => ({ title: 'Task Completed', icon: <CustomIcon /> }) },
  {
    label: 'click:',
    cell: () => ({
      title: 'Opening Webpage',
      description: URL,
      icon: <LinkOutlined />,
      onClick: () => window.open(URL, '_blank'),
      style: { cursor: 'pointer' },
    }),
  },
  {
    label: 'blink:',
    cell: () => ({ title: 'Task Completed', icon: <CustomIcon />, blink: true }),
  },
  {
    label: 'disabled:',
    cell: () => ({ title: 'Task Completed', icon: <CustomIcon />, disabled: true }),
  },
];

const VARIANTS: Array<'solid' | 'outlined' | 'text'> = ['solid', 'outlined', 'text'];

export default function NodeStatusDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '110px repeat(3, 1fr)',
        gap: 12,
        width: '100%',
      }}
    >
      {/* header row */}
      <div />
      {VARIANTS.map((v) => (
        <div key={v} style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          {v}
        </div>
      ))}

      {ROWS.map((row) => (
        <RowCells key={row.label} row={row} />
      ))}
    </div>
  );
}

function RowCells({ row }: { row: Row }) {
  return (
    <>
      <div
        style={{
          fontSize: 13,
          color: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {row.label}
      </div>
      {VARIANTS.map((variant) => {
        const props = row.cell(variant);
        return (
          <ThoughtChain.Item key={variant} variant={variant} {...props} />
        );
      })}
    </>
  );
}
