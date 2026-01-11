import { useState, useMemo } from 'react';

const accomplishments = [
  {
    id: 1,
    title: "Revenue Optimization Model",
    summary: "Built ML model that lifted B2B conversion rates 23% by identifying high-intent prospects and optimal outreach timing.",
    methods: ["causal-inference", "interpretable-ml"],
    industries: ["revenue", "b2b-sales"],
    details: "Used gradient boosting with SHAP explanations to surface the 12 features most predictive of deal closure. Integrated with CRM for real-time lead scoring.",
    metrics: ["23% conversion lift", "2.1x ROI on sales spend"],
  },
  {
    id: 2,
    title: "Demand Forecasting Pipeline",
    summary: "Deployed hierarchical forecasting system reducing inventory costs by $2.4M annually through better demand prediction.",
    methods: ["mlops", "causal-inference"],
    industries: ["operations", "supply-chain"],
    details: "Implemented Prophet + LightGBM ensemble with automated retraining via Airflow. Handles 50k SKUs across 200 locations.",
    metrics: ["$2.4M annual savings", "34% forecast accuracy improvement"],
  },
  {
    id: 3,
    title: "Customer Support Chatbot",
    summary: "Fine-tuned LLM handling 40% of support tickets autonomously with 94% customer satisfaction.",
    methods: ["llms", "mlops"],
    industries: ["operations", "customer-experience"],
    details: "RAG architecture with custom fine-tuning on 50k historical tickets. Seamless handoff to human agents for complex cases.",
    metrics: ["40% ticket deflection", "94% CSAT score"],
  },
  {
    id: 4,
    title: "Dynamic Pricing Engine",
    summary: "Causal ML system for real-time price optimization, driving 18% margin improvement.",
    methods: ["causal-inference", "interpretable-ml"],
    industries: ["revenue", "pricing"],
    details: "Double ML for causal effect estimation combined with contextual bandits for exploration. Processes 1M pricing decisions daily.",
    metrics: ["18% margin improvement", "12% volume increase"],
  },
  {
    id: 5,
    title: "Market Expansion Analysis",
    summary: "Location intelligence model identifying optimal retail expansion sites with 85% success rate.",
    methods: ["interpretable-ml", "causal-inference"],
    industries: ["expansion", "retail"],
    details: "Geospatial features + demographic clustering with explainable predictions. Board-ready visualizations for site selection.",
    metrics: ["85% site success rate", "14 new locations launched"],
  },
  {
    id: 6,
    title: "Document Intelligence System",
    summary: "LLM-powered contract analysis reducing legal review time by 60%.",
    methods: ["llms", "mlops"],
    industries: ["operations", "legal"],
    details: "Custom extraction pipeline with validation workflows. Handles NDAs, MSAs, and SOWs with clause-level precision.",
    metrics: ["60% time reduction", "99.2% extraction accuracy"],
  },
];

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

