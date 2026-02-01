---
title: "A Practical Guide to Causal Inference in ML"
date: 2026-01-31
description: "Moving beyond correlation to understand what actually drives your metrics."
tags: ["causal-inference", "tutorial"]
---

_*~12 minute read. Written for people who have shipped models, stared at dashboards, and felt that quiet dread of not knowing what actually moved the needle.*_

Most teams I work with start with a perfectly reasonable plan:

1) predict the metric
2) find the "top drivers"
3) pull those levers
4) celebrate

And then the metric… doesn't move. Or worse: it moves in the wrong direction.

This isn't because people lack the skills. It's because **prediction** and **intervention** are different games.

A predictive model can be *accurate* and still be useless for answering:
> "If we change X, does Y change?"

That question is causal inference.

This post is my practical workflow for doing causal inference in ML without turning it into a thesis. It's not exhaustive, but it's the approach that keeps me out of trouble.

---

## The running example (keep this in your head)

Let's say we run a business, and we do outreach.

- **Treatment (T):** "We sent the offer email"
- **Outcome (Y):** "They purchased in 7 days"

You build a classifier and it says:
- "Email sent" is a huge "driver" of purchase
- SHAP agrees
- Everyone nods

So you send more emails.

Purchase doesn't budge.

Why?

Because in the real world, we often **send emails to people who already look like they're going to buy**.

That's the theme of this entire post:
**your system selects who gets treated, and it's rarely random.**

---

## Question 1: What's the difference between prediction and causation?

### Background
Prediction answers:
> "Among people who did and didn't get the email, who bought?"

Causation answers:
> "If we *force* someone to get the email, do they buy more than if we *force* them not to?"

Those "force" worlds are counterfactuals. You never observe both for the same person. So you approximate the missing world by constructing a believable comparison group.

### Answer (the simplest mental model)
A causal effect is:

$$
E[Y \mid do(T=1)] - E[Y \mid do(T=0)]
$$

That little `do( )` is the whole story. It means "we intervened," not "we observed."

If you don't build something that resembles an intervention — an experiment, a quasi-experiment, or a careful observational design — then feature importance is mostly telling you what correlates with your outcome inside your current selection process.

---

## Question 2: What is a confounder, in plain English?

A **confounder** is anything that makes both of these true:

- it affects whether someone gets treated
- it affects the outcome

In the email example, common confounders are:
- prior engagement
- prior purchases
- intent signals
- segment assignment rules
- rep prioritization (if humans are deciding outreach)

This is why "treated vs untreated" comparisons are usually biased:
the groups are different *before treatment ever happens*.

---

## Step 0: Write the "target trial" you wish you ran

If I had to pick one habit that immediately improves causal work: it's this.

Before modeling, write down the experiment you *wish* you could run:

- **Unit:** user? account? territory? session?
- **Eligibility:** who's in? who's out?
- **Treatment:** what exactly is being applied, and when?
- **Control:** what does "no treatment" mean operationally?
- **Outcome:** precisely what metric, and over what window?
- **Estimand:** average effect? effect on treated? uplift by subgroup?

If you can't describe this cleanly, you don't have a causal estimate yet — you have an idea.

