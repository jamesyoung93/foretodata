import { useState, useEffect } from 'react';
import MolecularViewer from './MolecularViewer';
import CausalNetworkVisualization from './CausalNetworkVisualization';
import WaddingtonLandscape from './WaddingtonLandscape';

// ============================================================================
// PANEL 1: ENZYME ENGINEERING - Navigating sequence space to optimize function
// ============================================================================
// Animation tells the story of exploring a fitness landscape:
// - 3D wireframe mesh shows rugged landscape (sequence space)
// - Tracer moves across surface (not just left-right but also depth)
// - Allosteric sites pulse when big changes happen
// - Metrics improve as tracer climbs toward global optimum
const enzymeFrames = [
  {
    // Frame 1: Starting position - tracer in low valley
    art: `
 ACTIVE SITE         FITNESS LANDSCAPE
 ┌─────────────┐    ┌───────────────────┐
 │   ○───○     │    │ ╱─╲   ╱───╲  ╱─╲  │
 │  ╱  ▼  ╲    │    │╱   ╲_╱     ╲╱   ╲ │
 │ ●   ◇   ●   │    │─────•─────────────│
 │  ╲     ╱    │    │╲   ╱ ╲     ╱╲   ╱ │
 │   ●───●     │    │ ╲_╱   ╲___╱  ╲_╱  │
 │○         ○  │    │    sequence space  │
 │allo   allo  │    └───────────────────┘
 └─────────────┘`,
    metrics: { kcat: '142', efficiency: '1.2', tm: '68' },
    allosteric: [false, false]
  },
  {
    // Frame 2: Climbing local peak - first allosteric pulses
    art: `
 ACTIVE SITE         FITNESS LANDSCAPE
 ┌─────────────┐    ┌───────────────────┐
 │   ○───○     │    │ ╱─╲   ╱───╲  ╱─╲  │
 │  ╱  ▼  ╲    │    │╱ • ╲_╱     ╲╱   ╲ │
 │ ●   ◆   ●   │    │─────────────────── │
 │  ╲     ╱    │    │╲   ╱ ╲     ╱╲   ╱ │
 │   ●───●     │    │ ╲_╱   ╲___╱  ╲_╱  │
 │◉         ○  │    │    sequence space  │
 │allo   allo  │    └───────────────────┘
 └─────────────┘`,
    metrics: { kcat: '148', efficiency: '1.3', tm: '70' },
    allosteric: [true, false]
  },
  {
    // Frame 3: At local peak - good but not optimal
    art: `
 ACTIVE SITE         FITNESS LANDSCAPE
 ┌─────────────┐    ┌───────────────────┐
 │   ●───●     │    │ •─╲   ╱───╲  ╱─╲  │
 │  ╱  ▼  ╲    │    │╱   ╲_╱     ╲╱   ╲ │
 │ ●   ◆   ●   │    │─────────────────── │
 │  ╲     ╱    │    │╲   ╱ ╲     ╱╲   ╱ │
 │   ●───●     │    │ ╲_╱   ╲___╱  ╲_╱  │
 │◉         ◉  │    │    sequence space  │
 │allo   allo  │    └───────────────────┘
 └─────────────┘`,
    metrics: { kcat: '151', efficiency: '1.4', tm: '71' },
    allosteric: [true, true]
  },
  {
    // Frame 4: Dropping into valley - exploring further
    art: `
 ACTIVE SITE         FITNESS LANDSCAPE
 ┌─────────────┐    ┌───────────────────┐
 │   ○───○     │    │ ╱─╲   ╱───╲  ╱─╲  │
 │  ╱  ▽  ╲    │    │╱   ╲_╱  •  ╲╱   ╲ │
 │ ○   ◇   ○   │    │─────────────────── │
 │  ╲     ╱    │    │╲   ╱ ╲     ╱╲   ╱ │
 │   ○───○     │    │ ╲_╱   ╲___╱  ╲_╱  │
 │○         ○  │    │    sequence space  │
 │allo   allo  │    └───────────────────┘
 └─────────────┘`,
    metrics: { kcat: '144', efficiency: '1.2', tm: '69' },
    allosteric: [false, false]
  },
  {
    // Frame 5: Climbing toward global maximum
    art: `
 ACTIVE SITE         FITNESS LANDSCAPE
 ┌─────────────┐    ┌───────────────────┐
 │   ●───●     │    │ ╱─╲   ╱─•─╲  ╱─╲  │
 │  ╱  ▼  ╲    │    │╱   ╲_╱     ╲╱   ╲ │
 │ ●   ◆   ●   │    │─────────────────── │
 │  ╲     ╱    │    │╲   ╱ ╲     ╱╲   ╱ │
 │   ●───●     │    │ ╲_╱   ╲___╱  ╲_╱  │
 │◉         ○  │    │    sequence space  │
 │allo   allo  │    └───────────────────┘
 └─────────────┘`,
    metrics: { kcat: '155', efficiency: '1.5', tm: '72' },
    allosteric: [true, false]
  },
  {
    // Frame 6: Near global optimum - best metrics
    art: `
 ACTIVE SITE         FITNESS LANDSCAPE
 ┌─────────────┐    ┌───────────────────┐
 │   ●═══●     │    │ ╱─╲   ╱─╲ •  ╱─╲  │
 │  ╱  ▼  ╲    │    │╱   ╲_╱   ╲ ╲╱   ╲ │
 │ ●   ★   ●   │    │─────────────────── │
 │  ╲     ╱    │    │╲   ╱ ╲     ╱╲   ╱ │
 │   ●═══●     │    │ ╲_╱   ╲___╱  ╲_╱  │
 │◉         ◉  │    │    sequence space  │
 │allo   allo  │    └───────────────────┘
 └─────────────┘`,
    metrics: { kcat: '162', efficiency: '1.6', tm: '74' },
    allosteric: [true, true]
  },
];

