export type CaseStudy = {
  slug: string;
  recordType: 'Case study' | 'Practice record';
  domain: 'Decision systems' | 'Interactive AI' | 'Scientific machine learning';
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
    title: 'Optimizing resources under real-world constraints',
    question: 'How should limited resources be allocated when outcomes depend on many interacting factors and the final plan must obey real constraints?',
    summary: 'A reusable decision system for representing what drives an outcome, simulating possible allocations, choosing the best feasible plan, and learning from what happens next.',
    context: 'Teams often need to decide where limited time, money, or capacity will have the greatest effect. The challenge is that outcomes depend on interacting factors, only some can be changed, past allocation may not reveal true opportunity, and every recommendation must fit real policy and capacity limits.',
    difficulty: [
      'Predicting an outcome does not automatically show which action will improve it.',
      'The effect of one action can change across people, conditions, and combinations of actions.',
      'Simulated options become unreliable when they stray too far from situations represented in the data.',
      'The recommended allocation must be feasible, explainable, and measurable after it is put into practice.',
    ],
    approach: [
      'Represented the desired outcome, what the team could change, what it needed to account for, and the constraints on any plan.',
      'Estimated how outcomes responded to different actions, using temporal validation and diagnostics for interactions, data support, and stability.',
      'Simulated realistic scenarios before resources were committed and kept proposed changes within the range supported by the data.',
      'Optimized the allocation under real constraints, then paired the plan with a way to measure results and improve the next decision.',
    ],
    outcome: 'The result is a reviewable action plan rather than a passive prediction. TreeMMM publicly demonstrates the pattern through nonlinear response modeling, interaction discovery, scenario curves, and bounded budget reallocation on customer-level panel data, with a feature-parity R companion.',
    role: 'I designed and built the end-to-end decision and optimization workflow, including modeling, interpretation, simulation, allocation, and measurement, drawing on applied work in targeting, forecasting, causal measurement, and resource optimization.',
    evidence: {
      label: 'TreeMMM — open-source Python package and benchmark',
      href: 'https://github.com/jamesyoung93/treemmm',
    },
    featured: true,
  },
  {
    slug: 'governed-interactive-analytics',
    recordType: 'Case study',
    domain: 'Interactive AI',
    title: 'Conversational analytics with answers you can verify',
    question: 'How can people ask questions in everyday language and still trust where every number and conclusion came from?',
    summary: 'A governed analytics workbench where an LLM interprets the question, tested analytical engines produce the answer, and every result includes its evidence.',
    context: 'Conversational interfaces make complex data easier to explore, but a fluent answer can still use the wrong definition, overstate what the evidence supports, or produce a calculation that cannot be repeated. The goal was to make analytics easier to use without making the language model the source of truth.',
    difficulty: [
      'Every question must connect to approved measures, dimensions, data versions, and comparison rules.',
      'Questions about what happened, why it happened, what may happen, and what caused it require different kinds of evidence.',
      'The system must say when a request cannot be supported instead of inventing a plausible answer.',
      'The experience must stay interactive while every result remains traceable and reproducible.',
    ],
    approach: [
      'Used the LLM to translate a user’s intent and explain results, but not to calculate the answer.',
      'Sent approved requests to deterministic descriptive, retrieval, cohort, and causal analysis engines.',
      'Attached the source, analytical variant, data version, evidence level, code, and a stable result hash to every output.',
      'Added monitoring, role-specific views, causal-design workflows, and an independent golden test set to the same interface.',
    ],
    outcome: 'Insight Harness lets people explore data conversationally, drill into results, monitor changes, and download evidence-backed outputs. It also refuses unsupported requests and supports registered causal designs, so convenience does not come at the expense of control.',
    role: 'I designed and implemented the full governed AI system: the product architecture, shared metric definitions, deterministic analysis engines, evidence contract, evaluation harness, and interactive workbench.',
    evidence: {
      label: 'Insight Harness — open-source decision-intelligence workbench',
      href: 'https://github.com/jamesyoung93/insight_harness',
    },
    featured: true,
  },
  {
    slug: 'private-local-intelligence',
    recordType: 'Case study',
    domain: 'Interactive AI',
    title: 'Private AI for sensitive, long documents',
    question: 'How can people analyze sensitive, very long documents without sending the material to a cloud service?',
    summary: 'An offline desktop assistant that keeps documents and model inference on the user’s device while breaking long material into a structured, reviewable analysis.',
    context: 'Sensitive documents may not be allowed to leave the device, yet the most useful analysis often involves material longer than a local model can process at once. A practical system therefore has to protect the full workflow while remaining fast, understandable, and useful to non-specialists.',
    difficulty: [
      'The application must run well across different CPU and GPU configurations.',
      'Long documents need a structured analysis process rather than silently cutting off the text.',
      'Users need to understand what the model is doing, what it remembers, and how deeply it is analyzing the document.',
      'Privacy depends on the boundaries of the entire application, not only on where the model weights are stored.',
    ],
    approach: [
      'Built a desktop application that runs quantized models locally through llama.cpp.',
      'Used available hardware acceleration when possible, with a safe CPU fallback and a model service restricted to the local machine.',
      'Added recursive map-and-reduce analysis so documents longer than the model’s context window could still be processed systematically.',
      'Created clear fast and thorough modes, configurable conversation memory, and local PDF workflows.',
    ],
    outcome: 'The application provides private chat and long-document analysis without API keys or cloud processing, packaged as a desktop product that people can use without managing the underlying model infrastructure.',
    role: 'I conceived and built the complete private AI product, including the desktop interface, local model integration, long-document workflow, hardware-aware execution, packaging, and privacy boundaries.',
    featured: true,
  },
  {
    slug: 'adaptive-analytics-platform',
    recordType: 'Case study',
    domain: 'Interactive AI',
    title: 'Analytics that adapt to each organization’s data',
    question: 'How can a proven analytical and optimization method work across teams, brands, regions, and data structures without being rebuilt by hand each time?',
    summary: 'A framework that keeps the validated analysis stable while using an LLM to understand each new data environment and create the adapters needed to run it.',
    context: 'Organizations often repeat the same decision process across different data environments. The analytical method still applies, but table names, fields, reference files, and operating assumptions change, turning a reusable approach back into one-off implementation work.',
    difficulty: [
      'The system must find relevant data and connect it to the pipeline’s explicit requirements.',
      'Missing or mismatched inputs require adaptation without quietly changing what the analysis means.',
      'Generated preparation code must be reviewable, tested, and repaired within clear limits when it fails.',
      'Each deployment should retain useful decisions so the next implementation begins with more organizational context.',
    ],
    approach: [
      'Defined the reusable analytical stages, typed configuration, and exact data requirements.',
      'Used an LLM to inspect available data, suggest field mappings, and ask focused questions about unresolved inputs.',
      'Generated reviewable data-preparation adapters with execution checks and bounded, traceback-informed repair.',
      'Saved implementation decisions for future use while keeping the core modeling, scoring, and optimization deterministic.',
    ],
    outcome: 'AI2Analytics turns one-off analytical notebooks into adaptable decision systems that can discover and prepare unfamiliar data, run a validated method, compare scenarios, optimize under constraints, and retain what the organization learned.',
    role: 'I designed and implemented the framework, including data discovery, conversational configuration, code generation, reusable analytical templates, decision memory, scenario scoring, and constrained optimization.',
    evidence: {
      label: 'AI2Analytics — open-source adaptive analytics framework',
      href: 'https://github.com/jamesyoung93/AI2Analytics',
    },
    featured: true,
  },
  {
    slug: 'oxic-nitrogen-fixation',
    recordType: 'Case study',
    domain: 'Scientific machine learning',
    title: 'Choosing which genes to test for oxygen-tolerant nitrogen fixation',
    question: 'Which undercharacterized genes should researchers test next to understand how some cyanobacteria fix nitrogen in the presence of oxygen?',
    summary: 'A decision system using scientific machine learning to combine biological evidence and rank gene candidates for scarce experimental time and resources.',
    context: 'Nitrogenase is sensitive to oxygen, yet some cyanobacteria coordinate oxygen-producing photosynthesis with nitrogen fixation. Researchers must choose a small set of genes to test from a much larger search space where many functions remain uncertain and few positive examples are established.',
    difficulty: [
      'Only a small number of confirmed examples are available to guide a genome-wide search.',
      'Useful evidence is spread across gene expression, protein abundance, conservation, promoter structure, and genomic context.',
      'The output must help researchers choose experiments, not stop at a prediction score.',
    ],
    approach: [
      'Defined the experimental decision and assembled reference genes supported by the literature.',
      'Combined nitrogen step-down transcriptomics, quantitative proteomics, promoter features, genomic context, and comparative conservation.',
      'Compared interpretable and nonlinear models, then reviewed the specific evidence supporting high-priority candidates.',
      'Produced a ranked, reviewable set of hypotheses that researchers could use to plan experimental validation.',
    ],
    outcome: 'The work produced a published, reproducible framework for choosing FOX gene candidates to test while keeping computational evidence clearly separated from experimental validation.',
    role: 'I led the decision framing, data curation, machine-learning methodology, software development, formal analysis, and initial manuscript draft, and contributed to visualization and biological interpretation.',
    evidence: {
      label: 'Scientific Reports 16, 11412 (2026)',
      href: 'https://doi.org/10.1038/s41598-026-41873-w',
    },
    featured: true,
  },
  {
    slug: 'rubisco-active-learning',
    recordType: 'Case study',
    domain: 'Scientific machine learning',
    title: 'Choosing which protein variants to test next',
    question: 'How can researchers choose a small, informative set of Rubisco variants from a protein sequence space too large to test exhaustively?',
    summary: 'A decision system using scientific machine learning to balance promising protein candidates with experiments that will reduce uncertainty.',
    context: 'Protein engineering offers far more possible sequences than a laboratory can test. Measurements are expensive, biological constraints matter, and the best next experiment may be the one that teaches the most rather than the one with the highest predicted performance.',
    difficulty: [
      'The possible sequence space is too large for exhaustive laboratory screening.',
      'Available measurements cover only a small fraction of possible variants.',
      'Each experimental round must balance predicted performance, uncertainty, and a diverse set of candidates.',
    ],
    approach: [
      'Mapped protein sequences into numerical representations using protein-language-model embeddings.',
      'Used active learning to balance testing promising regions with exploring uncertain ones.',
      'Optimized each round around which variants would be most useful to test next.',
      'Kept the computational ranking connected to practical experimental validation.',
    ],
    outcome: 'The workflow turns a vast sequence space into a prioritized, informative experimental set and creates a repeatable loop in which each result can improve the next selection. The work was published in AI Chemistry in 2026.',
    role: 'I developed the scientific decision framing, protein representation, active-learning strategy, and candidate-prioritization workflow.',
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
    promise: 'Choose the best feasible action, not just the most likely outcome.',
    text: 'Represent what shapes an outcome, simulate realistic options, and decide what to do under real constraints. The technical foundation can include response modeling, causal inference, forecasting, and constrained optimization.',
    extension: 'From a one-time prediction to a system that plans, measures, and improves.',
  },
  {
    index: '02',
    title: 'Interactive AI',
    promise: 'Make AI useful without giving up privacy, control, or trust.',
    text: 'Use local LLMs, governed conversational analytics, and adaptable pipelines to make complex work easier while keeping calculations, evidence, and sensitive data under control.',
    extension: 'From a standalone assistant to a private, verifiable decision workflow.',
  },
  {
    index: '03',
    title: 'Scientific machine learning',
    promise: 'Use limited experiments where they can teach the most.',
    text: 'Combine biological evidence to rank candidates, balance performance with uncertainty, and choose what to test next. The methods include protein language models, multi-omics, comparative genomics, and active learning.',
    extension: 'From a ranked prediction to a continuous experiment-and-learning loop.',
  },
];

