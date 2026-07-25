export type CaseStudy = {
  slug: string;
  recordType: 'Case study' | 'Practice record';
  domain: 'Decision systems' | 'Interactive intelligence' | 'Scientific discovery';
  title: string;
  question: string;
  summary: string;
  context: string;
  difficulty: string[];
  approach: string[];
  outcome: string;
  role: string;
  evidence?: { label: string; href: string };
  featured: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'operational-decision-systems',
    recordType: 'Case study',
    domain: 'Decision systems',
    title: 'Scenario simulation and constrained allocation',
    question: 'Given a complex system of controllable levers, observed context, and hard constraints, which feasible intervention is most likely to improve the outcome?',
    summary: 'A reusable decision architecture that moves from response modeling through scenario simulation to bounded resource allocation and measurement.',
    context: 'Many operating problems share the same hidden structure: outcomes emerge from interacting variables, only some variables are controllable, historical allocation is confounded with opportunity, and the final recommendation must obey real capacity and policy constraints.',
    difficulty: [
      'A strong prediction does not, by itself, identify what should be changed.',
      'Response can be nonlinear, heterogeneous, and shaped by interactions between levers.',
      'Simulated interventions become misleading when they move beyond the support of observed data.',
      'The final plan has to be feasible, reviewable, and measurable after deployment.',
    ],
    approach: [
      'Represented each problem as outcomes, controllable levers, observed context, constraints, and uncertainty.',
      'Estimated response surfaces with temporal validation and diagnostics for interaction, support, and stability.',
      'Simulated feasible scenarios before committing resources, keeping counterfactuals inside observed support.',
      'Converted modeled response into constrained allocations, then attached a measurement plan to the intervention.',
    ],
    outcome: 'The resulting systems produce reviewable plans rather than passive scores. TreeMMM is a public implementation of this pattern for nonlinear response, interaction discovery, scenario curves, and bounded budget reallocation on customer-level panels, with a feature-parity R companion.',
    role: 'James designed and built the modeling, interpretation, simulation, and allocation workflow, drawing on applied work across targeting, forecasting, causal measurement, and resource optimization.',
    evidence: {
      label: 'TreeMMM — open-source Python package and benchmark',
      href: 'https://github.com/jamesyoung93/treemmm',
    },
    featured: true,
  },
  {
    slug: 'governed-interactive-analytics',
    recordType: 'Case study',
    domain: 'Interactive intelligence',
    title: 'Natural-language analytics with deterministic answers',
    question: 'How can people explore complex data conversationally without allowing a language model to invent the numbers?',
    summary: 'An interactive decision-intelligence workbench where the LLM translates intent, governed engines compute, and every answer carries provenance.',
    context: 'Natural language makes analytical systems easier to use, but fluent responses can hide unstable definitions, unsupported causal claims, and irreproducible calculations. The interface needs to be flexible without moving the source of truth into the model.',
    difficulty: [
      'Questions must resolve to governed metrics, dimensions, data versions, and comparison rules.',
      'Descriptive, diagnostic, predictive, and causal requests require different evidence boundaries.',
      'The system must refuse unsupported work clearly instead of improvising a plausible answer.',
      'Users need an interactive experience without losing traceability or reproducibility.',
    ],
    approach: [
      'Restricted the LLM to validated intent translation and optional phrasing rather than calculation.',
      'Routed approved intents into deterministic descriptive, retrieval, cohort, and causal engines.',
      'Stamped outputs with source, variant, data version, evidence tier, code, and a stable result hash.',
      'Built monitoring, persona views, causal-design workflows, and an independent golden set into the same interface.',
    ],
    outcome: 'Insight Harness combines natural-language exploration, interactive drill-down, monitoring, correct refusals, registered causal designs, and downloadable provenance-stamped artifacts in one governed analytical interface.',
    role: 'James designed and implemented the product architecture, semantic layer, deterministic engines, provenance contract, evaluation harness, and interactive workbench.',
    evidence: {
      label: 'Insight Harness — open-source decision-intelligence workbench',
      href: 'https://github.com/jamesyoung93/insight_harness',
    },
    featured: true,
  },
  {
    slug: 'private-local-intelligence',
    recordType: 'Case study',
    domain: 'Interactive intelligence',
    title: 'Private, on-device LLM document intelligence',
    question: 'How can people reason over sensitive and very long documents without sending the material to a cloud model?',
    summary: 'An offline desktop assistant combining quantized local inference, hardware-aware acceleration, and recursive document analysis.',
    context: 'Sensitive documents often cannot leave the device, while useful document analysis can exceed a local model’s context window. A practical product has to solve privacy, inference, document processing, and interaction design together.',
    difficulty: [
      'Local inference has to perform across different CPU and GPU configurations.',
      'Long documents require a structured analysis strategy rather than simple prompt truncation.',
      'The application must make model state, memory, and analysis depth understandable to non-specialists.',
      'Privacy depends on the full application boundary, not only the model weights.',
    ],
    approach: [
      'Built a desktop application around a local llama.cpp runtime and quantized model inference.',
      'Added hardware-aware acceleration with safe CPU fallback and a localhost-only model service.',
      'Implemented recursive map-and-reduce document analysis for material beyond the context window.',
      'Designed explicit fast and thorough modes, configurable conversation memory, and local PDF workflows.',
    ],
    outcome: 'The resulting application provides private chat and document reasoning without API keys or cloud processing, while remaining usable as a packaged desktop product.',
    role: 'James conceived and built the end-to-end application, including the desktop interface, local model runtime integration, document-analysis workflow, packaging, and privacy boundaries.',
    featured: true,
  },
  {
    slug: 'adaptive-analytics-platform',
    recordType: 'Case study',
    domain: 'Interactive intelligence',
    title: 'LLM-guided analytical pipelines that adapt to unfamiliar data',
    question: 'How can a validated analytical method travel across teams, brands, regions, and schemas without being rebuilt by hand each time?',
    summary: 'A framework that separates stable analytical logic from changing data environments, using an LLM for discovery and adaptation while deterministic templates perform the analysis.',
    context: 'Reusable analytical pipelines often fail at the last mile. The core method remains valid, but table names, schemas, reference files, and operating assumptions change from one deployment to the next.',
    difficulty: [
      'The system has to discover relevant data and map it to explicit pipeline requirements.',
      'Missing or mismatched inputs require adaptation without silently changing the analytical contract.',
      'Generated preprocessing code needs review, validation, and bounded repair when execution fails.',
      'Each deployment should preserve useful decisions so the next one starts with more context.',
    ],
    approach: [
      'Declared reusable pipeline stages, typed configuration, and explicit data requirements.',
      'Used an LLM to survey available data, map likely fields, and ask structured questions for unresolved inputs.',
      'Generated reviewable preprocessing adapters with execution checks and traceback-informed repair.',
      'Recorded decisions and reusable context while keeping the underlying modeling, scoring, and optimization deterministic.',
    ],
    outcome: 'AI2Analytics turns one-off analytical notebooks into adaptable systems that can discover, configure, transform, execute, and accumulate reusable organizational knowledge.',
    role: 'James designed and implemented the framework, including discovery, conversational configuration, code generation, reusable templates, decision memory, scenario scoring, and constrained optimization.',
    evidence: {
      label: 'AI2Analytics — open-source adaptive analytics framework',
      href: 'https://github.com/jamesyoung93/AI2Analytics',
    },
    featured: true,
  },
  {
    slug: 'oxic-nitrogen-fixation',
    recordType: 'Case study',
    domain: 'Scientific discovery',
    title: 'Multi-omic discovery for oxic nitrogen fixation',
    question: 'Which undercharacterized genes should be prioritized for experiments on oxygen-tolerant nitrogen fixation?',
    summary: 'A candidate-prioritization program integrating condition-specific multi-omics, comparative genomics, and interpretable machine learning.',
    context: 'Nitrogenase is oxygen-sensitive, yet some cyanobacteria coordinate oxygenic photosynthesis with nitrogen fixation. The search space includes many genes with incomplete functional annotation and only a limited set of experimentally established examples.',
    difficulty: [
      'The positive reference set is small relative to the genomic search space.',
      'Relevant evidence is distributed across expression, protein abundance, conservation, promoter architecture, and genomic context.',
      'The result had to support experimental prioritization rather than stop at a model score.',
    ],
    approach: [
      'Defined the biological question and assembled literature-supported reference genes.',
      'Integrated nitrogen step-down transcriptomics, quantitative proteomics, promoter features, genomic context, and comparative conservation.',
      'Compared interpretable and nonlinear models, then examined the evidence behind high-priority candidates.',
      'Structured outputs as a ranked, reviewable set of hypotheses for downstream validation planning.',
    ],
    outcome: 'The work produced a published, reproducible framework for prioritizing FOX gene candidates and distinguishing model evidence from experimental validation.',
    role: 'James led data curation, machine-learning methodology, software development, formal analysis, and the initial manuscript draft, and contributed to visualization and biological interpretation.',
    evidence: {
      label: 'Scientific Reports 16, 11412 (2026)',
      href: 'https://doi.org/10.1038/s41598-026-41873-w',
    },
    featured: true,
  },
  {
    slug: 'rubisco-active-learning',
    recordType: 'Case study',
    domain: 'Scientific discovery',
    title: 'Protein-language-model search for Rubisco variants',
    question: 'How can a large protein sequence space be narrowed to a small, informative set of variants for experimental consideration?',
    summary: 'Protein-language-model representations and active learning used as a disciplined search strategy for candidate selection.',
    context: 'Protein engineering presents a combinatorial search problem. Labels are expensive, biological constraints matter, and the most valuable next experiment may be the one that reduces uncertainty rather than the one with the highest predicted score.',
    difficulty: [
      'Sequence space is too large for exhaustive experimental screening.',
      'Available measurements are limited compared with the number of possible variants.',
      'Candidate selection must balance predicted performance, uncertainty, and experimental diversity.',
    ],
    approach: [
      'Represented protein sequences using protein-language-model embeddings.',
      'Used active-learning logic to balance exploitation of promising regions with exploration of uncertain regions.',
      'Framed each round around which variants would be most informative to test next.',
      'Kept the computational ranking connected to practical validation planning.',
    ],
    outcome: 'The resulting workflow provides a structured way to move from sequence representations to a prioritized experimental set. The work was published in AI Chemistry in 2026.',
    role: 'James developed the scientific-machine-learning framing and candidate-prioritization workflow.',
    evidence: {
      label: 'AI Chemistry 1(2), 7 (2026)',
      href: 'https://doi.org/10.3390/aichem1020007',
    },
    featured: true,
  },
];

