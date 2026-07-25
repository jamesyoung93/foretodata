import { useMemo, useState } from 'react';
import { caseStudies } from '../data/site';
import { playHover, playSelect } from '../utils/soundManager.js';

const domains = ['All', ...new Set(caseStudies.map((study) => study.domain))];

const asciiPanels = [
  {
    label: 'DECISION SYSTEM',
    art: `outcome  ◀── response model\n                 ▲\ncontext ────────┼──── scenario\n                 │\nlevers  ────────┴──── optimize ──▶ act`,
    note: 'Separate what can be changed from what must be observed.',
  },
  {
    label: 'INTERACTIVE INTELLIGENCE',
    art: `question ─▶ translate ─▶ governed tool\n                              │\nlocal model ─▶ retrieve ──────┤\n                              ▼\n                      evidence artifact`,
    note: 'Use language as the interface while keeping truth in the system.',
  },
  {
    label: 'SCIENTIFIC SEARCH',
    art: `sequence ─┬─ context\n          ├─ expression ─▶ rank ─▶ test\n          └─ structure          │\n                     learn ◀────┘`,
    note: 'Choose the next experiment for information as well as score.',
  },
];

export default function LabExplorer({ basePath = '/foretodata/' }) {
  const [domain, setDomain] = useState('All');
  const filtered = useMemo(
    () => domain === 'All' ? caseStudies : caseStudies.filter((study) => study.domain === domain),
    [domain],
  );

  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const toPath = (path) => `${normalizedBase}${path.replace(/^\/+/, '')}`;

  return (
    <>
      <div className="lab-figure" aria-label="Conceptual analytical system diagrams">
        {asciiPanels.map((panel) => (
          <section className="lab-figure-panel" key={panel.label}>
            <span className="lab-prompt">// {panel.label}</span>
            <pre aria-hidden="true">{panel.art}</pre>
            <p>{panel.note}</p>
          </section>
        ))}
      </div>

      <section aria-labelledby="lab-projects">
        <span className="lab-prompt">$ ls ./work --group=domain</span>
        <h2 id="lab-projects">Project index</h2>
        <div className="lab-filter" aria-label="Filter projects by domain">
          {domains.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={domain === item}
              onMouseEnter={playHover}
              onClick={() => {
                setDomain(item);
                playSelect();
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="lab-project-grid" aria-live="polite">
          {filtered.map((study) => (
            <article className="lab-project" key={study.slug}>
              <span className="lab-prompt">./{study.slug}</span>
              <h3>{study.title}</h3>
              <p>{study.question}</p>
              <a href={toPath(`work/${study.slug}`)}>view work →</a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
