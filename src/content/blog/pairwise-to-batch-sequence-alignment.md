---
title: "From Pairwise to Batch Sequence Alignment in R"
date: 2022-06-15
description: "Building a practical bioinformatics pipeline from single alignments to parallelized batch processing to a Shiny app."
tags: ["bioinformatics", "r", "sequence-alignment"]
---

Sequence alignment is fundamental to bioinformatics. Determining how many base pairs or amino acids line up between two sequences tells you about evolutionary relationships, functional similarity, and specimen identity. But the gap between "align two sequences" and "align thousands against a reference database" is mostly an engineering problem.

## Five levels of alignment

I built this out as a progression, each level solving a real limitation of the previous one.

### Level 1: Single pairwise alignment

Two hand-selected sequences aligned with `msaClustalOmega()`. Two H1N1 flu sequences, 88.1% identity. Takes milliseconds. Good for understanding what alignment actually does.

### Level 2: One query vs. database

One unknown sequence against 229 reference sequences, run serially. About a minute. Now you can answer "what is this sequence closest to?"

### Level 3: Multiple queries vs. database

Five unknowns against all 229 references. About four minutes serially. This is where it starts to feel slow.

### Level 4: Parallelized

Using `doParallel` to distribute alignments across cores. Same work, fraction of the time. Necessary once your database or query set grows.

### Level 5: Shiny app

Wrapped the whole pipeline in a Shiny application. Non-technical users drag and drop their sequences, get results back automatically. No command line, no R installation, no debugging package versions.

## The data

Open-source influenza sequences from fludb.org, pulled via API. After filtering for complete genomes: 229 swine influenza sequences across H1N1, H1N2, and H3N2 subtypes.

## Trade-offs

Running alignment locally gives you privacy and control over sensitive genomic data. Web-based tools like BLAST are faster for one-off queries against massive databases, but you're sending your sequences to an external server. For internal research on proprietary sequences, local compute with a good parallelization strategy is the better fit.