_(If you've never done this, it feels "extra." Then you do it once and realize it prevents weeks of ambiguity.)_

---

## Step 1: If you can randomize, do it

Randomization is not "academic purity." It's operational leverage.

It breaks the link between treatment assignment and the hidden stuff you didn't measure.

In our example, randomization answers:
> "What happens if we send the email to a random subset of eligible users?"

Practical notes:
- randomize at the **right level** (avoid spillovers / interference)
- log **assignment** and **actual exposure**
- pick **guardrails** (unsubscribe, complaints, refund rate, latency)
- predefine the **decision rule** (you want fewer arguments later)

If you have any control over the system, this is the simplest win.

---

## Step 2: If you *can't* randomize, pick a *design* (not just an estimator)

This is where most "causal ML" goes sideways.

People jump straight to:
- propensity models
- doubly robust methods
- fancy learners

…but skip the actual identification strategy.

Here's the decision tree I use:

### 2A) You have a rollout and a comparison group
Start with **Difference-in-Differences (DiD)**.

The idea:
- compare before/after change in treated group
- subtract before/after change in untreated group

The big assumption: **parallel trends** (the groups would have moved similarly absent treatment).

If you have multiple geos / markets / territories, DiD is often the cleanest observational workhorse.

### 2B) You have rich covariates and believe selection is "explainable"
Use **adjustment** methods:
- regression adjustment
- matching
- weighting (IPW)
- doubly robust / DML

The big assumption: **no unmeasured confounding** (conditional ignorability) plus **overlap**.

### 2C) Treatment is based on a cutoff
Consider **Regression Discontinuity (RD)**.

This is underrated in product/ops contexts:
- score > threshold → gets treatment
- score < threshold → does not

If people can't manipulate around the threshold, RD can be very credible.

### 2D) You have a credible "push" that affects treatment but not outcome directly
That's **Instrumental Variables (IV)** territory.

Hard to find in business. Occasionally real. Usually abused. (Be careful.)

---

## Step 3: Draw a causal graph (even a bad one)

I don't mean you need perfect DAGs. I mean you should do *something* that forces you to stop blindly "controlling for everything."

Three variables to be careful about:

### Confounders (adjust)
They cause both treatment and outcome.

### Mediators (don't adjust if you want total effect)
If treatment causes the mediator, and mediator causes outcome, controlling for it erases part of the treatment effect.

Example:
- Email → site visits → purchases
If you control for site visits, you're partially blocking the email's pathway.

### Colliders (conditioning can create bias)
If two things cause a third thing, controlling for the third can create a fake relationship between the causes.

You don't need to become a graph theorist. You just need to avoid common pitfalls.

---

## Step 4: Where ML actually fits

ML is useful in causal estimation when it's doing *nuisance estimation*:

- **propensity model:** $P(T=1 \mid X)$
- **outcome model:** $E(Y \mid T, X)$
- **heterogeneity:** how effects vary by segment

But here's the caution:

> **SHAP does not magically turn a predictive model into a causal model.**

A model can be:
- well-calibrated
- high AUC
- stable across folds

…and still be wrong about what happens when you intervene.

### My "safe default" when observational assumptions are plausible
Use **doubly robust / double machine learning** style estimators.

Why I like them in practice:
- they let you model the nuisance pieces flexibly
- they reduce sensitivity to mis-specification (not eliminate it)
- they play nicely with cross-fitting to avoid overfitting the causal parameter

It's not a silver bullet. It's just a good hammer when you've actually built a nail.

---

## Step 5: You need overlap (or you're doing extrapolation)

This is the quiet killer of causal projects.

If the treated and control populations don't overlap, your model is effectively answering:
> "What would happen if we treated a type of user we never actually treat?"

That's extrapolation. Sometimes necessary. Often dangerous.

Practical checks:
- propensity score distributions (are they all ~0 or ~1?)
- covariate balance after weighting/matching
- effect stability across trimming thresholds

If there's no overlap, the fix is usually not "a better model."
It's redefining the question:
- narrower eligibility
- different unit
- different intervention
- different measurement window

---

## Step 6: Try to break your own result

Prediction has train/test splits.

Causal work needs something else:
**stress tests and refutations.**

Things I like in applied work:
- placebo treatment (replace treatment with random noise → effect should vanish)
- placebo outcome (choose an outcome treatment shouldn't affect)
- pre-trends checks (for DiD)
- sensitivity analysis ("how strong would an unmeasured confounder need to be?")
- specification robustness (does the estimate swing wildly with small changes?)

The goal isn't to "prove causality."
The goal is to understand how fragile your conclusion is.

---

## How I explain causal results to stakeholders (the script)

When you're presenting causal work, don't lead with:
- "We used XGBoost + DML + cross-fitting…"

Lead with:
1) **Here's the decision we're trying to make**
2) **Here's the intervention we're evaluating**
3) **Here's the counterfactual we constructed (and why it's believable)**
4) **Here are the assumptions**
5) **Here are the stress tests**
6) **Here's what I'd do next (rollout plan + measurement plan)**

People don't need the estimator. They need the logic.

---

## The pocket checklist (print this mentally)

If you're trying to decide whether to trust a causal estimate, ask:

- Did we define the target trial?
- Could we randomize? If not, why not?
- What design are we using (DiD / RD / matching / IV)?
- Are we adjusting for pre-treatment confounders (not mediators/colliders)?
- Do treated/control overlap?
- Did we run refutations / placebos / robustness checks?
- Is the result stable enough to act on?
- What's the rollout + monitoring plan?

If you can't answer half of these, you don't have a causal estimate yet.
You have an analysis.

---

## Minimal code skeleton (DoWhy-style workflow)

This is intentionally barebones. The point is the *sequence*:
**model → identify → estimate → refute**.

```python
import pandas as pd
from dowhy import CausalModel

# df includes:
# treated (0/1), outcome, and pre-treatment covariates

treatment = "treated"
outcome = "revenue_7d"
confounders = [
    "prior_30d_revenue",
    "prior_30d_sessions",
    "tenure_days",
    "region",
    "device_type",
]

model = CausalModel(
    data=df,
    treatment=treatment,
    outcome=outcome,
    common_causes=confounders
)

estimand = model.identify_effect()

# Start simple: regression adjustment
estimate = model.estimate_effect(
    estimand,
    method_name="backdoor.linear_regression"
)
print("ATE:", estimate.value)

# Refute: placebo treatment should go ~0
placebo = model.refute_estimate(
    estimand,
    estimate,
    method_name="placebo_treatment_refuter",
    placebo_type="permute"
)
print(placebo)
```
