import type { ReactNode } from 'react';
import Header from './Header';
import SideNav from './SideNav';
import RightAnchor, { type AnchorItem } from './RightAnchor';
import type { MenuEntry } from '../data/menu';

interface DocLayoutProps {
  anchor?: AnchorItem[];
  menu?: MenuEntry[];
  navLabel?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function DocLayout({
  anchor = [],
  menu,
  navLabel,
  footer,
  children,
}: DocLayoutProps) {
  return (
    <div className="doc-root">
      <Header />
      <div className="doc-body">
        <SideNav menu={menu} label={navLabel} />
        <main className="doc-main">
          <article className="doc-article">{children}</article>
        </main>
        {anchor.length > 0 && <RightAnchor items={anchor} />}
      </div>
      {footer}
    </div>
  );
}
