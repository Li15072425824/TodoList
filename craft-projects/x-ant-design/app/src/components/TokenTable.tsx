import { useState } from 'react';
import './TokenTable.css';

export interface Token {
  name: string;
  desc: string;
  type: string;
  def: string;
  /** hex/rgba for the swatch dot; omit for non-color tokens */
  color?: string;
}

function TokenRows({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((t) => (
        <tr key={t.name}>
          <td className="tok-name">{t.name}</td>
          <td>{t.desc}</td>
          <td className="tok-type">{t.type}</td>
          <td className="tok-default">
            {t.color && <span className="tok-dot" style={{ background: t.color }} />}
            {t.def}
          </td>
        </tr>
      ))}
    </>
  );
}

function Section({
  title,
  hint,
  tokens,
  defaultOpen,
}: {
  title: string;
  hint: string;
  tokens: Token[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="tok-section">
      <button type="button" className="tok-header" onClick={() => setOpen((v) => !v)}>
        <span className={`tok-arrow ${open ? 'open' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="tok-section-title">{title}</span>
        <span className="tok-hint">{hint}</span>
      </button>
      {open && (
        <div className="tok-tablewrap x-scroll">
          <table>
            <thead>
              <tr>
                <th>Token 名称</th>
                <th>描述</th>
                <th>类型</th>
                <th>默认值</th>
              </tr>
            </thead>
            <tbody>
              <TokenRows tokens={tokens} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function TokenTable({
  componentTokens,
  globalTokens,
}: {
  componentTokens: Token[];
  globalTokens: Token[];
}) {
  return (
    <div className="token-table">
      <Section title="组件 Token" hint="如何定制？" tokens={componentTokens} defaultOpen />
      <Section title="全局 Token" hint="如何定制？" tokens={globalTokens} />
    </div>
  );
}
