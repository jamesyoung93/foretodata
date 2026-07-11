export type CaseStudy = {
  slug: string;
  domain: 'Biological discovery' | 'Scientific ML advisory' | 'Decision systems';
  title: string;
  question: string;
  summary: string;
  context: string;
  difficulty: string[];
  approach: string[];
  outcome: string;
  role: string;
  evidence?: { label: string; href: string };
  confidentiality?: string;
  featured: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'oxic-nitrogen-fixation',
    domain: 'Biological discovery',
    title: 'Multi-omic discovery for oxic nitrogen fixation',
    question: 'Which undercharacterized genes should be prioritized for experiments on oxygen-tolerant nitrogen fixation?',
    summary: 'A candidate-prioritization program integrating condition-specific multi-omics, comparative genomics, and interpretable machine learning.',
    context: 'Nitrogenase is oxygen-sensitive, yet some cyanobacteria coordinate oxygenic photosynthesis with nitrogen fixation. The search space includes many genes with incomplete functional annotation and only a limited set of experimentally established examples.',
    difficulty: [
      'The positive reference set is small relative to the genomic search space.',
      'Relevant evidence is distributed across expression, protein abundance, conservation, promoter architecture, and genomic context.',
      'A useful result must support experimental prioritization, not merely produce a model score.',
    ],
    approach: [
      'Defined the biological question and assembled literature-supported reference genes.',
      'Integrated nitrogen step-down transcriptomics, quantitative proteomics, promoter features, genomic context, and comparative conservation.',
      'Compared interpretable and nonlinear models, then examined the evidence behind high-priority candidates.',
      'Structured outputs as a ranked, reviewable set of hypotheses for downstream validation planning.',
    ],
    outcome: 'The work produced a published, reproducible framework for prioritizing FOX gene candidates and distinguishing model evidence from experimental validation.',
    role: 'James led data curation, machine-learning methodology, software development, formal analysis, visualization, and the initial manuscript draft, working with biological collaborators on interpretation and review.',
    evidence: {
      label: 'Scientific Reports 16, 11412 (2026)',
      href: 'https://doi.org/10.1038/s41598-026-41873-w',
    },
    featured: true,
  },
  {
    slug: 'rubisco-active-learning',
    domain: 'Biological discovery',
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
    outcome: 'The resulting workflow provides a structured way to move from sequence representations to a prioritized experimental set. The associated manuscript remains under revision; the site does not imply completed experimental validation.',
    role: 'James developed the scientific-machine-learning framing and candidate-prioritization workflow with research collaborators.',
    featured: true,
  },
  {
    slug: 'independent-scientific-ml-advisory',
    domain: 'Scientific ML advisory',
    title: 'Independent Advisory: Structural Biology and Scientific ML',
    question: 'Is a proposed scientific-AI approach feasible, decision-relevant, and connected to a credible experimental path?',
    summary: 'Selective, narrowly scoped advisory work at the boundary of structural biology, model evaluation, and experimental translation.',
    context: 'Biotechnology teams often face a decision before they face an implementation problem: whether the available data, methods, and validation capacity can support a useful predictive or prioritization system.',
    difficulty: [
      'Scientific feasibility and modeling feasibility are not the same thing.',
      'Vendor or internal proposals may obscure assumptions, data limitations, and validation costs.',
      'The useful output is often a narrower decision, staged plan, or stopping rule rather than a larger model.',
    ],
    approach: [
      'Clarified the scientific decision and the evidence needed to change it.',
      'Reviewed data readiness, candidate representations, model-evaluation plans, and biological constraints.',
      'Connected computational outputs to candidate prioritization and experimental translation.',
      'Identified feasibility risks and practical next steps without overstating certainty.',
    ],
    outcome: 'Engagements support technical strategy, method review, and experimental prioritization. Specific clients, systems, and results are intentionally not disclosed.',
    role: 'James served as an independent scientific and technical advisor on narrowly scoped questions.',
    confidentiality: 'Representative work is summarized at a high level. Details and results have been generalized to protect confidential information.',
    featured: true,
  },
  {
    slug: 'operational-decision-systems',
    domain: 'Decision systems',
    title: 'From predictions to operational decisions',
    question: 'How should forecasts and causal estimates be translated into repeatable choices under real operating constraints?',
    summary: 'Professional experience connecting targeting, forecasting, causal inference, measurement, and resource allocation to operational workflows.',
    context: 'In applied settings, model performance is only one part of the system. Recommendations must fit decision rights, capacity constraints, measurement plans, and the way people actually work.',
    difficulty: [
      'Predictive signals do not automatically identify effective interventions.',
      'Resource-allocation choices combine uncertainty with multi-team and multi-product constraints.',
      'A model can be technically sound and still fail if its outputs are not interpretable or adoptable.',
    ],
    approach: [
      'Started with the decision, intervention, and counterfactual rather than the estimator.',
      'Used forecasting and causal methods where they matched the identification and planning problem.',
      'Designed reviewable outputs and measurement loops for technical and non-technical stakeholders.',
      'Treated deployment, adoption, and iteration as part of the analytical system.',
    ],
    outcome: 'This work established reusable patterns for moving from analytical output to governed decision workflows. Employer-specific systems and commercial results are not presented as external advisory offerings.',
    role: 'James led and contributed to applied data-science work across forecasting, targeting, causal measurement, and operational implementation.',
    confidentiality: 'This summary describes transferable professional experience. Employer systems, brand details, and commercial outcomes have been omitted.',
    featured: false,
  },
];

