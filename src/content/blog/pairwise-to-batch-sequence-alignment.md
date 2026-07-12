---
title: "From Pairwise to Batch Sequence Alignment in R"
date: 2022-06-15
description: "Building a practical bioinformatics pipeline from single alignments to parallelized batch processing to a Shiny app."
tags: ["bioinformatics", "r", "sequence-alignment"]
---

Sequence alignment is fundamental to bioinformatics. Similarity between nucleotide or amino-acid sequences can provide evidence about evolutionary relatedness and possible functional similarity. Comparison with an appropriate reference can also support specimen identification. The gap between "align two sequences" and "align thousands against a reference database" is mostly an engineering problem.

## Five levels of alignment

I built this out as a progression, each level solving a real limitation of the previous one.

### Level 1: Single pairwise alignment

Two hand-selected sequences aligned with `msaClustalOmega()`. Two H1N1 flu sequences, 88.1% identity. Takes milliseconds. Good for understanding what alignment actually does.

### Level 2: One query vs. database

One unknown sequence against 229 reference sequences, run serially. About a minute. The result identifies the closest reference to the query.

### Level 3: Multiple queries vs. database

Five query sequences against all 229 references took about 4.28 minutes in the original serial run.

### Level 4: Parallelized

Using `doParallel` reduced the same run to about 1.42 minutes on the test machine. The result showed the value of parallel execution, although a production pipeline should set resource limits rather than consume every available core.

### Level 5: Shiny app

The final stage wrapped the pipeline in a Shiny interface so a user could provide sequences and review results without working directly in the analysis code.

## The data

Open-source influenza sequences from fludb.org, pulled via API. After filtering for complete genomes: 229 swine influenza sequences across H1N1, H1N2, and H3N2 subtypes.

## What this test shows

The query sequences in the demonstration were also present in the reference set. The 100% matches provide an end-to-end sanity check that the workflow can recover known matches. They do not establish performance on genuinely unknown specimens. A validation study would need held-out or independently identified sequences.

## Trade-offs

Running alignments locally can be useful when sequences should remain inside a controlled environment. Services such as BLAST are convenient for one-off searches against large public databases, while a local pipeline offers more control over data handling, dependencies, and repeatable batch processing.
