import { useState } from 'react';
import DocLayout from '../components/DocLayout';

const anchor = [
  { id: 'features', title: '特性' },
  { id: 'install', title: '安装' },
  { id: 'browser', title: '浏览器引入' },
  { id: 'components', title: '组件' },
  { id: 'ondemand', title: '按需加载' },
  { id: 'ts', title: 'TypeScript' },
];

const FEATURES: Array<[string, string]> = [
  ['🌈', '源自企业级 AI 产品的最佳实践：基于 RICH 交互范式，提供卓越的 AI 交互体验'],
  ['🧩', '灵活多样的原子组件：覆盖绝大部分 AI 对话场景，助力快速构建个性化 AI 交互页面'],
  ['⚡', '开箱即用的模型对接能力：配合 X SDK 轻松对接模型和智能体服务'],
  ['📦', '丰富的样板间支持：提供多种模板，快速启动 LUI 应用开发'],
  ['🛡', 'TypeScript 全覆盖：采用 TypeScript 开发，提供完整类型支持，提升开发体验与可靠性'],
  ['🎨', '深度主题定制能力：支持细粒度的样式调整，满足各种场景的个性化需求'],
];

const TABS = ['npm', 'yarn', 'pnpm', 'Bun', 'utoo'] as const;
const INSTALL_CMD: Record<(typeof TABS)[number], string> = {
  npm: 'npm install @ant-design/x --save',
  yarn: 'yarn add @ant-design/x',
  pnpm: 'pnpm add @ant-design/x',
  Bun: 'bun add @ant-design/x',
  utoo: 'utoo install @ant-design/x',
};

function Pencil() {
  return (
    <svg className="title-edit" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const COMP_GROUPS: Array<[string, string]> = [
  ['通用', 'Bubble - 消息气泡、Conversations - 会话管理、Notification - 系统通知'],
  ['唤醒', 'Welcome - 欢迎、Prompts - 提示集'],
  ['表达', 'Sender - 发送框、Attachment - 输入附件、Suggestion - 快捷指令'],
  ['确认', 'Think - 思考过程、ThoughtChain - 思维链'],
  ['反馈', 'Actions - 操作列表、FileCard - 文件卡片、Sources - 来源引用、CodeHighlighter - 代码高亮、Mermaid - 图表工具、Folder - 文件树'],
  ['其他', 'XProvider - 全局配置：主题、国际化等'],
];

const SAMPLE = `1   import React from 'react';
2   import { Bubble, Sender } from '@ant-design/x';
3
4   const messages = [
5     {
6       content: 'Hello, Ant Design X!',
7       role: 'user',
8       key: 'user_0',
9     },
10  ];
11
12  const App = () => (
13    <div style={{ height: '400px', display: 'flex',
14                 flexDirection: 'column',
15                 justifyContent: 'space-between' }}>
16      <Bubble.List items={messages} />
17      <Sender />
18    </div>
19  );
20
21  export default App;`;

export default function ComponentsIntroducePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('npm');

  return (
    <DocLayout anchor={anchor} navLabel="组件导航">
      <div className="doc-prose">
        <h1 className="page-h1">
          介绍
          <Pencil />
        </h1>

        <p>
          <code className="ic">@ant-design/x</code> 是基于 Ant Design
          设计体系的 React UI 库、专为 AI
          驱动界面设计，开箱即用的智能对话组件、无缝集成 API 服务，快速搭建智能应用界面。
        </p>

        <h2 id="features" className="page-h2">✨ 特性</h2>
        <ul className="page-list" style={{ listStyle: 'none', paddingLeft: 4 }}>
          {FEATURES.map(([icon, text]) => (
            <li key={text}>
              {icon} {text}
            </li>
          ))}
        </ul>

        <h2 id="install" className="page-h2">安装</h2>
        <h3 className="page-h3">使用 npm 或 yarn 或 pnpm 或 bun 安装 或 utoo 安装</h3>
        <p>
          我们推荐使用 npm 或 yarn 或 pnpm 或 bun 或 utoo
          的方式进行开发，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。
        </p>

        <div className="install-card">
          <div className="install-tabs">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={tab === t ? 'install-tab active' : 'install-tab'}
              >
                {t}
              </button>
            ))}
            <span className="install-lang">bash</span>
          </div>
          <pre className="install-cmd x-scroll">
            <code>{'$ ' + INSTALL_CMD[tab]}</code>
          </pre>
        </div>

        <p>
          如果你的网络环境不佳，推荐使用 <code className="ic">cnpm</code>。
        </p>

        <h3 id="browser" className="page-h3">浏览器引入</h3>
        <p>
          在浏览器中使用 <code className="ic">script</code> 和{' '}
          <code className="ic">link</code> 标签直接引入文件，并使用全局变量{' '}
          <code className="ic">antdx</code>。
        </p>
        <p>
          我们在 npm 发布包内的 dist 目录下提供了{' '}
          <code className="ic">antdx.js</code>、
          <code className="ic">antdx.min.js</code> 和{' '}
          <code className="ic">antdx.min.js.map</code>。
        </p>
        <p style={{ color: 'rgba(0,0,0,0.45)' }}>
          强烈不推荐使用已构建文件，这样无法按需加载，而且难以获得底层依赖模块的 bug
          快速修复支持。
        </p>
        <p>
          注意：<code className="ic">antdx.js</code> 和{' '}
          <code className="ic">antdx.min.js</code> 依赖 react、react-dom、dayjs antd
          @ant-design/cssinjs @ant-design/icons，请确保提前引入这些文件。
        </p>

        <h2 id="components" className="page-h2">🧩 组件</h2>
        <p>
          我们基于 RICH
          交互范式，在不同的交互阶段提供了大量的原子组件，帮助你灵活搭建你的 AI
          对话应用：
        </p>
        <ul className="page-list">
          {COMP_GROUPS.map(([g, text]) => (
            <li key={g}>
              <strong>{g}</strong>: {text}
            </li>
          ))}
        </ul>
        <p>下面是使用原子组件搭建一个最简单的对话框的代码示例：</p>

        <div className="install-card sample-card">
          <div className="install-tabs">
            {['index.tsx', 'app.tsx', 'package.json', 'index.css'].map((f, i) => (
              <span
                key={f}
                className={i === 1 ? 'install-tab active static' : 'install-tab static'}
              >
                {f}
              </span>
            ))}
          </div>
          <pre className="codeblock x-scroll" style={{ background: '#fff', borderRadius: 0 }}>
            <code>{SAMPLE}</code>
          </pre>
        </div>

        <h2 className="page-h2">⚡️ 对接模型/智能体服务，AI 对话数据流管理</h2>
        <p>
          我们通过提供 X SDK，帮助你开箱即用的对接模型和智能体服务，更有好用的基础工具。
        </p>

        <h2 className="page-h2">✨ Markdown 高性能流式渲染引擎</h2>
        <p>
          我们提供专为流式内容优化的 Markdown
          渲染解决方案、强大的扩展能力，支持公式、代码高亮、mermaid
          图表等、极致性能表现，确保流畅的内容展示体验。
        </p>

        <h2 id="ondemand" className="page-h2">按需加载</h2>
        <p>
          <code className="ic">@ant-design/x</code> 默认支持基于 ES modules 的 tree
          shaking。
        </p>

        <h2 id="ts" className="page-h2">TypeScript</h2>
        <p>
          <code className="ic">@ant-design/x</code> 使用 TypeScript
          进行书写并提供了完整的定义文件。
        </p>
      </div>
    </DocLayout>
  );
}
