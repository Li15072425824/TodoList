import type { ReactNode } from 'react';
import './SemanticDom.css';

export interface SemNode {
  key: string;
  desc: string;
}

/**
 * A "Semantic DOM" block: a faux rendered tree on top, then a key→desc table.
 */
export default function SemanticDom({
  preview,
  nodes,
}: {
  preview: ReactNode;
  nodes: SemNode[];
}) {
  return (
    <div className="sem-block">
      <div className="sem-preview x-scroll">{preview}</div>
      <div className="sem-table x-scroll">
        <table>
          <tbody>
            {nodes.map((n) => (
              <tr key={n.key}>
                <td className="sem-key">{n.key}</td>
                <td>{n.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
