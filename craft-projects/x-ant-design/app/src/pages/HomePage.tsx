import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeHeader from '../components/HomeHeader';
import './HomePage.css';

const STEPS = [
  {
    n: '1. 唤醒',
    title: '轻松唤醒，即刻吸引',
    desc: '可以让首次接触的用户快速理解AI能做什么，告知用户AI可实现的意图范围，降低用户成本',
    cta: '从唤醒开始',
    color: '#1677ff',
  },
  {
    n: '2. 表达',
    title: '简单表达，随时反馈',
    desc: '让用户知道如何快捷且正确的表达意图，减少AI的不理解风险，看清自己发送的内容',
    cta: '从表达开始',
    color: '#13c2c2',
  },
  {
    n: '3. 确认',
    title: '过程确认，尽在掌握',
    desc: '让用户知道该任务的AI执行运转情况，缓解用户等待焦虑，有掌控感',
    cta: '从确认开始',
    color: '#722ed1',
  },
  {
    n: '4. 反馈',
    title: '结果反馈，谁能不信',
    desc: '让用户清晰看到并信任AI任务完成的情况，并快速应用AI生成结果',
    cta: '从反馈开始',
    color: '#fa8c16',
  },
];

const SCENES = [
  { tab: 'Web 嵌入式', sub: '界面操作为主，偶尔唤起AI指令' },
  { tab: 'Web 独立式', sub: '自然语言为主，几乎没有界面操作' },
  { tab: 'Web 助手式', sub: '自然语言和界面操作均衡配合使用' },
] as const;

const COMP_CARDS = [
  { tag: '欢迎组件', phase: '唤醒', badge: null, desc: '开箱即用、易于配置、极致体验的通用图表库', preview: 'welcome' },
  { tag: '用户推荐', phase: '唤醒', badge: 'HR', desc: '让首次接触AI产品的用户快速理解AI能做什么', preview: 'recommend' },
  { tag: '快捷命令', phase: '表达', badge: 'HR', desc: '开箱即用、易于配置、极致体验的通用图表库', preview: 'prompt' },
  { tag: '进度加载', phase: '确认', badge: 'HR', desc: '开箱即用、易于配置、极致体验的通用图表库', preview: 'progress' },
  { tag: '结果操作', phase: '反馈', badge: 'HR', desc: '开箱即用、易于配置、极致体验的通用图表库', preview: 'result' },
  { tag: '管理对话', phase: '通用', badge: 'HR', desc: '开箱即用、易于配置、极致体验的通用图表库', preview: 'manage' },
] as const;

