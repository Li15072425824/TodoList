import React from 'react';

const TOP_ITEMS = ['介绍', '总览'];

const GROUPS = [
  {
    title: '通用',
    items: [
      { en: 'Bubble', zh: '对话气泡' },
      { en: 'Conversations', zh: '管理对话' },
      { en: 'Notification', zh: '系统通知', version: '2.0.0' },
    ],
  },
  {
    title: '唤醒',
    items: [
      { en: 'Welcome', zh: '欢迎' },
      { en: 'Prompts', zh: '提示集' },
    ],
  },
  {
    title: '确认',
    items: [
      { en: 'Think', zh: '思考过程', version: '2.0.0' },
      { en: 'ThoughtChain', zh: '思维链', version: '2.0.0', active: true },
    ],
  },
  {
    title: '表达',
    items: [
      { en: 'Attachments', zh: '输入附件' },
      { en: 'Sender', zh: '输入框' },
      { en: 'Suggestion', zh: '快捷指令' },
    ],
  },
  {
    title: '反馈',
    items: [
      { en: 'Actions', zh: '操作列表' },
      { en: 'CodeHighlighter', zh: '代码高亮', version: '2.1.0' },
      { en: 'FileCard', zh: '文件卡片', version: '2.0.0' },
      { en: 'Folder', zh: '文件夹', version: '2.4.0' },
      { en: 'Mermaid', zh: '图表工具', version: '2.1.0' },
      { en: 'Sources', zh: '来源引用', version: '2.0.0' },
    ],
  },
  {
    title: '其他',
    items: [{ en: 'XProvider', zh: '全局化配置' }],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        {TOP_ITEMS.map((item) => (
          <div className="nav-item" key={item}>
            {item}
          </div>
        ))}
      </div>
      {GROUPS.map((group) => (
        <div key={group.title}>
          <div className="nav-group-title">{group.title}</div>
          {group.items.map((item) => (
            <div
              className={`nav-item ${item.active ? 'active' : ''}`}
              key={item.en}
              onClick={() => {
                if (item.active) return;
                const anchor = document.getElementById('thought-chain-demo-basic');
                anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span className="en">{item.en}</span>
              <span className="zh">{item.zh}</span>
              {item.version ? <span className="version-tag">{item.version}</span> : null}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
