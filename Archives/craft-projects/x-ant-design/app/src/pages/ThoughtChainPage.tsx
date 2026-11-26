import DocLayout from '../components/DocLayout';
import DemoCard from '../components/DemoCard';
import ApiTable from '../components/ApiTable';
import SemanticDom from '../components/SemanticDom';
import TokenTable, { type Token } from '../components/TokenTable';
import { ThoughtChain } from '@ant-design/x';

import BasicDemo from '../demos/BasicDemo';
import NodeStatusDemo from '../demos/NodeStatusDemo';
import ConciseDemo from '../demos/ConciseDemo';
import CollapsibleDemo from '../demos/CollapsibleDemo';
import ControlledCollapseDemo from '../demos/ControlledCollapseDemo';
import DestroyOnHiddenDemo from '../demos/DestroyOnHiddenDemo';
import CustomDemo from '../demos/CustomDemo';
import NestedDemo from '../demos/NestedDemo';
import SingleLineCollapseDemo from '../demos/SingleLineCollapseDemo';

const anchor = [
  { id: 'when-to-use', title: '何时使用' },
  { id: 'demos', title: '代码演示' },
  { id: 'demo-basic', title: '基本', level: 1 as const },
  { id: 'demo-node-status', title: '节点状态', level: 1 as const },
  { id: 'demo-concise', title: '简洁思维链', level: 1 as const },
  { id: 'demo-collapsible', title: '可折叠的', level: 1 as const },
  { id: 'demo-controlled', title: '受控的折叠', level: 1 as const },
  { id: 'demo-destroy', title: '折叠时销毁内容', level: 1 as const },
  { id: 'demo-custom', title: '客制化', level: 1 as const },
  { id: 'demo-nested', title: '嵌套使用', level: 1 as const },
  { id: 'demo-single', title: '单行折叠', level: 1 as const },
  { id: 'api', title: 'API' },
  { id: 'semantic-dom', title: 'Semantic DOM' },
  { id: 'design-token', title: '主题变量' },
];

const componentTokens: Token[] = [
  { name: 'colorDescriptionDisabled', desc: '禁用描述文字颜色', type: 'string', def: 'rgba(0,0,0,0.25)', color: 'rgba(0,0,0,0.25)' },
  { name: 'colorErrorBgDisabled', desc: '错误状态禁用背景色', type: 'string', def: 'rgba(255,242,240,0.25)', color: 'rgba(255,242,240,0.25)' },
  { name: 'colorErrorTextDescription', desc: '错误状态描述文字颜色', type: 'string', def: 'rgba(255,77,79,0.45)', color: 'rgba(255,77,79,0.45)' },
  { name: 'colorErrorTextDescriptionDisabled', desc: '错误状态禁用描述文字颜色', type: 'string', def: 'rgba(255,77,79,0.25)', color: 'rgba(255,77,79,0.25)' },
  { name: 'colorErrorTextDisabled', desc: '错误状态禁用文字颜色', type: 'string', def: 'rgba(255,77,79,0.45)', color: 'rgba(255,77,79,0.45)' },
  { name: 'colorPrimaryDisabled', desc: '主要状态禁用颜色', type: 'string', def: 'rgba(22,119,255,0.45)', color: 'rgba(22,119,255,0.45)' },
  { name: 'colorSuccessDisabled', desc: '成功状态禁用颜色', type: 'string', def: 'rgba(82,196,26,0.45)', color: 'rgba(82,196,26,0.45)' },
  { name: 'colorTextBlink', desc: '打字动画颜色', type: 'string', def: '#000', color: '#000' },
  { name: 'colorTextBlinkDefault', desc: '默认打字动画颜色', type: 'string', def: 'rgba(0,0,0,0.45)', color: 'rgba(0,0,0,0.45)' },
  { name: 'colorTitleDisabled', desc: '禁用标题文字颜色', type: 'string', def: 'rgba(0,0,0,0.45)', color: 'rgba(0,0,0,0.45)' },
  { name: 'iconSize', desc: '图标容器尺寸', type: 'number', def: '14' },
  { name: 'itemBorderRadius', desc: 'ThoughtChain.Item 圆角', type: 'number', def: '6' },
  { name: 'itemMotionDescription', desc: '思维链节点描述文字的动画颜色', type: 'string', def: 'rgba(0,0,0,0.25)', color: 'rgba(0,0,0,0.25)' },
  { name: 'itemOutlinedBg', desc: '边框模式的 ThoughtChain.Item 背景色', type: 'string', def: '#ffffff', color: '#ffffff' },
  { name: 'itemOutlinedHoverBg', desc: '边框模式的 ThoughtChain.Item 悬浮态背景色', type: 'string', def: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.06)' },
  { name: 'itemSolidBg', desc: '实心的 ThoughtChain.Item 背景色', type: 'string', def: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.04)' },
  { name: 'itemSolidHoverBg', desc: '实心的 ThoughtChain.Item 悬浮态背景色', type: 'string', def: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.06)' },
];

