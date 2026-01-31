import { useState, useMemo } from 'react';
import { playClick, playHover, playSelect, playExpand, playCollapse } from '../utils/soundManager.js';

// 8 ML Project Accomplishments - Real Work
const accomplishments = [
  {
    id: 1,
    title: "Dynamic HCP Targeting & Promotional Response",
    summary: "Built standardized targeting models prescribing omnichannel HCP engagement and resource allocation across pharmaceutical brands at Pfizer and UCB.",
    goals: ["resource-optimization", "improve-targeting"],
    methods: ["causal-ml", "interpretable-ml"],
    industries: ["pharma"],
    details: "System simulates promotional response of each healthcare provider to optimally allocate sales rep calls given multi-product, multi-team constraints. Used propensity matching, inverse probability weighting, difference-in-difference regression, and double/debiased ML. Delivered via interactive R Shiny dashboards with SQL, Python, and PySpark backend.",
    metrics: ["5-10% lift at plan attainment", "Multi-brand deployment"],
  },
  {
    id: 2,
    title: "Enterprise Demand Forecasting Framework",
    summary: "End-to-end forecasting framework at NetApp covering 1000s of Product × Segment × Geography time series at multiple horizons.",
    goals: ["reduce-costs", "improve-operations"],
    methods: ["forecasting", "mlops"],
    industries: ["enterprise"],
    details: "Used for parts supply planning, cloud operations (ARR, ACV, iARR), and partner/channel compensation planning. Built with global XGBoost featuring rich feature engineering, hierarchical modeling, Bayesian hyperparameter optimization, and ensembling. Parallelized on GCP for scale.",
    metrics: ["30-50% error reduction vs. field forecasts", "Days → hours runtime"],
  },
  {
    id: 3,
    title: "RAG-Powered Sales Acceleration",
    summary: "Hackathon prototype: retrieval-augmented generation system embedding NetApp's internal knowledge base to accelerate sales engineer responses.",
    goals: ["productivity", "improve-experience"],
    methods: ["llms", "rag"],
    industries: ["enterprise"],
    details: "Built a RAG architecture with LLM integration to help sales engineers answer technically complex questions faster by retrieving relevant internal documentation. This was a hackathon project demonstrating GenAI potential, not a production deployment.",
    metrics: ["4th place / ~40 teams", "Company-wide GenAI hackathon"],
  },
  {
    id: 4,
    title: "Automated Pharma Data Pipeline",
    summary: "R Shiny dashboard automating data pulls and manipulation of IQVIA LAAD and Specialty Pharmaceutical data.",
    goals: ["productivity", "improve-operations"],
    methods: ["automation", "dashboards"],
    industries: ["pharma"],
    details: "Enables point-and-click filters, pivots, aggregations, in-group/out-group labeling, and downloads for TRx, NRx, NBRx, details, claims types, and promotional activity at the HCP level. Eliminated repetitive data wrangling to free analysts for higher-value work.",
    metrics: ["~10 hrs/week freed", "Automated ETL"],
  },
  {
    id: 5,
    title: "Bioinformatics ML Consulting",
    summary: "Independent contractor (1099) for a livestock vaccine company, building ML models to support vaccine R&D.",
    goals: ["accelerate-research", "reduce-risk"],
    methods: ["bioinformatics", "interpretable-ml"],
    industries: ["biotech"],
    details: "Models predicted epitope regions, immunogenic distance of antigens, protein degradation rates, sequence-to-yield relationships, and identified target proteins for new pathogen projects. Work informed vaccine target selection and suggested yield-preserving modifications.",
    metrics: ["Informed target selection", "Yield-preserving mods"],
  },
  {
    id: 6,
    title: "Polymer Property Prediction",
    summary: "Summer internship at Lawrence Livermore National Lab building models to predict chemical properties of polymers.",
    goals: ["accelerate-research", "improve-operations"],
    methods: ["interpretable-ml", "bayesian-optimization"],
    industries: ["national-lab"],
    details: "Achieved accuracy matching state-of-the-art closed-source models using open, interpretable methods. Used neural networks, Gaussian process regression, and Bayesian optimization for hyperparameter tuning. Deployed via R Shiny on LLNL intranet.",
    metrics: ["Matched SOTA accuracy", "Interpretable alternatives"],
  },
  {
    id: 7,
    title: "ML for Nitrogen Fixation Gene Discovery",
    summary: "PhD research applying machine learning to identify essential genes for cyanobacterial nitrogen fixation toward self-fertilizing crops.",
    goals: ["accelerate-research", "expand-knowledge"],
    methods: ["bioinformatics", "interpretable-ml"],
    industries: ["academic"],
    details: "Used XGBoost and comparative genomics to identify gene candidates essential for nitrogen fixation. This research contributed to a successful $7M NSF grant application and resulted in publications and manuscripts.",
    metrics: ["Contributed to $7M NSF grant", "Publications & manuscripts"],
  },
  {
    id: 8,
    title: "VendorCheck",
    summary: "In development: AI-powered tool for technical due diligence on analytics/ML vendor proposals in pharma commercial.",
    goals: ["reduce-risk", "improve-operations"],
    methods: ["llms", "rag"],
    industries: ["pharma", "product"],
    details: "Helps pharma commercial teams evaluate vendor claims for statistical red flags, methodology gaps, and unrealistic performance claims before signing contracts. Built with custom RAG system, Claude API integration, and specialized pharma analytics prompt engineering. Waitlist open at vendorcheck.carrd.co.",
    metrics: ["Launching Jan 2026", "Waitlist open"],
  },
];

