import { useMemo, useState } from 'react';
import { caseStudies } from '../data/site';
import { playHover, playSelect } from '../utils/soundManager.js';

const domains = ['All', ...new Set(caseStudies.map((study) => study.domain))];

const asciiPanels = [
  {
    label: 'MAP',
    art: `desired outcome\n      ▲\n      ├──── what can change\n      ├──── what must be accounted for\n      └──── constraints + uncertainty`,
    note: 'Make the outcome, choices, context, and limits explicit.',
  },
  {
    label: 'SIMULATE',
    art: `current state ──▶ option A ──▶ possible outcome\n              ├──▶ option B ──▶ possible outcome\n              └──▶ option C ──▶ possible outcome`,
    note: 'Compare realistic actions before committing resources.',
  },
  {
    label: 'OPTIMIZE → LEARN',
    art: `options + constraints ──▶ best feasible action\n                                  │\nupdated system ◀── measured result ◀─┘`,
    note: 'Choose what can be carried out, then use the result to improve the next decision.',
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
      <div className="lab-figure" aria-label="Map, simulate, optimize, and learn">
        {asciiPanels.map((panel) => (
          <section className="lab-figure-panel" key={panel.label}>
            <span className="lab-prompt">// {panel.label}</span>
            <pre aria-hidden="true">{panel.art}</pre>
            <p>{panel.note}</p>
          </section>
        ))}
      </div>

      <section aria-labelledby="lab-projects">
        <span className="lab-prompt">$ explore ./systems --group=domain</span>
        <h2 id="lab-projects">Systems in practice</h2>
        <div className="lab-filter" aria-label="Filter work by domain">
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
              <p>{study.summary}</p>
              <a href={toPath(`work/${study.slug}`)}>open system →</a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
