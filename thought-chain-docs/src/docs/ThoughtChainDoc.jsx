import React, { useState } from 'react';
import { Button, Card, Space, Switch } from 'antd';
import {
  CheckCircleOutlined,
  CodeOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  GithubOutlined,
  HeartOutlined,
  SearchOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { ThoughtChain } from '@ant-design/x';
import DemoBox from '../components/DemoBox.jsx';

/* ------------------------------------------------------------------ data --- */

const BASIC_ITEMS = [
  { title: 'Knowledge Query', description: 'Query knowledge base' },
  { title: 'Web Search Tool Invoked', description: 'Tool invocation' },
  { title: 'Model Invocation Complete', description: 'Invoke model for response' },
  { title: 'Response Complete', description: 'Task completed', blink: true },
];

const STATUS_SEQUENCE = ['success', 'loading', 'error', 'abort'];

function PathCode({ children }) {
  return <span className="chip-path">{children}</span>;
}

function FileChips() {
  return (
    <div className="demo-stack">
      <p style={{ margin: 0 }}>Creating folder for new component</p>
      <ThoughtChain.Item
        variant="solid"
        icon={<CodeOutlined />}
        title="Executing command"
        description={<PathCode>mkdir -p component</PathCode>}
      />
      <p style={{ margin: 0 }}>Creating files needed for new component</p>
      <ThoughtChain.Item
        variant="solid"
        icon={<EditOutlined />}
        title="Creating file"
        description={<PathCode>component/index.tsx</PathCode>}
      />
      <ThoughtChain.Item
        variant="solid"
        icon={<EditOutlined />}
        title="Creating Chinese description file for new component"
        description={<PathCode>component/index.zh-CN.md</PathCode>}
      />
      <ThoughtChain.Item
        variant="solid"
        icon={<EditOutlined />}
        title="Creating English description file for new component"
        description={<PathCode>component/index.en-US.md</PathCode>}
      />
    </div>
  );
}

function ResultChips() {
  const rows = [
    ['Folder created', 'component'],
    ['File created', 'component/index.tsx'],
    ['File created', 'component/index.zh-CN.md'],
    ['File created', 'component/index.en-US.md'],
  ];
  return (
    <div className="demo-stack">
      {rows.map(([title, path]) => (
        <ThoughtChain.Item
          key={path}
          variant="solid"
          status="success"
          title={title}
          description={<PathCode>{path}</PathCode>}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- api tables --- */

const CHAIN_PROPS = [
  ['items', '思维节点集合', 'ThoughtChainItemType[]', '-', '-'],
  ['defaultExpandedKeys', '初始化展开的节点', 'string[]', '-', '-'],
  ['expandedKeys', '当前展开的节点', 'string[]', '-', '-'],
  ['onExpand', '展开节点变化回调', '(expandedKeys: string[]) => void;', '-', '-'],
  ['line', '线条样式，为 false 时不展示线条', "boolean | 'solid' | 'dashed' | 'dotted'", "'solid'", '-'],
  [
    'classNames',
    '语义化结构的类名',
    "Record<'root' | 'item' | 'itemIcon' | 'itemHeader' | 'itemContent' | 'itemFooter', string>",
    '-',
    '-',
  ],
  ['prefixCls', '自定义前缀', 'string', '-', '-'],
  [
    'styles',
    '语义化结构的样式',
    "Record<'root' | 'item' | 'itemIcon' | 'itemHeader' | 'itemContent' | 'itemFooter', React.CSSProperties>",
    '-',
    '-',
  ],
  ['rootClassName', '根元素样式类名', 'string', '-', '-'],
];

const ITEM_TYPE_PROPS = [
  ['content', '思维节点内容', 'React.ReactNode', '-', '-'],
  ['description', '思维节点描述', 'React.ReactNode', '-', '-'],
  ['footer', '思维节点脚注', 'React.ReactNode', '-', '-'],
  ['icon', '思维节点图标, 为 false 时不展示', 'false | React.ReactNode', 'DefaultIcon', '-'],
  ['key', '思维节点唯一标识符', 'string', '-', '-'],
  ['status', '思维节点状态', "'loading' | 'success' | 'error' | 'abort'", '-', '-'],
  ['title', '思维节点标题', 'React.ReactNode', '-', '-'],
  ['collapsible', '思维节点是否可折叠', 'boolean', 'false', '-'],
  ['blink', '闪动效果', 'boolean', '-', '-'],
  ['destroyOnHidden', '隐藏时是否销毁内容节点', 'boolean', 'true', '-'],
];

const ITEM_PROPS = [
  ['prefixCls', '自定义前缀', 'string', '-', '-'],
  ['icon', '思维链图标', 'React.ReactNode', '-', '-'],
  ['title', '思维链标题', 'React.ReactNode', '-', '-'],
  ['description', '思维链描述', 'React.ReactNode', '-', '-'],
  ['status', '思维链状态', "'loading' | 'success' | 'error' | 'abort'", '-', '-'],
  ['variant', '变体配置', "'solid' | 'outlined' | 'text'", '-', '-'],
  ['blink', '闪动效果', 'boolean', '-', '-'],
];

const COMPONENT_TOKENS = [
  ['colorDescriptionDisabled', '禁用描述文字颜色', 'string', 'rgba(0,0,0,0.25)'],
  ['colorErrorBgDisabled', '错误状态禁用背景色', 'string', 'rgba(255,242,240,0.25)'],
  ['colorErrorTextDescription', '错误状态描述文字颜色', 'string', 'rgba(255,77,79,0.45)'],
  ['colorErrorTextDescriptionDisabled', '错误状态禁用描述文字颜色', 'string', 'rgba(255,77,79,0.25)'],
  ['colorErrorTextDisabled', '错误状态禁用文字颜色', 'string', 'rgba(255,77,79,0.45)'],
  ['colorPrimaryDisabled', '主要状态禁用颜色', 'string', 'rgba(22,119,255,0.45)'],
  ['colorSuccessDisabled', '成功状态禁用颜色', 'string', 'rgba(82,196,26,0.45)'],
  ['colorTextBlink', '打字动画颜色', 'string', '#000'],
  ['colorTextBlinkDefault', '默认打字动画颜色', 'string', 'rgba(0,0,0,0.45)'],
  ['colorTitleDisabled', '禁用标题文字颜色', 'string', 'rgba(0,0,0,0.45)'],
  ['iconSize', '图标容器尺寸', 'number', '14'],
  ['itemBorderRadius', 'ThoughtChain.Item 圆角', 'number', '6'],
  ['itemMotionDescription', '思维链节点描述文字的动画颜色', 'string', 'rgba(0,0,0,0.25)'],
  ['itemOutlinedBg', '边框模式的 ThoughtChain.Item 背景色', 'string', '#ffffff'],
  ['itemOutlinedHoverBg', '边框模式的 ThoughtChain.Item 悬浮态背景色', 'string', 'rgba(0,0,0,0.06)'],
  ['itemSolidBg', '实心的 ThoughtChain.Item 背景色', 'string', 'rgba(0,0,0,0.04)'],
  ['itemSolidHoverBg', '实心的 ThoughtChain.Item 悬浮态背景色', 'string', 'rgba(0,0,0,0.06)'],
];

const GLOBAL_TOKENS = [
  ['colorPrimary', '品牌主色', 'string', '#1677ff'],
  ['colorText', '文本颜色', 'string', 'rgba(0,0,0,0.88)'],
  ['colorTextSecondary', '次级文本颜色', 'string', 'rgba(0,0,0,0.65)'],
  ['colorBgContainer', '容器背景色', 'string', '#ffffff'],
  ['borderRadius', '基础圆角', 'number', '6'],
  ['fontFamily', '字体', 'string', '-apple-system, ...'],
  ['controlHeight', '控件高度', 'number', '32'],
];

function ApiTable({ columns, rows }) {
  return (
    <table className="api-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0] + row[1]}>
            {row.map((cell, index) => (
              <td
                key={index}
                className={
                  index === 0
                    ? 'api-prop'
                    : index === 1
                      ? ''
                      : index === 2
                        ? 'api-type'
                        : index === 3
                          ? 'api-default'
                          : 'api-version'
                }
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TokenTable({ rows, withSwatch = false }) {
  return (
    <table className="api-table">
      <thead>
        <tr>
          <th>Token 名称</th>
          <th>描述</th>
          <th>类型</th>
          <th>默认值</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, desc, type, value]) => (
          <tr key={name}>
            <td className="api-prop">{name}</td>
            <td>{desc}</td>
            <td className="api-type">{type}</td>
            <td className="api-default">
              {withSwatch && value.startsWith('rgba') || withSwatch && value.startsWith('#') ? (
                <span className="token-swatch" style={{ '--swatch': value }} />
              ) : null}
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* -------------------------------------------------------------------- demos --- */

function BasicDemo() {
  return (
    <Card className="demo-card">
      <ThoughtChain items={BASIC_ITEMS} />
    </Card>
  );
}

function StatusDemo() {
  const [index, setIndex] = useState(0);
  const status = STATUS_SEQUENCE[index % STATUS_SEQUENCE.length];
  return (
    <Card className="demo-card">
      <div className="demo-card-toolbar">
        <Button onClick={() => setIndex((value) => value + 1)}>Run Next</Button>
      </div>
      <ThoughtChain
        items={[
          { title: 'Thought Chain Item - 1', description: `status: ${status}`, status },
          { title: 'Thought Chain Item - 2', description: 'status: error', status: 'error' },
        ]}
      />
    </Card>
  );
}

function SimpleDemo() {
  const rows = [
    {
      label: 'loading status:',
      status: 'loading',
      title: 'Tool Calling',
    },
    {
      label: 'success status:',
      status: 'success',
      title: 'Tool Call Finished',
    },
    {
      label: 'error status:',
      status: 'error',
      title: 'Tool Call Error',
    },
    {
      label: 'abort status',
      status: 'abort',
      title: 'Agent Response Aborted',
    },
    {
      label: 'custom icon:',
      icon: <SunOutlined />,
      title: 'Task Completed',
    },
  ];

  return (
    <div>
      {rows.map((row) => (
        <div className="demo-row" key={row.label}>
          <span className="demo-row-label">{row.label}</span>
          <div className="demo-row-items">
            {['solid', 'outlined', 'text'].map((variant) => (
              <ThoughtChain.Item
                key={variant}
                variant={variant}
                status={row.status}
                icon={row.icon}
                title={row.title}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="demo-row">
        <span className="demo-row-label">click:</span>
        <div className="demo-row-items">
          <ThoughtChain.Item
            variant="solid"
            icon={<ExportOutlined />}
            title="Opening Webpage"
            description="https://x.ant.design/docs/playground/copilot"
          />
          <ThoughtChain.Item
            variant="outlined"
            icon={<EditOutlined />}
            title="Creating"
            description={<PathCode>todo.md</PathCode>}
          />
          <ThoughtChain.Item
            variant="text"
            icon={<SearchOutlined />}
            title="Searching"
            description="Route Information"
          />
          <ThoughtChain.Item
            variant="solid"
            status="error"
            icon={<ExportOutlined />}
            title="Opening Webpage"
            description="https://x.ant.design/docs/playground/copilot"
          />
          {['solid', 'outlined', 'text'].map((variant) => (
            <ThoughtChain.Item
              key={`ok-${variant}`}
              variant={variant}
              status="success"
              title="Tool Call Finished"
            />
          ))}
        </div>
      </div>
      <div className="demo-row">
        <span className="demo-row-label">blink:</span>
        <div className="demo-row-items">
          {['solid', 'outlined', 'text'].map((variant, i) => (
            <ThoughtChain.Item
              key={`blink-${variant}`}
              variant={variant}
              blink
              icon={<SunOutlined />}
              title="Task Completed"
              description={i === 2 ? 'Route Information' : undefined}
            />
          ))}
        </div>
      </div>
      <div className="demo-row">
        <span className="demo-row-label">disabled:</span>
        <div className="demo-row-items" style={{ opacity: 0.45 }}>
          {['solid', 'outlined', 'text'].map((variant) => (
            <ThoughtChain.Item
              key={`disabled-${variant}`}
              variant={variant}
              icon={<SunOutlined />}
              title="Task Completed"
            />
          ))}
          <ThoughtChain.Item
            variant="solid"
            status="error"
            icon={<ExportOutlined />}
            title="Opening Webpage"
            description="playground/copilot"
          />
        </div>
      </div>
    </div>
  );
}

const COLLAPSE_ITEMS = [
  {
    key: 'write_component',
    status: 'success',
    title: 'Create Task: Write New Component',
    description: 'Execute files needed for creating new component',
    collapsible: true,
    content: <FileChips />,
  },
  {
    key: 'check_task',
    status: 'loading',
    title: 'Checking Task Execution Steps',
    description: 'Verify overall task execution logic and feasibility',
    collapsible: true,
    content: <ResultChips />,
  },
];

function CollapsibleDemo() {
  return (
    <Card className="demo-card">
      <ThoughtChain
        items={COLLAPSE_ITEMS}
        defaultExpandedKeys={['write_component', 'check_task']}
      />
    </Card>
  );
}

function ControlledDemo() {
  const [expandedKeys, setExpandedKeys] = useState(['write_component']);
  return (
    <Card className="demo-card">
      <div className="demo-card-toolbar">
        <Button
          onClick={() =>
            setExpandedKeys((keys) =>
              keys.includes('check_task')
                ? keys.filter((key) => key !== 'check_task')
                : [...keys, 'check_task'],
            )
          }
        >
          {expandedKeys.includes('check_task') ? 'Close' : 'Open'} &quot;check_task&quot; details
        </Button>
      </div>
      <ThoughtChain
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        items={[
          {
            key: 'write_component',
            status: 'success',
            title: 'Create Task: Develop New Component',
            description: 'Execute files needed for creating new component creation',
            collapsible: true,
            content: (
              <div className="demo-collapse-content">
                <FileChips />
                <p>Checking Task Execution Steps Completion</p>
                <p>Verify the overall task execution logic and feasibility</p>
              </div>
            ),
          },
          {
            key: 'check_task',
            status: 'loading',
            title: 'Check Task Execution Steps',
            description: 'Verify the overall task execution logic and feasibility',
            collapsible: true,
            content: <ResultChips />,
          },
          {
            key: 'using_component',
            status: 'success',
            title: 'Using the New Component',
            description: 'Using the generated component to complete the task',
            collapsible: true,
            content: (
              <div className="demo-collapse-content">
                <p>File created</p>
                <ThoughtChain.Item
                  variant="solid"
                  status="success"
                  title="File created"
                  description={<PathCode>component</PathCode>}
                />
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}

function DestroyDemo() {
  const [destroyOnHidden, setDestroyOnHidden] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card className="demo-card">
      <div className="demo-card-toolbar">
        <Space>
          <Button onClick={() => setCollapsed((value) => !value)}>Collapse</Button>
          <Switch
            checked={destroyOnHidden}
            onChange={setDestroyOnHidden}
            checkedChildren="destroyOnHidden"
            unCheckedChildren="keep"
          />
        </Space>
      </div>
      <ThoughtChain
        expandedKeys={collapsed ? [] : ['task_1']}
        onExpand={() => setCollapsed(true)}
        items={[
          {
            key: 'task_1',
            title: 'Collapsible Task',
            description: 'Content will be removed from DOM when collapsed',
            collapsible: true,
            destroyOnHidden,
            content: (
              <div className="demo-collapse-content">
                <p>Task detail content.</p>
              </div>
            ),
          },
          {
            key: 'task_2',
            title: 'Normal Task',
            content: (
              <div className="demo-collapse-content">
                <p>Task2 content.</p>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}

function CustomizationDemo() {
  return (
    <Card className="demo-card">
      <ThoughtChain
        line="dashed"
        items={[
          {
            icon: <HeartOutlined style={{ color: '#eb2f96', fontSize: 18 }} />,
            title: 'Create Task',
            description: 'Thinking Process',
            content: (
              <div className="demo-collapse-content">
                <p>1. Analyze task, understand task workflow</p>
                <p>2. Task creation, files needed for task</p>
                <p>3. Task execution, using new component</p>
                <FileChips />
              </div>
            ),
            footer: (
              <Button size="small" className="demo-footer-btn">
                查看详情
              </Button>
            ),
          },
          {
            status: 'loading',
            title: 'Checking Task Execution Steps',
            description: 'Verify the overall task execution logic and feasibility',
            content: <ResultChips />,
          },
          {
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            title: 'Checking Task Execution Steps',
            description: 'Verify the overall task execution logic and feasibility',
            content: <ResultChips />,
          },
        ]}
      />
    </Card>
  );
}

function NestedDemo() {
  const nestedOne = (
    <div className="demo-nested-content">
      <ThoughtChain
        items={[
          { title: '1-1 Thought Chain Item', description: 'description' },
          { title: '1-2 Thought Chain Item', description: 'description' },
        ]}
      />
      <Button size="small" icon={<DeleteOutlined />}>
        删除节点
      </Button>
    </div>
  );

  return (
    <Card className="demo-card">
      <ThoughtChain
        items={[
          {
            key: 'outer-1',
            title: '1 - Thought Chain Item',
            description: 'description',
            content: nestedOne,
            footer: <span className="demo-hint">嵌套 ThoughtChain 组件</span>,
          },
          {
            key: 'outer-2',
            title: '2 - Thought Chain Item',
            description: 'description',
            content: (
              <div className="demo-nested-content">
                <ThoughtChain
                  items={[
                    { title: '2-1 Thought Chain Item', description: 'description' },
                    { title: '2-2 Thought Chain Item', description: 'description' },
                    { title: '2-3 Thought Chain Item', description: 'description' },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}

function SingleDemo() {
  return (
    <Card className="demo-card">
      <ThoughtChain
        defaultExpandedKeys={['single']}
        items={[
          {
            key: 'single',
            status: 'success',
            title: 'Create Task: Write New Component',
            description: 'Execute files needed for creating new component',
            collapsible: true,
            content: (
              <div className="demo-collapse-content">
                <FileChips />
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}

/* ------------------------------------------------------------------ semantic --- */

function SemanticChain() {
  return (
    <div className="semantic-wrap">
      <div className="semantic-preview">
        <Card className="demo-card" size="small">
          <ThoughtChain
            items={[
              { key: 's1', title: 'Knowledge Query', description: 'Query knowledge base' },
              { key: 's2', title: 'Response Complete', description: 'Task completed', blink: true },
            ]}
          />
        </Card>
      </div>
      <div className="semantic-list">
        {[
          ['root', '根节点'],
          ['item', '思维链节点'],
          ['itemIcon', '思维链图标'],
          ['itemHeader', '思维链节点头部'],
          ['itemContent', '思维链节点内容'],
          ['itemFooter', '思维链节点页脚'],
        ].map(([name, desc]) => (
          <div className="semantic-item" key={name}>
            <div className="name">{name}</div>
            <div className="desc">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemanticItem() {
  return (
    <div className="semantic-wrap">
      <div className="semantic-preview">
        <Card className="demo-card" size="small">
          <ThoughtChain.Item
            variant="outlined"
            status="success"
            title="Opening Webpage"
            description="https://x.ant.design/docs/playground/copilot"
          />
        </Card>
      </div>
      <div className="semantic-list">
        {[
          ['root', '根节点'],
          ['icon', '思维链图标'],
          ['title', '思维链标题'],
          ['description', '思维链节点描述'],
        ].map(([name, desc]) => (
          <div className="semantic-item" key={name}>
            <div className="name">{name}</div>
            <div className="desc">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- codes --- */

const CODES = {
  basic: `import { ThoughtChain } from '@ant-design/x';

const items = [
  { title: 'Knowledge Query', description: 'Query knowledge base' },
  { title: 'Web Search Tool Invoked', description: 'Tool invocation' },
  { title: 'Model Invocation Complete', description: 'Invoke model for response' },
  { title: 'Response Complete', description: 'Task completed', blink: true },
];

export default () => <ThoughtChain items={items} />;`,
  status: `import { useState } from 'react';
import { Button } from 'antd';
import { ThoughtChain } from '@ant-design/x';

const statuses = ['success', 'loading', 'error', 'abort'];

export default () => {
  const [index, setIndex] = useState(0);
  const status = statuses[index % statuses.length];
  return (
    <>
      <Button onClick={() => setIndex((i) => i + 1)}>Run Next</Button>
      <ThoughtChain
        items={[
          { title: 'Thought Chain Item - 1', description: 'status: ' + status, status },
          { title: 'Thought Chain Item - 2', description: 'status: error', status: 'error' },
        ]}
      />
    </>
  );
};`,
  simple: `import { ThoughtChain } from '@ant-design/x';

export default () => (
  <>
    <ThoughtChain.Item variant="solid" status="loading" title="Tool Calling" />
    <ThoughtChain.Item variant="outlined" status="loading" title="Tool Calling" />
    <ThoughtChain.Item variant="text" status="loading" title="Tool Calling" />
  </>
);`,
  collapsible: `import { ThoughtChain } from '@ant-design/x';

<ThoughtChain
  items={[
    {
      title: 'Create Task: Write New Component',
      description: 'Execute files needed for creating new component',
      collapsible: true,
      content: <FileChips />,
    },
  ]}
/>;`,
  controlled: `const [expandedKeys, setExpandedKeys] = useState(['write_component']);

<ThoughtChain
  expandedKeys={expandedKeys}
  onExpand={(keys) => setExpandedKeys(keys)}
  items={items}
/>;`,
  destroy: `<ThoughtChain
  items={[
    {
      key: 'task_1',
      title: 'Collapsible Task',
      collapsible: true,
      destroyOnHidden,
      content: 'Task detail content.',
    },
    { key: 'task_2', title: 'Normal Task', content: 'Task2 content.' },
  ]}
/>;`,
  customization: `<ThoughtChain
  line="dashed"
  items={[
    {
      icon: <HeartOutlined style={{ color: '#eb2f96' }} />,
      title: 'Create Task',
      description: 'Thinking Process',
      content: <CustomContent />,
      footer: <Button size="small">查看详情</Button>,
    },
    { status: 'loading', title: 'Checking Task Execution Steps' },
  ]}
/>;`,
  nested: `<ThoughtChain
  items={[
    {
      title: '1 - Thought Chain Item',
      content: (
        <ThoughtChain
          items={[
            { title: '1-1 Thought Chain Item', description: 'description' },
            { title: '1-2 Thought Chain Item', description: 'description' },
          ]}
        />
      ),
    },
  ]}
/>;`,
  single: `<ThoughtChain
  items={[
    {
      title: 'Create Task: Write New Component',
      collapsible: true,
      description: 'Execute files needed for creating new component',
      content: <FileChips />,
    },
  ]}
/>;`,
};

/* ---------------------------------------------------------------------- doc --- */

export default function ThoughtChainDoc() {
  const [tokenTab, setTokenTab] = useState('component');

  return (
    <article className="doc">
      <h1>ThoughtChain 思维链</h1>
      <p className="doc-intro">
        思维链组件用于可视化和追踪 Agent 对 Actions 和 Tools 的调用链。
      </p>

      <div className="meta-list">
        <div className="meta-row">
          <span className="meta-label">使用</span>
          <span className="meta-value meta-code">
            import {'{'} ThoughtChain {'}'} from &quot;@ant-design/x&quot;;
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-label">源码</span>
          <span className="meta-value">
            <span className="meta-link">
              <GithubOutlined /> x/components/thought-chain
            </span>
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-label">文档</span>
          <span className="meta-value meta-sep">
            <span className="meta-link">
              <EditOutlined /> 编辑此页
            </span>
            <span className="meta-link">
              <ExportOutlined /> 更新日志
            </span>
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-label">版本</span>
          <span className="meta-value">
            自 <span className="meta-code">2.0.0</span> 起支持
          </span>
        </div>
      </div>

      <h2 id="when-to-use" data-toc-anchor="when-to-use">
        何时使用
      </h2>
      <ul className="bullet-list">
        <li>调试和跟踪复杂 Agent System 中的调用链</li>
        <li>类似的链式场景中使用</li>
      </ul>

      <h2 id="demos" data-toc-anchor="demos">
        代码演示
      </h2>

      <DemoBox
        id="thought-chain-demo-basic"
        title="基本"
        description="基础用法。"
        code={CODES.basic}
      >
        <BasicDemo />
      </DemoBox>

      <DemoBox
        id="thought-chain-demo-status"
        title="节点状态"
        description="思维链节点支持配置 status 属性来明显的表明当前节点的执行状态"
        code={CODES.status}
      >
        <StatusDemo />
      </DemoBox>

      <DemoBox
        id="thought-chain-demo-simple"
        title="简洁思维链"
        description="简洁思维链，提供不同的类型可供选择。"
        code={CODES.simple}
      >
        <SimpleDemo />
      </DemoBox>

      <DemoBox
        id="thought-chain-demo-collapsible"
        title="可折叠的"
        description="配置 collapsible 可开启对思维链节点内容区域的折叠功能"
        code={CODES.collapsible}
      >
        <CollapsibleDemo />
      </DemoBox>

      <DemoBox
        id="thought-chain-demo-controlled"
        title="受控的折叠"
        description="受控的思维链节点内容区域的折叠功能。"
        code={CODES.controlled}
      >
        <ControlledDemo />
      </DemoBox>

      <DemoBox
        id="thought-chain-demo-destroy"
        title="折叠时销毁内容"
        description="折叠时是否销毁内容节点。"
        code={CODES.destroy}
      >
        <DestroyDemo />
      </DemoBox>

      <DemoBox
        id="thought-chain-demo-customization"
        title="客制化"
        description="items 属性支持灵活的客制化配置，详情参考 ThoughtChainItemType 定义"
        code={CODES.customization}
      >
        <CustomizationDemo />
      </DemoBox>

      <DemoBox
        id="thought-chain-demo-nested"
        title="嵌套使用"
        description="ThoughtChain 组件支持嵌套使用"
        code={CODES.nested}
      >
        <NestedDemo />
      </DemoBox>

      <DemoBox
        id="thought-chain-demo-single"
        title="单行折叠"
        description="单行折叠。"
        code={CODES.single}
      >
        <SingleDemo />
      </DemoBox>

      <h2 id="api" data-toc-anchor="api">
        API
      </h2>
      <p className="table-note">通用属性参考：通用属性</p>

      <div id="api-thought-chain" data-toc-anchor="api-thought-chain">
        <h3 className="api-section-title">ThoughtChainProps</h3>
        <ApiTable columns={['属性', '说明', '类型', '默认值', '版本']} rows={CHAIN_PROPS} />
      </div>

      <div id="api-item-type" data-toc-anchor="api-item-type">
        <h3 className="api-section-title">ThoughtChainItemType</h3>
        <ApiTable columns={['属性', '说明', '类型', '默认值', '版本']} rows={ITEM_TYPE_PROPS} />
      </div>

      <div id="api-item" data-toc-anchor="api-item">
        <h3 className="api-section-title">ThoughtChain.Item</h3>
        <ApiTable columns={['属性', '说明', '类型', '默认值', '版本']} rows={ITEM_PROPS} />
      </div>

      <h2 id="semantic" data-toc-anchor="semantic">
        Semantic DOM
      </h2>
      <div id="semantic-chain" data-toc-anchor="semantic-chain">
        <h3 className="api-section-title">ThoughtChain</h3>
        <SemanticChain />
      </div>
      <div id="semantic-item" data-toc-anchor="semantic-item">
        <h3 className="api-section-title">ThoughtChain.Item</h3>
        <SemanticItem />
      </div>

      <h2 id="tokens" data-toc-anchor="tokens">
        主题变量（Design Token）
      </h2>
      <h3 className="api-section-title" id="tokens-component" data-toc-anchor="tokens-component">
        {tokenTab === 'component' ? '组件 Token 如何定制？' : '全局 Token 如何定制？'}
      </h3>
      <div className="token-tabs">
        <span
          className={`token-tab ${tokenTab === 'component' ? 'active' : ''}`}
          onClick={() => setTokenTab('component')}
        >
          组件 Token
        </span>
        <span
          className={`token-tab ${tokenTab === 'global' ? 'active' : ''}`}
          onClick={() => setTokenTab('global')}
        >
          全局 Token
        </span>
      </div>
      <div id="tokens-global" data-toc-anchor="tokens-global">
        {tokenTab === 'component' ? (
          <TokenTable rows={COMPONENT_TOKENS} withSwatch />
        ) : (
          <TokenTable rows={GLOBAL_TOKENS} withSwatch />
        )}
      </div>

      <div className="doc-footer">
        Ant Design X · ThoughtChain 组件文档本地复刻版 · 基于 React + @ant-design/x
      </div>
    </article>
  );
}