// Goal Categories (Business Outcomes)
const goalCategories = {
  'resource-optimization': { label: 'Resource Optimization', icon: '🎯', description: 'Optimize allocation of people, budget, and assets' },
  'improve-targeting': { label: 'Improve Targeting', icon: '📍', description: 'Better audience and engagement targeting' },
  'reduce-costs': { label: 'Reduce Costs', icon: '💰', description: 'Cut operational expenses and inefficiencies' },
  'improve-operations': { label: 'Improve Operations', icon: '⚡', description: 'Streamline processes and workflows' },
  'productivity': { label: 'Productivity', icon: '⏱️', description: 'Free time for higher-value work' },
  'improve-experience': { label: 'Improve Experience', icon: '✨', description: 'Enhance user and customer experience' },
  'accelerate-research': { label: 'Accelerate Research', icon: '🔬', description: 'Speed scientific discovery and R&D' },
  'reduce-risk': { label: 'Reduce Risk', icon: '🛡️', description: 'Minimize business and operational risk' },
  'expand-knowledge': { label: 'Expand Knowledge', icon: '📚', description: 'Generate new scientific understanding' },
};

// Method Categories (ML Techniques)
const methodCategories = {
  'causal-ml': { label: 'Causal ML', icon: '🔗', description: 'Cause-effect analysis and impact measurement' },
  'interpretable-ml': { label: 'Interpretable ML', icon: '💡', description: 'Transparent models with explainable insights' },
  'forecasting': { label: 'Time Series', icon: '📈', description: 'Forecasting and temporal modeling' },
  'mlops': { label: 'MLOps', icon: '⚙️', description: 'Production ML systems and pipelines' },
  'llms': { label: 'LLMs & GenAI', icon: '🤖', description: 'Large language models and generative AI' },
  'rag': { label: 'RAG', icon: '🔍', description: 'Retrieval-augmented generation systems' },
  'automation': { label: 'Automation', icon: '🔄', description: 'Workflow automation and ETL pipelines' },
  'dashboards': { label: 'Dashboards', icon: '📊', description: 'Interactive visualization and BI tools' },
  'bioinformatics': { label: 'Bioinformatics', icon: '🧬', description: 'Computational biology and genomics' },
  'bayesian-optimization': { label: 'Bayesian Optimization', icon: '🎲', description: 'Probabilistic hyperparameter tuning' },
};

// Industry Categories
const industryCategories = {
  'pharma': { label: 'Pharma', icon: '💊', description: 'Pharmaceutical commercial analytics' },
  'enterprise': { label: 'Enterprise Tech', icon: '🏢', description: 'Enterprise software and cloud services' },
  'biotech': { label: 'Biotech', icon: '🧪', description: 'Biotechnology and life sciences R&D' },
  'national-lab': { label: 'National Lab', icon: '🔬', description: 'Government research laboratories' },
  'academic': { label: 'Academic Research', icon: '🎓', description: 'University and grant-funded research' },
  'product': { label: 'Product Development', icon: '🚀', description: 'Building new products and tools' },
};

