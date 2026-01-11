import { useState, useEffect } from 'react';

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
// PANEL 2: REGULATORY CIRCUITS - Bistable toggle switch controls cell fate
// ============================================================================
// Animation tells the story of a bistable genetic switch:
// - LEFT: Network state with TF1/TF2 mutual repression and expression bars
// - RIGHT: 2D phenotype space with VIABILITY (x) and PRODUCTIVITY (y) axes
// - Signal triggers transitions between stable states
// - Full cycle: 12 frames (~8-9 seconds at 700ms/frame)
//
// Biotech context: Classic tradeoff between cell health and production output
// - OPTIMAL attractor: high viability + high productivity (sweet spot)
// - SURVIVAL attractor: high viability but low productivity (lazy cells)
const regulatoryFrames = [
  // ========== OPTIMAL STATE (TF1 dominant, high productivity) ==========
  {
    // Frame 1: Stable optimal state - TF1 high, TF2 low
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│             │    │ P              │
│ ┌─ TF1 ─┐   │    │ ↑      ●       │
│ │███████│   │    │ │       ╲      │
│ └───┬───┘   │    │ │        ╲     │
│   ⊣─┼─⊣     │    │ │         ╲    │
│ ┌───┴───┐   │    │ │          ╲   │
│ │░░░░░░░│   │    │ │           ○  │
│ └─ TF2 ─┘   │    │ └────────────→ │
│  ↓     ↓    │    │            V   │
│prod  surv   │    └────────────────┘
└─────────────┘`,
    state: 'OPTIMAL', stability: 94, v: 0.87, p: 0.91
  },
  {
    // Frame 2: Optimal state with repression pulse from TF1
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│             │    │ P              │
│ ┌─ TF1 ─┐   │    │ ↑      ●       │
│ │███████│   │    │ │       ╲      │
│ └───┬───┘   │    │ │        ╲     │
│   ⊣─●─⊣     │    │ │         ╲    │
│ ┌───┴───┐   │    │ │          ╲   │
│ │░░░░░░░│   │    │ │           ○  │
│ └─ TF2 ─┘   │    │ └────────────→ │
│  ↓     ↓    │    │            V   │
│prod  surv   │    └────────────────┘
└─────────────┘`,
    state: 'OPTIMAL', stability: 92, v: 0.85, p: 0.89
  },
  {
    // Frame 3: Signal appears, about to trigger transition
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│   ⚡signal   │    │ P              │
│     ↓       │    │ ↑      ●       │
│ ┌─ TF1 ─┐   │    │ │       ╲      │
│ │██████░│   │    │ │        ╲     │
│ └───┬───┘   │    │ │         ╲    │
│   ⊣─┼─⊣     │    │ │          ╲   │
│ ┌───┴───┐   │    │ │           ○  │
│ │░░░░░░░│   │    │ └────────────→ │
│ └─ TF2 ─┘   │    │            V   │
│             │    └────────────────┘
└─────────────┘`,
    state: 'OPTIMAL', stability: 78, v: 0.79, p: 0.82
  },
  // ========== TRANSITION: OPTIMAL → SURVIVAL ==========
  {
    // Frame 4: Signal triggers, TF1 starts dropping
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│   ⚡⚡signal  │    │ P              │
│     ↓↓      │    │ ↑     ·        │
│ ┌─ TF1 ─┐   │    │ │    ·  ╲      │
│ │████░░░│   │    │ │   ●    ╲     │
│ └───┬───┘   │    │ │         ╲    │
│   ⊣─┼─⊣     │    │ │          ╲   │
│ ┌───┴───┐   │    │ │           ○  │
│ │██░░░░░│   │    │ └────────────→ │
│ └─ TF2 ─┘   │    │            V   │
│             │    └────────────────┘
└─────────────┘`,
    state: 'switching', stability: 34, v: 0.52, p: 0.48
  },
  {
    // Frame 5: Mid-transition, crossing the boundary
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│             │    │ P              │
│ ┌─ TF1 ─┐   │    │ ↑    ·         │
│ │██░░░░░│   │    │ │  ·    ╲      │
│ └───┬───┘   │    │ │ ●      ╲     │
│   ⊣─○─⊣     │    │ │         ╲    │
│ ┌───┴───┐   │    │ │          ╲   │
│ │████░░░│   │    │ │           ○  │
│ └─ TF2 ─┘   │    │ └────────────→ │
│  ↓     ↓    │    │            V   │
│prod  surv   │    └────────────────┘
└─────────────┘`,
    state: 'switching', stability: 12, v: 0.38, p: 0.31
  },
  {
    // Frame 6: Approaching survival state, TF2 rising
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│             │    │ P              │
│ ┌─ TF1 ─┐   │    │ ↑       ╲      │
│ │█░░░░░░│   │    │ │ ·      ╲     │
│ └───┬───┘   │    │ │·        ╲    │
│   ⊣─┼─⊣     │    │ │          ╲   │
│ ┌───┴───┐   │    │ │       ●   ○  │
│ │█████░░│   │    │ └────────────→ │
│ └─ TF2 ─┘   │    │            V   │
│  ↓     ↓    │    │                │
│prod  surv   │    └────────────────┘
└─────────────┘`,
    state: 'SURVIVAL', stability: 58, v: 0.78, p: 0.21
  },
  // ========== SURVIVAL STATE (TF2 dominant, low productivity) ==========
  {
    // Frame 7: Stable survival state - TF2 high, TF1 low
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│             │    │ P              │
│ ┌─ TF1 ─┐   │    │ ↑       ╲      │
│ │░░░░░░░│   │    │ │        ╲     │
│ └───┬───┘   │    │ │         ╲    │
│   ⊣─┼─⊣     │    │ │          ╲   │
│ ┌───┴───┐   │    │ │           ●  │
│ │███████│   │    │ └────────────→ │
│ └─ TF2 ─┘   │    │            V   │
│  ↓     ↓    │    │                │
│prod  surv   │    └────────────────┘
└─────────────┘`,
    state: 'SURVIVAL', stability: 89, v: 0.91, p: 0.11
  },
  {
    // Frame 8: Survival state with repression pulse from TF2
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│             │    │ P              │
│ ┌─ TF1 ─┐   │    │ ↑       ╲      │
│ │░░░░░░░│   │    │ │        ╲     │
│ └───┬───┘   │    │ │         ╲    │
│   ⊣─●─⊣     │    │ │          ╲   │
│ ┌───┴───┐   │    │ │           ●  │
│ │███████│   │    │ └────────────→ │
│ └─ TF2 ─┘   │    │            V   │
│  ↓     ↓    │    │                │
│prod  surv   │    └────────────────┘
└─────────────┘`,
    state: 'SURVIVAL', stability: 91, v: 0.88, p: 0.13
  },
  {
    // Frame 9: Signal appears again, about to flip back
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│   ⚡signal   │    │ P              │
│     ↓       │    │ ↑       ╲      │
│ ┌─ TF1 ─┐   │    │ │        ╲     │
│ │░░░░░░░│   │    │ │         ╲    │
│ └───┬───┘   │    │ │          ╲   │
│   ⊣─┼─⊣     │    │ │           ●  │
│ ┌───┴───┐   │    │ └────────────→ │
│ │██████░│   │    │            V   │
│ └─ TF2 ─┘   │    │                │
│             │    └────────────────┘
└─────────────┘`,
    state: 'SURVIVAL', stability: 76, v: 0.82, p: 0.19
  },
  // ========== TRANSITION: SURVIVAL → OPTIMAL ==========
  {
    // Frame 10: Signal triggers, TF2 starts dropping
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│   ⚡⚡signal  │    │ P              │
│     ↓↓      │    │ ↑       ╲      │
│ ┌─ TF1 ─┐   │    │ │   ·    ╲     │
│ │██░░░░░│   │    │ │  ●      ╲    │
│ └───┬───┘   │    │ │          ╲   │
│   ⊣─┼─⊣     │    │ │       ·   ○  │
│ ┌───┴───┐   │    │ └────────────→ │
│ │████░░░│   │    │            V   │
│ └─ TF2 ─┘   │    │                │
│             │    └────────────────┘
└─────────────┘`,
    state: 'switching', stability: 31, v: 0.52, p: 0.45
  },
  {
    // Frame 11: Crossing back toward optimal
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│             │    │ P              │
│ ┌─ TF1 ─┐   │    │ ↑    ·         │
│ │████░░░│   │    │ │   ●   ╲      │
│ └───┬───┘   │    │ │        ╲     │
│   ⊣─○─⊣     │    │ │     ·   ╲    │
│ ┌───┴───┐   │    │ │          ╲   │
│ │██░░░░░│   │    │ │           ○  │
│ └─ TF2 ─┘   │    │ └────────────→ │
│  ↓     ↓    │    │            V   │
│prod  surv   │    └────────────────┘
└─────────────┘`,
    state: 'switching', stability: 18, v: 0.41, p: 0.58
  },
  {
    // Frame 12: Approaching optimal state again
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌─────────────┐    ┌────────────────┐
│             │    │ P              │
│ ┌─ TF1 ─┐   │    │ ↑     ·        │
│ │█████░░│   │    │ │     ●  ╲     │
│ └───┬───┘   │    │ │   ·     ╲    │
│   ⊣─┼─⊣     │    │ │          ╲   │
│ ┌───┴───┐   │    │ │           ○  │
│ │█░░░░░░│   │    │ └────────────→ │
│ └─ TF2 ─┘   │    │            V   │
│  ↓     ↓    │    │                │
│prod  surv   │    └────────────────┘
└─────────────┘`,
    state: 'OPTIMAL', stability: 62, v: 0.74, p: 0.75
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
    id: 'enzyme',
    title: 'ENZYME ENGINEERING',
    subtitle: 'sequence → structure → function',
    color: 'text-accent',
    frames: enzymeFrames,
  },
  {
    id: 'regulatory',
    title: 'REGULATORY CIRCUITS',
    subtitle: 'network → dynamics → cell fate',
    color: 'text-cyan',
    frames: regulatoryFrames,
  },
  {
    id: 'decision',
    title: 'DECISION SYSTEMS',
    subtitle: 'signal → model → action → outcome',
    color: 'text-amber',
    frames: decisionFrames,
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
      const isTransition = frame.state === 'switching';
      const stateClass = isTransition ? 'status-transition' : (frame.state === 'SURVIVAL' ? 'status-stress' : 'status-growth');
      // Fixed-width state display: "OPTIMAL      " or "SURVIVAL     " or "switching... " (all 12 chars)
      const stateDisplay = isTransition ? 'switching...' : frame.state.padEnd(12, ' ');
      return (
        <div className="ascii-metrics">
          <div className="metric-row">
            <span className="metric-label">STATE:</span>
            <span className={`metric-value metric-fixed ${stateClass}`}>
              {stateDisplay}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">stability:</span>
            <span className="metric-value metric-fixed">{padNumber(frame.stability, 2)}%</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">position:</span>
            <span className="metric-value metric-fixed">V:{padDecimal(frame.v, 1, 2)} P:{padDecimal(frame.p, 1, 2)}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">titer:</span>
            <span className="metric-value metric-fixed">{padDecimal((frame.p * 3.2).toFixed(1), 1, 1)} g/L</span>
          </div>
        </div>
      );
    }

    if (panel.id === 'decision') {
      return (
        <div className="ascii-metrics">
          <div className="metric-row">
            <span className="metric-label">CONVERSION:</span>
            <span className="metric-value metric-fixed metric-up">{frame.conv.padStart(3, ' ')}% {frame.convDir}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">REVENUE:</span>
            <span className="metric-value metric-fixed metric-up">${frame.rev}M {frame.revDir}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">CHURN:</span>
            <span className="metric-value metric-fixed metric-down">{frame.churn.padStart(3, ' ')}% {frame.churnDir}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`ascii-panel ${panel.color}`}>
      <div className="ascii-panel-header">
        <span className="ascii-panel-title">{panel.title}</span>
        <span className="ascii-panel-subtitle">{panel.subtitle}</span>
      </div>
      <pre className="ascii-panel-art" aria-hidden="true">
        {frame.art}
      </pre>
      {renderMetrics()}
    </div>
  );
}

export default function AsciiHeroAnimation() {
  const [frameIndex, setFrameIndex] = useState(0);

  // Animation loop for all panels simultaneously
  // Uses 12 frames for regulatory panel's bistable switch cycle (~8.4s total)
  // Enzyme (6 frames) and Decision (4 frames) panels cycle within this
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 12);
    }, 700); // 700ms per frame for readable narrative

    return () => clearInterval(frameInterval);
  }, []);

  return (
    <div className="ascii-hero-wrapper">
      <div className="ascii-hero-header">
        <span className="ascii-hero-tagline">
          COMPLEX SYSTEMS — finding the levers that change outcomes
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
