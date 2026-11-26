import DocLayout from '../components/DocLayout';
import { specMenu } from '../data/docsMenus';

const anchor = [
  { id: 'what', title: '一、What' },
  { id: 'why', title: '二、WHY' },
  { id: 'how', title: '三、How' },
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

/* A faux-figure block: soft gradient panel with a centered caption. */
function Figure({
  title,
  tone = 'blue',
  tall = false,
  children,
}: {
  title: string;
  tone?: 'blue' | 'green' | 'purple' | 'dark';
  tall?: boolean;
  children?: React.ReactNode;
}) {
  const grads: Record<string, string> = {
    blue: 'linear-gradient(135deg,#e6f4ff 0%,#f0f7ff 45%,#f9f0ff 100%)',
    green: 'linear-gradient(135deg,#f6ffed 0%,#fff 60%,#e6fffb 100%)',
    purple: 'linear-gradient(135deg,#f9f0ff 0%,#fff0f6 55%,#e6f4ff 100%)',
    dark: 'linear-gradient(135deg,#1f2a44 0%,#312164 60%,#0e3a52 100%)',
  };
  return (
    <figure
      style={{
        margin: '24px 0',
        borderRadius: 12,
        background: grads[tone],
        border: '1px solid rgba(5,5,5,0.06)',
        padding: tall ? '40px 24px 20px' : '28px 24px 16px',
      }}
    >
      <div
        style={{
          minHeight: tall ? 180 : 110,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: tone === 'dark' ? '#fff' : 'rgba(0,0,0,0.55)',
        }}
      >
        {children}
        <span style={{ fontSize: 15, fontWeight: 500 }}>{title}</span>
      </div>
    </figure>
  );
}

export default function SpecIntroducePage() {
  return (
    <DocLayout anchor={anchor} menu={specMenu} navLabel="设计导航">
      <div className="doc-prose">
        <h1 className="page-h1">
          RICH 设计范式简介
          <Pencil />
        </h1>

        <Figure title="RICH AI 界面设计范式" tone="purple" tall>
          <div style={{ display: 'flex', gap: 20, fontSize: 30 }}>
            <span>🧭</span>
            <span>❤️</span>
            <span>💬</span>
            <span>🖥️</span>
          </div>
        </Figure>

        <p>
          2022 年 11 月 30 日，OpenAI 发布 ChatGPT
          3.5，带领人类走向 AGI 人机交互新世纪。AGI
          让自然人机交互成为现实，「语言」这一简单、自然的交互方式，一度威胁到统治人机交互领域长达几十年之久的
          GUI（图形用户界面）。设计者们纷纷开始各种各样的尝试与改造：
        </p>
        <ul className="page-list">
          <li>为 BI 软件引入 copilot，让小白也能通过自然语言上手数据分析</li>
          <li>将诸多跨平台的企业办公软件集成进一个智能助手，提高办公效率</li>
          <li>构建基于自然语言的 AI 原生代码研发软件，取代传统复杂的代码编辑器</li>
        </ul>
        <p>……</p>
        <p>
          无一例外，设计者们在起初，大胆而坚定的拥抱「会话式交互」，仿佛它无所不能，即将成为人机交互领域的主宰。然而，随着时间的流逝，当人们从自然语言交互的“热恋”冷静下来时，才发现纵然会话式交互有着简单易上手等优势，但也存在着诸多的弊端。
        </p>
        <p>一个重要的问题开始浮出水面：</p>
        <p style={{ fontWeight: 500 }}>到底 AI 产品界面设计该如何进行？</p>
        <p>在蚂蚁内部的 AI 产品设计实践中，我们也经常冒出类似的困惑：</p>
        <ul className="page-list">
          <li>图形界面操作不好吗？一定要用会话的方式吗？</li>
          <li>什么样的产品适合用会话交互完成？</li>
          <li>会话交互跟图形界面交互可以融合吗？</li>
          <li>AI 产品设计的体验受到哪些因素的影响？</li>
          <li>如何去系统性的思考一个 AI 产品的设计？</li>
        </ul>
        <p>……</p>
        <p>
          这些困惑的本质来源于，我们缺乏对当下融合了多种交互模式的「AI
          产品界面设计」缺乏清晰的定义和认知，因而在如何创造好的 AI 体验上遇到了迷茫。
        </p>
        <p>
          因此从 2023
          年底开始，我们团队抽调了各个业务领域的设计师，横向成立了 AI
          设计研究小组，开始尝试去定义和理解所谓的「AI +
          Design」是什么、该怎么做的设计命题。
        </p>
        <p>
          在这方面，无论是学术界还是企业界，都有着不少相关的研究和应用。站在巨人的肩膀上，我们力图构建出一套适用于当下的
          AI
          设计理论，并同时在蚂蚁内部涌现的海量 AI
          产品中，去实践和迭代我们的思想。在这个过程中，一套系统性的 AI
          设计理论和方法开始涌现——《RICH 设计范式——创造卓越 AI 产品体验》。
        </p>

        <Figure title="会话交互独特特征" tone="blue">
          <span style={{ fontSize: 30 }}>🤝</span>
        </Figure>

        <Figure title="AI 产品界面设计该如何进行？" tone="green" />

        <h2 id="what" className="page-h2">一、What？什么是 RICH 设计范式？</h2>
        <p>
          RICH 是我们提出来的一个 AI 界面设计范式，好比 WICH 范式之于图形用户界面。
        </p>
        <p>
          ACM SIGCHI
          2005（人机交互顶会）曾经定义过，人机交互的核心问题可以分为三个层面：
        </p>
        <ul className="page-list">
          <li>界面范式层：界定人机交互界面的设计要素，指引设计者关注的核心问题</li>
          <li>用户模型层：构建界面体验评估模型，用以度量界面体验的好坏</li>
          <li>软件框架层：人机界面的底层支撑算法和数据结构等软件开发框架，是隐藏在前端界面背后的内容</li>
        </ul>
        <p>
          其中界面范式，是每一个人机交互新技术诞生之时，设计者最需要去关注和定义的层面。界面范式定义了设计者所应该关注的设计要素是什么，基于此才能定义什么是好的设计和该如何进行好的设计。
        </p>
        <p>
          人们追求用户界面的革新，本质上是想要拓宽人机交互的带宽，更大程度解放人的生产力。在整个人机交互的发展过程中，出现了多种广泛使用的用户界面类型，从最早的批处理界面，到后来的命令行界面，再到当下最为流行的图形用户界面。
        </p>
        <p>
          基于 WIMP (Window, Icon, Menu, Point Device) 界面范式
          的图形用户界面，最早诞生于 1970
          年代的施乐公司，而后在 1980
          年代相继被苹果 Macintosh 电脑和微软 windows
          电脑借鉴并发扬光大。基于桌面隐喻的 WIMP
          界面由于其语法极小化，对象可视化和快速语义反馈等优点，持续统治着界面设计领域
          40 年有余。
        </p>

        <Figure title="基于 WIMP 界面范式构建的 GUI" tone="blue" />

        <p>
          如下图案例，我们如今仍在使用的 WIMP
          图形用户界面，与最早的样子并无本质差异。这样强有力的现实，也再一次验证了定义界面范式的重要性。
        </p>
        <p>
          在 AGI
          时代，机器已经可以理解更复杂、模糊的人们意图，也可以用几乎完全类人的方式与用户交流。这项变革的技术将引领我们不得不从过去的设计经验中跳脱出来，去尝试定义一个新的人机交互界面的范式，从而寻找体验的最优解。
        </p>

        <Figure title="RICH 界面设计范式" tone="purple" tall>
          <div style={{ display: 'flex', gap: 28, fontSize: 44, fontWeight: 700 }}>
            <span>R</span>
            <span>I</span>
            <span>C</span>
            <span>H</span>
          </div>
        </Figure>

        <p>RICH 正是我们提出的适用于当下 AGI 人机交互界面设计时代的一种范式的假设，它包含了四个设计要素：</p>
        <ul className="page-list">
          <li>Intention 意图</li>
          <li>Role 角色</li>
          <li>Conversation 对话</li>
          <li>Hybrid UI 混合界面</li>
        </ul>
        <p>每一个设计要素都在牵引着我们设计者需要关注的具体问题。</p>
        <p>
          我们认为，在 AI 设计过程中，关注到这四个要素，将有助于我们事半功倍的创造出卓越的
          AI 产品体验。
        </p>

        <Figure title="AI 界面范式将指引 AI 用户产品设计" tone="green" />
        <Figure title="技术革新引领界面范式" tone="blue" tall />

        <h2 id="why" className="page-h2">二、WHY? 为什么是 RICH 设计范式？</h2>
        <p>
          在应用之前，我们想先跟大家分享下 RICH
          是如何推导出来的？为什么是 RICH 而不是其它？
        </p>
        <p>
          在人机交互变迁史上，机器和交互方式的迭代总是依托于变革性技术的成熟化应用。变化的是技术和交互方式，但不变的永远是人机交互的本质与人的需求。从不变思变，正是
          RICH 推导出来的关键一步。
        </p>
        <p>
          人机交互的本质是用户通过执行某种动作或行为输入给机器，机器理解并完成诉求后产出结果给用户，用户评估是否符合要求，如果符合，一个交互单元就完成了闭环。
        </p>
        <p>基于此，唐纳德·诺曼提出了一个人机交互模型，更进一步的拆解和定义了这个交互单元。</p>

        <Figure title="人机交互模型" tone="blue" />

        <p>在图形界面时代，WIMP 范式中的各个要素，主要作用于人机交互的「执行操作」与输出环节的相关节点：</p>
        <ul className="page-list">
          <li>icon 图标：通过图形化隐喻，帮助用户完成操作的执行</li>
          <li>menu 菜单：通过有序的结构组织了各种操作，让用户能更加高效的进行系统性任务</li>
          <li>pointing 指点设备：通过键盘、鼠标指向式设备，让用户可以更清楚的选中目标操作</li>
          <li>windows 窗口：通过固定的空间去承载不同的内容，让用户能够阅读、评估不同的多媒体内容</li>
        </ul>
        <p>
          受限于图形界面交互的特点，实际上在过去的交互过程中，前期的大量工作需要用户自己完成。用户需要先行根据自己的意图，结合工具——即电脑与图形界面，再进行方案的制定和拆解，才能开始让机器开始执行所明确要求的操作。
        </p>
        <p>
          可以看到，过去机器只是被动的在帮助用户完成命令的执行，而用户的意图需要经过自身的先行拆解和细化才能最终转译成一次又一次的点击传达给用户。但是当下
          AI
          时代，一切都不一样了。机器最大的飞跃在于它越来越像一个“人”了，它能够理解用户模糊的意图，甚至自动制定方案、推动任务执行，最终帮助用户达成他的意图。
        </p>
        <p>
          在这个新的体验环节中，增加了很多隐形的体验规则，过去只要 UI
          界面组织的相对可用、美观，就能给用户带来较好的体验感受。但 AI
          时代，体验还取决于机器是否听得懂我的意思，是否讲话比较好听等等一系列隐形的体验。因而针对这样一种新的交互特征，关键设计要素需要被重新抽象和定义，确保我们的设计关注点走在正确的方向上。
        </p>
        <p>RICH 范式正是我们尝试定义的 AI 时代应该关注的设计要素集：</p>
        <ul className="page-list">
          <li>Intention 意图：AI 能够听懂并理解用户的意图，协助用户自动完成方案计划和步骤拆解，进而推动执行</li>
          <li>Role 角色：AI 扮演了某种身份角色，来匹配用户的意图，也保障与用户的互动是顺畅、符合预期的</li>
          <li>Conversation 会话：用户的模糊意图通过会话来逐步与 AI 对焦、拆解，用户的指令也结合其中</li>
          <li>Hybrid UI 混合界面：用户的执行动作和机器的结果输出与反馈承载在融合了多种交互方式的界面当中</li>
        </ul>
        <p>
          上述四个要素，组合在一起构成了 IRCH
          这四个字母，为了方便记忆和应用，我们调整了下字母的顺序得到了 RICH
          这个单词，刚好十分便于记忆，我们暂且将这个设计范式称之为「RICH 设计范式」😄。
        </p>

        <Figure title="GUI 时代，「机」长期帮助用户执行命令" tone="blue" tall />
        <Figure title="AGI 人机共生新时代" tone="purple" tall />

        <h2 id="how" className="page-h2">三、How？如何应用 RICH AI 设计范式？</h2>
        <p>
          那么该如何应用 RICH 创造卓越的 AI
          产品体验呢？在后续的指引文档里，我们将深入浅出，分别针对 RICH
          中的四个要素进行介绍和定义，通过提供开箱即用的设计策略和案例，帮助大家更好的理解和应用
          RICH。这套理念和最终的界面资产也集成到 Ant Design X
          里，希望能帮助大家轻松创造卓越 AI 产品体验！
        </p>

        <Figure title="如何应用 RICH？" tone="green" tall />
        <Figure title="推荐材料" tone="blue" tall />
        <Figure title="RICH 设计范式提出者" tone="purple" />

        <h2 className="page-h2">附</h2>
        <p>
          最后，感谢广大开源的各类学术论文、书籍和企业界的 AI
          设计理论，过去一年多，在它们的肩膀上，我们构建了一套开箱即用的理论与方法。我们知道
          RICH
          一定还有很多考虑不周的地方，也希望大家多多给我们反馈。
        </p>
        <p>
          最后感谢我们自己，在忙碌的日常工作中，挤出时间完成了这个几乎是纯公益的指引手册，我们是设计师。
        </p>
      </div>
    </DocLayout>
  );
}
