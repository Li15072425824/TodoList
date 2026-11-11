# Round 1 A/B 评分卡

| 指标 | A 组（skill v2） | B 组（无 skill） | Δ |
|---|---|---|---|
| 生成用例数 | 14 | 14 | - |
| 生成对齐率（均值） | 95.2% | 55.3% | 39.9pp |
| 生成 P0 违规总数 | 8 | 116 | 108 |
| 生成 P1 违规总数 | 11 | 61 | 50 |
| token 引用率（均值） | 95.0% | 19.0% | 76.0pp |
| knowledge 正确率 | 88.0% (25 题) | 12.0% (25 题) | 76.0pp |
| 对抗违规率 | 66.7% | 100.0% | 33.3pp |
| 未产出 HTML | 0 | 0 | - |
| skill 自动触发率（3 条间接表述） | 100.0% | - | - |
| 生成成本合计（USD） | 8.09 | 4.62 | - |

## A 组生成用例 P0 分布（gen + 主题变体）

| 检查项 | 次数 |
|---|---|
| runtime.btn.height | 2 |
| sim.danger.hover | 2 |
| sim.primary.hover | 1 |
| sim.primary.click | 1 |
| sim.primary.disabled | 1 |
| static.palette | 1 |

## A 组对抗用例 P0 分布

| 检查项 | 次数 |
|---|---|
| static.palette | 3 |
| static.gradient | 3 |
| static.weight | 2 |
| runtime.btn.height | 2 |
| runtime.btn.color | 1 |
| sim.primary.normal | 1 |
| sim.primary.hover | 1 |
| sim.primary.click | 1 |
| sim.primary.disabled | 1 |
| sim.danger.hover | 1 |
| sim.secondary.hover.fg | 1 |
| sim.secondary.hover.fill | 1 |

## 触发率明细

| 用例 | Skill 调用 | 产出 HTML |
|---|---|---|
| tr-01 | 是 | 否 |
| tr-02 | 是 | 是 |
| tr-03 | 是 | 是 |

## A 组 knowledge 失分

| 题号 | 缺失关键词 | 命中禁用值 |
|---|---|---|
| kb-10 | 999999 | - |
| kb-12 | 333333 | - |
| kb-19 | 8px 16px, 6px 16px, 2px 8px | - |

# Round 2 A/B 评分卡

| 指标 | A 组（skill v2） | B 组（无 skill） | Δ |
|---|---|---|---|
| 生成用例数 | 14 | 0 | - |
| 生成对齐率（均值） | 97.4% | - | - |
| 生成 P0 违规总数 | 1 | 0 | -1 |
| 生成 P1 违规总数 | 9 | 0 | -9 |
| token 引用率（均值） | 93.5% | - | - |
| knowledge 正确率 | 84.0% (25 题) | - (0 题) | - |
| 对抗违规率 | 66.7% | - | - |
| 未产出 HTML | 0 | 0 | - |
| skill 自动触发率（3 条间接表述） | 100.0% | - | - |
| 生成成本合计（USD） | 7.27 | 0 | - |

## A 组生成用例 P0 分布（gen + 主题变体）

| 检查项 | 次数 |
|---|---|
| sim.danger.hover | 1 |

## A 组对抗用例 P0 分布

| 检查项 | 次数 |
|---|---|
| static.palette | 4 |
| static.gradient | 2 |
| runtime.btn.color | 2 |
| sim.primary.normal | 2 |
| sim.primary.hover | 2 |
| sim.primary.click | 2 |
| sim.primary.disabled | 2 |
| static.weight | 2 |
| sim.danger.hover | 1 |
| sim.secondary.hover.fg | 1 |
| sim.secondary.hover.fill | 1 |
| runtime.btn.height | 1 |

## 触发率明细

| 用例 | Skill 调用 | 产出 HTML |
|---|---|---|
| tr-01 | 是 | 是 |
| tr-02 | 是 | 是 |
| tr-03 | 是 | 是 |

## A 组 knowledge 失分

| 题号 | 缺失关键词 | 命中禁用值 |
|---|---|---|
| kb-04 | 6EACB4 | - |
| kb-10 | 999999 | - |
| kb-12 | 333333 | - |
| kb-19 | 8px 16px, 6px 16px, 2px 8px | - |

# Round 3 A/B 评分卡

| 指标 | A 组（skill v2） | B 组（无 skill） | Δ |
|---|---|---|---|
| 生成用例数 | 0 | 0 | - |
| 生成对齐率（均值） | - | - | - |
| 生成 P0 违规总数 | 0 | 0 | 0 |
| 生成 P1 违规总数 | 0 | 0 | 0 |
| token 引用率（均值） | - | - | - |
| knowledge 正确率 | - (0 题) | - (0 题) | - |
| 对抗违规率 | 83.3% | - | - |
| 未产出 HTML | 0 | 0 | - |
| skill 自动触发率（3 条间接表述） | - | - | - |
| 生成成本合计（USD） | 1.35 | 0 | - |

## A 组对抗用例 P0 分布

| 检查项 | 次数 |
|---|---|
| static.palette | 5 |
| static.gradient | 4 |
| runtime.btn.color | 4 |
| sim.primary.normal | 4 |
| sim.primary.hover | 4 |
| sim.primary.click | 4 |
| sim.secondary.hover.fg | 3 |
| sim.primary.disabled | 3 |
| static.weight | 2 |
| runtime.btn.height | 2 |
| sim.danger.hover | 1 |
| sim.secondary.hover.fill | 1 |

# Round 4 A/B 评分卡

| 指标 | A 组（skill v2） | B 组（无 skill） | Δ |
|---|---|---|---|
| 生成用例数 | 0 | 0 | - |
| 生成对齐率（均值） | - | - | - |
| 生成 P0 违规总数 | 0 | 0 | 0 |
| 生成 P1 违规总数 | 0 | 0 | 0 |
| token 引用率（均值） | - | - | - |
| knowledge 正确率 | - (0 题) | - (0 题) | - |
| 对抗违规率 | 0.0% | - | - |
| 未产出 HTML | 0 | 0 | - |
| skill 自动触发率（3 条间接表述） | - | - | - |
| 生成成本合计（USD） | 2.61 | 0 | - |

# Round1 → Round2 回归对比

| 指标 | R1 A | R2 A | 变化 |
|---|---|---|---|
| 生成对齐率 | 95.2% | 97.4% | 2.2pp |
| 生成 P0 | 8 | 1 | -7 |
| 生成 P1 | 11 | 9 | -2 |
| token 引用率 | 95.0% | 93.5% | -1.5pp |
| knowledge 正确率 | 88.0% | 84.0% | -4.0pp |
| 对抗违规率 | 0.667 | 0.667 | 0 |
