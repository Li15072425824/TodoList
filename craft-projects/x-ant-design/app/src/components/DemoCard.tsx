import { useState, type ReactNode } from 'react';
import './DemoCard.css';

interface DemoCardProps {
  id: string;
  title: string;
  description: ReactNode;
  code?: string;
  children: ReactNode;
}

function ActionIcons({
  codeOpen,
  onToggleCode,
}: {
  codeOpen: boolean;
  onToggleCode: () => void;
}) {
  return (
    <>
      <button type="button" className="dc-icon" aria-label="全屏" title="全屏">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="dc-icon" aria-label="API" title="API">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="dc-icon" aria-label="复制代码" title="复制代码">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="7" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="7" cy="17" r="3.2" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17" cy="17" r="3.2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M9.5 8.5l5 0M9.5 15.5l5 0" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <button type="button" className="dc-icon" aria-label="新窗口打开" title="新窗口打开">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M14 5h5v5M19 5l-9 9M18 13.5V19H5V6h5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className={codeOpen ? 'dc-icon active' : 'dc-icon'}
        aria-label="查看代码"
        title="查看代码"
        onClick={onToggleCode}
      >
        <svg width="20" height="18" viewBox="0 0 24 20" fill="none">
          <path d="M9 4l-6 6 6 6M15 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}

export default function DemoCard({
  id,
  title,
  description,
  code,
  children,
}: DemoCardProps) {
  const [codeOpen, setCodeOpen] = useState(false);

  return (
    <section className="dc-card" id={id}>
      <div className="dc-preview">{children}</div>
      <div className="dc-meta">
        <div className="dc-title">
          <span>{title}</span>
          <svg className="dc-title-edit" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="dc-desc">{description}</div>
        <div className="dc-actions">
          <ActionIcons
            codeOpen={codeOpen}
            onToggleCode={() => setCodeOpen((v) => !v)}
          />
        </div>
      </div>
      {codeOpen && code && (
        <pre className="dc-code x-scroll">
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}