export const organizationNeeds = [
  {
    audience: 'Startups',
    title: 'Solve one valuable decision now and build from it.',
    text: 'Represent an urgent decision, simulate the options, and deliver a usable first system that can expand across new data, models, users, and products as the company learns.',
  },
  {
    audience: 'Enterprises',
    title: 'Connect AI to decisions people actually make.',
    text: 'Bring governed data, permissioned tools, real constraints, evidence, and feedback into one decision workflow so AI can scale across teams without becoming a collection of disconnected pilots.',
  },
  {
    audience: 'Research institutes',
    title: 'Make every experiment improve the next choice.',
    text: 'Combine evidence, candidate search, interactive reasoning, and experiment selection so limited laboratory resources are directed toward informative tests and each result improves the next scientific decision.',
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
    text: 'Name the outcome, what can be changed, what must be accounted for, the constraints, and what remains uncertain.',
  },
  {
    index: '02',
    title: 'Simulate',
    text: 'Test realistic options and show how each one may change the outcome, with assumptions and limits kept visible.',
  },
  {
    index: '03',
    title: 'Decide',
    text: 'Choose the best feasible experiment, intervention, or allocation under the constraints people actually face.',
  },
  {
    index: '04',
    title: 'Learn',
    text: 'Measure what happened, update the representation of the system, and make the next decision better than the last.',
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
    description: 'Why conversational AI should interpret questions while governed analytical engines calculate the answers and show the evidence behind every result.',
    published: 'July 2026',
    href: 'https://foretodata.substack.com/p/fluent-and-wrong-can-look-exactly',
  },
  {
    title: 'The Evolution of Research and Insight Generation: From Hypotheses to Outcomes',
    description: 'How hypotheses, prediction, causal reasoning, and active learning fit into one loop for choosing what to do next.',
    published: 'April 2026',
    href: 'https://foretodata.substack.com/p/the-evolution-of-research-and-insight',
  },
  {
    title: 'I Built a Tool That Turns Sentences Into a Consulting-Quality Slide Deck',
    description: 'How a system turns narrative input into a structured slide deck while keeping the argument, evidence, and judgment visible.',
    published: 'March 2026',
    href: 'https://foretodata.substack.com/p/i-built-a-tool-that-turns-sentences',
  },
];

export const profile = {
  name: 'James Young',
  descriptor: 'Decision systems for complex domains',
  headline: 'I build decision systems for complex domains.',
  summary: 'I represent the variables, constraints, and uncertainty that shape an outcome; separate what can be controlled from what cannot; simulate possible actions; and decide on the best feasible next step. Each result improves the next decision.',
  linkedin: 'https://www.linkedin.com/in/jamesyoungsd/',
  scholar: 'https://scholar.google.com/citations?user=EyrW6pEAAAAJ&hl=en',
  substack: 'https://foretodata.substack.com/',
  substackArchive: 'https://foretodata.substack.com/archive',
};