export const capabilityLanes = [
  {
    index: '01',
    title: 'Decision systems',
    promise: 'Find the levers that can change an outcome.',
    text: 'Response modeling, causal inference, scenario simulation, and constrained optimization for resource allocation, process design, forecasting, and measurement.',
    extension: 'From one forecast to an adaptive planning and measurement system.',
  },
  {
    index: '02',
    title: 'Interactive intelligence',
    promise: 'Make complex systems usable without hiding their boundaries.',
    text: 'Private local LLMs, governed natural-language analytics, adaptive analytical pipelines, and tools that turn expert workflows into inspectable interfaces.',
    extension: 'From one assistant to a private, governed workflow and knowledge layer.',
  },
  {
    index: '03',
    title: 'Scientific discovery',
    promise: 'Choose the next experiment, not just the next prediction.',
    text: 'Protein language models, multi-omics, comparative genomics, active learning, and candidate prioritization for expensive biological search spaces.',
    extension: 'From one model to a continuous experiment-selection and learning loop.',
  },
];

export const organizationNeeds = [
  {
    audience: 'Startups',
    title: 'Prove value now without building a dead-end prototype.',
    text: 'Start with one urgent decision or workflow, then extend the same architecture across new data, models, users, and products as the company learns.',
  },
  {
    audience: 'Enterprises',
    title: 'Move AI into operations without losing control.',
    text: 'Connect models to governed data, permissioned tools, real constraints, provenance, and feedback so intelligence can scale across teams instead of remaining a collection of pilots.',
  },
  {
    audience: 'Research institutes',
    title: 'Turn scarce experiments into compounding knowledge.',
    text: 'Unify multimodal evidence, candidate search, interactive reasoning, and experiment selection so each result improves the next scientific decision.',
  },
];

