import { ThoughtChain } from '@ant-design/x';
import type { ReactNode } from 'react';

/* Small inline icons used inside the task-building chain content. */

const IconTerminal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 9l3 3-3 3M13 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconFile = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M13 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9l-6-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M13 3v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#52c41a" strokeWidth="1.8" />
    <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#52c41a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A gray "command / file" chip: bold label + muted argument. */
export function TaskChip({
  icon,
  label,
  arg,
}: {
  icon?: 'terminal' | 'file' | 'check';
  label: string;
  arg?: string;
}) {
  const iconNode =
    icon === 'terminal' ? (
      <IconTerminal />
    ) : icon === 'file' ? (
      <IconFile />
    ) : icon === 'check' ? (
      <IconCheck />
    ) : null;
  return (
    <ThoughtChain.Item
      variant="solid"
      icon={iconNode}
      title={<span style={{ fontWeight: 500 }}>{label}</span>}
      description={arg ? <span style={{ color: 'rgba(0,0,0,0.45)' }}>{arg}</span> : null}
      style={{ borderRadius: 6 }}
    />
  );
}

/** Muted helper line, e.g. "Creating folder for new component". */
export function TaskLine({ children }: { children: ReactNode }) {
  return (
    <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14, lineHeight: 1.5715 }}>
      {children}
    </div>
  );
}

/** The inner content of the "Create Task" node used across many demos. */
export function CreateTaskContent({
  zhDoc,
  enDoc,
  continueZh,
  continueEn,
}: {
  zhDoc?: boolean;
  enDoc?: boolean;
  continueZh?: boolean;
  continueEn?: boolean;
} = {}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TaskLine>Creating folder for new component</TaskLine>
      <TaskChip icon="terminal" label="Executing command" arg="mkdir -p component" />
      <TaskLine>Creating files needed for new component</TaskLine>
      <TaskChip icon="file" label="Creating file" arg="component/index.tsx" />
      <TaskLine>
        {zhDoc ? 'Creating Chinese documentation file' : 'Creating Chinese description file for new component'}
      </TaskLine>
      <TaskChip
        icon="file"
        label={continueZh ? 'Continue creating file' : 'Creating file'}
        arg="component/index.zh-CN.md"
      />
      <TaskLine>
        {enDoc ? 'Continue' : 'Creating English description file for new component'}
      </TaskLine>
      <TaskChip
        icon="file"
        label={continueEn ? 'Continue creating file' : 'Creating file'}
        arg="component/index.en-US.md"
      />
    </div>
  );
}

/** The inner content of the "Checking Task" node. */
export function CheckTaskContent({ word = 'created' }: { word?: 'created' | 'creation completed' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TaskChip icon="check" label={word === 'created' ? 'Folder created' : 'Folder creation completed'} arg="component" />
      <TaskChip
        icon="check"
        label={word === 'created' ? 'File created' : 'File creation completed'}
        arg="component/index.tsx"
      />
      <TaskChip
        icon="check"
        label={word === 'created' ? 'File created' : 'File creation completed'}
        arg="component/index.zh-CN.md"
      />
      <TaskChip
        icon="check"
        label={word === 'created' ? 'File created' : 'File creation completed'}
        arg="component/index.en-US.md"
      />
    </div>
  );
}
