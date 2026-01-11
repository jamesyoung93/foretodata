import { useState, useMemo } from 'react';

// Accomplishment data - you'll populate this from your content
const accomplishments = [
  {
    id: 1,
    title: "Revenue Optimization Model",
    summary: "Built ML model that lifted B2B conversion rates 23% by identifying high-intent prospects and optimal outreach timing.",
    methods: ["causal-inference", "interpretable-ml"],
    industries: ["revenue", "b2b-sales"],
    details: "Used gradient boosting with SHAP explanations to surface the 12 features most predictive of deal closure...",
    metrics: ["23% conversion lift", "2.1x ROI on sales spend"],
  },
  {
    id: 2,
    title: "Demand Forecasting Pipeline",
    summary: "Deployed hierarchical forecasting system reducing inventory costs by $2.4M annually through better demand prediction.",
    methods: ["mlops", "causal-inference"],
    industries: ["operations", "supply-chain"],
    details: "Implemented Prophet + LightGBM ensemble with automated retraining via Airflow...",
    metrics: ["$2.4M annual savings", "34% forecast accuracy improvement"],
  },
  {
    id: 3,
    title: "Customer Support Chatbot",
    summary: "Fine-tuned LLM handling 40% of support tickets autonomously with 94% customer satisfaction.",
    methods: ["llms", "mlops"],
    industries: ["operations", "customer-experience"],
    details: "RAG architecture with custom fine-tuning on 50k historical tickets...",
    metrics: ["40% ticket deflection", "94% CSAT score"],
  },
  {
    id: 4,
    title: "Dynamic Pricing Engine",
    summary: "Causal ML system for real-time price optimization, driving 18% margin improvement.",
    methods: ["causal-inference", "interpretable-ml"],
    industries: ["revenue", "pricing"],
    details: "Double ML for causal effect estimation combined with contextual bandits...",
    metrics: ["18% margin improvement", "12% volume increase"],
  },
  {
    id: 5,
    title: "Market Expansion Analysis",
    summary: "Location intelligence model identifying optimal retail expansion sites with 85% success rate.",
    methods: ["interpretable-ml", "causal-inference"],
    industries: ["expansion", "retail"],
    details: "Geospatial features + demographic clustering with explainable predictions...",
    metrics: ["85% site success rate", "14 new locations launched"],
  },
  {
    id: 6,
    title: "Document Intelligence System",
    summary: "LLM-powered contract analysis reducing legal review time by 60%.",
    methods: ["llms", "mlops"],
    industries: ["operations", "legal"],
    details: "Custom extraction pipeline with validation workflows...",
    metrics: ["60% time reduction", "99.2% extraction accuracy"],
  },
];

// Category definitions
const methodCategories = {
  'llms': { label: 'LLMs & GenAI', icon: '🔮', description: 'Large language models and generative AI' },
  'interpretable-ml': { label: 'Interpretable ML', icon: '💡', description: 'Transparent models with explainable insights' },
  'causal-inference': { label: 'Causal Inference', icon: '🎯', description: 'Cause-effect analysis and impact measurement' },
  'mlops': { label: 'MLOps', icon: '⚙️', description: 'Production ML systems and pipelines' },
};

const industryCategories = {
  'revenue': { label: 'Grow Revenue', icon: '💰', description: 'Sales optimization, pricing, conversion' },
  'operations': { label: 'Streamline Ops', icon: '⚡', description: 'Automation, efficiency, cost reduction' },
  'expansion': { label: 'Expand Business', icon: '🚀', description: 'Market analysis, location intelligence' },
  'b2b-sales': { label: 'B2B Sales', icon: '🤝', description: 'Enterprise sales and account management' },
  'pricing': { label: 'Pricing', icon: '📊', description: 'Dynamic pricing and margin optimization' },
  'supply-chain': { label: 'Supply Chain', icon: '📦', description: 'Inventory, logistics, demand planning' },
  'customer-experience': { label: 'Customer Experience', icon: '💬', description: 'Support, satisfaction, engagement' },
  'retail': { label: 'Retail', icon: '🏪', description: 'Store operations and expansion' },
  'legal': { label: 'Legal', icon: '⚖️', description: 'Contract analysis and compliance' },
};

export default function FilterToggle() {
  const [viewMode, setViewMode] = useState('method'); // 'method' or 'industry'
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = viewMode === 'method' ? methodCategories : industryCategories;
  const categoryKey = viewMode === 'method' ? 'methods' : 'industries';

  // Group accomplishments by selected category type
  const grouped = useMemo(() => {
    const groups = {};
    Object.keys(categories).forEach(cat => {
      groups[cat] = accomplishments.filter(a => a[categoryKey].includes(cat));
    });
    return groups;
  }, [viewMode]);

  // Filter to show only selected category or all
  const displayGroups = selectedCategory 
    ? { [selectedCategory]: grouped[selectedCategory] }
    : grouped;

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-controls">
          <span className="filter-label">View by:</span>
          <div className="toggle-group">
            <button
              onClick={() => { setViewMode('method'); setSelectedCategory(null); }}
              className={`toggle-btn ${viewMode === 'method' ? 'active' : ''}`}
            >
              Method
            </button>
            <button
              onClick={() => { setViewMode('industry'); setSelectedCategory(null); }}
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
        if (items.length === 0) return null;
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
