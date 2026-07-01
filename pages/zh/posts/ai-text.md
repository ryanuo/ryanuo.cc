---
title: AI读长文太慢？上下文压缩与摘要实战指南
date: '2026-06-28 16:25'
cate: 技术
description: 介绍如何使用AI处理过长文本，如上下文压缩、摘要与长文档处理。
---

## AI 处理过长文本的实践方案

随着大语言模型（LLM）的快速发展，越来越多的 AI 应用需要处理大量文本，例如：

- AI 对话（Chat）
- RAG（Retrieval-Augmented Generation）
- 文档问答
- GitHub README 分析
- 技术博客生成
- 企业知识库
- 长篇小说总结
- 多轮 Agent 对话

虽然目前主流模型已经支持较大的上下文窗口（Context Window），例如 128K、200K 甚至 1M Tokens，但在实际开发中仍然会遇到许多问题：

- API 调用成本随着 Token 增加而增加。
- 长上下文导致模型响应速度下降。
- 第三方代理服务通常限制上下文长度。
- 超长请求容易出现 `503 Service Unavailable`、超时等异常。
- 原始文档包含大量 Markdown、HTML、图片链接、重复内容等无效 Token。

因此，在将文本发送给 AI 之前，通常需要先对文本进行压缩，提高信息密度，减少 Token 消耗。

## 常见处理方式

目前比较常见的上下文管理方式主要有以下几种。

### 按消息数量截断

仅保留最近 N 条历史消息。

例如：

```text
A
B
C
D
E
F
G

↓

E
F
G
```

优点：

- 实现简单
- 性能高

缺点：

- 可能删除重要历史消息
- 上下文容易丢失

### 按 Token 长度截断

统计当前上下文 Token，当超过限制时删除最早的内容。

例如：

```python
while token_count(messages) > MAX_TOKEN:
    messages.pop(0)
```

优点：

- 能保证不会超过模型限制

缺点：

- 重要信息可能被删除
- 冗余文本仍然存在

## 为什么要做摘要（Summarization）

摘要并不是简单删除文字，而是**提高信息密度（Information Density）**。

例如：

原文：

> 火山方舟是火山引擎推出的大模型平台，提供模型训练、推理、评测、精调等全方位功能与服务。平台支持多种主流大模型接入，具有稳定可靠、安全互信的特点。企业可以通过火山方舟快速构建自己的 AI 应用，降低开发成本与技术门槛。

摘要：

> 火山方舟是火山引擎的大模型平台，支持多模型，可帮助企业快速构建 AI 应用。

摘要能够：

- 保留核心事实
- 删除重复描述
- 提高信息密度
- 降低 Token 消耗
- 延长多轮对话能力

相比直接截断历史消息，摘要更适合作为长期上下文管理方案。

## 推荐处理流程

推荐采用流水线（Pipeline）方式处理长文本。

```text
Markdown
      │
      ▼
Markdown 清洗
      │
      ▼
文本规范化
      │
      ▼
抽取式摘要
      │
      ▼
生成式摘要（可选）
      │
      ▼
发送给 AI
```

## 第一阶段：Markdown 清洗

首先删除所有不会影响语义的格式信息，例如：

- Markdown 语法
- HTML 标签
- URL
- 图片
- Badge
- TOC
- Emoji
- 多余空格

例如：

### 原文

```markdown
# Hello

**ChatGPT**

[GitHub](https://github.com)

![logo](logo.png)
```

### 清洗后

```text
Hello

ChatGPT

GitHub
```

Python 示例：

```python
from markdown_compress import compress_markdown

with open("README.md", encoding="utf8") as f:
    text = f.read()

text = compress_markdown(text)
```

通常可以减少 **20%~40% Token**。

## 第二阶段：文本规范化

进一步统一文本格式。

例如：

```text
ＡＢＣ１２３

↓

ABC123
```

删除：

- 重复空格
- 多余空行
- 无意义字符
- Emoji

示例：

```python
text = normalize_text(text)
```

## 第三阶段：抽取式摘要

抽取式摘要不会重新组织语言，而是挑选最重要的句子。

常见算法：

- TextRank
- LexRank
- LSA
- TF-IDF
- Luhn

Python 常见库：

### SnowNLP

安装：

```bash
pip install snownlp
```

使用：

```python
from snownlp import SnowNLP

text = """
火山方舟是火山引擎推出的大模型平台。
平台支持多种模型。
企业可以快速构建 AI 应用。
"""

summary = SnowNLP(text).summary(2)

print(summary)
```

输出：

```text
[
  "火山方舟是火山引擎推出的大模型平台",
  "企业可以快速构建 AI 应用"
]
```

### TextRank（Summa）

安装：

```bash
pip install summa
```

使用：

```python
from summa.summarizer import summarize

summary = summarize(
    text,
    ratio=0.3,
)

print(summary)
```

其中：

```python
ratio=0.3
```

表示：

> 保留约 30% 的重要句子。

需要注意：

- ratio 是目标比例
- 并不是严格压缩到 30%

## 第四阶段：生成式摘要（LLM）

如果预算允许，可以利用大模型进一步压缩。

例如：

```python
from openai import OpenAI

client = OpenAI()

prompt = """
请将下面内容压缩到原文30%。

要求：

1. 保留所有事实
2. 删除重复
3. 删除示例
4. 输出纯文本
"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role":"system",
            "content":prompt
        },
        {
            "role":"user",
            "content":text
        }
    ]
)

print(response.choices[0].message.content)
```

相比抽取式摘要，大模型可以：

- 重写句子
- 合并重复信息
- 提高信息密度

但需要额外消耗 Token。

## Chunk（分块）处理

对于超长文本，不建议一次发送给 AI。

例如：

```text
100000 Token

↓

3000

3000

3000

3000
```

每块分别摘要。

最后再次总结。

```text
Chunk1

↓

摘要1

Chunk2

↓

摘要2

...

↓

最终摘要
```

这种方案通常称为：

> Map-Reduce Summary

Python 示例：

```python
chunks = split_by_token(text, 3000)

summaries = []

for chunk in chunks:
    summaries.append(ai_summary(chunk))

final = ai_summary("\n".join(summaries))
```

这是目前处理超长文档最常见的方法。

## 推荐实践

建议根据文本长度选择不同策略。

| 文本长度 | 推荐方案 |
|----------|----------|
| < 2K 字 | Markdown 清洗 |
| 2K~10K 字 | Markdown 清洗 + TextRank |
| >10K 字 | Markdown 清洗 + Chunk + AI 摘要 |

推荐流程：

```python
text = compress_markdown(text)

if token_count(text) > 3000:
    text = textrank_summary(text)

if token_count(text) > 5000:
    text = llm_summary(text)
```

## 常见问题

### summarize 为什么返回空字符串？

例如：

```python
summary = summarize(text, ratio=0.3)

print(summary)
```

输出：

```text

```

可能原因：

- 文本太短
- 中文支持有限
- 删除了所有换行
- 没有足够句子参与排序

建议：

- 保留句子边界
- 摘要完成后再压缩文本

## 参考资料

- OpenAI API Documentation：https://platform.openai.com/docs
- Anthropic Claude Documentation：https://docs.anthropic.com
- Google AI Documentation：https://ai.google.dev
- SnowNLP：https://github.com/isnowfy/snownlp
- Summa（TextRank）：https://github.com/summanlp/textrank
- Sumy：https://github.com/miso-belica/sumy
- 《15 天学会 AI 应用开发（五）使用 AI 摘要来压缩上下文消息》（火山引擎开发者社区）
