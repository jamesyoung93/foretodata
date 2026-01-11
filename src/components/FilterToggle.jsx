import { useState, useMemo } from 'react';

// 6 ML Project Accomplishments
const accomplishments = [
  {
    id: 1,
    title: "Revenue Optimization Model",
    summary: "Built ML model that lifted B2B conversion rates 23% by identifying high-intent prospects and optimal outreach timing.",
    goals: ["grow-revenue", "improve-targeting"],
    methods: ["causal-inference", "interpretable-ml"],
    industries: ["b2b-sales", "saas"],
    details: "Used gradient boosting with SHAP explanations to surface the 12 features most predictive of deal closure. Deployed as real-time scoring API integrated with Salesforce, enabling sales reps to prioritize outreach based on predicted conversion probability and optimal contact timing windows.",
    metrics: ["23% conversion lift", "2.1x ROI on sales spend"],
  },
  {
    id: 2,
    title: "Demand Forecasting Pipeline",
    summary: "Deployed hierarchical forecasting system reducing inventory costs by $2.4M annually through better demand prediction.",
    goals: ["reduce-costs", "improve-operations"],
    methods: ["mlops", "causal-inference"],
    industries: ["supply-chain", "retail"],
    details: "Implemented Prophet + LightGBM ensemble with automated retraining via Airflow. System handles 50k SKUs across 200 locations with daily forecast updates. Includes anomaly detection for demand spikes and integration with ERP for automated reorder triggers.",
    metrics: ["$2.4M annual savings", "34% forecast accuracy improvement"],
  },
  {
    id: 3,
    title: "Customer Support Chatbot",
    summary: "Fine-tuned LLM handling 40% of support tickets autonomously with 94% customer satisfaction.",
    goals: ["reduce-costs", "improve-experience"],
    methods: ["llms", "mlops"],
    industries: ["customer-support", "e-commerce"],
    details: "RAG architecture with custom fine-tuning on 50k historical tickets. Includes escalation detection, sentiment monitoring, and seamless handoff to human agents. Integrated with Zendesk for full ticket lifecycle management and automated follow-ups.",
    metrics: ["40% ticket deflection", "94% CSAT score"],
  },
  {
    id: 4,
    title: "Dynamic Pricing Engine",
    summary: "Causal ML system for real-time price optimization, driving 18% margin improvement across product catalog.",
    goals: ["grow-revenue", "improve-margins"],
    methods: ["causal-inference", "interpretable-ml"],
    industries: ["e-commerce", "retail"],
    details: "Double ML for causal effect estimation combined with contextual bandits for continuous optimization. Handles competitor monitoring, elasticity modeling, and segment-specific pricing. Includes guardrails for price fairness and brand consistency.",
    metrics: ["18% margin improvement", "12% volume increase"],
  },
  {
    id: 5,
    title: "Market Expansion Analysis",
    summary: "Location intelligence model identifying optimal retail expansion sites with 85% success rate on launched locations.",
    goals: ["expand-market", "reduce-risk"],
    methods: ["interpretable-ml", "causal-inference"],
    industries: ["retail", "real-estate"],
    details: "Geospatial features + demographic clustering with explainable predictions for site selection. Model incorporates foot traffic data, competitor proximity, demographic fit scores, and cannibalization risk assessment. Outputs include confidence intervals and key risk factors.",
    metrics: ["85% site success rate", "14 new locations launched"],
  },
  {
    id: 6,
    title: "Document Intelligence System",
    summary: "LLM-powered contract analysis reducing legal review time by 60% while maintaining 99%+ extraction accuracy.",
    goals: ["reduce-costs", "improve-operations"],
    methods: ["llms", "mlops"],
    industries: ["legal", "finance"],
    details: "Custom extraction pipeline with multi-stage validation workflows. Handles clause identification, obligation extraction, risk flagging, and comparison against standard templates. Includes human-in-the-loop review interface with active learning for continuous improvement.",
    metrics: ["60% time reduction", "99.2% extraction accuracy"],
  },
];

// Goal Categories (Business Outcomes)
const goalCategories = {
  'grow-revenue': { label: 'Grow Revenue', icon: '📈', description: 'Increase sales, conversions, and revenue' },
  'reduce-costs': { label: 'Reduce Costs', icon: '💰', description: 'Cut operational expenses and inefficiencies' },
  'improve-operations': { label: 'Improve Operations', icon: '⚡', description: 'Streamline processes and automation' },
  'improve-experience': { label: 'Improve Experience', icon: '😊', description: 'Enhance customer satisfaction' },
  'expand-market': { label: 'Expand Market', icon: '🚀', description: 'Enter new markets and segments' },
  'improve-targeting': { label: 'Improve Targeting', icon: '🎯', description: 'Better audience and lead targeting' },
  'improve-margins': { label: 'Improve Margins', icon: '📊', description: 'Optimize pricing and profitability' },
  'reduce-risk': { label: 'Reduce Risk', icon: '🛡️', description: 'Minimize business and operational risk' },
};

// Method Categories (ML Techniques)
const methodCategories = {
  'llms': { label: 'LLMs & GenAI', icon: '🔮', description: 'Large language models and generative AI' },
  'interpretable-ml': { label: 'Interpretable ML', icon: '💡', description: 'Transparent models with explainable insights' },
  'causal-inference': { label: 'Causal Inference', icon: '🎯', description: 'Cause-effect analysis and impact measurement' },
  'mlops': { label: 'MLOps', icon: '⚙️', description: 'Production ML systems and pipelines' },
};

// Industry Categories
const industryCategories = {
  'b2b-sales': { label: 'B2B Sales', icon: '🤝', description: 'Enterprise sales and account management' },
  'saas': { label: 'SaaS', icon: '☁️', description: 'Software as a service' },
  'supply-chain': { label: 'Supply Chain', icon: '📦', description: 'Inventory, logistics, demand planning' },
  'retail': { label: 'Retail', icon: '🏪', description: 'Store operations and expansion' },
  'customer-support': { label: 'Customer Support', icon: '💬', description: 'Help desk and ticket management' },
  'e-commerce': { label: 'E-commerce', icon: '🛒', description: 'Online retail and marketplaces' },
  'legal': { label: 'Legal', icon: '⚖️', description: 'Contract analysis and compliance' },
  'finance': { label: 'Finance', icon: '💵', description: 'Financial services and banking' },
  'real-estate': { label: 'Real Estate', icon: '🏢', description: 'Property and location intelligence' },
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
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-controls">
          <span className="filter-label">View by:</span>
          <div className="toggle-group">
            <button
              onClick={() => handleViewChange('goal')}
              className={`toggle-btn ${viewMode === 'goal' ? 'active' : ''}`}
            >
              Goal
            </button>
            <button
              onClick={() => handleViewChange('method')}
              className={`toggle-btn ${viewMode === 'method' ? 'active' : ''}`}
            >
              Method
            </button>
            <button
              onClick={() => handleViewChange('industry')}
              className={`toggle-btn ${viewMode === 'industry' ? 'active' : ''}`}
            >
              Industry
            </button>
          </div>
        </div>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
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
            onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
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
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
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
