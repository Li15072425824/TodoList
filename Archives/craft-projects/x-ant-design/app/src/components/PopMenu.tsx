import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './PopMenu.css';

export interface PopMenuItem {
  key: string;
  label: ReactNode;
}

/**
 * A small, fully-controlled popover rendered through a portal.
 * The trigger exposes aria-haspopup/aria-expanded and the panel uses role="menu"
 * so assistive tooling (and the open-state capture) can detect it.
 */
export default function PopMenu({
  id,
  label,
  items,
  selectedKey,
  children,
  align = 'left',
}: {
  id: string;
  label: ReactNode;
  items: PopMenuItem[];
  selectedKey?: string;
  children?: ReactNode;
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number }>({
    top: 0,
  });

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos(
      align === 'right'
        ? { top: r.bottom + 6, right: window.innerWidth - r.right }
        : { top: r.bottom + 6, left: r.left },
    );
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('.popmenu-panel')
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <>
      <span
        ref={triggerRef}
        className="popmenu-trigger"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        {label}
      </span>
      {open &&
        createPortal(
          <div
            id={id}
            role="menu"
            className="popmenu-panel x-scroll"
            style={{ top: pos.top, left: pos.left, right: pos.right }}
          >
            {items.map((it) => (
              <div
                key={it.key}
                role="menuitem"
                tabIndex={-1}
                className={
                  selectedKey === it.key
                    ? 'popmenu-item selected'
                    : 'popmenu-item'
                }
                onClick={() => setOpen(false)}
              >
                {it.label}
              </div>
            ))}
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
