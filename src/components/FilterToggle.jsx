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
    <div className="space-y-8">
      {/* Toggle Switch */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="text-terminal-dim text-sm">View by:</span>
          <div className="relative flex bg-terminal-surface border border-terminal-border rounded-lg p-1">
            <button
              onClick={() => { setViewMode('method'); setSelectedCategory(null); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'method'
                  ? 'bg-terminal-accent text-terminal-bg shadow-glow-sm'
                  : 'text-terminal-dim hover:text-terminal-text'
              }`}
            >
              Method
            </button>
            <button
              onClick={() => { setViewMode('industry'); setSelectedCategory(null); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'industry'
                  ? 'bg-terminal-accent text-terminal-bg shadow-glow-sm'
                  : 'text-terminal-dim hover:text-terminal-text'
              }`}
            >
              Industry
            </button>
          </div>
        </div>
        
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-terminal-dim hover:text-terminal-accent text-sm transition-colors"
          >
            ← Show all
          </button>
        )}
      </div>

      {/* Category Pills (quick filter) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(categories).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
              selectedCategory === key
                ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-accent'
                : 'border-terminal-border text-terminal-dim hover:border-terminal-muted hover:text-terminal-text'
            }`}
          >
            <span className="mr-1.5">{icon}</span>
            {label}
            <span className="ml-1.5 text-terminal-dim">({grouped[key]?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Grouped Accomplishments */}
      <div className="space-y-8">
        {Object.entries(displayGroups).map(([categoryId, items]) => {
          if (items.length === 0) return null;
          const category = categories[categoryId];
          
          return (
            <section key={categoryId} className="space-y-4">
              <header className="flex items-center gap-3 pb-2 border-b border-terminal-border">
                <span className="text-xl">{category.icon}</span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-terminal-text">
                    {category.label}
                  </h2>
                  <p className="text-terminal-dim text-xs">{category.description}</p>
                </div>
              </header>
              
              <div className="grid gap-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className={`group border rounded-lg transition-all duration-300 cursor-pointer ${
                      expandedId === item.id
                        ? 'border-terminal-accent bg-terminal-accent-glow'
                        : 'border-terminal-border bg-terminal-surface/30 hover:border-terminal-muted hover:bg-terminal-surface/50'
                    }`}
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm transition-transform duration-200 ${
                              expandedId === item.id ? 'text-terminal-accent rotate-90' : 'text-terminal-dim'
                            }`}>
                              ▸
                            </span>
                            <h3 className="font-medium text-terminal-text group-hover:text-terminal-accent transition-colors truncate">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-terminal-dim text-sm pl-5 line-clamp-2">
                            {item.summary}
                          </p>
                        </div>
                        
                        {/* Metrics preview */}
                        <div className="hidden sm:flex flex-col items-end gap-1 text-xs shrink-0">
                          {item.metrics.slice(0, 2).map((metric, i) => (
                            <span key={i} className="text-terminal-accent font-medium">
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Expanded content */}
                      {expandedId === item.id && (
                        <div className="mt-4 pt-4 border-t border-terminal-border/50 pl-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                          <p className="text-terminal-text/90 text-sm leading-relaxed">
                            {item.details}
                          </p>
                          
                          <div className="flex flex-wrap gap-4">
                            <div>
                              <span className="text-terminal-dim text-xs block mb-1">Methods</span>
                              <div className="flex flex-wrap gap-1">
                                {item.methods.map(m => (
                                  <span key={m} className="px-2 py-0.5 text-xs bg-terminal-muted/50 text-terminal-cyan rounded">
                                    {methodCategories[m]?.label || m}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-terminal-dim text-xs block mb-1">Industries</span>
                              <div className="flex flex-wrap gap-1">
                                {item.industries.map(i => (
                                  <span key={i} className="px-2 py-0.5 text-xs bg-terminal-muted/50 text-terminal-amber rounded">
                                    {industryCategories[i]?.label || i}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 sm:hidden">
                            {item.metrics.map((metric, i) => (
                              <span key={i} className="text-terminal-accent text-sm font-medium">
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
