import React, { useState } from 'react';
import { CodeOutlined, EditOutlined, PictureOutlined, ThunderboltOutlined } from '@ant-design/icons';

export default function DemoBox({ id, title, description, code, children, center = false }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <section className="code-box" id={id} data-toc-anchor={id}>
      <div className={`code-box-demo ${center ? 'center' : ''}`}>{children}</div>
      <div className="code-box-meta">
        <div className="code-box-title">
          {title}
          <EditOutlined title="编辑此演示" />
        </div>
        {description ? (
          <div className="code-box-desc">{description}</div>
        ) : null}
        <div className="code-box-actions">
          <button className="icon-btn" type="button" aria-label="预览">
            <PictureOutlined />
          </button>
          <button className="icon-btn" type="button" aria-label="模板">
            <ThunderboltOutlined />
          </button>
          <button
            className="icon-btn"
            type="button"
            aria-label={showCode ? '收起代码' : '查看代码'}
            onClick={() => setShowCode((value) => !value)}
          >
            <CodeOutlined style={showCode ? { color: 'var(--primary)' } : undefined} />
          </button>
        </div>
      </div>
      {showCode ? (
        <pre className="code-box-code">
          <code>{code}</code>
        </pre>
      ) : null}
    </section>
  );
}
