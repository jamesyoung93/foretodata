---
title: "Pre-Snap Tells and Offensive Predictability in the NFL"
date: 2025-01-07
description: "An exploratory classification study of pre-snap formation predictability and its association with on-field performance."
tags: ["sports-analytics", "machine-learning", "classification", "observational-analysis"]
section: "selected"
---

> This is an exploratory observational analysis. It identifies associations worth testing and does not estimate a causal effect of formation predictability.

Can defenses read a play before the snap? If they can, is that predictability associated with performance?

I used 2022 NFL tracking data to train classifiers on player positioning and formation features, measuring how readily each team's run and pass plays could be distinguished from pre-snap alignment alone. I then compared those predictability scores with team and player performance measures.

## The setup

Each play in the tracking data includes the x and y coordinates of all 22 players before the snap. The models used those positions and related formation features to classify run versus pass.

The original model reported a training AUC of about 0.788 and a test AUC of about 0.774. The close values suggest that the classifier retained useful signal on the held-out data without a large train-test gap.

Teams whose plays were easier to classify were described as having more transparent formations. Lower predictability meant the pre-snap alignment disclosed less about the play type.

## What showed up

**Team-level association.** Easier-to-read pre-snap alignments were associated with weaker run-blocking grades. The reported correlation was about -0.49.

**Players who changed teams.** In the observed sample, guards and quarterbacks who moved into more predictable schemes tended to receive lower grades. This comparison is suggestive, but it does not isolate the effect of scheme from role, personnel, coaching, opponent, or other changes that accompany a move.

**Examples within the season.** The Eagles and Bears appeared among the less predictable teams and also graded well in run blocking. Across teams, higher formation predictability generally coincided with lower blocking efficiency.

## What it means

The analysis supports a plausible hypothesis: pre-snap variation may make defensive anticipation harder and may also change how player performance should be interpreted across systems.

It does not prove that making a formation less predictable will improve performance. A stronger study would repeat the analysis across seasons, define a comparison group for scheme changes, adjust for game state and personnel, and report uncertainty around the team and player estimates.

The useful contribution is a measurable scheme-level feature that can be evaluated alongside conventional player and team metrics, not a causal verdict from one season of observational data.