export type Publication = {
  title: string;
  citation: string;
  href?: string;
  accessLabel?: string;
  featureRank?: number;
};

export const publicationPrograms: { id: string; title: string; description: string; publications: Publication[] }[] = [
  {
    id: 'functional-discovery',
    title: 'Functional discovery and nitrogen fixation',
    description: 'Work connecting microbial physiology, comparative evidence, and machine learning to questions of oxygen-tolerant nitrogen fixation.',
    publications: [
      {
        title: 'Predicting FOX gene candidates for oxic nitrogen fixation using multi-omic machine learning and comparative bioinformatics',
        citation: 'Scientific Reports 16(1), 11412 (2026)',
        href: 'https://doi.org/10.1038/s41598-026-41873-w',
        accessLabel: 'Open paper',
        featureRank: 1,
      },
      {
        title: 'Nitrosomes: protein language modeling and live-cell imaging reveal condensate-like nitrogenase organization in heterocysts',
        citation: 'bioRxiv 2026.05.23.727275 (2026)',
        href: 'https://doi.org/10.64898/2026.05.23.727275',
        accessLabel: 'Open preprint',
      },
      {
        title: 'Nitrogen-Responsive Extracellular Proteomics Reveals Evidence for a Novel Heterocyst-Specific Protein Secretion Pathway in Anabaena',
        citation: 'bioRxiv 2026.06.08.730779 (2026)',
        href: 'https://doi.org/10.64898/2026.06.08.730779',
        accessLabel: 'Open preprint',
      },
      {
        title: 'Harnessing Nitrogen Fixing Plants for a Bio-Solar Nitrogen Economy',
        citation: 'Resources, Environment and Sustainability, 100359 (2026)',
        href: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=EyrW6pEAAAAJ&citation_for_view=EyrW6pEAAAAJ:roLk4NBRz8UC',
      },
      {
        title: 'Beyond nif: protein-family modeling reveals the accessory systems of cyanobacterial diazotrophy',
        citation: 'In submission',
      },
      {
        title: 'Secondary Metabolites Predict Diazotrophic Cyanobacteria: A Model-Based Cheminformatic Approach',
        citation: 'Metabolites 15(9), 562 (2025)',
        href: 'https://doi.org/10.3390/metabo15090562',
        accessLabel: 'Open paper',
        featureRank: 3,
      },
      {
        title: 'Discovery of Photosynthetic Oxic N₂-Fixation in Cyanobacteria Using Wet Lab and Machine Learning Approaches',
        citation: 'PhD dissertation, South Dakota State University (2025)',
        href: 'https://openprairie.sdstate.edu/etd2/1717',
        accessLabel: 'Open dissertation',
      },
      {
        title: 'Harnessing Solar-Powered Oxic N₂-fixing Cyanobacteria for the BioNitrogen Economy',
        citation: 'Cyanobacteria Biotechnology, Wiley-VCH, 407-439 (2021)',
        href: 'https://doi.org/10.1002/9783527824908.ch13',
      },
      {
        title: 'Unicellular Cyanobacteria Exhibit Light-Driven, Oxygen-Tolerant, Constitutive Nitrogenase Activity Under Continuous Illumination',
        citation: 'bioRxiv 619353 (2019)',
        href: 'https://doi.org/10.1101/619353',
        accessLabel: 'Open preprint',
      },
      {
        title: 'Identification of Cell Surface Sugars in N₂-Fixing Cyanobacterium Cyanothece ATCC 51142 Using Fluorescein Labeled Lectins',
        citation: 'Proceedings of the South Dakota Academy of Science 97 (2018)',
        href: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=EyrW6pEAAAAJ&citation_for_view=EyrW6pEAAAAJ:u5HHmVD_uO8C',
      },
    ],
  },
  {
    id: 'protein-learning',
    title: 'Protein learning and engineering',
    description: 'Protein representation and active-learning approaches for narrowing experimental search spaces.',
    publications: [
      {
        title: 'Active Learning on Protein Language Model Embeddings Accelerates Rubisco Variant Discovery for Desired Traits',
        citation: 'AI Chemistry 1(2), 7 (2026)',
        href: 'https://doi.org/10.3390/aichem1020007',
        accessLabel: 'Open paper',
        featureRank: 2,
      },
    ],
  },
  {
    id: 'comparative-biology',
    title: 'Comparative genomics and broader computational biology',
    description: 'Collaborative work spanning genome assembly, multi-omic prediction, and biological data integration.',
    publications: [
      {
        title: 'Chromosome-level genome assembly of the Chinese three-keeled pond turtle (Mauremys reevesii) provides insights into freshwater adaptation',
        citation: 'Molecular Ecology Resources 22(4), 1596-1605 (2022)',
        href: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=EyrW6pEAAAAJ&citation_for_view=EyrW6pEAAAAJ:zYLM7Y9cAGgC',
      },
      {
        title: 'Crowdsourcing assessment of maternal blood multi-omics for predicting gestational age and preterm birth',
        citation: 'Cell Reports Medicine 2(6) (2021)',
        href: 'https://doi.org/10.1016/j.xcrm.2021.100323',
        accessLabel: 'Open paper',
      },
    ],
  },
];

