# 调研/分析任务强制规范（必须遵守）

## research-report skill 强制调用

- 当用户要求「调研 / 专项调研 / 深度研究 / 分析 / 对比分析 / 评估」且期望产出报告时，**必须在执行任何调研动作（搜索、抓取、读项目代码）之前，先调用 Skill 工具加载 `research-report` skill**，然后严格按该 skill 的 Step 1–7 执行，不得跳步、不得用自拟流程替代。
- 即使用户没有明确说"用 skill"，只要是调研分析类任务，也一律先加载 `research-report`。

## 报告归档强制位置

- 最终调研报告**必须**写入 `/Users/lixing/WorkRep/TodoList/PPT/<topic-slug>/调研报告.md`（topic-slug 为英文 kebab-case），过程产物放同目录 `notes/`。
- **不允许**只把报告输出到对话或只归档到 Obsidian——Obsidian 归档（全局约定）照做，但它是额外副本，不是替代；PPT 目录下的报告才是正式交付物。
- 收尾时按 skill Step 7 核对清单核对目录树，并向用户汇报最终文件路径。

## 兜底规则

- 若因故未走完整 skill 流程（如用户明确要求轻量快速分析），只要有"报告/分析结论"类产出，也必须在 `PPT/<topic-slug>/` 下落一份报告文件，并在回复中给出该路径。
