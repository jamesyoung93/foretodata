---
title: "Predicting DNA Properties with Bioinformatics and Interpretable ML"
date: 2022-06-16
description: "Using k-mer features to predict DNAse I hypersensitivity with interpretable models in R."
tags: ["bioinformatics", "interpretable-ml", "genomics"]
---

Most bioinformatics workflows rely on alignment-based methods like BLAST to infer function from sequence similarity. That works well when you have close homologs in the database. When you don't, you need a different approach.

## The problem

Predict whether a given DNA sequence is DNAse I hypersensitive (a marker of open chromatin and regulatory activity). Binary classification: hypersensitive or not.

## Feature extraction

Instead of alignment, I used k-mer features. Specifically, dinucleotide counts extracted from each sequence using the rDNAse package in R. This converts a variable-length DNA string into a fixed-length numeric vector that any ML model can consume.

The training set contained both positive and negative examples. The holdout set had five sequences, all positive, for validation.

## Modeling

I trained interpretable models on the k-mer features and evaluated on held-out data. The interpretable ML app (same one from the cheminformatics work) lets you inspect which dinucleotide patterns drive predictions for individual sequences.

## The broader point

Alignment tells you what a sequence *looks like*. ML on extracted features can tell you what a sequence *does*. When you're working with novel sequences that don't have close matches in reference databases, this is often the more useful question. And when you can explain which features matter, you give biologists something they can reason about rather than just a score.
