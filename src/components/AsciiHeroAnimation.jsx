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
// PANEL 2: REGULATORY CIRCUITS - Network logic controls cellular outcomes
// ============================================================================
const regulatoryFrames = [
  {
    art: `
       ┌───┐  ──▶  ┌───┐
       │ A │━━━━━▶│ B │
       └───┘       └───┘
         │    ╭────╮ ↑
         ▼    │ FB │─┘
       ┌───┐  ╰────╯
       │ C │──┤├──○
       └───┘  REPR`,
    growth: '67', stress: 'ACTIVE', bars: '████░░'
  },
  {
    art: `
       ┌───┐  ══▶  ┌───┐
       │ A │══════▶│ B │
       └───┘       └───┘
         ║    ╭────╮ ║
         ▼    │ FB │─╯
       ┌───┐  ╰────╯
       │ C │──┤├──●
       └───┘  REPR`,
    growth: '71', stress: 'ACTIVE', bars: '█████░'
  },
  {
    art: `
       ┌───┐  ──▶  ┌───┐
       │ A │━━━━━▶│ B │
       └───┘       └───┘
         │    ╭────╮ │
         ▼    │ FB │◀┘
       ┌───┐  ╰────╯
       │ C │──┤├──○
       └───┘  REPR`,
    growth: '64', stress: 'MODERATE', bars: '████░░'
  },
  {
    art: `
       ┌───┐  ━━▶  ┌───┐
       │ A │──────▶│ B │
       └───┘       └───┘
         │    ╭────╮ ↑
         ▼    │ FB │─┤
       ┌───┐  ╰────╯
       │ C │──┤├──●
       └───┘  REPR`,
    growth: '69', stress: 'ACTIVE', bars: '████░░'
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
    subtitle: 'network → expression → phenotype',
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
      return (
        <div className="ascii-metrics">
          <div className="metric-row">
            <span className="metric-label">GROWTH:</span>
            <span className="metric-value">{frame.bars} {frame.growth}%</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">STRESS:</span>
            <span className="metric-value status-active">{frame.stress}</span>
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
  // Uses 6 frames for enzyme panel's fitness landscape story
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 6);
    }, 700); // Slightly slower for the narrative to read

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
