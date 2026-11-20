import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './HomeHeader.css';

const LINKS: Array<[string, string]> = [
  ['设计', '/docs/spec/introduce-cn'],
  ['研发', '/docs/react/introduce-cn'],
  ['组件', '/components/introduce-cn/'],
  ['X Markdown', '#'],
  ['X SDK', '#'],
  ['X Card', '#'],
  ['X Skill', '#'],
  ['演示', '#'],
  ['国内镜像', '#'],
];

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="hh">
      <div className="hh-inner">
        <Link to="/index-cn" className="hh-brand" onClick={() => setOpen(false)}>
          <Logo />
          <span className="hh-title">Ant Design X</span>
        </Link>
        <nav className="hh-nav x-scroll">
          {LINKS.map(([t, p]) => (
            <Link key={t} to={p} className="hh-link">
              {t}
            </Link>
          ))}
        </nav>
        <div className="hh-actions">
          <button type="button" className="hh-icon" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 015.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
            </svg>
          </button>
          <button
            type="button"
            className="hh-burger"
            aria-label="菜单"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="hh-mobile x-scroll">
          {LINKS.map(([t, p]) => (
            <Link key={t} to={p} className="hh-link" onClick={() => setOpen(false)}>
              {t}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
