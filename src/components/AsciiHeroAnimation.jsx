import { useState, useEffect } from 'react';

// ============================================================================
// PANEL 1: ENZYME ENGINEERING - Navigating sequence space to optimize function
// ============================================================================
// Animation tells the story of exploring a fitness landscape:
// - Tracer moves across rugged landscape (sequence space)
// - Allosteric sites pulse when big changes happen
// - Metrics improve as tracer climbs toward global optimum
const enzymeFrames = [
  {
    // Frame 1: Starting position - tracer in low valley
    art: `
 ACTIVE SITE          FITNESS LANDSCAPE
 ┌──────────────┐    ┌──────────────────┐
 │    ○───○     │    │        ∧         │
 │   ╱  ▼  ╲    │    │  ∧    ╱ ╲   ∧∧   │
 │  ●   ◇   ●   │    │ ╱ ╲  ╱   ╲_╱╲ ╲  │
 │   ╲     ╱    │    │╱   ╲╱•        ╲╱ │
 │    ●───●     │    │  sequence space  │
 │ ○         ○  │    └──────────────────┘
 │allo     allo│
 └──────────────┘`,
    metrics: { kcat: '142', efficiency: '1.2', tm: '68' },
    allosteric: [false, false]
  },
  {
    // Frame 2: Climbing local peak - first allosteric pulses
    art: `
 ACTIVE SITE          FITNESS LANDSCAPE
 ┌──────────────┐    ┌──────────────────┐
 │    ○───○     │    │        ∧         │
 │   ╱  ▼  ╲    │    │  ∧    ╱ ╲   ∧∧   │
 │  ●   ◆   ●   │    │ ╱•╲  ╱   ╲_╱╲ ╲  │
 │   ╲     ╱    │    │╱   ╲╱         ╲╱ │
 │    ●───●     │    │  sequence space  │
 │ ◉         ○  │    └──────────────────┘
 │allo     allo│
 └──────────────┘`,
    metrics: { kcat: '148', efficiency: '1.3', tm: '70' },
    allosteric: [true, false]
  },
  {
    // Frame 3: At local peak - good but not optimal
    art: `
 ACTIVE SITE          FITNESS LANDSCAPE
 ┌──────────────┐    ┌──────────────────┐
 │    ●───●     │    │        ∧         │
 │   ╱  ▼  ╲    │    │  •    ╱ ╲   ∧∧   │
 │  ●   ◆   ●   │    │ ╱ ╲  ╱   ╲_╱╲ ╲  │
 │   ╲     ╱    │    │╱   ╲╱         ╲╱ │
 │    ●───●     │    │  sequence space  │
 │ ◉         ◉  │    └──────────────────┘
 │allo     allo│
 └──────────────┘`,
    metrics: { kcat: '151', efficiency: '1.4', tm: '71' },
    allosteric: [true, true]
  },
  {
    // Frame 4: Dropping into valley - exploring further
    art: `
 ACTIVE SITE          FITNESS LANDSCAPE
 ┌──────────────┐    ┌──────────────────┐
 │    ○───○     │    │        ∧         │
 │   ╱  ▽  ╲    │    │  ∧    ╱ ╲   ∧∧   │
 │  ○   ◇   ○   │    │ ╱ ╲  ╱•  ╲_╱╲ ╲  │
 │   ╲     ╱    │    │╱   ╲╱         ╲╱ │
 │    ○───○     │    │  sequence space  │
 │ ○         ○  │    └──────────────────┘
 │allo     allo│
 └──────────────┘`,
    metrics: { kcat: '144', efficiency: '1.2', tm: '69' },
    allosteric: [false, false]
  },
  {
    // Frame 5: Climbing toward global maximum
    art: `
 ACTIVE SITE          FITNESS LANDSCAPE
 ┌──────────────┐    ┌──────────────────┐
 │    ●───●     │    │        ∧         │
 │   ╱  ▼  ╲    │    │  ∧    ╱•╲   ∧∧   │
 │  ●   ◆   ●   │    │ ╱ ╲  ╱   ╲_╱╲ ╲  │
 │   ╲     ╱    │    │╱   ╲╱         ╲╱ │
 │    ●───●     │    │  sequence space  │
 │ ◉         ○  │    └──────────────────┘
 │allo     allo│
 └──────────────┘`,
    metrics: { kcat: '155', efficiency: '1.5', tm: '72' },
    allosteric: [true, false]
  },
  {
    // Frame 6: Near global optimum - best metrics
    art: `
 ACTIVE SITE          FITNESS LANDSCAPE
 ┌──────────────┐    ┌──────────────────┐
 │    ●═══●     │    │        •         │
 │   ╱  ▼  ╲    │    │  ∧    ╱ ╲   ∧∧   │
 │  ●   ★   ●   │    │ ╱ ╲  ╱   ╲_╱╲ ╲  │
 │   ╲     ╱    │    │╱   ╲╱         ╲╱ │
 │    ●═══●     │    │  sequence space  │
 │ ◉         ◉  │    └──────────────────┘
 │allo     allo│
 └──────────────┘`,
    metrics: { kcat: '162', efficiency: '1.6', tm: '74' },
    allosteric: [true, true]
  },
];