export const approachPrinciples = [
  {
    index: '01',
    title: 'Represent',
    text: 'Define the outcome, observed state, controllable levers, constraints, and uncertainty before choosing a model.',
  },
  {
    index: '02',
    title: 'Simulate',
    text: 'Estimate how plausible interventions propagate through the system, keeping assumptions and support visible.',
  },
  {
    index: '03',
    title: 'Decide',
    text: 'Choose an experiment, intervention, or allocation that is feasible under the constraints people actually face.',
  },
  {
    index: '04',
    title: 'Learn',
    text: 'Measure what happened, update the representation, and make the next decision better than the last.',
  },
];

export type Insight = {
  title: string;
  description: string;
  published: string;
  href: string;
};

export const featuredInsights: Insight[] = [
  {
    title: 'Fluent and Wrong Can Look Exactly Like Fluent and Right',
    description: 'A working AI analytics demo built around governed definitions, reproducible evidence, causal boundaries, and refusal when a claim cannot be verified.',
    published: 'July 2026',
    href: 'https://foretodata.substack.com/p/fluent-and-wrong-can-look-exactly',
  },
  {
    title: 'The Evolution of Research and Insight Generation: From Hypotheses to Outcomes',
    description: 'A framework connecting hypothesis-driven science, predictive modeling, causal inference, and active learning to measurable outcomes.',
    published: 'April 2026',
    href: 'https://foretodata.substack.com/p/the-evolution-of-research-and-insight',
  },
  {
    title: 'I Built a Tool That Turns Sentences Into a Consulting-Quality Slide Deck',
    description: 'A practical system for translating narrative input into structured slide decks while preserving judgment about argument, evidence, and communication.',
    published: 'March 2026',
    href: 'https://foretodata.substack.com/p/i-built-a-tool-that-turns-sentences',
  },
];

export const profile = {
  name: 'James Young',
  descriptor: 'Decision Systems · Interactive AI · Scientific Machine Learning',
  headline: 'I build extensible intelligence for complex decisions.',
  summary: 'I help startups, enterprises, and research institutes move beyond one-off models and analyses by building adaptive systems that represent complex environments, simulate options, recommend the next action, and learn from what happens.',
  linkedin: 'https://www.linkedin.com/in/jamesyoungsd/',
  scholar: 'https://scholar.google.com/citations?user=EyrW6pEAAAAJ&hl=en',
  substack: 'https://foretodata.substack.com/',
  substackArchive: 'https://foretodata.substack.com/archive',
};
