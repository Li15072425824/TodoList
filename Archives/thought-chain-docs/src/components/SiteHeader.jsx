import React from 'react';
import {
  AppstoreOutlined,
  DownOutlined,
  GithubOutlined,
  MoonOutlined,
  SunOutlined,
  TranslationOutlined,
} from '@ant-design/icons';

const NAV_ITEMS = [
  { label: '设计', href: '#' },
  { label: '研发', href: '#' },
  { label: '组件', href: '#', active: true },
  { label: 'X Markdown', href: '#' },
  { label: 'X SDK', href: '#' },
  { label: 'X Card', href: '#' },
  { label: 'X Skill', href: '#' },
  { label: '演示', href: '#' },
  { label: '国内镜像', href: '#' },
];

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 34 34" aria-label="Ant Design X">
      <defs>
        <linearGradient id="x-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1677ff" />
          <stop offset="45%" stopColor="#7f56ff" />
          <stop offset="100%" stopColor="#ff4d94" />
        </linearGradient>
        <linearGradient id="x-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5b8cff" />
          <stop offset="100%" stopColor="#9254de" />
        </linearGradient>
      </defs>
      <path
        d="M7.2 6.2 L26.8 27.8"
        stroke="url(#x-gradient-2)"
        strokeWidth="5.4"
        strokeLinecap="round"
      />
      <path
        d="M26.8 6.2 L7.2 27.8"
        stroke="url(#x-gradient)"
        strokeWidth="5.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SiteHeader({ dark, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="brand">
        <BrandMark />
        <span className="brand-title">Ant Design X</span>
      </div>
      <nav className="header-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={item.active ? 'active' : ''}
            onClick={(event) => event.preventDefault()}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-right">
        <span className="version">
          2.10.0 <DownOutlined style={{ fontSize: 10 }} />
        </span>
        <button className="icon-btn" type="button" aria-label="应用">
          <AppstoreOutlined />
        </button>
        <button className="icon-btn" type="button" aria-label="切换主题" onClick={onToggleTheme}>
          {dark ? <SunOutlined /> : <MoonOutlined />}
        </button>
        <button className="icon-btn" type="button" aria-label="语言">
          <TranslationOutlined />
        </button>
        <button className="icon-btn" type="button" aria-label="GitHub">
          <GithubOutlined />
        </button>
      </div>
    </header>
  );
}
