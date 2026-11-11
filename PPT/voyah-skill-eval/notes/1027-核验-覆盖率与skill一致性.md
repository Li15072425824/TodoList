---
created: 2026-11-10 10:27
project: TodoList
type: dialogue
tags: [覆盖率, skill-lint, spec.json]
session_id: unknown
saved_by: ai
---

# 核验：用例覆盖率与 skill v2 一致性

## 被核验主张

1. spec.json 的 227 个叶子全部被用例覆盖（100%）。
2. skill v2 的取值与 spec.json 零偏差。

## 核验过程

- 运行 `node eval/checker/coverage-report.mjs`：
  - 输出 `coverage-report: 227/227 (100.0%)`；
  - cases 42（gen 11 / adversarial 6 / knowledge 25）；
  - 各分区覆盖：色彩 133/133、线条 15/15、字体 17/17、按钮 30/30、间距 32/32；
  - 无无效 covers 引用、无未覆盖叶子（否则退出码 1）。
- 运行 `node eval/checker/skill-lint.mjs skill-v2/voyah-demo`：
  - 允许色板 100 个，skill 文件 4 个；
  - `✔ 0 偏差（spec 域全部通过）`（修订后复跑仍 0 偏差）。

## 结论

两条主张**成立**，置信度高（脚本自动校验、可复现；证据文件 `eval/coverage-matrix.md`、`eval/results/`）。
