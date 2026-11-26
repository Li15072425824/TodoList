export interface MenuLeaf {
  title: string;
  /** path under x.ant.design, used for routing locally */
  path: string;
  tag?: string;
}

export interface MenuGroup {
  title: string;
  children: MenuLeaf[];
}

export type MenuEntry = MenuLeaf | MenuGroup;

const leaf = (title: string, slug: string, tag?: string): MenuLeaf => ({
  title,
  path: `/components/${slug}`,
  tag,
});

/** Left-hand component navigation, mirroring the order on the live docs. */
export const componentMenu: MenuEntry[] = [
  { title: '介绍', path: '/components/introduce-cn' },
  { title: '总览', path: '/components/overview-cn' },
  {
    title: '通用',
    children: [
      leaf('Bubble 对话气泡', 'bubble-cn'),
      leaf('Conversations 管理对话', 'conversations-cn'),
      leaf('Notification 系统通知', 'notification-cn', '2.0.0'),
    ],
  },
  {
    title: '唤醒',
    children: [
      leaf('Welcome 欢迎', 'welcome-cn'),
      leaf('Prompts 提示集', 'prompts-cn'),
    ],
  },
  {
    title: '确认',
    children: [
      leaf('Think 思考过程', 'think-cn', '2.0.0'),
      leaf('ThoughtChain 思维链', 'thought-chain-cn', '2.0.0'),
    ],
  },
  {
    title: '表达',
    children: [
      leaf('Attachments 输入附件', 'attachments-cn'),
      leaf('Sender 输入框', 'sender-cn'),
      leaf('Suggestion 快捷指令', 'suggestion-cn'),
    ],
  },
  {
    title: '反馈',
    children: [
      leaf('Actions 操作列表', 'actions-cn'),
      leaf('CodeHighlighter 代码高亮', 'code-highlighter-cn', '2.1.0'),
      leaf('FileCard 文件卡片', 'file-card-cn', '2.0.0'),
      leaf('Folder 文件夹', 'folder-cn', '2.4.0'),
      leaf('Mermaid 图表工具', 'mermaid-cn', '2.1.0'),
      leaf('Sources 来源引用', 'sources-cn', '2.0.0'),
    ],
  },
  {
    title: '其他',
    children: [leaf('XProvider 全局化配置', 'x-provider-cn')],
  },
];

export const isGroup = (entry: MenuEntry): entry is MenuGroup =>
  (entry as MenuGroup).children !== undefined;

/** Primary top navigation inside the rounded pill. */
export const topNav = [
  { title: '设计', path: '/docs/spec/introduce-cn' },
  { title: '研发', path: '/docs/react/introduce-cn' },
  { title: '组件', path: '/components/introduce-cn' },
  { title: 'X Markdown', path: '/x-markdowns/introduce-cn' },
  { title: 'X SDK', path: '/x-sdks/introduce-cn' },
  { title: 'X Card', path: '/x-cards/introduce-cn' },
  { title: 'X Skill', path: '/x-skills/introduce-cn' },
  { title: '演示', path: '/docs/playground/ultramodern-cn' },
  { title: '国内镜像', path: '#' },
];
