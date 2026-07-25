import { useState } from 'react';

const systems = [
  {
    id: 'decision',
    label: 'Decision systems',
    question: 'Where should constrained resources move, and what change should that produce?',
    outcome: 'Measurable operational or commercial response',
    levers: ['budget', 'cadence', 'channel mix', 'capacity'],
    context: ['baseline opportunity', 'market dynamics', 'access', 'prior allocation'],
    constraints: ['coverage', 'policy', 'capacity', 'observed support'],
    engine: 'Response model → scenario simulation → constrained optimizer',
    decision: 'A feasible allocation, expected impact, and measurement plan',
  },
  {
    id: 'intelligence',
    label: 'Interactive intelligence',
    question: 'How can a person explore, reason, and act without losing the source of truth?',
    outcome: 'A useful answer, analysis, or completed workflow',
    levers: ['model choice', 'retrieval scope', 'tool permissions', 'interface'],
    context: ['data authority', 'privacy', 'device resources', 'user intent'],
    constraints: ['provenance', 'latency', 'approval', 'allowed actions'],
    engine: 'Intent translation → governed or local tools → verified artifact',
    decision: 'An answer or action with evidence and boundaries attached',
  },
  {
    id: 'science',
    label: 'Scientific discovery',
    question: 'Which candidate or experiment will produce the most useful next piece of evidence?',
    outcome: 'Validated knowledge or improved biological function',
    levers: ['candidate', 'variant', 'condition', 'assay design'],
    context: ['sequence', 'structure', 'multi-omics', 'prior experiments'],
    constraints: ['assay capacity', 'cost', 'uncertainty', 'biological plausibility'],
    engine: 'Representation → active search → candidate prioritization',
    decision: 'The next experiment, its rationale, and what remains uncertain',
  },
];

function VariableGroup({ label, values, kind }) {
  return (
    <div className={`lens-variable-group lens-variable-group--${kind}`}>
      <span>{label}</span>
      <div>
        {values.map((value) => <span className="lens-chip" key={value}>{value}</span>)}
      </div>
    </div>
  );
}

export default function SystemsLens() {
  const [selected, setSelected] = useState(systems[0].id);
  const system = systems.find((item) => item.id === selected) ?? systems[0];

  return (
    <div className="systems-lens">
      <div className="lens-toolbar">
        <div>
          <span className="meta-label">Interactive systems lens</span>
          <p>Choose a domain. The variables change; the decision architecture persists.</p>
        </div>
        <div className="lens-switcher" aria-label="Choose a system to examine">
          {systems.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={item.id === selected}
              onClick={() => setSelected(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lens-panel" key={system.id}>
        <div className="lens-question">
          <span className="meta-label">Decision question</span>
          <strong>{system.question}</strong>
        </div>

        <div className="lens-map">
          <article className="lens-outcome">
            <span className="meta-label">Desired outcome</span>
            <strong>{system.outcome}</strong>
          </article>

          <div className="lens-variables">
            <VariableGroup label="Controllable levers" values={system.levers} kind="lever" />
            <VariableGroup label="Observed context" values={system.context} kind="context" />
            <VariableGroup label="Constraints" values={system.constraints} kind="constraint" />
          </div>

          <article className="lens-engine">
            <span className="meta-label">Reasoning engine</span>
            <strong>{system.engine}</strong>
          </article>

          <article className="lens-decision">
            <span className="meta-label">Decision product</span>
            <strong>{system.decision}</strong>
          </article>
        </div>

        <div className="lens-cycle" aria-label="Represent, simulate, decide, and learn">
          {['Represent', 'Simulate', 'Decide', 'Learn'].map((stage, index) => (
            <span key={stage}>
              <b>0{index + 1}</b>
              {stage}
            </span>
          ))}
        </div>
      </div>

      <p className="lens-caption">Conceptual map. A deployed system requires domain-specific data, validation, and decision rights.</p>
    </div>
  );
}