const globalTokens: Token[] = [];

export default function ThoughtChainPage() {
  return (
    <DocLayout anchor={anchor}>
      <h1 className="page-h1">ThoughtChain 思维链</h1>

      <h2 id="when-to-use" className="page-h2">何时使用</h2>
      <ul className="page-list">
        <li>用于展示 AI 的思考过程，以可视化的方式呈现当前的执行状态。</li>
        <li>适合在对话流中表达一个有明确步骤、状态与结果的任务。</li>
      </ul>

      <h2 id="demos" className="page-h2">代码演示</h2>

      <div id="demo-basic" className="demo-anchor">
        <DemoCard id="" title="基本" description="基础用法。">
          <BasicDemo />
        </DemoCard>
      </div>

      <div id="demo-node-status" className="demo-anchor">
        <DemoCard id="" title="节点状态" description="思维链节点支持配置 status 属性来明显的表明当前节点的执行状态。">
          <NodeStatusDemo />
        </DemoCard>
      </div>

      <div id="demo-concise" className="demo-anchor">
        <DemoCard id="" title="简洁思维链" description="简洁思维链，提供不同的类型可供选择。">
          <ConciseDemo />
        </DemoCard>
      </div>

      <div id="demo-collapsible" className="demo-anchor">
        <DemoCard id="" title="可折叠的" description={'配置 collapsible 可开启对思维链节点内容区域的折叠功能。'}>
          <CollapsibleDemo />
        </DemoCard>
      </div>

      <div id="demo-controlled" className="demo-anchor">
        <DemoCard id="" title="受控的折叠" description="受控的思维链节点内容区域的折叠功能。">
          <ControlledCollapseDemo />
        </DemoCard>
      </div>

      <div id="demo-destroy" className="demo-anchor">
        <DemoCard id="" title="折叠时销毁内容" description="折叠时是否销毁内容节点。">
          <DestroyOnHiddenDemo />
        </DemoCard>
      </div>

      <div id="demo-custom" className="demo-anchor">
        <DemoCard id="" title="客制化" description="items 属性支持灵活的客制化配置，详情参考 ThoughtChainItemType 定义。">
          <CustomDemo />
        </DemoCard>
      </div>

      <div id="demo-nested" className="demo-anchor">
        <DemoCard id="" title="嵌套使用" description="ThoughtChain 组件支持嵌套使用。">
          <NestedDemo />
        </DemoCard>
      </div>

      <div id="demo-single" className="demo-anchor">
        <DemoCard id="" title="单行折叠" description="单行折叠。">
          <SingleLineCollapseDemo />
        </DemoCard>
      </div>

      <h2 id="api" className="page-h2">API</h2>
      <p className="api-link-line">
        通用属性参考：<a href="#api">通用属性</a>
      </p>

      <h3 className="page-h3">ThoughtChainProps</h3>
      <ApiTable
        rows={[
          { name: 'items', desc: '思维节点集合', type: 'ThoughtChainItemType[]' },
          { name: 'defaultExpandedKeys', desc: '初始化展开的节点', type: 'string[]' },
          { name: 'expandedKeys', desc: '当前展开的节点', type: 'string[]' },
          { name: 'onExpand', desc: '展开节点变化回调', type: '(expandedKeys: string[]) => void' },
          { name: 'line', desc: "线条样式，为false 时不展示线条", type: "boolean | 'solid' | 'dashed' | 'dotted‌'", def: "'solid'" },
          { name: 'classNames', desc: '语义化结构的类名', type: "Record<'root' | 'item' | 'itemIcon' | 'itemHeader' | 'itemContent' | 'itemFooter', string>" },
          { name: 'prefixCls', desc: '自定义前缀', type: 'string' },
          { name: 'styles', desc: '语义化结构的样式', type: "Record<'root' | 'item' | 'itemIcon' | 'itemHeader' | 'itemContent' | 'itemFooter', React.CSSProperties>" },
          { name: 'rootClassName', desc: '根元素样式类名', type: 'string' },
        ]}
      />

      <h3 className="page-h3">ThoughtChainItemType</h3>
      <ApiTable
        rows={[
          { name: 'content', desc: '思维节点内容', type: 'React.ReactNode' },
          { name: 'description', desc: '思维节点描述', type: 'React.ReactNode' },
          { name: 'footer', desc: '思维节点脚注', type: 'React.ReactNode' },
          { name: 'icon', desc: '思维节点图标，为false时不展示', type: 'false | React.ReactNode', def: 'DefaultIcon' },
          { name: 'key', desc: '思维节点唯一标识符', type: 'string' },
          { name: 'status', desc: '思维节点状态', type: "'loading' | 'success' | 'error' | 'abort'" },
          { name: 'title', desc: '思维节点标题', type: 'React.ReactNode' },
          { name: 'collapsible', desc: '思维节点是否可折叠', type: 'boolean', def: 'false' },
          { name: 'blink', desc: '闪动效果', type: 'boolean' },
          { name: 'destroyOnHidden', desc: '隐藏时是否销毁内容节点', type: 'boolean', def: 'true' },
        ]}
      />

      <h3 className="page-h3">ThoughtChain.Item</h3>
      <ApiTable
        rows={[
          { name: 'prefixCls', desc: '自定义前缀', type: 'string' },
          { name: 'icon', desc: '思维链图标', type: 'React.ReactNode' },
          { name: 'title', desc: '思维链标题', type: 'React.ReactNode' },
          { name: 'description', desc: '思维链描述', type: 'React.ReactNode' },
          { name: 'status', desc: '思维链状态', type: "'loading' | 'success' | 'error' | 'abort'" },
          { name: 'variant', desc: '变体配置', type: "'solid' | 'outlined' | 'text'" },
          { name: 'blink', desc: '闪动效果', type: 'boolean' },
        ]}
      />

      <h2 id="semantic-dom" className="page-h2">Semantic DOM</h2>

      <h3 className="page-h3">ThoughtChain</h3>
      <SemanticDom
        preview={
          <ThoughtChain
            items={[
              {
                key: 's',
                title: 'Thought Chain Item Title',
                description: 'description',
                content: 'Thought Chain Item Content',
                footer: 'Thought Chain Item Footer',
              },
            ]}
            defaultExpandedKeys={['s']}
            style={{ width: 420, background: '#fff', borderRadius: 8 }}
          />
        }
        nodes={[
          { key: 'root', desc: '根节点' },
          { key: 'item', desc: '思维链节点' },
          { key: 'itemIcon', desc: '思维链图标' },
          { key: 'itemHeader', desc: '思维链节点头部' },
          { key: 'itemContent', desc: '思维链节点内容' },
          { key: 'itemFooter', desc: '思维链节点页脚' },
        ]}
      />

      <h3 className="page-h3">ThoughtChain.Item</h3>
      <SemanticDom
        preview={
          <div style={{ width: 360, background: '#fff', borderRadius: 8, padding: 16 }}>
            <ThoughtChain.Item
              variant="outlined"
              title="Opening Webpage"
              description="https://x.ant.design/docs/playground/copilot"
            />
          </div>
        }
        nodes={[
          { key: 'root', desc: '根节点' },
          { key: 'icon', desc: '思维链图标' },
          { key: 'title', desc: '思维链标题' },
          { key: 'description', desc: '思维链节点描述' },
        ]}
      />

      <h2 id="design-token" className="page-h2">
        主题变量（Design Token）
      </h2>
      <TokenTable componentTokens={componentTokens} globalTokens={globalTokens} />
    </DocLayout>
  );
}
