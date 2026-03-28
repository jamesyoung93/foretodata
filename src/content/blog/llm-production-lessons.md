---
title: "Lessons from Deploying LLMs in Production"
date: 2026-01-31
description: "What I learned shipping LLM applications to real users."
tags: ["llms", "mlops"]
---

LLMs are the first piece of software I've worked with that can look **shockingly correct** while being **quietly wrong**.

In a demo, that's charming. In production, it's a support ticket factory.

This post is my attempt to compress the stuff I wish someone had drilled into me earlier, especially the parts that *don't* show up in the "look, it works!" version.

---

## TL;DR (for people who actually have jobs)

- **Treat the LLM like an untrusted component.** It is not a deterministic function.
- **Your "model" is the workflow.** Prompts are a rounding error compared to routing, retrieval, validation, and fallbacks.
- **If you can't evaluate it, you can't ship it.** "Seems better" is not a metric.
- **RAG is an information retrieval problem wearing an LLM costume.**
- **Measure impact like an intervention.** Holdouts and causal thinking beat vibes.

---

## 1) The demo trap: production traffic is adversarial by default

Most LLM apps start like this:

1. You build a prompt.
2. It works on your five test questions.
3. Everyone gets excited.

Then reality shows up.

Real users:
- paste in weird formatting and giant blobs of text
- ask the same question 12 slightly different ways
- assume the model is authoritative
- accidentally (or intentionally) push it into edge cases
- treat error messages like a personal challenge

So the first lesson is simple:

> You don't "deploy a prompt." You deploy a system that has to survive contact with real behavior.

---

## 2) Rule #1: the model isn't the product. The workflow is.

If your LLM feature is good in production, it's rarely because the model is "smart."
It's because the *workflow* makes it hard for the model to fail in expensive ways.

The workflow includes:
- intent capture (what does the user actually want?)
- routing (LLM vs search vs template vs "I can't do that")
- retrieval (if you're grounding)
- formatting + schema constraints
- validation + fallbacks
- UX that encourages review and makes uncertainty legible

This is also where classic ML experience transfers perfectly: most real value lives in the glue.

---

## 3) Prompts don't scale. Guardrails scale.

Prompts matter… but prompts don't scale the way people want them to.

A prompt is basically a config file. If it's turning into a 600-line novel:
- you're writing code in the wrong place
- and your "fixes" are probably creating new failure modes elsewhere

What scales better:

### A) Structured outputs
- JSON schemas
- function calling / tool interfaces
- validation with hard fail + retry
- "If it fails validation, it doesn't ship."

### B) Decomposition
Instead of one mega-call, split into cheap steps:

1) **Classify intent** (cheap)
2) **Retrieve / filter** (deterministic-ish)
3) **Generate** (expensive)
4) **Verify / format** (cheap)
5) **Policy + safety checks** (cheap)

This buys you:
- better debuggability
- lower cost
- fewer "magic prompt" dependencies

### C) Fallbacks that don't embarrass you
Fallbacks aren't failure. They're reliability.

Examples:
- "Here are the top 5 relevant docs; want a summary?"
- "I'm not confident; ask it this way"
- "Try again later" (with a graceful explanation)
- "Human review required" for high-risk actions

---

## 4) Reliability is mostly ops (timeouts, drift, and cost)

Treat an LLM call like a flaky external API. Because it is.

What you need in production:
- **timeouts**
- **retries** (carefully; retries multiply cost)
- **rate limits**
- **caching**
- **circuit breakers** when providers degrade
- **versioning** (prompt versions + model versions + retrieval corpus versions)

One practical way to think about it:

> MLOps is just SRE with a bigger uncertainty budget.

---

## 5) If you're doing RAG, retrieval quality is the bottleneck

RAG is not "add a vector DB."

RAG is:
- chunking strategy
- metadata
- filters
- hybrid retrieval (often better than pure semantic)
- reranking
- context packing (what actually makes it into the prompt)

Two habits that save weeks of confusion:

### A) Evaluate retrieval separately
If the correct chunk wasn't retrieved, the model never had a chance.

### B) Require citations (even internally)
If the model can't point to *where* it got the answer, you can't debug it—and users won't trust it.

When RAG apps fail, it's often not hallucination.
It's **confident answers based on the wrong context**.

---

## 6) Security isn't optional (prompt injection is real)

If your system reads untrusted text (web pages, docs, emails) and the model can take actions, you should assume someone will try to mess with it.

The most useful mindset shift:

> The model will blur "instructions" and "data." Your system must separate them.

A pragmatic defense-in-depth posture:
- least-privilege tool access
- allowlists for actions
- sanitize outputs (especially anything that becomes a tool input)
- log and monitor suspicious patterns
- constrain tools so the model *can't* do dangerous things even if it wants to

Also: if you're building agentic systems, be careful about "excessive agency."
The more you let the model do, the more you're building an exploit surface. (And yes, this shows up in real security taxonomies.)

---

## 7) The eval loop is the real deployment

The first time users touch your LLM app, you stop being a builder and become an operator.

You're now dealing with:
- distribution shift
- prompt regressions
- retrieval drift (docs change constantly)
- provider updates that move behavior
- cost creep

The best operating rhythm I've found is boring—and that's the point:

- **Daily:** sample real conversations (inputs + outputs)
- **Weekly:** run eval suite + review failures
- **Monthly:** revisit risk controls, costs, and UX friction

If you do nothing else, do this:

> Look at real outputs regularly. Dashboards don't replace eyeballs.

---

## 8) Measure impact like an intervention (holdouts beat vibes)

This is where causal inference thinking pays rent.

LLM features are interventions in a live system.
If you can't describe the counterfactual, you can't be confident you helped.

Three practical patterns:

### A) Holdouts when you can
Even small holdouts protect you from:
- seasonality
- novelty effects
- selection bias (power users adopt first)
- multiple simultaneous product changes

### B) Instrument behavior, not just "quality"
Log the funnel:
- request → route → retrieval → generation → validation → user action → business metric

### C) Use quasi-experiments when you can't A/B
Phased rollout? Difference-in-differences.
Adoption-driven? Matching / weighting.
The goal isn't academic perfection. The goal is not lying to yourself.

---

## A production checklist I actually use

### Product
- [ ] Clear user job-to-be-done
- [ ] Success metric + counterfactual plan
- [ ] UX supports review/edit

### Reliability
- [ ] Timeouts, retries, fallbacks
- [ ] Rate limits + caching
- [ ] Versioning for prompts/models/corpus

### Evaluation
- [ ] Offline eval set representing real traffic
- [ ] Regression tests
- [ ] Online measurement with holdouts or phased rollout

### Security
- [ ] Least-privilege tools
- [ ] Output sanitization + validation
- [ ] Audit logs + anomaly monitoring

### RAG (if applicable)
- [ ] Retrieval metrics
- [ ] Chunking + metadata strategy
- [ ] Citations in responses

---

## Closing thought

Most LLM pain comes from treating a probabilistic system like deterministic software.

If you treat the LLM as an untrusted component, put a real workflow around it, build evaluation into the loop, and measure it like any other intervention, you end up shipping things that survive real users.

That's the whole game.

#llms
#mlops

---

### Further reading (if you want to go deeper)
- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- NIST AI RMF 1.0 (PDF): https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf
- OpenAI evaluation best practices: https://platform.openai.com/docs/guides/evaluation-best-practices
- Anthropic: Building Effective Agents: https://www.anthropic.com/research/building-effective-agents