export default function FilterToggle() {
  const [viewMode, setViewMode] = useState('goal'); // 'goal', 'method', or 'industry'
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Select category based on view mode
  const getCategoryConfig = () => {
    switch (viewMode) {
      case 'goal':
        return { categories: goalCategories, key: 'goals' };
      case 'method':
        return { categories: methodCategories, key: 'methods' };
      case 'industry':
        return { categories: industryCategories, key: 'industries' };
      default:
        return { categories: goalCategories, key: 'goals' };
    }
  };

  const { categories, key: categoryKey } = getCategoryConfig();

  // Group accomplishments by selected category type
  const grouped = useMemo(() => {
    const groups = {};
    Object.keys(categories).forEach(cat => {
      groups[cat] = accomplishments.filter(a => a[categoryKey]?.includes(cat));
    });
    return groups;
  }, [viewMode]);

  // Filter to show only selected category or all
  const displayGroups = selectedCategory
    ? { [selectedCategory]: grouped[selectedCategory] }
    : grouped;

  const handleViewChange = (mode) => {
    setViewMode(mode);
    setSelectedCategory(null);
    setExpandedId(null);
    playClick(); // Retro click sound
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-controls">
          <span className="filter-label">View by:</span>
          <div className="toggle-group">
            <button
              onClick={() => handleViewChange('goal')}
              onMouseEnter={playHover}
              className={`toggle-btn ${viewMode === 'goal' ? 'active' : ''}`}
            >
              Goal
            </button>
            <button
              onClick={() => handleViewChange('method')}
              onMouseEnter={playHover}
              className={`toggle-btn ${viewMode === 'method' ? 'active' : ''}`}
            >
              Method
            </button>
            <button
              onClick={() => handleViewChange('industry')}
              onMouseEnter={playHover}
              className={`toggle-btn ${viewMode === 'industry' ? 'active' : ''}`}
            >
              Industry
            </button>
          </div>
        </div>

        {selectedCategory && (
          <button
            onClick={() => { setSelectedCategory(null); playClick(); }}
            onMouseEnter={playHover}
            className="filter-label hover-highlight"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Show all
          </button>
        )}
      </div>

      <div className="category-pills">
        {Object.entries(categories).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => { setSelectedCategory(selectedCategory === key ? null : key); playSelect(); }}
            onMouseEnter={playHover}
            className={`pill ${selectedCategory === key ? 'active' : ''}`}
          >
            <span className="count">{icon}</span>
            {label}
            <span className="count">({grouped[key]?.length || 0})</span>
          </button>
        ))}
      </div>

      {Object.entries(displayGroups).map(([categoryId, items]) => {
        if (!items || items.length === 0) return null;
        const category = categories[categoryId];

        return (
          <section key={categoryId} className="category-section">
            <header className="category-header">
              <span className="category-icon">{category.icon}</span>
              <div>
                <h2 className="category-title">{category.label}</h2>
                <p className="category-desc">{category.description}</p>
              </div>
            </header>

            {items.map((item) => (
              <article
                key={item.id}
                className={`card ${expandedId === item.id ? 'expanded' : ''}`}
                onClick={() => {
                  const isExpanding = expandedId !== item.id;
                  setExpandedId(isExpanding ? item.id : null);
                  isExpanding ? playExpand() : playCollapse();
                }}
                onMouseEnter={playHover}
              >
                <div className="card-content">
                  <div className="card-main">
                    <div className="card-body">
                      <div className="card-title-row">
                        <span className="card-arrow">▸</span>
                        <h3 className="card-title">{item.title}</h3>
                      </div>
                      <p className="card-summary">{item.summary}</p>
                    </div>
                    <div className="card-metrics">
                      {item.metrics.slice(0, 2).map((metric, i) => (
                        <span key={i} className="metric">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {expandedId === item.id && (
                    <div className="card-expanded-content">
                      <p className="card-details">{item.details}</p>
                      <div className="tags-group">
                        <div>
                          <span className="tags-label">Goals</span>
                          <div className="tags">
                            {item.goals.map((goal) => (
                              <span key={goal} className="tag goal">
                                {goalCategories[goal]?.label || goal}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="tags-label">Methods</span>
                          <div className="tags">
                            {item.methods.map((method) => (
                              <span key={method} className="tag method">
                                {methodCategories[method]?.label || method}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="tags-label">Industries</span>
                          <div className="tags">
                            {item.industries.map((industry) => (
                              <span key={industry} className="tag industry">
                                {industryCategories[industry]?.label || industry}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
