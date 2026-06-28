---
title: AI Text Compression & Summarization
date: "2026-06-28 16:25"
cate: Tech
description: Learn how to process long text efficiently with AI using context compression, text summarization, and long document handling techniques.
---

## Practical Approaches for Processing Long Text with AI

As Large Language Models (LLMs) continue to evolve, more and more AI applications are required to process large amounts of text, including:

* AI Chat Applications
* Retrieval-Augmented Generation (RAG)
* Document Question Answering
* GitHub README Analysis
* Technical Blog Generation
* Enterprise Knowledge Bases
* Long-form Article Summarization
* Multi-turn Agent Conversations

Although modern LLMs support increasingly large context windows (e.g., **128K**, **200K**, or even **1M Tokens**), developers still face several practical challenges:

* API costs increase as token usage grows.
* Large contexts result in slower inference.
* Many third-party API providers impose smaller context limits.
* Extremely long requests may lead to errors such as `503 Service Unavailable` or request timeouts.
* Original documents often contain a significant amount of unnecessary tokens, such as Markdown syntax, HTML tags, image links, and duplicated content.

Therefore, before sending text to an AI model, it is generally recommended to compress the content, increase information density, and reduce overall token consumption.

---

## Common Approaches

Several common strategies are used to manage long conversation histories.

### Truncating by Message Count

Only keep the most recent **N** messages.

Example:

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

Advantages:

* Easy to implement
* High performance

Disadvantages:

* Important historical information may be lost.
* Context continuity cannot be guaranteed.

---

### Truncating by Token Count

Calculate the total number of tokens and remove the oldest messages once the limit is exceeded.

Example:

```python
while token_count(messages) > MAX_TOKEN:
    messages.pop(0)
```

Advantages:

* Guarantees that requests stay within the model's context limit.

Disadvantages:

* Important information may still be discarded.
* Redundant content remains in the context.

---

## Why Summarization?

Summarization is not simply about removing words—it is about **increasing information density**.

Original text:

> Volcano Ark is a large language model platform launched by Volcano Engine, providing model training, inference, evaluation, and fine-tuning capabilities. The platform supports multiple mainstream LLMs and enables enterprises to rapidly build AI applications while reducing development costs and technical barriers.

Summary:

> Volcano Ark is an LLM platform that supports multiple models and helps enterprises quickly build AI applications.

Benefits of summarization:

* Preserves key facts
* Removes redundant information
* Increases information density
* Reduces token consumption
* Extends multi-turn conversation capability

Compared with simply truncating history, summarization provides a much more effective long-term context management strategy.

---

## Recommended Processing Pipeline

A pipeline-based workflow is recommended for handling long documents.

```text
Markdown
      │
      ▼
Markdown Cleaning
      │
      ▼
Text Normalization
      │
      ▼
Extractive Summarization
      │
      ▼
Generative Summarization (Optional)
      │
      ▼
Send to AI
```

---

## Stage 1: Markdown Cleaning

First, remove formatting information that does not contribute to semantic understanding.

Examples include:

* Markdown syntax
* HTML tags
* URLs
* Images
* Badges
* Table of Contents
* Emojis
* Extra whitespace

### Original

```markdown
# Hello

**ChatGPT**

[GitHub](https://github.com)

![logo](logo.png)
```

### Cleaned

```text
Hello

ChatGPT

GitHub
```

Python example:

```python
from markdown_compress import compress_markdown

with open("README.md", encoding="utf8") as f:
    text = f.read()

text = compress_markdown(text)
```

This stage typically reduces **20%–40%** of tokens.

---

## Stage 2: Text Normalization

Normalize the text into a consistent format.

Example:

```text
ＡＢＣ１２３

↓

ABC123
```

Normalization typically includes:

* Removing duplicate spaces
* Removing extra blank lines
* Removing meaningless characters
* Removing emojis

Example:

```python
text = normalize_text(text)
```

