import type { ReactNode } from 'react';
import './ApiTable.css';

export interface ApiRow {
  name: ReactNode;
  desc: ReactNode;
  type: ReactNode;
  def?: ReactNode;
  version?: ReactNode;
}

export default function ApiTable({ rows }: { rows: ApiRow[] }) {
  return (
    <div className="api-table x-scroll">
      <table>
        <thead>
          <tr>
            <th>属性</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
            <th>版本</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="api-name">{r.name}</td>
              <td>{r.desc}</td>
              <td className="api-type">{r.type}</td>
              <td>{r.def ?? '-'}</td>
              <td>{r.version ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Type-text helper: magenta monospace fragment. */
export function T({ children }: { children: ReactNode }) {
  return <span className="api-type-frag">{children}</span>;
}
