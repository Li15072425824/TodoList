import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import PopMenu from './PopMenu';
import { topNav } from '../data/menu';
import './Header.css';

const VERSIONS = ['2.10.0', '2.9.0', '2.8.0', '2.7.0', '2.6.0', '2.5.0'];

const isActive = (current: string, path: string) => {
  if (path === '/components/introduce-cn') return current.startsWith('/components');
  if (path === '/docs/spec/introduce-cn') return current.startsWith('/docs/spec');
  if (path === '/docs/react/introduce-cn') return current.startsWith('/docs/react');
  return current === path;
};

export default function Header() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="dx-header">
      {/* Desktop / tablet layout */}
      <Link className="dx-logo" to="/index-cn" aria-label="Ant Design X 首页">
        <Logo size={30} />
        <span className="dx-logo-text">Ant Design X</span>
      </Link>

      <nav className="dx-pill x-scroll" aria-label="主导航">
        <button className="dx-pill-search" aria-label="搜索" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {topNav.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className={isActive(pathname, item.path) ? 'dx-pill-item active' : 'dx-pill-item'}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="dx-actions">
        <DetailsMenu
          align="right"
          selectedKey="2.10.0"
          items={VERSIONS.map((v) => ({ key: v, label: v }))}
          label={
            <span className="dx-version-inner">
              2.10.0
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          }
        />
        <span className="dx-action-divider" />
        <button className="dx-action" type="button" aria-label="切换语言">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 5h7M9 3v2c0 4.4-2.9 8.3-7 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 9.5C6 13 9 15.5 13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M13 20l4-9 4 9M14.6 16.5h4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="dx-action" type="button" aria-label="双向切换">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 4L3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="dx-action" type="button" aria-label="主题">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 3a9 9 0 109 9c0-1.4-1.1-2-2.5-2H15a2 2 0 01-2-2V5c0-1.1-.9-2-1-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="dx-action" type="button" aria-label="GitHub">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0022 12.2C22 6.6 17.5 2 12 2z" />
          </svg>
        </button>
      </div>

      {/* Mobile: a native disclosure; summary is the pill (logo + burger) */}
      <details
        className="dx-mobile-details"
        open={mobileOpen}
        onToggle={(e) => setMobileOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="dx-mobile">
          <Link className="dx-mobile-logo" to="/index-cn" aria-label="Ant Design X 首页">
            <Logo size={26} />
            <span>Ant Design X</span>
          </Link>
          <span className="dx-mobile-toggle">
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
        </summary>
      </details>

      {/* Mobile expanded: horizontal scroll row of the top nav */}
      {mobileOpen && (
        <div
          className="dx-mobile-nav x-scroll"
          id="dx-mobile-nav"
          role="menu"
          aria-label="主导航"
        >
          {topNav.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className={isActive(pathname, item.path) ? 'active' : ''}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