---

## Stage 3: Extractive Summarization

Extractive summarization selects the most important sentences without rewriting them.

Common algorithms include:

* TextRank
* LexRank
* LSA
* TF-IDF
* Luhn

### SnowNLP

Install:

```bash
pip install snownlp
```

Example:

```python
from snownlp import SnowNLP

text = """
Volcano Ark is an LLM platform.
It supports multiple AI models.
It helps enterprises build AI applications quickly.
"""

summary = SnowNLP(text).summary(2)

print(summary)
```

Output:

```text
[
    "Volcano Ark is an LLM platform.",
    "It helps enterprises build AI applications quickly."
]
```

---

### TextRank (Summa)

Install:

```bash
pip install summa
```

Example:

```python
from summa.summarizer import summarize

summary = summarize(
    text,
    ratio=0.3,
)

print(summary)
```

Here,

```python
ratio = 0.3
```

means:

> Keep approximately **30%** of the most important sentences.

**Note:**

* `ratio` is only a target proportion.
* The actual output length may vary.

---

## Stage 4: Generative Summarization (LLMs)

If your budget allows, an LLM can further compress the content by rewriting it.

Example:

```python
from openai import OpenAI

client = OpenAI()

prompt = """
Compress the following content to approximately 30% of its original length.

Requirements:

1. Preserve all factual information.
2. Remove duplicated content.
3. Remove examples.
4. Output plain text only.
"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": prompt
        },
        {
            "role": "user",
            "content": text
        }
    ]
)

print(response.choices[0].message.content)
```

Compared with extractive summarization, LLMs can:

* Rewrite sentences
* Merge duplicated information
* Produce much higher information density

However, this also consumes additional tokens.

---

## Chunk-Based Processing

Very large documents should **not** be sent to the model in a single request.

Instead, split the document into smaller chunks.

Example:

```text
100000 Tokens

↓

3000

3000

3000

3000
```

Summarize each chunk independently.

Finally, summarize the merged summaries.

```text
Chunk 1

↓

Summary 1

Chunk 2

↓

Summary 2

...

↓

Final Summary
```

This strategy is commonly known as the **Map-Reduce Summarization** approach.

Python example:

```python
chunks = split_by_token(text, 3000)

summaries = []

for chunk in chunks:
    summaries.append(ai_summary(chunk))

final = ai_summary("\n".join(summaries))
```

This is currently one of the most widely used techniques for processing long documents.

---

## Recommended Practices

Choose different strategies based on document size.

| Document Size     | Recommended Strategy                             |
| ----------------- | ------------------------------------------------ |
| < 2K characters   | Markdown Cleaning                                |
| 2K–10K characters | Markdown Cleaning + TextRank                     |
| > 10K characters  | Markdown Cleaning + Chunking + LLM Summarization |

Example:

```python
text = compress_markdown(text)

if token_count(text) > 3000:
    text = textrank_summary(text)

if token_count(text) > 5000:
    text = llm_summary(text)
```

---

## Frequently Asked Questions

### Why does `summarize()` return an empty string?

Example:

```python
summary = summarize(text, ratio=0.3)

print(summary)
```

Possible reasons:

* The document is too short.
* Chinese language support is limited.
* Sentence boundaries have been removed.
* There are too few valid sentences for ranking.

Recommendation:

* Preserve sentence boundaries before summarization.
* Perform aggressive text compression only after summarization.

---

## References

* OpenAI API Documentation: https://platform.openai.com/docs
* Anthropic Documentation: https://docs.anthropic.com
* Google AI Documentation: https://ai.google.dev
* SnowNLP: https://github.com/isnowfy/snownlp
* Summa (TextRank): https://github.com/summanlp/textrank
* Sumy: https://github.com/miso-belica/sumy
* *15 Days to Learn AI Application Development (Part 5): Using AI Summarization to Compress Conversation Context* (Volcano Engine Developer Community)