// ============================================================================
// PANEL 3: PROTEIN FITNESS LANDSCAPE - Active learning optimizes protein function
// ============================================================================
// Animation tells the story of ML-guided protein engineering:
// - 3D landscape shows fitness surface (sequence → embedding → function)
// - Ball moves through landscape as active learning explores
// - Metrics show fitness, uncertainty, delta vs wildtype, and round
// - Progression through active learning rounds toward optimum
const regulatoryFrames = [
  // ========== ROUND 1: Initial exploration ==========
  {
    art: ``, // Using 3D WaddingtonLandscape instead
    fitness: 0.42, uncertainty: 0.18, deltaWT: '-0.8σ', round: 'Active Learning R1'
  },
  {
    art: ``,
    fitness: 0.48, uncertainty: 0.15, deltaWT: '-0.4σ', round: 'Active Learning R1'
  },
  {
    art: ``,
    fitness: 0.53, uncertainty: 0.14, deltaWT: '+0.2σ', round: 'Active Learning R1'
  },
  // ========== ROUND 2: Refining search ==========
  {
    art: ``,
    fitness: 0.61, uncertainty: 0.12, deltaWT: '+0.9σ', round: 'Active Learning R2'
  },
  {
    art: ``,
    fitness: 0.68, uncertainty: 0.11, deltaWT: '+1.3σ', round: 'Active Learning R2'
  },
  {
    art: ``,
    fitness: 0.74, uncertainty: 0.10, deltaWT: '+1.6σ', round: 'Active Learning R2'
  },
  // ========== ROUND 3: Approaching optimum ==========
  {
    art: ``,
    fitness: 0.79, uncertainty: 0.09, deltaWT: '+1.8σ', round: 'Active Learning R3'
  },
  {
    art: ``,
    fitness: 0.85, uncertainty: 0.08, deltaWT: '+2.0σ', round: 'Active Learning R3'
  },
  {
    art: ``,
    fitness: 0.91, uncertainty: 0.08, deltaWT: '+2.3σ', round: 'Active Learning R3'
  },
  // ========== ROUND 4: Fine-tuning at optimum ==========
  {
    art: ``,
    fitness: 0.94, uncertainty: 0.06, deltaWT: '+2.5σ', round: 'Active Learning R4'
  },
  {
    art: ``,
    fitness: 0.96, uncertainty: 0.05, deltaWT: '+2.7σ', round: 'Active Learning R4'
  },
  {
    art: ``,
    fitness: 0.97, uncertainty: 0.04, deltaWT: '+2.8σ', round: 'Active Learning R4'
  },
];

