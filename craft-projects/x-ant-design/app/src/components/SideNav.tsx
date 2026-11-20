import { Link, useLocation } from 'react-router-dom';
import { componentMenu, isGroup, type MenuEntry } from '../data/menu';
import './SideNav.css';

function VersionTag({ tag }: { tag: string }) {
  return <span className="sx-tag">{tag}</span>;
}

export function LeafRow({ entry }: { entry: Extract<MenuEntry, { path: string }> }) {
  const { pathname } = useLocation();
  const active = pathname === entry.path;
  return (
    <li>
      <Link
        to={entry.path}
        className={active ? 'sx-leaf active' : 'sx-leaf'}
        aria-current={active ? 'page' : undefined}
      >
        <span className="sx-leaf-title">{entry.title}</span>
        {entry.tag && <VersionTag tag={entry.tag} />}
      </Link>
    </li>
  );
}

export default function SideNav({
  menu = componentMenu,
  label = '组件导航',
}: {
  menu?: MenuEntry[];
  label?: string;
}) {
  return (
    <nav className="sx-sidenav x-scroll" aria-label={label}>
      <ul className="sx-menu">
        {menu.map((entry, i) => {
          if (isGroup(entry)) {
            return (
              <li className="sx-group" key={`g-${i}`}>
                <div className="sx-group-title">{entry.title}</div>
                <ul className="sx-group-list">
                  {entry.children.map((child, j) => (
                    <LeafRow entry={child} key={`c-${j}`} />
                  ))}
                </ul>
              </li>
            );
          }
          return <LeafRow entry={entry} key={`l-${i}`} />;
        })}
      </ul>
    </nav>
  );
}
