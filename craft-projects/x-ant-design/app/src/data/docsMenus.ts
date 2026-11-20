import type { MenuEntry } from './menu';

const P = '#';

/* ---- /docs/react/introduce-cn ---- */
export const reactMenu: MenuEntry[] = [
  { title: 'Ant Design X', path: '/docs/react/introduce-cn' },
  { title: '更新日志', path: P, tag: 'v2.10.0' },
  {
    title: '模型接入',
    children: [
      { title: 'OpenAI', path: P, tag: 'Updated' },
      { title: '通义千问', path: P, tag: 'Updated' },
    ],
  },
  {
    title: '智能体接入',
    children: [{ title: '百宝箱', path: P, tag: 'Updated' }],
  },
  ComponentsGroup('如何使用', [
    '在 create-react-app 中使用',
    '在 Vite 中使用',
    '在 Next.js 中使用',
    '在 Umi 中使用',
    '在 Rsbuild 中使用',
  ]),
  {
    title: '进阶使用',
    children: [
      { title: '样式兼容', path: P },
      { title: '通用属性', path: P },
      { title: '从 v1 到 v2', path: P, tag: 'New' },
    ],
  },
  { title: '贡献指南', path: P },
  { title: 'FAQ', path: P },
];

function ComponentsGroup(title: string, children: string[]): MenuEntry {
  return { title, children: children.map((t) => ({ title: t, path: P })) };
}

/* ---- /docs/spec/introduce-cn ---- */
export const specMenu: MenuEntry[] = [
  { title: 'RICH 设计范式简介', path: '/docs/spec/introduce-cn' },
  {
    title: '一、什么是 RICH 设计范式',
    children: [
      { title: '介绍', path: P },
      { title: '真实一致', path: P },
      { title: '流畅自然', path: P },
      { title: '有人情味', path: P },
    ],
  },
  {
    title: '二、为什么是 RICH 设计范式',
    children: [
      { title: '介绍', path: P },
      { title: '明确意图类型', path: P },
      { title: '提供意图预期', path: P },
      { title: '引导意图表达', path: P },
    ],
  },
  {
    title: '三、如何应用 RICH AI 设计范式',
    children: [
      { title: '介绍', path: P },
      { title: '开始', path: P },
      { title: '追问', path: P },
      { title: '提示', path: P },
      { title: '确认', path: P },
      { title: '错误', path: P },
      { title: '结束', path: P },
    ],
  },
  {
    title: '四、RICH 在组件中的应用',
    children: [
      { title: '介绍', path: P },
      { title: '唤醒｜AI 标识', path: P },
      { title: '唤醒｜欢迎提示', path: P },
      { title: '表达｜用户输入', path: P },
      { title: '表达｜用户发送', path: P },
      { title: '确认｜生成过程', path: P },
      { title: '反馈｜结果应用', path: P },
      { title: '反馈｜结果展示', path: P },
    ],
  },
];