// ============================================================================
// PANEL 3: DECISION SYSTEMS - ML finds levers in business systems
// ============================================================================
const decisionFrames = [
  {
    art: `
   ▸▸▸│         ┌─────┐
   ▹▹▹│  ──▶    │ ◇◇◇ │   ──▶
   ▸▸▸│         │◇ M ◇│
   ▹▹▹│         │ ◇◇◇ │
  INPUT         └─────┘        `,
    conv: '+23', rev: '2.4', churn: '-18', convDir: '▲', revDir: '▲', churnDir: '▼'
  },
  {
    art: `
   ▹▸▸│         ┌─────┐
   ▸▹▸│  ▶▶▶    │ ●○● │   ▶▶▶
   ▹▸▹│         │○ M ○│
   ▸▹▸│         │ ●○● │
  INPUT         └─────┘        `,
    conv: '+25', rev: '2.5', churn: '-19', convDir: '▲', revDir: '▲', churnDir: '▼'
  },
  {
    art: `
   ▸▹▸│         ┌─────┐
   ▹▸▹│  >>>    │ ◆◇◆ │   >>>
   ▸▹▸│         │◇ M ◇│
   ▹▸▹│         │ ◆◇◆ │
  INPUT         └─────┘        `,
    conv: '+27', rev: '2.6', churn: '-21', convDir: '▲', revDir: '▲', churnDir: '▼'
  },
  {
    art: `
   ▹▹▸│         ┌─────┐
   ▸▸▹│  ⟹     │ ★☆★ │   ⟹
   ▹▹▸│         │☆ M ☆│
   ▸▸▹│         │ ★☆★ │
  INPUT         └─────┘        `,
    conv: '+29', rev: '2.7', churn: '-22', convDir: '▲', revDir: '▲', churnDir: '▼'
  },
];

// Panel configuration
const panels = [
  {
    id: 'decision',
    title: 'DECISION SYSTEMS',
    subtitle: 'intervention → propagation → impact',
    color: 'text-amber',
    frames: decisionFrames,
  },
  {
    id: 'enzyme',
    title: 'ENZYME ENGINEERING',
    subtitle: 'sequence → structure → function',
    color: 'text-accent',
    frames: enzymeFrames,
  },
  {
    id: 'regulatory',
    title: 'PROTEIN FITNESS LANDSCAPE',
    subtitle: 'sequence → embedding → function',
    color: 'text-cyan',
    frames: regulatoryFrames,
  },
];

// Fixed-width formatting utilities
const padNumber = (num, width) => String(num).padStart(width, ' ');
const padDecimal = (num, intWidth, decWidth) => {
  const [intPart, decPart = ''] = String(num).split('.');
  return intPart.padStart(intWidth, ' ') + '.' + decPart.padEnd(decWidth, '0');
};

