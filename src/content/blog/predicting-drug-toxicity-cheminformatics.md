---
title: "Cheminformatics Feature Engineering for an Ames Mutagenicity Prototype"
date: 2022-06-16
description: "An early R prototype for turning molecular strings into reviewable structural features for mutagenicity modeling."
tags: ["cheminformatics", "bioinformatics", "interpretable-ml"]
section: "foundations"
---

> Originally published in June 2022. This was a feature-engineering and tooling demonstration, not a completed validation study.

Quantitative structure-activity relationship modeling connects molecular structure to measured properties. This prototype focused on the first step: converting chemical representations into features that an interpretable model could use.

## The data

I used the publicly available Ames Mutagenicity dataset from the TU Berlin Toxicity Benchmark. Each compound is represented as a SMILES string with a binary label: mutagenic or non-mutagenic.

The original demonstration used the first 500 compounds and a five-row holdout. That split is useful for exercising a pipeline, but it is not a defensible basis for a performance claim.

## Feature engineering

The key step is converting SMILES into numbers the model can use. Using ChemmineR in R, I extracted:

- Atom counts
- Functional group counts
- Ring counts
- Aromaticity levels
- Molecular weight and charge

The result is a feature matrix where each row is a compound and each column is a structural descriptor.

## Modeling and interpretation

The next stage passed the descriptor table to an R application designed to compare interpretable models and inspect feature contributions for individual predictions.

The preserved article does not include the fitted model, metrics, validation results, or prediction explanations. This archive entry therefore makes no claim about predictive performance.

## Why retain it

The useful record is the representation choice and the early emphasis on reviewable features. Those choices remain relevant, even though a current mutagenicity project would require stronger data splitting, validation, calibration, and domain review.
