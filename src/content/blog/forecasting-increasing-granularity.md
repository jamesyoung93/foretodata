---
title: "Forecasting at Increasing Granularity"
date: 2023-01-30
description: "What changes when one aggregate forecast becomes thousands of product, geography, and segment forecasts."
tags: ["forecasting", "time-series", "decision-systems", "model-evaluation"]
---

An aggregate forecast can look stable while the series beneath it are sparse, volatile, and difficult to maintain. That difference matters when a planning process moves from one total to thousands of product, geography, and segment forecasts.

## One forecast becomes a hierarchy

Consider a parts business with four levels:

1. Total parts sold worldwide
2. Sales by country
3. Sales by district within each country
4. Sales by customer segment within each district

The hierarchy can represent other structures, but the operating problem is the same. Each additional level creates more series, thinner data, and more opportunities for the forecasts to disagree with one another.

Granular forecasts are still useful because many decisions happen below the total. Inventory, staffing, marketing, and account planning usually require a view of where demand may occur, not only how much demand exists overall.

## Signal becomes thinner

Aggregation smooths local variation. A national series may show a clear trend while individual stores alternate between zero demand and short bursts of activity. At the lower level, the model has less signal and more noise.

The right question is not whether every granular forecast can match the accuracy of the total. It is whether the lower-level forecast improves the decision compared with the available baseline, including a field estimate or a simple seasonal rule.

Evaluation should therefore be reported by level and by series type. A single average can hide poor performance on the sparse or high-value series that matter most.

## Forecasts need to agree

A hierarchy creates a coherence problem. The country forecasts may not add up to the worldwide forecast, and district forecasts may not add up to their country totals.

A simple top-down adjustment scales the lower-level forecasts so they sum to a higher-level forecast. This can be useful when the aggregate series carries a stronger signal, but it does not guarantee better accuracy for every lower-level series.

It is one member of a broader family of reconciliation methods. Bottom-up, top-down, and optimal reconciliation approaches such as MinT make different assumptions about where the reliable information sits. The method should be tested through backtesting rather than chosen by intuition alone.

## Compute grows quickly

Suppose a company forecasts 100 products, four variants of each product, and ten geographies. That is 4,000 series. At ten seconds per model, one run takes about 11 hours before monitoring, retries, or downstream reporting.

Independent univariate models can still be appropriate, but they are not the only option. Global models learn across many related series in one training process and can reduce both runtime and maintenance overhead. They may also share information across sparse series.

The tradeoff is that global models introduce their own design choices: series identifiers, lag features, leakage control, cold starts, and evaluation across heterogeneous groups. Faster training is useful only if the model remains valid for the planning horizon and the decisions it supports.

## Missing is not the same as zero

Granular data creates more missing periods. If a product has no row for last month, that absence may mean zero sales, a delayed feed, a discontinued item, or a change in the product hierarchy.

Filling every missing value with zero is safe only after the data-generating process is understood. The pipeline should make the distinction explicit and record why a gap was filled. Otherwise, preprocessing can manufacture demand patterns that never occurred.

## Questions to settle before modeling

- At which hierarchy levels are decisions actually made?
- Which series carry enough history to forecast independently?
- What baseline must the model beat at each level?
- How will forecasts be reconciled across the hierarchy?
- Does a missing period mean zero, unavailable, or not applicable?
- How long can the production run take, and how will failures resume?
- Which external variables are available at forecast time?

Granularity is not valuable by itself. It is valuable when the additional detail changes a decision and when the pipeline can produce, reconcile, and monitor that detail reliably.
