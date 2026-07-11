---
title: "Pre-Snap Tells and Offensive Predictability in the NFL"
date: 2025-01-07
description: "Using ML classification on NFL tracking data to measure how formation predictability correlates with on-field performance."
tags: ["sports-analytics", "machine-learning", "classification"]
---

Can defenses read your play before the snap? And if they can, does it actually hurt you?

I used 2022 NFL tracking data to train classification models on player positioning, measuring how easily each team's plays could be predicted from pre-snap alignments alone. Then I checked whether that predictability correlated with performance.

## The setup

Every play in the NFL tracking dataset includes x/y coordinates for all 22 players at the moment before the snap. I trained models to classify run vs. pass using only those positions and formation features.

Teams whose plays were easier to classify had more "transparent" formations. Teams whose plays were harder to classify were running less predictable schemes.

## What showed up

**Formation transparency matters.** Teams with easy-to-read pre-snap alignments showed weaker run-blocking grades, with a correlation around -0.49 against team predictability metrics.

**Guards and QBs feel it most.** When players moved to more transparent schemes, their individual grades dropped. This supports the idea that scheme unpredictability has value independent of roster talent.

**Team-level patterns were clear.** The Eagles and Bears ran less predictable formations and graded better in run blocking. Teams that ranked high on predictability scored lower on blocking efficiency.

## What it means

Coaching staffs probably already know this intuitively, but this puts a number on it. Diversifying formations and concealing play-calling tendencies through alignment variations has measurable value. Front offices could factor scheme predictability into how they evaluate player performance across different systems.

