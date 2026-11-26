import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import SiteHeader from './components/SiteHeader.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toc from './components/Toc.jsx';
import ThoughtChainDoc from './docs/ThoughtChainDoc.jsx';

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        },
      }}
    >
      <SiteHeader dark={dark} onToggleTheme={() => setDark((value) => !value)} />
      <div className="doc-layout">
        <Sidebar />
        <main className="main-column">
          <ThoughtChainDoc />
        </main>
        <Toc />
      </div>
    </ConfigProvider>
  );
}
