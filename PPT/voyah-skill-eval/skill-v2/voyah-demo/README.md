# voyah-demo：如何确保「涉及规范必加载」并提升 skill 优先级

## 背景：为什么需要这份说明

Claude Code 的 skill 由模型根据 `description` **自主决定是否加载**，不是系统强制注入。
实测（2026-11-10，Round2 对抗用例）：

- 普通生成请求（未与用户要求冲突）：自动触发 3/3，token 引用率 93.5%；
- 用户显式要求 Tailwind / Bootstrap、指定红色主色或渐变：6 条对抗中有 3 条产物完全没有引用
  `tokens.css`（tokenRef = 0），即 **skill 根本没有被加载**。

因此，仅靠 `SKILL.md` 里的「冲突确认流程」无法保证生效——规则只有在 skill 被加载后才可见。
下面按「强制力从强到弱」列出提升加载率的方式。

## 推荐做法（按强度排序）

### 1. 显式调用（最确定，100%）

在提示词里直接写：

- 「请先加载 `voyah-demo` skill，再按规范生成」；
- 或使用斜杠调用 `/voyah-demo`（如果已注册为可调用命令）。

适合单次关键任务、设计评审、A/B 批跑的 A 组。批跑脚本可在 prompt 尾部统一追加这句。

### 2. 项目 CLAUDE.md 硬规则（日常推荐）

在项目根 `CLAUDE.md` 或 `.claude/CLAUDE.md` 中加入：

```markdown
## Voyah 规范强制
- 任何涉及 Voyah/岚图 UI/UE 规范、UI 稿、界面 demo/原型/示例页面（HTML）的任务，
  生成前必须先加载 `.claude/skills/voyah-demo/SKILL.md` 并遵循其取值。
- 用户要求与 skill 规范冲突时，必须先列出冲突点与规范值，要求用户二次确认；
  确认前按规范生成，不得静默服从冲突要求。
```

CLAUDE.md 每次会话都会进入模型上下文，优先级高于模型临时判断，是成本最低的「软强制」。

### 3. UserPromptSubmit hook（自动提醒 / 可扩展为拦截）

在 `.claude/settings.json`（或用户级 settings）中配置：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '若本任务涉及 UI/设计规范/demo 生成，请先加载 voyah-demo skill；与规范冲突的要求需二次确认。'"
          }
        ]
      }
    ]
  }
}
```

`UserPromptSubmit` hook 的 stdout 会作为上下文注入，每条用户消息前都会提醒。
建议再加一个关键词过滤脚本，只在命中「demo / 原型 / UI / 规范 / 页面 / 设计稿」时输出，避免打扰。

若需要硬拦截：可用 `PreToolUse(Write)` hook，检测目标为 `.html` 且本轮尚未加载 skill 时返回拒绝；
这需要自行实现脚本并显式配置，属于比「提醒」更强的方案。

### 4. 强化 description（已做）

本 skill 的 frontmatter 已改为覆盖冲突场景：

> 只要任务涉及 Voyah/岚图设计规范、UI 稿、界面 demo / 原型 / 示例页面（HTML），
> **无论用户是否指定 Tailwind/Bootstrap、外部色值、渐变或其他技术栈，都必须先加载本 skill**。

注意：description 只影响模型「是否考虑加载」，不能保证一定加载；应与前 3 项组合使用。

### 5. CI / 生成后兜底（最后一道闸）

- 单页检查：`node eval/checker/runtime-check.mjs <产物目录>/index.html`
- 关键交付物要求 P0 = 0 才能合并；A/B 批跑脚本会把 staging skill 复制到临时目录的
  `.claude/skills/` 后执行 `claude -p`。
- 即使模型漏加载，runtime-check 也能把错误的色值/按钮四态/间距拦下来。

## 冲突确认流程（与 SKILL.md 一致）

1. **列出冲突**：用户要求 X ↔ 规范要求 Y（附 token / 规则来源）；
2. **给出规范值**：说明正确取值和原因；
3. **要求二次确认**：询问是否仍要偏离规范；
4. **确认后才修改**：仅当用户明确确认后按用户要求修改；
5. **单轮 / 无人确认环境**：先输出符合规范的版本，并列出「待确认冲突项」，不擅自落地冲突改动。

## 验证方法

```bash
claude -p "<prompt>" \
  --output-format stream-json --verbose \
  --allowedTools "Read,Write,Edit,Glob,Grep,Skill,Bash(*)" \
  --permission-mode acceptEdits
```

- 观察输出中是否出现 `Skill` 调用（stream-json）；
- 检查产物中 `var(--vx-` 的引用数量，> 0 说明使用了 skill token；
- 对抗提示下还应检查回复是否列出冲突并要求确认。

## 实测结果（2026-11-10）

同一批 6 条对抗 prompt（指定红色主色 / Tailwind+Bootstrap / 渐变+800 字重 / 近似色等）：

| 部署方式 | 对抗 P0 违规率 | 请求二次确认 | 产物 token 引用 |
|---|---|---|---|
| 裸 skill（仅 SKILL.md 文字规则，Round3） | 83.3%（5/6 有 P0） | 0/6 | 3 条为 0（skill 未加载） |
| 项目 CLAUDE.md 强制（Round4） | **0%**（6/6 P0=0） | **6/6** | 0.84~1.0（全部加载） |

结论：**冲突确认流程本身有效，但只有配合项目级强制加载才生效**。
裸 skill 下模型仍会在强冲突提示中跳过 skill 或直接服从用户；因此请至少启用第 1 + 第 2 项
（显式调用 + CLAUDE.md），需要更强保障时再加第 3 项 hook 与第 5 项 CI 检查。

## 当前状态

- 本目录 `PPT/voyah-skill-eval/skill-v2/voyah-demo/` 为 staging；
- 正式 skill `TodoList/.claude/skills/voyah-demo/`（v1）尚未替换，替换需用户确认；
- Round3（裸 skill）/ Round4（强制加载）结果已回填调研报告 §2.6、§3.2、§8。