function FauxApp() {
  return (
    <div className="faux-app">
      <div className="faux-titlebar">
        <span className="faux-dot" />
        <span className="faux-title">你好，我是全新AI产品创造助手</span>
      </div>
      <div className="faux-body">
        <div className="faux-greet">
          <div className="faux-avatar">X</div>
          <div>
            <div className="faux-greet-title">基于 Ant Design 的 AGI 产品智能解决方案</div>
            <div className="faux-greet-sub">创造更美好的智能视界</div>
          </div>
        </div>
        <div className="faux-grid">
          <div className="faux-col">
            <div className="faux-col-title">热门话题</div>
            {['Ant Design X 主要升级了什么？', 'Ant Design X 诞生背景及研发初衷？', 'Ant Design X 支持生产部署吗？'].map((t) => (
              <div className="faux-row" key={t}>
                <span className="faux-q">Q</span>
                {t}
              </div>
            ))}
          </div>
          <div className="faux-col">
            <div className="faux-chip">🎨 角色 AI 智能的艺术及表达能力</div>
            <div className="faux-chip">💬 对话 AI 与你共创用户产品价值</div>
            <div className="faux-chip">✨ 意图 AI 智能的艺术及创作能力</div>
          </div>
        </div>
        <div className="faux-input">
          <span>Ant Design X 全新升级了什么？</span>
          <span className="faux-send">→</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [scene, setScene] = useState(0);

  return (
    <div className="home">
      <HomeHeader />
      <main>
      {/* ---- hero ---- */}
      <section className="hp-hero">
        <div className="hp-container">
          <h1 className="hp-hero-title">
            Ant Des<span className="hp-i">i</span>gn X
          </h1>
          <h2 className="hp-hero-sub">AI 体验新秩序</h2>
          <p className="hp-hero-desc">
            Ant Design 团队匠心呈现
            <br />
            RICH 设计范式，打造卓越 AI 界面解决方案，引领智能新体验。
          </p>
          <div className="hp-hero-cta">
            <Link to="/components/introduce-cn/" className="hp-btn primary">
              开始使用
            </Link>
            <Link to="/docs/spec/introduce-cn" className="hp-btn ghost">
              设计语言
            </Link>
          </div>
        </div>
      </section>

      {/* ---- RICH paradigm ---- */}
      <section className="hp-section">
        <div className="hp-container">
          <h2 className="hp-h2">AI 设计范式 - RICH</h2>
          <p className="hp-section-desc">
            我们致力于构建 AI 设计理论，并在蚂蚁内部海量 AI
            产品中实践、迭代。在此过程中，RICH
            设计范式应运而生：角色（Role）、意图（Intention）、会话（Conversation）和混合界面（Hybrid
            UI）
          </p>
          <div className="rich-diagram" aria-hidden>
            <div className="rich-node role">
              <span className="rich-emoji">🎭</span>
              <span>Role</span>
            </div>
            <div className="rich-node intention">
              <span className="rich-emoji">❤️</span>
              <span>Intention</span>
            </div>
            <div className="rich-node conversation">
              <span className="rich-emoji">💬</span>
              <span>Conversation</span>
            </div>
            <div className="rich-node hybrid">
              <span className="rich-emoji">🖥️</span>
              <span>Hybrid UI</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- solution steps ---- */}
      <section className="hp-section">
        <div className="hp-container">
          <h2 className="hp-h2">AI 界面解决方案</h2>
          <p className="hp-section-desc">
            基于RICH，延续熟悉的 Ant Design
            设计语言，全新 AGI 混合界面（Hybrid-UI）解决方案，完美融合 GUI
            和自然会话交互。从唤醒到表达，从过程到反馈，合适的组件恰当的呈现在所有的人机互动过程中。
          </p>
          <div className="step-list">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-n" style={{ color: s.color }}>
                  {s.n}
                </div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                <button type="button" className="step-cta">
                  {s.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- try scenes ---- */}
      <section className="hp-section">
        <div className="hp-container">
          <h2 className="hp-h2">试一试，多种 AI 场景体验</h2>
          <p className="hp-section-desc">提供多场景解决方案，帮助用户提高与 AI 协作效率</p>

          <div className="scene-tabs">
            {SCENES.map((s, i) => (
              <button
                key={s.tab}
                type="button"
                onClick={() => setScene(i)}
                className={scene === i ? 'scene-tab active' : 'scene-tab'}
              >
                <span className="scene-name">{s.tab}</span>
                <span className="scene-sub">{s.sub}</span>
              </button>
            ))}
          </div>

          <FauxApp />
        </div>
      </section>

      {/* ---- components ---- */}
      <section className="hp-section">
        <div className="hp-container">
          <h2 className="hp-h2">组件丰富，选用自如</h2>
          <p className="hp-section-desc">
            Ant Design X 全新 AI 组件，大量实用组件满足你的需求，灵活定制与拓展
          </p>
          <div className="comp-cards">
            {COMP_CARDS.map((c) => (
              <div className="comp-card" key={c.tag}>
                <div className={`comp-preview ${c.preview}`}>
                  <div className="comp-mini" />
                </div>
                <div className="comp-meta">
                  <span className="comp-name">{c.tag}</span>
                  <span className="comp-phase">{c.phase}</span>
                </div>
                <p className="comp-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- framework ---- */}
      <section className="hp-framework">
        <div className="hp-container">
          <h2 className="hp-h2 light">AI 设计语言与研发框架</h2>
          <p className="hp-section-desc light">配套生态，让你快速搭建网站应用</p>

          <div className="fw-card">
            <div className="fw-icon">📘</div>
            <div className="fw-name">RICH 设计指南</div>
            <div className="fw-desc">意图、角色、会话、混合 UI</div>
          </div>
          <div className="fw-card">
            <div className="fw-icon">Aa</div>
            <div className="fw-name">组件设计指引</div>
            <div className="fw-desc">全局样式、设计模式</div>
          </div>
          <div className="fw-card">
            <div className="fw-icon">🧩</div>
            <div className="fw-name">组件库</div>
            <div className="fw-desc">Ant Design of React / Angular / Vue</div>
            <div className="fw-links">
              <div className="fw-link">Ant Design　企业级 UI 设计语言和 React 组件库</div>
              <div className="fw-link">Ant Design Mobile　Ant Design移动端 UI 组件库</div>
              <div className="fw-link">AntV　全新一代数据可视化解决方案</div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}
