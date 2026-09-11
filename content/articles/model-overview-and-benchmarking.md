---
title: "Model Overview and Benchmarking"
category: "Evaluation"
date: "2026-09-10"
excerpt: "Benchmarks can be a useful way to compare models, but only if you know what the benchmark measures, and how they can be duped."
parent: "root"
readingTime: 6
---

> “When a measure becomes a target, it ceases to be a good measure”
>
> — Charles Goodhart

![Artificial Analysis' Intelligence Index](https://www.deeplearning.ai/_next/image?url=https%3A%2F%2Fcharonhub.deeplearning.ai%2Fcontent%2Fimages%2F2026%2F01%2FArtificial-Analysis-Revamps-Intelligence-Index-1.png&w=3840&q=75)

With 9 new models releasing since September 2026, the AI scene is moving at a faster pace than ever. Benchmarks can be a useful way to compare models, but only if you know what the benchmark measures, and how they can be duped.

This article will focus less on the current models, as they are constantly changing. Instead, we will focus on what goes into their evaluation and benchmarking.

## The model landscape

Let's begin by providing a concise summary of the model landscape:

**Frontier models:** The most advanced, state-of-the-art models operating at the absolute boundary of AI capabilities. All frontier models are also foundational models.

**Foundational models:** Any large AI model trained on massive-scale data that can be fine-tuned to perform a wide variety of tasks.

### Models by Company

- **OpenAI**
  - GPT-6 Astra/Astra Pro – good at autonomous computer use, 3D spatial reasoning/CAD, and multi-agent workflows
  - GPT-5.6 Sol, Terra, Luna
- **Anthropic**
  - Fable 5.1/Mythos 5.1 – known for software engineering and long-horizon work
  - Opus 5
  - Sonnet/Haiku
- **SpaceXAI**
  - Grok 4.6 – known for real-time news and social media feeds, and fewer safeguards/restrictions
- **Meta**
  - Muse Spark 1.3 – known for low-cost API tool orchestration and coding agents
- **Google**
  - Gemini 3.8 Flash – known for quick TTFT and low cost
- **Zhipu AI** (open-weight)
  - GLM-5.3 – known for low cost-per-task and terminal-based coding
- **Alibaba** (open-weight)
  - Qwen 3.8 – known for autonomous long-horizon tasks
- **Deepseek** (open-weight)
  - DeepSeek 4.1 – known for agentic tasks and low cost
- **Kimi** (open-weight)
  - Kimi K3 – known for context retrieval and scientific computing

**Benchmarking**

Benchmarks are tests that measure some aspect of a model. Just like kids in school, models are presented with problems and are graded based on a rubric. Common benchmarks include price per output token, coding and software engineering skills, end-to-end latency, context retention, and reasoning.

There are also benchmarks that measure human preference. For example, LMArena allows users to rate two LLMs relative to each other, giving them elo for a leaderboard. 

The main entities that create benchmarks are aggregators, academics, nonprofits and independent research organizations, and frontier labs themselves.

**Aggregators and leaderboards**

These groups run existing tests under a standardized setup, and publish rankings. They don't create their own tests. This directly compares model performances with each other under identical conditions.

A well known aggregator is Artificial Analysis, which has an intelligence score, a weighted index of ten separate evaluations. BenchLM similarly aggregates benchmark results from various sources and compares them.

**Academics**

These benchmarks are created by academia and typically involve a research paper and a dataset file. The research group creates or collects tasks with known correct answers and publishes them, forming a benchmark.

- **MMLU** tests broad academic and professional knowledge across 57 subjects in a multi-choice format. However, due to pretraining, it is now highly saturated and contaminated.
- **GPQA** tests deep graduate-level reasoning in physics, chemistry, and biology, and was created by PhD experts. It is moderately saturated due to frontier models being able to exhaustively verify equations.
- **SWE-bench** tests real-world coding agent capabilities by providing the model with a real Github issue and requiring the fix to pass unit tests. This benchmark was sometimes exploited, when agents would alter the test harness to report artificial passes rather than fixing the actual bug.

**Nonprofits and Research Orgs**

Independent organizations sought to create benchmarks that could not be saturated or gamed. They wanted to test fluid intelligence, or the ability to adapt to a new situation than previously seen, as LLMs have high crystallized intelligence due to pre-training.

- **ARC-AGI** presents visual grid puzzles using fundamental concepts like symmetry, containment, and object counting. However, it can be gamed by trial-and-error approaches which don’t demonstrate general intelligence (efficient skill acquisition).
- **FrontierMath** was designed with mathematicians to create original, research-grade math problems that are extremely difficult. The problems are original and cannot be web-scraped, which prevents cheating. However, the problems are so difficult that sometimes the creators miss edge cases and struggle on a ground truth.
- **Humanity’s Last Exam** was created by the Center for AI Safety and contains 2,500+ multidisciplinary questions. In order for a question to be added to the benchmark, it had to stump frontier LLMs. LLMs initially scored around 5-15%. However, this led to some questions in the benchmark involving extremely niche trivia that required no reasoning. In addition, evaluation scores depended highly on how much compute an evaluator allows the model.

**Frontier labs**

Frontier labs build their own benchmarks and publish them. Obviously, this could create a conflict of interest situation, or the labs might tailor their models such that they perform the best on the benchmarks they themselves created.

## Saturation

When all models begin to perform exceptionally well on a benchmark, we consider that benchmark to be saturated, and it no longer gives meaningful comparisons between multiple models.

## Benchmaxxing: A caveat on benchmarking

Benchmaxxing refers to models optimizing for performance on benchmark tests while not performing to the same degree when given general tasks, and is often the cause of saturation. It can be done through data contamination, where a benchmark’s answers are found in the model’s pretraining data; people can fine-tune models to output data in the exact format of the test; or agents might tamper with the testing infrastructure to fake a good score while not solving the problem.

New benchmarks rarely contain multiple choice questions or answers that can be found in a model’s pre-training. However, there are new ways to game benchmarks. One way is throwing massive amounts of compute at the problem, and another way is through agent scaffolding wrappers that aid the model and obscure its raw capabilities.

## Application 
When you are looking for models, it's helpful to take into account how well they perform on benchmarks that test specific capabilities important for your use case. 

Benchmarks are interesting and worth thinking about in order to judge models relative to each other. But ultimately, I see benchmarks as moving goalposts. When a new benchmark emerges, models begin to optimize for that benchmark, and then the benchmark becomes saturated, and will have to undergo revision. 

They're meaningful - but only to an extent, and many times, personal usage experience doesn't align with benchmark scores. 