// Individual panel component
function AsciiPanel({ panel, frameIndex }) {
  const frame = panel.frames[frameIndex % panel.frames.length];

  // Render metrics based on panel type with fixed-width formatting
  const renderMetrics = () => {
    if (panel.id === 'enzyme') {
      return (
        <div className="ascii-metrics">
          <div className="metric-row">
            <span className="metric-label">kcat:</span>
            <span className="metric-value metric-fixed">{padNumber(frame.metrics.kcat, 3)} s⁻¹</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">kcat/Km:</span>
            <span className="metric-value metric-fixed">{padDecimal(frame.metrics.efficiency, 1, 1)} × 10⁶ M⁻¹s⁻¹</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Tm:</span>
            <span className="metric-value metric-fixed">{padNumber(frame.metrics.tm, 2)}°C</span>
          </div>
        </div>
      );
    }

    if (panel.id === 'regulatory') {
      return (
        <div className="ascii-metrics">
          <div className="metric-row">
            <span className="metric-label">fitness:</span>
            <span className="metric-value metric-fixed">{padDecimal(frame.fitness, 1, 2)}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">uncertainty:</span>
            <span className="metric-value metric-fixed">±{padDecimal(frame.uncertainty, 1, 2)}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Δ vs WT:</span>
            <span className="metric-value metric-fixed">{frame.deltaWT}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">round:</span>
            <span className="metric-value metric-fixed">{frame.round}</span>
          </div>
        </div>
      );
    }

    if (panel.id === 'decision') {
      // Calculate bar widths based on frame values
      const convValue = parseInt(frame.conv.replace('+', ''));
      const churnValue = Math.abs(parseInt(frame.churn));

      return (
        <div className="ascii-metrics decision-metrics-enhanced">
          <div className="metric-row metric-bar-row">
            <span className="metric-label">CONVERSION:</span>
            <div className="metric-bar">
              <div
                className="metric-bar-fill positive"
                style={{ width: `${(convValue / 35) * 100}%` }}
              />
            </div>
            <span className="metric-value metric-fixed metric-up">{frame.conv.padStart(3, ' ')}% {frame.convDir}</span>
          </div>
          <div className="metric-row metric-bar-row">
            <span className="metric-label">REVENUE:</span>
            <div className="metric-bar">
              <div
                className="metric-bar-fill positive"
                style={{ width: `${(parseFloat(frame.rev) / 3.0) * 100}%` }}
              />
            </div>
            <span className="metric-value metric-fixed metric-up">${frame.rev}M {frame.revDir}</span>
          </div>
          <div className="metric-row metric-bar-row">
            <span className="metric-label">CHURN:</span>
            <div className="metric-bar">
              <div
                className="metric-bar-fill negative"
                style={{ width: `${(churnValue / 30) * 100}%` }}
              />
            </div>
            <span className="metric-value metric-fixed metric-down">{frame.churn.padStart(3, ' ')}% {frame.churnDir}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  // For enzyme panel, use 3D molecular viewer instead of ASCII art
  // For regulatory panel, use 3D Waddington epigenetic landscape
  // For decision panel, use causal network visualization
  const renderVisualization = () => {
    if (panel.id === 'enzyme') {
      return (
        <div className="enzyme-3d-container">
          <MolecularViewer
            allostericPulse={frame.allosteric || [false, false]}
            frameIndex={frameIndex}
          />
        </div>
      );
    }
    if (panel.id === 'regulatory') {
      return (
        <div className="waddington-3d-container">
          <WaddingtonLandscape frameIndex={frameIndex} />
        </div>
      );
    }
    if (panel.id === 'decision') {
      return (
        <div className="causal-network-wrapper">
          <CausalNetworkVisualization frameIndex={frameIndex} />
        </div>
      );
    }
    return (
      <pre className="ascii-panel-art" aria-hidden="true">
        {frame.art}
      </pre>
    );
  };

  return (
    <div className={`ascii-panel ${panel.color}`}>
      <div className="ascii-panel-header">
        <span className="ascii-panel-title">{panel.title}</span>
        <span className="ascii-panel-subtitle">{panel.subtitle}</span>
      </div>
      {renderVisualization()}
      {renderMetrics()}
    </div>
  );
}

export default function AsciiHeroAnimation() {
  const [frameIndex, setFrameIndex] = useState(0);

  // Animation loop for all panels simultaneously
  // Extended to 20 frames with slower timing for contemplative pace
  // Total cycle: ~30 seconds (was ~8.4 seconds)
  // Enzyme (6 frames) and Decision (4 frames) panels cycle within this
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 20);
    }, 1500); // 1500ms per frame for meditative, contemplative pace

    return () => clearInterval(frameInterval);
  }, []);

  return (
    <div className="ascii-hero-wrapper">
      <div className="ascii-hero-header">
        <span className="ascii-hero-tagline">
          AI AND ML APPLICATIONS IN COMPLEX SYSTEMS — FINDING THE LEVERS THAT CHANGE OUTCOMES
        </span>
      </div>
      <div className="ascii-panels-grid">
        {panels.map((panel) => (
          <AsciiPanel
            key={panel.id}
            panel={panel}
            frameIndex={frameIndex}
          />
        ))}
      </div>
    </div>
  );
}
