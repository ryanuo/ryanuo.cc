---
title: grill-me vs Superpowers: A Full Comparison of Two Agent-Skill Paths
date: "2026-07-17 18:00"
description: Positioning, workflows, invocation models, coverage, trade-offs, and when to combine Matt Pocock’s grill-me with Jesse Vincent’s Superpowers.
cate: Tech
plum: true
---

[[toc]]

In the agent-skills ecosystem, two names come up constantly:

- **grill-me** — Matt Pocock ([mattpocock/skills](https://github.com/mattpocock/skills))
- **Superpowers** — Jesse Vincent / obra ([obra/superpowers](https://github.com/obra/superpowers))

People often treat them as an either/or. A better frame: they overlap on **pre-implementation alignment**, but differ sharply in **shape, enforcement, and lifecycle coverage**.

This post compares positioning, mechanisms, workflows, trade-offs, and practical selection. Structure follows public repos as of mid-2026 (star counts move; check GitHub for live numbers).

## One-line positioning

| | **grill-me** | **Superpowers** |
|---|---|---|
| **What it is** | A (family of) **relentless interview** skill(s) | A full **software methodology + composable skills** |
| **Core question** | “Have you actually thought this through?” | “How do we ship from idea to a mergeable branch with discipline?” |
| **Output** | Shared understanding (optionally no files) | Design → plan → implement → review → finish |
| **Philosophy** | Small, hackable, composable; human keeps control | Process-first; skills force agents not to cut corners |
| **Author** | Matt Pocock | Jesse Vincent (obra) |
| **Repo** | [mattpocock/skills](https://github.com/mattpocock/skills) | [obra/superpowers](https://github.com/obra/superpowers) |

## Where each came from

### grill-me: three sentences that force alignment

grill-me went viral as a tiny skill. The essence:

> Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk each branch of the design/decision tree, resolving dependencies one by one. If the codebase can answer a question, explore the code instead of asking. For each question, give your recommended answer.

It later split into a clearer stack:

| Entry | Role |
|-------|------|
| **grilling** | Interview **primitive** (callable by other skills) |
| **grill-me** | User-facing front door: pure interview, **writes nothing** |
| **grill-with-docs** | Same interview + writes `CONTEXT.md` glossary / ADRs |

The broader [mattpocock/skills](https://github.com/mattpocock/skills) repo markets **Skills for Real Engineers**: many small composable skills (domain-modeling, to-spec, to-tickets, tdd, implement…). It argues against frameworks that **own the process and take your control** (README contrasts approaches like GSD / BMAD / Spec-Kit).

Install sketch:

```bash
npx skills@latest add mattpocock/skills --skill=grill-me -y -g
# or install the set, then run /setup-matt-pocock-skills
```

### Superpowers: weld engineering process into the agent

Superpowers describes itself as:

> A complete software development methodology for your coding agents.

It is not “one skill.” It is:

1. A library of composable skills (brainstorming, writing-plans, TDD, subagent-driven-development, …)
2. A session bootstrap via **using-superpowers**: check and invoke relevant skills **before** acting
3. Multi-harness packaging (Claude Code, Codex, Cursor, OpenCode, Copilot CLI, Pi, …)

The enforcement tone from `using-superpowers`:

> If you think there is even a 1% chance a skill might apply… you ABSOLUTELY MUST invoke the skill.

In short: Superpowers fights the failure mode where agents **rationalize skipping** TDD, planning, or review under time pressure.

Claude Code install sketch:

```text
/plugin install superpowers@claude-plugins-official
```

## Workflow comparison

### grill-me covers the alignment entrance

```text
Idea / rough plan
    │
    ▼
 /grill-me  or  /grill-with-docs  or  /grilling
    │
    ├─ one question at a time
    ├─ recommended answer each time
    ├─ explore code when facts live there
    └─ resolve decision-tree deps in order
    │
    ▼
Shared understanding (+ optional CONTEXT.md / ADRs)
    │
    ▼
(optional) to-spec → to-tickets → implement → …
```

Notes:

- **Does not implement by default**
- grill-me is **stateless**: alignment lives in the chat; durable artifacts need grill-with-docs
- Matt’s main build chain is roughly: `grill-with-docs → to-spec → to-tickets → implement → code-review`
- Huge / foggy efforts may start with **wayfinder**, then return to grilling

### Superpowers covers the full delivery pipeline

```text
You: “Let’s build X”
    │
    ▼
 using-superpowers (must check skills first)
    │
    ▼
 brainstorming  ← HARD-GATE: no code until design approved
    │  context → one-by-one Qs → 2–3 options → design sections → design doc
    ▼
 using-git-worktrees
    ▼
 writing-plans (2–5 min tasks with verification)
    ▼
 subagent-driven-development / executing-plans
    │  + test-driven-development (red-green-refactor)
    │  + requesting-code-review between tasks
    ▼
 finishing-a-development-branch (tests, merge/PR/cleanup)
```

Notes:

- **Auto-triggers** by design; you often don’t type `/brainstorm`
- Brainstorming hard-gates implementation skills until approval
- TDD, YAGNI, evidence-before-claims are first-class
- Subagents + worktrees support long unattended runs

## Mechanism differences

### 1. Invocation: you opt in vs it enforces

| Dimension | grill-me | Superpowers |
|-----------|----------|-------------|
| Default trigger | **User slash** `/grill-me` (`disable-model-invocation: true`) | **Session-level mandatory** skill checks |
| Skip risk | You can simply not call it | Designed so the model can barely skip |
| Fits | Keep your own pace; pressure on demand | Default engineering behavior |

This is the deepest product split:

- grill-me: **optional scalpel**
- Superpowers: **always-on seatbelt + full factory line**

### 2. The interview: similar, not identical

Both attack “code before clarity”:

| Shared | Detail |
|--------|--------|
| One question at a time | Avoid questionnaire dumps |
| Understand before building | Stop drive-by implementation |
| Prefer code exploration | Facts from the repo; decisions from you |
| Guided options | Superpowers: 2–3 approaches; grill-me: recommended answers |

Differences:

| | grill-me / grilling | Superpowers brainstorming |
|---|---------------------|---------------------------|
| Metaphor | **Decision-tree interrogation** | **Collaborative design + hard gates** |
| Artifacts | None by default; with-docs → glossary/ADR | Design doc path + commit habit |
| Visual | None built-in | Optional visual companion (browser mockups) |
| Downstream | Hands control back to you | Chains into writing-plans |

In one line: **brainstorming ≈ heavier, productized grilling hooked to a delivery pipeline**.

### 3. Coverage: point vs surface

| Lifecycle stage | grill-me family | Superpowers |
|-----------------|-----------------|-------------|
| Clarification / design | ✅ home turf | ✅ brainstorming |
| Ubiquitous language / ADR | ✅ grill-with-docs / domain-modeling | Design docs; weaker DDD framing |
| Implementation plan | Other skills (to-spec/tickets) | ✅ writing-plans |
| Isolated workspace | Not built-in | ✅ git worktrees |
| Execution | implement / tdd, etc. | ✅ SDD + TDD |
| Code review | code-review skill exists | ✅ inter-task review path |
| Branch finish | Loose | ✅ finishing-a-development-branch |
| Debugging method | diagnosing-bugs, etc. | ✅ systematic-debugging |
| Multi-harness | Agent Skills / installer | **First-class multi-platform plugins** |

### 4. Artifacts and “memory”

- **grill-me**: conversation is the artifact; cross-session reuse → grill-with-docs (`CONTEXT.md` + ADRs)
- **Superpowers**: defaults to specs under `docs/superpowers/specs/...`, plans and worktree lifecycle follow the flow

If you care about **project-level language**, Matt’s CONTEXT.md story is sharper. If you care about **feature delivery discipline**, Superpowers is thicker.

### 5. Weight and learning curve

| | grill-me | Superpowers |
|---|----------|-------------|
| Cognitive load | Tiny: one slash command | Medium–high: methodology + skill graph |
| Customization | Easy to fork small skills | Cross-agent consistency; higher bar to change |
| Trivial tasks | Easy to skip | Can feel heavy (even fans admit trivial work may not need it) |

## Pros and cons

### grill-me strengths

1. **Extremely light** — install and go  
2. **Clear control** — you choose when to pressure-test  
3. **Universal** — coding, courses, product decisions  
4. **Recommended answers** — turn open interrogation into fast yes/no  
5. **DDD-friendly chain** — grill-with-docs / domain-modeling turn alignment into assets  

### grill-me weaknesses

1. **Stops at alignment** — no implement/finish pipeline  
2. **No enforcement** if you forget to run it  
3. **One skill is not enough** for real delivery — you need the rest of the set  
4. Pure grill-me is **ephemeral** without with-docs  

### Superpowers strengths

1. **End-to-end methodology** — brainstorm to merge options  
2. **Forces skill use** — fights “skip TDD under pressure”  
3. **Subagents + worktrees + two-stage review** — long tasks  
4. **Official multi-harness support** — team tool-churn is cheaper  
5. **TDD / verification defaults** — higher quality baseline  

### Superpowers weaknesses

1. **Heavy** for small edits  
2. **Less agency** for people who hate being process-managed  
3. **Stacks badly** with other heavy methodologies if you install everything  
4. Debugging “why did it enter brainstorming again?” has a cost  

## Community color (anecdotal)

- Reddit/blog trifectas often list **Superpowers / get-shit-done / grill-me**
- Some call Superpowers more “elegant and complete,” grill-me a small “decision-driven” tip of the spear
- Others say Superpowers *feels* like endless questioning — similar to grill-me — but with a full engineering pipe behind it
- Matt’s own coding recommendation evolved: early viral grill-me; later prefer **grill-with-docs / domain-model chain** when aligning against a real codebase

## How to choose

### Pick grill-me (or grilling / grill-with-docs) if…

- Your main pain is **coding before alignment**
- You want **manual cadence**, not a default full process
- You grill **non-code decisions** often
- You like small skills and will compose `to-spec → tickets → implement` yourself
- You value **CONTEXT.md / ADRs** as cross-session assets  

### Pick Superpowers if…

- You want long **autonomous** runs that stay on rails  
- The team needs **shared engineering defaults** (TDD, plans, review)  
- You work across **Claude Code / Codex / Cursor**  
- You’ll trade process weight for fewer rewrites  
- You hate “simple task → half-baked patch”  

### The practical answer: combine, don’t oppose

They overlap on the entrance interview and complement on delivery:

```text
A (light):   /grill-me  →  implement yourself or plan mode
B (mid):     /grill-with-docs  →  to-spec  →  implement
C (heavy):   Superpowers full flow
D (hybrid):  grill first for high-stakes design,
             then Superpowers plan/execute
             (or keep Superpowers TDD/worktree only)
```

Practical tips:

1. **Install only one side for two weeks** and notice whether enforcement helps or irritates  
2. Already on Superpowers? Still use grill-me for **extra pressure tests** on risky designs  
3. Already on Matt’s full set? Don’t stack Superpowers just for stars unless you need worktree/SDD/multi-harness  
4. Trivial edits: skip both. High-risk architecture: use *some* form of interview either way  

## Summary table

| Dimension | grill-me | Superpowers |
|-----------|----------|-------------|
| Grain | Point skill (+ primitive/variants) | Methodology + skill library |
| Trigger | User slash primarily | Default auto + hard gates |
| Main value | Alignment, decision trees, shared understanding | Full-process discipline and delivery |
| Artifacts | Optional (with-docs) | Default design/plan paths |
| TDD / subagents / worktrees | Other skills or manual | Built into the chain |
| Multi-platform | Agent Skills / installer | Official multi-harness plugins |
| Best for | Pressure interviews, general decisions | Serious feature delivery |
| Risk | Unused = useless | Over-process |
| Relationship | **Entrance scalpel** | **Factory OS** |

## Quick install

**grill-me / Matt skills:**

```bash
npx skills@latest add mattpocock/skills --skill=grill-me -y -g
# preferred for coding:
npx skills@latest add mattpocock/skills --skill=grill-with-docs -y -g
```

Claude plugin:

```text
/plugin marketplace add mattpocock/skills
/plugin install mattpocock-skills@mattpocock
```

**Superpowers:**

```text
/plugin install superpowers@claude-plugins-official
```

See the Superpowers README for Cursor / Codex / OpenCode and others.

## Conclusion

- **grill-me** asks: *Before we write code, do we share the same understanding?*  
- **Superpowers** asks: *After we understand, how does the agent ship with engineering discipline?*  

Treating them as rival products undersells grill-me’s universality and Superpowers’ pipeline depth. A healthier model:

> **grill-me is the pressure-test primitive; Superpowers is the default engineering OS.**

One slot only: alignment pain → grill-me (or grill-with-docs); delivery discipline pain → Superpowers. Two slots: interview and domain language from Matt’s stack, plan/TDD/worktree from Superpowers — many strong workflows already mix them without writing it down.

---

## References

- [mattpocock/skills](https://github.com/mattpocock/skills) / [grill-me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) / [grilling](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling)
- [Matt · My Grill Me Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral)
- [Matt · The /grill-me Skill](https://www.aihero.dev/skills-grill-me)
- [obra/superpowers](https://github.com/obra/superpowers)
- [Jesse Vincent · Superpowers announcement](https://blog.fsck.com/2025/10/09/superpowers/)
