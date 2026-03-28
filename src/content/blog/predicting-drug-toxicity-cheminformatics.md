---
title: "Predicting Drug Toxicity with Cheminformatics and ML"
date: 2022-06-16
description: "QSAR modeling on the Ames Mutagenicity dataset using interpretable ML in R."
tags: ["cheminformatics", "bioinformatics", "interpretable-ml"]
---

Quantitative structure-activity relationship (QSAR) modeling lets you predict chemical properties from molecular structure. Toxicity is the obvious application, but the same approach works for solubility, melting temperature, drug activity, blood-brain barrier permeability, and other endpoints.

## The data

I used the publicly available Ames Mutagenicity dataset from the TU Berlin Toxicity Benchmark. Each compound is represented as a SMILES string with a binary label: toxic or not.

## Feature engineering

The key step is converting SMILES into numbers the model can use. Using ChemmineR in R, I extracted:

- Atom counts
- Functional group counts
- Ring counts
- Aromaticity levels
- Molecular weight and charge

This gives you a feature matrix where each row is a compound and each column is a structural descriptor.

## Modeling

I deliberately avoided graph neural networks and message-passing networks here. The goal was interpretability. I wanted to be able to explain *why* a compound was flagged as toxic, not just that it was.

The modeling and evaluation ran through an interpretable ML app I built in R, which lets you compare methods side by side and inspect feature contributions for individual predictions.

## Why this matters

In pharma, a black-box toxicity prediction is close to useless. Medicinal chemists need to know which structural features are driving the prediction so they can modify the compound. Interpretable QSAR gives them that. The same pipeline applies to any property you can label and any structure you can encode.
