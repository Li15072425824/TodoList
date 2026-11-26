import React, { useEffect, useState } from 'react';

export const TOC_DATA = [
  { id: 'when-to-use', label: '何时使用' },
  {
    id: 'demos',
    label: '代码演示',
    children: [
      { id: 'thought-chain-demo-basic', label: '基本' },
      { id: 'thought-chain-demo-status', label: '节点状态' },
      { id: 'thought-chain-demo-simple', label: '简洁思维链' },
      { id: 'thought-chain-demo-collapsible', label: '可折叠的' },
      { id: 'thought-chain-demo-controlled', label: '受控的折叠' },
      { id: 'thought-chain-demo-destroy', label: '折叠时销毁内容' },
      { id: 'thought-chain-demo-customization', label: '客制化' },
      { id: 'thought-chain-demo-nested', label: '嵌套使用' },
      { id: 'thought-chain-demo-single', label: '单行折叠' },
    ],
  },
  {
    id: 'api',
    label: 'API',
    children: [
      { id: 'api-thought-chain', label: 'ThoughtChain' },
      { id: 'api-item-type', label: 'ThoughtChainItemType' },
      { id: 'api-item', label: 'ThoughtChain.Item' },
    ],
  },
  {
    id: 'semantic',
    label: 'Semantic DOM',
    children: [
      { id: 'semantic-chain', label: 'ThoughtChain' },
      { id: 'semantic-item', label: 'ThoughtChain.Item' },
    ],
  },
  {
    id: 'tokens',
    label: '主题变量（Design Token）',
    children: [
      { id: 'tokens-component', label: '组件 Token' },
      { id: 'tokens-global', label: '全局 Token' },
    ],
  },
];

export default function Toc() {
  const [active, setActive] = useState('when-to-use');

  useEffect(() => {
    const handler = () => {
      const anchors = [...document.querySelectorAll('[data-toc-anchor]')];
      const current = anchors
        .filter((element) => element.getBoundingClientRect().top < 140)
        .pop();
      if (current) setActive(current.dataset.tocAnchor);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const jump = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="toc">
      {TOC_DATA.map((section) => (
        <div key={section.id}>
          <div className="toc-title" onClick={() => jump(section.children?.[0]?.id ?? section.id)}>
            {section.label}
          </div>
          {section.children?.map((item) => (
            <div
              key={item.id}
              className={`toc-sub ${active === item.id ? 'active' : ''}`}
              onClick={() => jump(item.id)}
            >
              {item.label}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
