import { useState } from 'react';

const systems = [
  {
    id: 'decision',
    label: 'Decision systems',
    question: 'How should limited resources be allocated to produce the best result?',
    outcome: 'More impact from the resources available',
    levers: ['where the budget goes', 'timing', 'channel mix', 'capacity'],
    context: ['starting conditions', 'market changes', 'access', 'past performance'],
    constraints: ['total budget', 'coverage requirements', 'policy', 'available capacity'],
    engine: 'Estimate likely outcomes, compare scenarios, and choose the best feasible allocation',
    decision: 'An allocation plan, expected result, and way to measure what happens',
  },
  {
    id: 'intelligence',
    label: 'Interactive AI',
    question: 'How can someone answer a complex question or complete a task without losing privacy, control, or source evidence?',
    outcome: 'A useful answer or completed task that can be checked',
    levers: ['model', 'information sources', 'tool access', 'interface'],
    context: ['source data', 'privacy needs', 'device limits', 'user goal'],
    constraints: ['approved actions', 'response time', 'evidence requirements', 'human approval'],
    engine: 'Understand the request, use approved local or governed tools, and verify the result',
    decision: 'A supported answer or action with its sources and limits made clear',
  },
  {
    id: 'science',
    label: 'Scientific machine learning',
    question: 'Which candidate or experiment is most likely to produce useful new evidence?',
    outcome: 'A more informative experiment and faster learning',
    levers: ['candidate', 'variant', 'condition', 'experiment design'],
    context: ['sequence', 'structure', 'biological evidence', 'past experiments'],
    constraints: ['experiment capacity', 'cost', 'uncertainty', 'biological plausibility'],
    engine: 'Bring the evidence together, compare candidates, and prioritize the most useful test',
    decision: 'The next experiment, why it is worth running, and what remains uncertain',
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
          <span className="meta-label">See the method in different domains</span>
          <p>Choose a domain. The details change, but the four-step decision loop stays the same.</p>
        </div>
        <div className="lens-switcher" aria-label="Choose an area to examine">
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
          <span className="meta-label">Decision to improve</span>
          <strong>{system.question}</strong>
        </div>

        <div className="lens-map">
          <article className="lens-outcome">
            <span className="meta-label">What success looks like</span>
            <strong>{system.outcome}</strong>
          </article>

          <div className="lens-variables">
            <VariableGroup label="What you can change" values={system.levers} kind="lever" />
            <VariableGroup label="What you need to account for" values={system.context} kind="context" />
            <VariableGroup label="What limits the choice" values={system.constraints} kind="constraint" />
          </div>

          <article className="lens-engine">
            <span className="meta-label">How options are evaluated</span>
            <strong>{system.engine}</strong>
          </article>

          <article className="lens-decision">
            <span className="meta-label">Recommended next step</span>
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

      <p className="lens-caption">The method is consistent; each implementation is built around the data, constraints, and authority of the people making the decision.</p>
    </div>
  );
}
