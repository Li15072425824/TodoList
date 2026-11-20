# ThoughtChain 思维链 · 本地文档站

Ant Design X 「思维链 ThoughtChain」中文文档页（https://x.ant.design/components/thought-chain-cn）的本地 React 复刻版。

制作方式参考 [craft-anything](https://github.com/storytold/craft-anything) 的
**Study → Build → Check → Ready** 工作流：先用浏览器检查原站的布局、配色、DOM 结构与组件 Token，
再用 React 重建，最后逐屏比对截图并修正差异（原站 craft-anything-cli 未安装，因此用同样的方法论手工执行）。

## 技术栈

- React 19 + Vite 8
- antd 6（Card / Button / Switch / Space / ConfigProvider）
- @ant-design/x 2.10（真实的 `ThoughtChain` 组件与 `ThoughtChain.Item`）
- 纯 CSS 复刻文档站外壳（顶部导航、左侧组件菜单、右侧目录、代码块、API 表格、Token 表格）

## 运行

```bash
cd thought-chain-docs
npm install
npm run dev      # http://localhost:5273
npm run build    # 产物在 dist/
```

> 若 `npm install` 时跳过了 optional dependencies，Vite 8 的 rolldown 会缺少原生绑定，
> 需要额外安装：`npm i @rolldown/binding-darwin-arm64`（其他平台换对应包）。

## 页面包含

- 顶部 80px 导航：Ant Design X 品牌、居中胶囊导航、版本号、主题切换、GitHub 等图标
- 左侧完整组件菜单（介绍 / 总览 / 通用 / 唤醒 / 确认 / 表达 / 反馈 / 其他），ThoughtChain 高亮
- 正文：标题、导入方式、源码 / 文档 / 版本元信息、何时使用
- 9 个可交互代码演示（每个都可展开源码）：
  1. 基本
  2. 节点状态（Run Next 切换 loading / success / error / abort）
  3. 简洁思维链（solid / outlined / text 三种 variant、状态、blink、disabled）
  4. 可折叠的
  5. 受控的折叠（Open / Close "check_task" details）
  6. 折叠时销毁内容（destroyOnHidden 开关）
  7. 客制化（自定义图标、dashed 连线、footer）
  8. 嵌套使用
  9. 单行折叠
- API：ThoughtChainProps / ThoughtChainItemType / ThoughtChain.Item 三张表
- Semantic DOM：ThoughtChain、ThoughtChain.Item 语义结构示意
- 主题变量：组件 Token / 全局 Token 切换表格（带颜色色块）
- 右侧滚动联动的目录（TOC）
- 深色模式（右上角月亮 / 太阳按钮，antd 算法 + CSS 变量同步切换）

## 目录结构

```text
thought-chain-docs/
├── index.html
├── vite.config.js
├── public/favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx                     # 主题状态 + 布局
    ├── styles.css                  # 文档站视觉复刻
    ├── components/
    │   ├── SiteHeader.jsx          # 顶部导航
    │   ├── Sidebar.jsx             # 左侧组件菜单
    │   ├── Toc.jsx                 # 右侧目录 + 滚动联动
    │   └── DemoBox.jsx             # 演示容器（预览 / 描述 / 源码展开）
    └── docs/
        └── ThoughtChainDoc.jsx     # 正文、9 个演示、API/Token 表格
```

复刻过程中对照原站保存的截图在 `_ref/`（页面全貌与各演示截图，便于继续微调）。

## 说明

- 视觉与文案以 Ant Design X 官网公开文档为参照，仅用于本地学习 / 复刻练习。
- 组件行为来自 `@ant-design/x` 的真实实现，因此状态图标、blink 动画、折叠逻辑等与官方一致。