const styles = {
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  filterControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  filterLabel: {
    color: '#808080',
    fontSize: '0.875rem',
  },
  toggleGroup: {
    display: 'flex',
    background: '#111111',
    border: '1px solid #1a1a1a',
    borderRadius: '0.5rem',
    padding: '0.25rem',
  },
  toggleBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    fontFamily: 'inherit',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'transparent',
    color: '#808080',
  },
  toggleBtnActive: {
    background: '#00ff88',
    color: '#0a0a0a',
    boxShadow: '0 0 10px rgba(0, 255, 136, 0.2)',
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  pill: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    fontFamily: 'inherit',
    borderRadius: '9999px',
    border: '1px solid #1a1a1a',
    background: 'transparent',
    color: '#808080',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pillActive: {
    borderColor: '#00ff88',
    background: 'rgba(0, 255, 136, 0.1)',
    color: '#00ff88',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #1a1a1a',
    marginBottom: '1rem',
  },
  sectionIcon: {
    fontSize: '1.25rem',
  },
  sectionTitle: {
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#e0e0e0',
    margin: 0,
  },
  sectionDesc: {
    color: '#808080',
    fontSize: '0.75rem',
    margin: 0,
  },
  card: {
    border: '1px solid #1a1a1a',
    borderRadius: '0.5rem',
    background: 'rgba(17, 17, 17, 0.3)',
    marginBottom: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cardExpanded: {
    borderColor: '#00ff88',
    background: 'rgba(0, 255, 136, 0.15)',
  },
  cardContent: {
    padding: '1rem',
  },
  cardMain: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  cardArrow: {
    color: '#808080',
    fontSize: '0.875rem',
    transition: 'transform 0.2s',
  },
  cardArrowExpanded: {
    color: '#00ff88',
    transform: 'rotate(90deg)',
  },
  cardTitle: {
    fontWeight: '500',
    color: '#e0e0e0',
    margin: 0,
    fontSize: '1rem',
  },
  cardSummary: {
    color: '#808080',
    fontSize: '0.875rem',
    margin: 0,
    paddingLeft: '1.25rem',
  },
  cardMetrics: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem',
    flexShrink: 0,
  },
  metric: {
    color: '#00ff88',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(26, 26, 26, 0.5)',
    paddingLeft: '1.25rem',
  },
  details: {
    color: 'rgba(224, 224, 224, 0.9)',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  tagsGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  tagsLabel: {
    color: '#808080',
    fontSize: '0.75rem',
    display: 'block',
    marginBottom: '0.25rem',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
  },
  tagMethod: {
    padding: '0.125rem 0.5rem',
    fontSize: '0.75rem',
    background: 'rgba(42, 42, 42, 0.5)',
    borderRadius: '0.25rem',
    color: '#00d4ff',
  },
  tagIndustry: {
    padding: '0.125rem 0.5rem',
    fontSize: '0.75rem',
    background: 'rgba(42, 42, 42, 0.5)',
    borderRadius: '0.25rem',
    color: '#ffaa00',
  },
  backLink: {
    color: '#808080',
    fontSize: '0.875rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

export default function FilterToggle() {
  const [viewMode, setViewMode] = useState('method');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = viewMode === 'method' ? methodCategories : industryCategories;
  const categoryKey = viewMode === 'method' ? 'methods' : 'industries';

  const grouped = useMemo(() => {
    const groups = {};
    Object.keys(categories).forEach(cat => {
      groups[cat] = accomplishments.filter(a => a[categoryKey].includes(cat));
    });
    return groups;
  }, [viewMode]);

  const displayGroups = selectedCategory 
    ? { [selectedCategory]: grouped[selectedCategory] }
    : grouped;

  return (
    <div>
      {/* Toggle Switch */}
      <div style={styles.filterBar}>
        <div style={styles.filterControls}>
          <span style={styles.filterLabel}>View by:</span>
          <div style={styles.toggleGroup}>
            <button
              onClick={() => { setViewMode('method'); setSelectedCategory(null); }}
              className="hover-highlight"
              style={{
                ...styles.toggleBtn,
                ...(viewMode === 'method' ? styles.toggleBtnActive : {}),
              }}
            >
              Method
            </button>
            <button
              onClick={() => { setViewMode('industry'); setSelectedCategory(null); }}
              className="hover-highlight"
              style={{
                ...styles.toggleBtn,
                ...(viewMode === 'industry' ? styles.toggleBtnActive : {}),
              }}
            >
              Industry
            </button>
          </div>
        </div>
        
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="hover-highlight"
            style={styles.backLink}
          >
            ← Show all
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div style={styles.pills}>
        {Object.entries(categories).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
            className="hover-highlight"
            style={{
              ...styles.pill,
              ...(selectedCategory === key ? styles.pillActive : {}),
            }}
          >
            <span style={{ marginRight: '0.375rem' }}>{icon}</span>
            {label}
            <span style={{ marginLeft: '0.375rem', color: '#808080' }}>
              ({grouped[key]?.length || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Grouped Accomplishments */}
      <div>
        {Object.entries(displayGroups).map(([categoryId, items]) => {
          if (items.length === 0) return null;
          const category = categories[categoryId];
          
          return (
            <section key={categoryId} style={styles.section}>
              <header style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>{category.icon}</span>
                <div>
                  <h2 style={styles.sectionTitle}>{category.label}</h2>
                  <p style={styles.sectionDesc}>{category.description}</p>
                </div>
              </header>
              
              <div>
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="hover-highlight"
                    style={{
                      ...styles.card,
                      ...(expandedId === item.id ? styles.cardExpanded : {}),
                    }}
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <div style={styles.cardContent}>
                      <div style={styles.cardMain}>
                        <div style={styles.cardBody}>
                          <div style={styles.cardTitleRow}>
                            <span style={{
                              ...styles.cardArrow,
                              ...(expandedId === item.id ? styles.cardArrowExpanded : {}),
                            }}>
                              ▸
                            </span>
                            <h3 style={styles.cardTitle}>{item.title}</h3>
                          </div>
                          <p style={styles.cardSummary}>{item.summary}</p>
                        </div>
                        
                        <div style={styles.cardMetrics}>
                          {item.metrics.slice(0, 2).map((metric, i) => (
                            <span key={i} style={styles.metric}>{metric}</span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Expanded content */}
                      {expandedId === item.id && (
                        <div style={styles.expandedContent}>
                          <p style={styles.details}>{item.details}</p>
                          
                          <div style={styles.tagsGroup}>
                            <div>
                              <span style={styles.tagsLabel}>Methods</span>
                              <div style={styles.tags}>
                                {item.methods.map(m => (
                                  <span key={m} style={styles.tagMethod}>
                                    {methodCategories[m]?.label || m}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span style={styles.tagsLabel}>Industries</span>
                              <div style={styles.tags}>
                                {item.industries.map(i => (
                                  <span key={i} style={styles.tagIndustry}>
                                    {industryCategories[i]?.label || i}
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
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