// ============================================================================
// PANEL 2: REGULATORY CIRCUITS - Bistable toggle switch controls cell fate
// ============================================================================
// Animation tells the story of a bistable genetic switch:
// - LEFT: Network state with TF1/TF2 mutual repression and expression bars
// - RIGHT: 2D phenotype space showing cell fate as continuous position
// - Signal triggers transitions between stable states
// - Full cycle: 12 frames (~8-9 seconds at 700ms/frame)
const regulatoryFrames = [
  // ========== GROWTH STATE (TF1 dominant) ==========
  {
    // Frame 1: Stable growth state - TF1 high, TF2 low
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│              │   │ S              │
│  ┌─ TF1 ─┐   │   │ ↑  ○           │
│  │███████│   │   │ │    ╲         │
│  └───┬───┘   │   │ │     ╲        │
│    ⊣─┼─⊣     │   │ │      ╲       │
│  ┌───┴───┐   │   │ │       ●      │
│  │░░░░░░░│   │   │ │        ╲  ○  │
│  └─ TF2 ─┘   │   │ └─────────────→│
│   ↓     ↓    │   │            G   │
│ growth stress│   └────────────────┘
└──────────────┘`,
    state: 'GROWTH', stability: 94, g: 0.87, s: 0.12
  },
  {
    // Frame 2: Growth state with repression pulse from TF1
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│              │   │ S              │
│  ┌─ TF1 ─┐   │   │ ↑  ○           │
│  │███████│   │   │ │    ╲         │
│  └───┬───┘   │   │ │     ╲        │
│    ⊣─●─⊣     │   │ │      ╲       │
│  ┌───┴───┐   │   │ │       ●      │
│  │░░░░░░░│   │   │ │        ╲  ○  │
│  └─ TF2 ─┘   │   │ └─────────────→│
│   ↓     ↓    │   │            G   │
│ growth stress│   └────────────────┘
└──────────────┘`,
    state: 'GROWTH', stability: 92, g: 0.85, s: 0.14
  },
  {
    // Frame 3: Signal appears, about to trigger transition
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│    ⚡signal   │   │ S              │
│      ↓       │   │ ↑  ○           │
│  ┌─ TF1 ─┐   │   │ │    ╲         │
│  │██████░│   │   │ │     ╲        │
│  └───┬───┘   │   │ │      ╲       │
│    ⊣─┼─⊣     │   │ │       ●      │
│  ┌───┴───┐   │   │ │        ╲  ○  │
│  │░░░░░░░│   │   │ └─────────────→│
│  └─ TF2 ─┘   │   │            G   │
│   ↓     ↓    │   │                │
└──────────────┘   └────────────────┘`,
    state: 'GROWTH', stability: 78, g: 0.79, s: 0.18
  },
  // ========== TRANSITION: GROWTH → STRESS ==========
  {
    // Frame 4: Signal triggers, TF1 starts dropping
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│    ⚡⚡signal  │   │ S              │
│      ↓↓      │   │ ↑  ○           │
│  ┌─ TF1 ─┐   │   │ │    ╲   ·     │
│  │████░░░│   │   │ │     ╲ ·      │
│  └───┬───┘   │   │ │      ●       │
│    ⊣─┼─⊣     │   │ │       ╲      │
│  ┌───┴───┐   │   │ │        ╲  ○  │
│  │██░░░░░│   │   │ └─────────────→│
│  └─ TF2 ─┘   │   │            G   │
│   ↓     ↓    │   │                │
└──────────────┘   └────────────────┘`,
    state: 'transition', stability: 34, g: 0.52, s: 0.48
  },
  {
    // Frame 5: Mid-transition, crossing the boundary
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│              │   │ S              │
│  ┌─ TF1 ─┐   │   │ ↑  ○     ·     │
│  │██░░░░░│   │   │ │    ╲  ·      │
│  └───┬───┘   │   │ │     ●        │
│    ⊣─○─⊣     │   │ │      ╲       │
│  ┌───┴───┐   │   │ │       ╲      │
│  │████░░░│   │   │ │        ╲  ○  │
│  └─ TF2 ─┘   │   │ └─────────────→│
│   ↓     ↓    │   │            G   │
│ growth stress│   └────────────────┘
└──────────────┘`,
    state: 'transition', stability: 12, g: 0.38, s: 0.61
  },
  {
    // Frame 6: Approaching stress state, TF2 rising
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│              │   │ S              │
│  ┌─ TF1 ─┐   │   │ ↑  ○   ·       │
│  │█░░░░░░│   │   │ │    ● ·       │
│  └───┬───┘   │   │ │     ╲        │
│    ⊣─┼─⊣     │   │ │      ╲       │
│  ┌───┴───┐   │   │ │       ╲      │
│  │█████░░│   │   │ │        ╲  ○  │
│  └─ TF2 ─┘   │   │ └─────────────→│
│   ↓     ↓    │   │            G   │
│ growth stress│   └────────────────┘
└──────────────┘`,
    state: 'STRESS', stability: 58, g: 0.21, s: 0.78
  },
  // ========== STRESS STATE (TF2 dominant) ==========
  {
    // Frame 7: Stable stress state - TF2 high, TF1 low
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│              │   │ S              │
│  ┌─ TF1 ─┐   │   │ ↑  ●           │
│  │░░░░░░░│   │   │ │    ╲ ·       │
│  └───┬───┘   │   │ │     ╲        │
│    ⊣─┼─⊣     │   │ │      ╲       │
│  ┌───┴───┐   │   │ │       ╲      │
│  │███████│   │   │ │        ╲  ○  │
│  └─ TF2 ─┘   │   │ └─────────────→│
│   ↓     ↓    │   │            G   │
│ growth stress│   └────────────────┘
└──────────────┘`,
    state: 'STRESS', stability: 89, g: 0.11, s: 0.91
  },
  {
    // Frame 8: Stress state with repression pulse from TF2
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│              │   │ S              │
│  ┌─ TF1 ─┐   │   │ ↑  ●           │
│  │░░░░░░░│   │   │ │    ╲         │
│  └───┬───┘   │   │ │     ╲        │
│    ⊣─●─⊣     │   │ │      ╲       │
│  ┌───┴───┐   │   │ │       ╲      │
│  │███████│   │   │ │        ╲  ○  │
│  └─ TF2 ─┘   │   │ └─────────────→│
│   ↓     ↓    │   │            G   │
│ growth stress│   └────────────────┘
└──────────────┘`,
    state: 'STRESS', stability: 91, g: 0.13, s: 0.88
  },
  {
    // Frame 9: Signal appears again, about to flip back
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│    ⚡signal   │   │ S              │
│      ↓       │   │ ↑  ●           │
│  ┌─ TF1 ─┐   │   │ │    ╲         │
│  │░░░░░░░│   │   │ │     ╲        │
│  └───┬───┘   │   │ │      ╲       │
│    ⊣─┼─⊣     │   │ │       ╲      │
│  ┌───┴───┐   │   │ │        ╲  ○  │
│  │██████░│   │   │ └─────────────→│
│  └─ TF2 ─┘   │   │            G   │
│   ↓     ↓    │   │                │
└──────────────┘   └────────────────┘`,
    state: 'STRESS', stability: 76, g: 0.19, s: 0.82
  },
  // ========== TRANSITION: STRESS → GROWTH ==========
  {
    // Frame 10: Signal triggers, TF2 starts dropping
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│    ⚡⚡signal  │   │ S              │
│      ↓↓      │   │ ↑  ○  ·        │
│  ┌─ TF1 ─┐   │   │ │    ●         │
│  │██░░░░░│   │   │ │     ╲        │
│  └───┬───┘   │   │ │      ╲       │
│    ⊣─┼─⊣     │   │ │       ╲      │
│  ┌───┴───┐   │   │ │        ╲  ○  │
│  │████░░░│   │   │ └─────────────→│
│  └─ TF2 ─┘   │   │            G   │
│   ↓     ↓    │   │                │
└──────────────┘   └────────────────┘`,
    state: 'transition', stability: 31, g: 0.45, s: 0.52
  },
  {
    // Frame 11: Crossing back toward growth
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│              │   │ S              │
│  ┌─ TF1 ─┐   │   │ ↑  ○           │
│  │████░░░│   │   │ │    ╲  ·      │
│  └───┬───┘   │   │ │     ╲ ·      │
│    ⊣─○─⊣     │   │ │      ●       │
│  ┌───┴───┐   │   │ │       ╲      │
│  │██░░░░░│   │   │ │        ╲  ○  │
│  └─ TF2 ─┘   │   │ └─────────────→│
│   ↓     ↓    │   │            G   │
│ growth stress│   └────────────────┘
└──────────────┘`,
    state: 'transition', stability: 18, g: 0.58, s: 0.41
  },
  {
    // Frame 12: Approaching growth state again
    art: `
 NETWORK STATE       PHENOTYPE SPACE
┌──────────────┐   ┌────────────────┐
│              │   │ S              │
│  ┌─ TF1 ─┐   │   │ ↑  ○           │
│  │█████░░│   │   │ │    ╲         │
│  └───┬───┘   │   │ │     ╲  ·     │
│    ⊣─┼─⊣     │   │ │      ╲ ·     │
│  ┌───┴───┐   │   │ │       ●      │
│  │█░░░░░░│   │   │ │        ╲  ○  │
│  └─ TF2 ─┘   │   │ └─────────────→│
│   ↓     ↓    │   │            G   │
│ growth stress│   └────────────────┘
└──────────────┘`,
    state: 'GROWTH', stability: 62, g: 0.74, s: 0.25
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
  INPUT         └─────┘`,
    conv: '+23%', rev: '$2.4M', churn: '-18%', convDir: '▲', revDir: '▲', churnDir: '▼'
  },
  {
    art: `
   ▹▸▸│         ┌─────┐
   ▸▹▸│  ▶▶▶    │ ●○● │   ▶▶▶
   ▹▸▹│         │○ M ○│
   ▸▹▸│         │ ●○● │
  INPUT         └─────┘`,
    conv: '+25%', rev: '$2.5M', churn: '-19%', convDir: '▲', revDir: '▲', churnDir: '▼'
  },
  {
    art: `
   ▸▹▸│         ┌─────┐
   ▹▸▹│  >>>    │ ◆◇◆ │   >>>
   ▸▹▸│         │◇ M ◇│
   ▹▸▹│         │ ◆◇◆ │
  INPUT         └─────┘`,
    conv: '+27%', rev: '$2.6M', churn: '-21%', convDir: '▲', revDir: '▲', churnDir: '▼'
  },
  {
    art: `
   ▹▹▸│         ┌─────┐
   ▸▸▹│  ⟹     │ ★☆★ │   ⟹
   ▹▹▸│         │☆ M ☆│
   ▸▸▹│         │ ★☆★ │
  INPUT         └─────┘`,
    conv: '+29%', rev: '$2.7M', churn: '-22%', convDir: '▲', revDir: '▲', churnDir: '▼'
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

// Individual panel component
function AsciiPanel({ panel, frameIndex }) {
  const frame = panel.frames[frameIndex % panel.frames.length];

  // Render metrics based on panel type
  const renderMetrics = () => {
    if (panel.id === 'enzyme') {
      return (
        <div className="ascii-metrics">
          <div className="metric-row">
            <span className="metric-label">kcat:</span>
            <span className="metric-value">{frame.metrics.kcat} s⁻¹</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">kcat/Km:</span>
            <span className="metric-value">{frame.metrics.efficiency} × 10⁶ M⁻¹s⁻¹</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Tm:</span>
            <span className="metric-value">{frame.metrics.tm}°C</span>
          </div>
        </div>
      );
    }

    if (panel.id === 'regulatory') {
      const isTransition = frame.state === 'transition';
      const stateClass = isTransition ? 'status-transition' : (frame.state === 'STRESS' ? 'status-stress' : 'status-growth');
      return (
        <div className="ascii-metrics">
          <div className="metric-row">
            <span className="metric-label">STATE:</span>
            <span className={`metric-value ${stateClass}`}>
              {isTransition ? '◇ switching...' : frame.state}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">stability:</span>
            <span className="metric-value">{frame.stability}%</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">position:</span>
            <span className="metric-value">G:{frame.g.toFixed(2)} S:{frame.s.toFixed(2)}</span>
          </div>
        </div>
      );
    }

    if (panel.id === 'decision') {
      return (
        <div className="ascii-metrics">
          <div className="metric-row">
            <span className="metric-label">CONVERSION:</span>
            <span className="metric-value metric-up">{frame.conv} {frame.convDir}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">REVENUE:</span>
            <span className="metric-value metric-up">{frame.rev} {frame.revDir}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">CHURN:</span>
            <span className="metric-value metric-down">{frame.churn} {frame.churnDir}</span>
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
