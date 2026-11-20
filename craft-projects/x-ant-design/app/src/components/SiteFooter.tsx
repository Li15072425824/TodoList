import './SiteFooter.css';

const COLS: Array<{ title: string; items: string[] }> = [
  {
    title: '相关资源',
    items: [
      'Ant Design',
      'Ant Design Charts',
      'Ant Design Pro',
      'Pro Components',
      'Ant Design Mobile',
      'Ant Design Web3',
      'Ant Motion - 设计动效',
      '国内镜像站点 🇨🇳',
    ],
  },
  {
    title: '社区',
    items: [
      'Awesome Ant Design',
      'Medium',
      'Twitter',
      'Ant Design 语雀专栏',
      'Ant Design 知乎专栏',
      'SEE Conf - 蚂蚁体验科技大会',
      '加入我们',
    ],
  },
  {
    title: '帮助',
    items: [
      'GitHub',
      '更新日志',
      '常见问题',
      '报告 Bug',
      '议题',
      '讨论区',
      'StackOverflow',
      'SegmentFault',
    ],
  },
  {
    title: '更多产品',
    items: [
      '语雀 - 构建你的数字花园',
      'AntV - 数据可视化解决方案',
      'Egg - 企业级 Node.js 框架',
      'Kitchen - Sketch 工具集',
      'Galacean - 互动图形解决方案',
      '蚂蚁体验科技',
      '主题编辑器',
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-grid">
        {COLS.map((c) => (
          <div className="sf-col" key={c.title}>
            <div className="sf-title">{c.title}</div>
            {c.items.map((i) => (
              <a className="sf-link" href="#" key={i}>
                {i}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="sf-bottom">Made with ❤ by 蚂蚁集团和 Ant Design 开源社区</div>
    </footer>
  );
}