export type Publication = {
  title: string;
  authors: string;
  citation: string;
  href?: string;
  note?: string;
};

export const publicationPrograms: { id: string; title: string; description: string; publications: Publication[] }[] = [
  {
    id: 'functional-discovery',
    title: 'Functional discovery and nitrogen fixation',
    description: 'Work connecting microbial physiology, comparative evidence, and machine learning to questions of oxygen-tolerant nitrogen fixation.',
    publications: [
      {
        title: 'Predicting FOX gene candidates for oxic nitrogen fixation using multi-omic machine learning and comparative bioinformatics',
        authors: 'J Young, L Gu, R Zhou',
        citation: 'Scientific Reports 16, 11412 (2026)',
        href: 'https://doi.org/10.1038/s41598-026-41873-w',
      },
      {
        title: 'Secondary Metabolites Predict Diazotrophic Cyanobacteria: A Model-Based Cheminformatic Approach',
        authors: 'J Young, T Nawaz, L Gu, R Zhou',
        citation: 'Metabolites 15(9), 562 (2025)',
        href: 'https://doi.org/10.3390/metabo15090562',
      },
      {
        title: 'Discovery of Photosynthetic Oxic N₂-Fixation in Cyanobacteria Using Wet Lab and Machine Learning Approaches',
        authors: 'J Young',
        citation: 'PhD dissertation, South Dakota State University',
        href: 'https://openprairie.sdstate.edu/etd2/1717',
      },
      {
        title: 'Unicellular Cyanobacteria Exhibit Light-Driven, Oxygen-Tolerant, Constitutive Nitrogenase Activity Under Continuous Illumination',
        authors: 'J Young, L Gu, M Hildreth, R Zhou',
        citation: 'bioRxiv 619353 (2019)',
        href: 'https://doi.org/10.1101/619353',
      },
      {
        title: 'Harnessing Solar-Powered Oxic N₂-fixing Cyanobacteria for the BioNitrogen Economy',
        authors: 'J Young, L Gu, W Gibbons, R Zhou',
        citation: 'Cyanobacteria Biotechnology, Wiley-VCH, 407–439 (2021)',
        href: 'https://doi.org/10.1002/9783527824908.ch13',
      },
      {
        title: 'Predictive Pangenomics Prioritizes Gene Families Associated with Oxic Nitrogen Fixation in Cyanobacteria',
        authors: 'J Young, S Aryal, D Nelson, EZ Gnimpieba, R Zhou',
        citation: 'Manuscript in preparation',
        note: 'Status carried forward from the existing site and should be reconfirmed before publication.',
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
        authors: 'J Young, L Gu, R Zhou',
        citation: 'Manuscript in revision',
        note: 'Status carried forward from the existing site and should be reconfirmed before publication.',
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
        authors: 'J Liu, K Zheng, S Liu, L Gu, J Young, Z Wang, Y Qiu, S Gu, L Xiong, R Zhou, L Nie',
        citation: 'Molecular Ecology Resources 22(4), 1596–1605 (2022)',
      },
      {
        title: 'Crowdsourcing assessment of maternal blood multi-omics for predicting gestational age and preterm birth',
        authors: 'AL Tarca, BÁ Pataki, R Romero, et al. (J Young, consortium author)',
        citation: 'Cell Reports Medicine 2(6) (2021)',
        href: 'https://doi.org/10.1016/j.xcrm.2021.100323',
      },
    ],
  },
];

export const approachPrinciples = [
  {
    index: '01',
    title: 'Start with the decision or experiment',
    text: 'Define what will be chosen, tested, or changed—and what evidence would be sufficient to act.',
  },
  {
    index: '02',
    title: 'Constrain the search space',
    text: 'Use scientific context, operating constraints, and prior evidence before adding model complexity.',
  },
  {
    index: '03',
    title: 'Design for the next cycle',
    text: 'Make validation, interpretation, adoption, and iteration part of the system from the beginning.',
  },
];

export const profile = {
  name: 'James Young',
  descriptor: 'Scientific Machine Learning · Biological Discovery · Decision Systems',
  headline: 'Machine learning for biological discovery and consequential decisions.',
  summary: 'I build analytical systems that narrow complex search spaces, prioritize experiments and interventions, and translate data into decisions.',
  linkedin: 'https://www.linkedin.com/in/jamesyoungsd/',
  scholar: 'https://scholar.google.com/citations?user=EyrW6pEAAAAJ&hl=en',
  substack: 'https://foretodata.substack.com/',
};
