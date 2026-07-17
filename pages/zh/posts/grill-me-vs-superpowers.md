---
title: grill-me vs Superpowers：两种 Agent Skills 路线的全面对比
date: "2026-07-17 18:00"
description: 从定位、工作流、调用方式、覆盖范围到选型建议，全面对比 Matt Pocock 的 grill-me 与 Jesse Vincent 的 Superpowers，并说明何时单用、何时组合。
cate: 技术
plum: true
---

[[toc]]

在 Agent Skills 生态里，有两个名字几乎绕不开：

- **grill-me** —— Matt Pocock（[mattpocock/skills](https://github.com/mattpocock/skills)）
- **Superpowers** —— Jesse Vincent / obra（[obra/superpowers](https://github.com/obra/superpowers)）

很多人把它们当成「二选一」。更准确的说法是：它们解决的问题重叠在「动手前对齐」，但在**产品形态、强制程度、覆盖生命周期**上差别很大。

本文从定位、机制、工作流、优劣与选型把两者摊开。数据与结构以 2026 年中公开仓库为准（Stars 会持续变动，以 GitHub 实时为准）。

## 一句话定位

| | **grill-me** | **Superpowers** |
|---|---|---|
| **是什么** | 一个（组）**审讯式**规划 skill | 一整套 **软件工程方法论 + 可组合 skills** |
| **核心问题** | 「你真的想清楚了吗？」 | 「如何按纪律从想法走到可合并分支？」 |
| **输出** | 共享理解（默认可无落盘） | 设计文档 → 计划 → 实现 → 评审 → 收尾 |
| **哲学** | 小、可改、可组合，控制权在人 | 流程优先，用 skill 强制 agent 不抄近路 |
| **作者** | Matt Pocock | Jesse Vincent (obra) |
| **仓库** | [mattpocock/skills](https://github.com/mattpocock/skills)（含 grill-me 等） | [obra/superpowers](https://github.com/obra/superpowers) |

## 它们各自从哪来

### grill-me：三句话撬动对齐

grill-me 最早以极短 skill 走红，核心指令大意是：

> 针对这个 plan 无情地采访我，直到达成共享理解；按决策树逐个分支解决依赖；能靠读代码回答的就去读代码；每个问题给出你的推荐答案。

后续演进里，它拆成了更清晰的三层：

| 入口 | 角色 |
|------|------|
| **grilling** | 审讯原语（可被其他 skill 调用） |
| **grill-me** | 用户侧入口：纯面试，**不写文件** |
| **grill-with-docs** | 同一套审讯 + 写入 `CONTEXT.md` 术语表 / ADR |

Matt 的更大仓库 `mattpocock/skills` 定位是 **Skills for Real Engineers**：一堆小而可组合的 skill（domain-modeling、to-spec、to-tickets、tdd、implement…），反对「框架抢走控制权」的黑盒流程（其 README 点名对比 GSD / BMAD / Spec-Kit 一类「接管全流程」的方案）。

安装示例：

```bash
npx skills@latest add mattpocock/skills --skill=grill-me -y -g
# 或装全套后再 /setup-matt-pocock-skills
```

### Superpowers：把工程流程焊进 agent

Superpowers 自称：

> A complete software development methodology for your coding agents.

它不是「某一个 skill」，而是：

1. 一组可组合 skills（brainstorming、writing-plans、TDD、subagent-driven-development…）
2. 启动时注入的 **using-superpowers** 规则：相关 skill 必须先 invoke，再行动
3. 跨 harness 的安装包（Claude Code / Codex / Cursor / OpenCode / Copilot CLI / Pi 等）

典型强制语气来自 `using-superpowers`：

> If you think there is even a 1% chance a skill might apply… you ABSOLUTELY MUST invoke the skill.

也就是说：Superpowers 在和「agent 会合理化地跳过最佳实践」这件事硬刚——用流程与心理学式约束把纪律钉死。

安装示例（Claude Code）：

```text
/plugin install superpowers@claude-plugins-official
```

## 工作流对比

### grill-me 覆盖的是「入口对齐」

```text
想法 / 粗 plan
    │
    ▼
 /grill-me  或  /grill-with-docs  或  /grilling
    │
    ├─ 一次只问一题
    ├─ 每题给推荐答案
    ├─ 能读代码则读代码
    └─ 决策树按依赖逐个 resolve
    │
    ▼
共享理解（+ 可选 CONTEXT.md / ADR）
    │
    ▼
（可选）to-spec → to-tickets → implement → …
```

要点：

- **默认不写代码、不实现**
- grill-me 明确 **stateless**：会话结束，对齐在对话里；要留痕用 grill-with-docs
- 主构建链在 Matt 体系里大致是：`grill-with-docs → to-spec → to-tickets → implement → code-review`
- 大范围、路径不清的项目可先 **wayfinder** 画决策地图，再回来 grilling

### Superpowers 覆盖的是「完整交付流水线」

```text
你说「我们做个 X」
    │
    ▼
 using-superpowers（强制先查 skill）
    │
    ▼
 brainstorming  ← HARD-GATE：未批准设计前禁止写代码
    │  探索上下文 → 逐题澄清 → 2–3 方案 → 分段设计 → 写 design doc
    ▼
 using-git-worktrees（隔离分支）
    ▼
 writing-plans（拆成 2–5 分钟级任务，含验证步骤）
    ▼
 subagent-driven-development / executing-plans
    │  + test-driven-development（红绿重构）
    │  + requesting-code-review（任务间评审）
    ▼
 finishing-a-development-branch（测通、merge/PR/清理）
```

要点：

- **默认自动触发**，不必每次手敲 `/brainstorm`
- brainstorming 有硬门禁：没设计、没用户批准，就不能进实现 skill
- 强调 TDD、YAGNI、证据优先（verification-before-completion）
- 子代理 + worktree 支撑长时间无人值守推进

## 核心机制差异

### 1. 调用方式：你点名 vs 它强制

| 维度 | grill-me | Superpowers |
|------|----------|-------------|
| 默认触发 | **用户显式** `/grill-me`（`disable-model-invocation: true`） | **会话级强制** skill 检查 |
| 是否会「自己跳过」 | 取决于你是否调用 | 设计目标就是让模型很难跳过 |
| 适合谁 | 想保留节奏、按需加压 | 想默认工程化、少靠自觉 |

这是最本质的差异之一：

- grill-me：**可选的手术刀**
- Superpowers：**默认开着的安全带 + 整条产线**

### 2. 审讯本身：很像，但不一样

两者在「动手前先问清楚」上高度同构：

| 共性 | 说明 |
|------|------|
| 一次一问 | 避免问卷轰炸 |
| 先理解再动手 | 防 agent 直接开写 |
| 探索代码优先 | 事实去仓库找，决策交给人 |
| 方案权衡 | Superpowers 明确 2–3 方案；grill-me 用推荐答案引导 |

差异：

| | grill-me / grilling | Superpowers brainstorming |
|---|---------------------|---------------------------|
| 隐喻 | **决策树 interrogation** | **协作式设计对话 + 硬门禁** |
| 产物 | 默认可无文档；with-docs → glossary/ADR | 强制 design doc 路径与 commit 习惯 |
| 可视化 | 无内建 | 可选 visual companion（浏览器 mockup） |
| 后续 | 交还控制权给你选下一步 skill | 自动衔接到 writing-plans |

可以说：**brainstorming ≈ 更重、更产品化的 grilling + 文档与下游流水线挂钩**。

### 3. 覆盖面：点 vs 面

| 生命周期阶段 | grill-me 系 | Superpowers |
|--------------|-------------|-------------|
| 需求澄清 / 设计 | ✅ 主场 | ✅ brainstorming |
| 领域语言 / ADR | ✅ grill-with-docs / domain-modeling | 有 design doc，DDD 味道更淡 |
| 实现计划 | 靠其他 skill（to-spec/to-tickets） | ✅ writing-plans |
| 隔离工作区 | 无内建 | ✅ git worktrees |
| 实现执行 | 靠 implement / tdd 等 | ✅ SDD + TDD |
| 代码评审 | 有 code-review skill | ✅ 任务间强制 review 路径 |
| 分支收尾 | 无强绑定 | ✅ finishing-a-development-branch |
| 调试方法论 | diagnosing-bugs 等 | ✅ systematic-debugging |
| 跨平台 harness | skills 标准 + 多 agent 安装 | **一等公民多平台插件** |

### 4. 产物与「记忆」

- **grill-me**：对话即产物；要跨会话复用 → `grill-with-docs` 写 `CONTEXT.md` + ADR  
- **Superpowers**：默认把设计落到 `docs/superpowers/specs/...`，计划、评审、worktree 状态跟流程走  

若你在意「项目级统一语言」（ubiquitous language），Matt 体系（CONTEXT.md）更显式；若你在意「这次 feature 从设计到 PR 的纪律」，Superpowers 更完整。

### 5. 体量与学习成本

| | grill-me | Superpowers |
|---|----------|-------------|
| 心智负担 | 极低：记住一个斜杠命令 | 中高：整套方法论 + 多 skill 联动 |
| 定制 | 小 skill 易改、易 fork | 跨平台一致性约束更强，贡献门槛更高 |
| 对琐碎任务 | 可完全不用 | 可能「过重」（官方也承认 trivial 场景未必需要） |

## 优缺点清单

### grill-me 的强项

1. **极致轻量**：几句话的原语，安装即用  
2. **控制权清晰**：你决定何时加压，不会被全流程绑架  
3. **通用**：写代码、做课程选题、做产品决策都能用  
4. **推荐答案机制**：从「开放式拷问」变成「对提案说 yes/no」，节奏更快  
5. **与 DDD 工具链衔接好**：grill-with-docs / domain-modeling 把对齐沉淀成资产  

### grill-me 的弱项

1. **不负责实现与收尾**——对齐完就结束  
2. **默认无强制**：懒的时候会跳过，问题又回到「agent 直接开写」  
3. **单 skill 视角不够**：真正落地通常要整套 mattpocock/skills  
4. 纯 grill-me **不落盘**，会话一关上下文蒸发（除非 with-docs）  

### Superpowers 的强项

1. **端到端方法论**：从脑暴到 merge 选项闭环  
2. **强制 skill 使用**：对抗「赶时间跳过 TDD/规划」  
3. **子代理 + worktree + 双阶段 review**：适合长任务  
4. **多 harness 官方支持**：团队换工具成本更低  
5. **TDD / 验证哲学内建**：质量默认值更高  

### Superpowers 的弱项

1. **重**：小改动也可能被流程拖住  
2. **自主权变少**：有人觉得像被流程「管着」  
3. **与其他重型方法论可能打架**（同时装 GSD + Superpowers + 全套 Matt skills 会叠床架屋）  
4. 学习与调试「为什么它又进 brainstorming 了」有成本  

## 社区里常见说法（可参考，非权威）

- Reddit / 博客常见三分法：**Superpowers / get-shit-done / grill-me**  
- 有人认为 Superpowers 更「优雅完整」，grill-me 是「决策驱动开发」的小尖刀  
- 也有人反馈 Superpowers 像在「一直问你」，和 grill-me 体感相似，但后面多了一整条工程管线  
- Matt 本人对编码场景的推荐已演进：早期主推 grill-me；后更推荐 **grill-with-docs / domain-model 链** 用于对着代码库对齐  

## 怎么选

### 选 grill-me（或 grilling / grill-with-docs）如果…

- 你主要痛点是 **需求没对齐就开写**  
- 你想 **保留手动节奏**，不要默认全流程  
- 你经常做 **非代码决策**（内容、产品、架构权衡）  
- 你喜欢小 skill，愿意自己拼 `to-spec → tickets → implement`  
- 你重视 **CONTEXT.md / ADR** 这种跨会话语言资产  

### 选 Superpowers 如果…

- 你要 agent **长时间自治**还不跑偏  
- 团队需要 **统一工程默认值**（TDD、plan、review）  
- 你跨 **Claude Code / Codex / Cursor** 多端工作  
- 你愿意用「重一点」的流程换返工更少  
- 你讨厌 agent「简单任务也直接糊一版」  

### 更务实的答案：组合，而不是对立

两者在「入口审讯」上重叠，在「交付管线」上互补：

```text
方案 A（轻）：  /grill-me  →  自己实现或 plan mode
方案 B（中）：  /grill-with-docs  →  to-spec  →  implement
方案 C（重）：  Superpowers 全流程（brainstorm → plan → SDD → finish）
方案 D（混）：  关键用 /grill-me 或 grill-with-docs 加压
               确认后再交给 Superpowers 的 plan/执行段
               （或关掉 Superpowers 自动脑暴，只借其 TDD/worktree）
```

实践建议：

1. **先只装一边跑两周**，感受「强制」是否适合你  
2. 若已用 Superpowers，仍可用 grill-me 做 **额外压力测试**（尤其跨团队、高风险设计）  
3. 若已用 Matt 全套，不必为「有人 stars 更高」再叠 Superpowers，除非你缺 worktree/SDD/跨端统一  
4. 琐碎改动：两边都可以跳过；高风险架构：两边都值得上审讯  

## 对照总表

| 维度 | grill-me | Superpowers |
|------|----------|-------------|
| 粒度 | 单点 skill（+ 原语/变体） | 方法论 + skill 库 |
| 触发 | 用户斜杠为主 | 默认自动 + 硬门禁 |
| 主要价值 | 对齐、决策树、共享理解 | 全流程纪律与交付 |
| 文档产物 | 可选（with-docs） | 默认 design/plan 路径 |
| TDD / 子代理 / worktree | 需其他 skill 或手工 | 内建链路 |
| 多平台 | 经 Agent Skills / installer | 官方多 harness 插件 |
| 适合场景 | 加压访谈、通用决策 | 严肃功能交付 |
| 风险 | 不用就没用 | 过重、过管 |
| 关系 | **入口手术刀** | **整条产线** |

## 上手命令速查

**grill-me / Matt skills：**

```bash
npx skills@latest add mattpocock/skills --skill=grill-me -y -g
# 编码场景更推荐：
npx skills@latest add mattpocock/skills --skill=grill-with-docs -y -g
```

Claude 插件：

```text
/plugin marketplace add mattpocock/skills
/plugin install mattpocock-skills@mattpocock
```

**Superpowers：**

```text
/plugin install superpowers@claude-plugins-official
```

其他 harness 见官方 README 的 Cursor / Codex / OpenCode 等章节。

## 结论

- **grill-me** 回答的是：*在写代码之前，我们有没有真正想清楚？*  
- **Superpowers** 回答的是：*想清楚之后，agent 如何按工程纪律把事做完？*  

把它们当成对立产品，会低估 grill-me 的通用性，也会低估 Superpowers 的流水线厚度。更健康的模型是：

> **grill-me 是加压对齐的原语；Superpowers 是默认打开的工程操作系统。**

你若只有一个槽位：对齐问题更痛 → 先 grill-me（或 grill-with-docs）；交付纪律更痛 → 先 Superpowers。槽位够：入口用 Matt 的审讯与领域语言，中后段用 Superpowers 的计划、TDD 与 worktree——很多「又问又写又测」的高手其实已经在混用，只是没写成文章。

---

## 参考

- [mattpocock/skills](https://github.com/mattpocock/skills) / [grill-me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) / [grilling](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling)
- [Matt · My Grill Me Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral)
- [Matt · The /grill-me Skill](https://www.aihero.dev/skills-grill-me)
- [obra/superpowers](https://github.com/obra/superpowers)
- [Jesse Vincent · Superpowers announcement](https://blog.fsck.com/2025/10/09/superpowers/)
