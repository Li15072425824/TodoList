import { useState, type ReactNode } from 'react';
import './DetailsMenu.css';

export interface DetailsMenuItem {
  key: string;
  label: ReactNode;
}

/**
 * A popover built on a native <details>/<summary>: the summary is a non-form
 * disclosure control that the open-state capture recognises, and the panel is
 * absolutely positioned under the trigger.
 */
export default function DetailsMenu({
  label,
  items,
  selectedKey,
  align = 'right',
}: {
  label: ReactNode;
  items: DetailsMenuItem[];
  selectedKey?: string;
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className={`dm-details ${align}`}
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="dm-summary">{label}</summary>
      <div className="dm-panel x-scroll" role="menu">
        {items.map((it) => (
          <div
            key={it.key}
            role="menuitem"
            tabIndex={-1}
            className={selectedKey === it.key ? 'dm-item selected' : 'dm-item'}
            onClick={() => setOpen(false)}
          >
            {it.label}
          </div>
        ))}
      </div>
    </details>
  );
}
