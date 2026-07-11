---
title: "Reproducible R Workflows with drake"
date: 2020-09-05
description: "A historical implementation note on dependency graphs, incremental computation, and recoverable analytical pipelines in R."
tags: ["r", "reproducibility", "data-workflows", "automation"]
section: "foundations"
---

> Originally published in September 2020. The `drake` package was [superseded by `targets` in 2021](https://books.ropensci.org/targets/drake.html), so this is preserved as a record of the workflow design rather than current package guidance.

Analytical projects rarely consist of one script. Data ingestion, cleaning, feature construction, modeling, validation, and reporting form a dependency graph even when the code is stored as a loose collection of files.

The practical problem is not only organization. If a late step fails after several expensive steps have completed, a conventional script often starts again from the beginning. That costs time and makes it harder to know which outputs are current.

## The workflow used in the original project

The example combined data pulled from Google, Quandl, and the Federal Reserve Economic Data service. Separate steps corrected an API limitation, combined the sources, and handled missing observations before producing a final analysis table.

The first design change was to turn each script into a function with a clear input and output. The second was to declare the dependencies among those functions in a `drake` plan.

That plan made the workflow inspectable. Before a run, the dependency graph showed which targets were out of date. After a successful run, completed targets were cached. If a downstream step failed, the workflow could resume from the point of failure instead of repeating every data pull and transformation.

## Why the pattern still matters

The package has changed, but the useful ideas have not:

- Express the analysis as small, testable functions.
- Make dependencies explicit rather than relying on execution order inside a long script.
- Cache completed work when inputs and code have not changed.
- Recompute downstream outputs when an upstream dependency changes.
- Keep enough metadata to explain how an output was produced.
- Make interrupted work recoverable.

These are now familiar ideas in data orchestration, MLOps, and scientific workflow systems. The 2020 implementation used `drake`; a new R project would generally use [`targets`](https://books.ropensci.org/targets/drake.html), while other ecosystems offer tools such as Snakemake and workflow orchestrators.

## The durable lesson

Reproducibility is not created by saving a final file. It comes from preserving the relationships among data, code, parameters, and outputs so that the result can be rebuilt and inspected.

A dependency-aware workflow also changes day-to-day development. It shortens the feedback loop, reduces unnecessary computation, and makes failures easier to isolate. Those benefits matter in a small research analysis and become essential when the same pipeline supports repeated operational decisions.
