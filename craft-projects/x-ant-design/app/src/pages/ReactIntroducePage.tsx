import DocLayout from '../components/DocLayout';
import SiteFooter from '../components/SiteFooter';
import { reactMenu } from '../data/docsMenus';

const anchor = [
  { id: 'who-use', title: '谁在使用' },
  { id: 'contribute', title: '如何贡献' },
  { id: 'community', title: '社区互助' },
];

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

function Feature({
  pkg,
  tag,
  children,
}: {
  pkg: string;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <p style={{ margin: '0 0 20px' }}>
      <code className="ic">{pkg}</code> - {tag}
      <br />
      {children}
    </p>
  );
}

export default function ReactIntroducePage() {
  return (
    <DocLayout
      anchor={anchor}
      menu={reactMenu}
      navLabel="研发导航"
      footer={<SiteFooter />}
    >
      <div className="doc-prose">
        <h1 className="page-h1">
          Ant Design X ｜AI界面解决方案
          <Pencil />
        </h1>

        <p>
          Ant Design X 是一款 AI 应用复合工具集，融合了 UI 组件库、流式 Markdown
          渲染引擎和 AI SDK，为开发者提供构建下一代 AI 驱动应用的完整工具链。
        </p>

        <Feature pkg="@ant-design/x" tag="智能界面构建框架">
          基于 Ant Design 设计体系的 React UI 库、专为 AI
          驱动界面设计，开箱即用的智能对话组件、无缝集成 API
          服务，快速搭建智能应用界面，查看详情请点击<a href="#">这里</a>。
        </Feature>

        <Feature pkg="@ant-design/x-markdown" tag="高性能流式渲染引擎">
          专为流式内容优化的 Markdown
          渲染解决方案、强大的扩展能力，支持公式、代码高亮、mermaid
          图表等极致性能表现，确保流畅的内容展示体验。查看详情请点击<a href="#">这里</a>。
        </Feature>

        <Feature pkg="@ant-design/x-card" tag="动态卡片渲染器">
          基于 A2UI 协议的动态卡片渲染组件，让 AI Agent 通过结构化 JSON
          消息流动态构建交互式界面。支持流式渲染、数据绑定和响应式更新，适用于 AI
          助手界面、智能表单、数据可视化等场景。查看详情请点击<a href="#">这里</a>。
        </Feature>

        <Feature pkg="@ant-design/x-sdk" tag="AI 对话数据流管理">
          提供完整的工具 API 集合、开箱即用的 AI
          对话应用数据流管理、简化开发流程，提升开发效率。查看详情请点击
          <a href="#">这里</a>。
        </Feature>

        <Feature pkg="@ant-design/x-skill" tag="智能技能库">
          是专为 Ant Design X
          打造的智能技能库，提供了一系列精心设计的 Agent 技能。这些技能能够显著提升开发效率，帮助您快速构建高质量的
          AI
          对话应用，并有效解决开发过程中遇到的各种问题，详情点击<a href="#">这里</a>。
        </Feature>

        <div
          aria-hidden
          style={{
            height: 180,
            margin: '32px 0',
            borderRadius: 16,
            background:
              'linear-gradient(120deg, #e6f4ff 0%, #f9f0ff 55%, #fff0f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            fontSize: 40,
          }}
        >
          <span style={{ color: '#1677ff' }}>X</span>
          <span style={{ color: 'rgba(0,0,0,0.25)' }}>+</span>
          <span style={{ color: '#61dafb' }}>⚛</span>
          <span style={{ color: 'rgba(0,0,0,0.25)' }}>+</span>
          <span style={{ color: '#722ed1' }}>M↓</span>
        </div>

        <h2 id="who-use" className="page-h2">谁在使用</h2>
        <p>
          Ant Design X 广泛用于蚂蚁集团内由 AI 驱动的用户交互界面。如果你的公司和产品使用了
          Ant Design X，欢迎到<a href="#">这里</a>留言。
        </p>

        <h2 id="contribute" className="page-h2">如何贡献</h2>
        <p>
          在任何形式的参与前，请先阅读<a href="#">贡献者文档</a>。如果你希望参与贡献，欢迎提交
          <a href="#"> Pull Request</a>，或给我们<a href="#">报告 Bug</a>。
        </p>
        <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>
          强烈推荐阅读《提问的智慧》、《如何向开源社区提问题》 和
          《如何有效地报告 Bug》、《如何向开源项目提交无法解答的问题》，更好的问题更容易获得帮助。
        </p>

        <h2 id="community" className="page-h2">社区互助</h2>
        <p>
          如果您在使用的过程中碰到问题，可以通过下面几个途径寻求帮助，同时我们也鼓励资深用户通过下面的途径给新人提供帮助。
        </p>
        <p>
          通过 GitHub Discussions 提问时，建议使用 Q&amp;A 标签。
        </p>
        <ol style={{ paddingLeft: 24 }}>
          <li>
            <a href="#">GitHub Discussions</a>
          </li>
          <li>
            <a href="#">GitHub Issues</a>
          </li>
        </ol>
      </div>
    </DocLayout>
  );
}
