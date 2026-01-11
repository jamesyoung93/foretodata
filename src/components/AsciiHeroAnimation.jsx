import { useState, useEffect } from 'react';

// ============================================================================
// PROTEIN HELIX ANIMATION - Rotating double helix structure
// ============================================================================
const proteinFrames = [
  `
      .  *  .      *  .
    .    ██══════██    .
   *   ██          ██   *
  .  ██    ○    ○    ██  .
    ██  ○        ○  ██
   ██ ○            ○ ██
  ██○                ○██
   ██ ○            ○ ██
    ██  ○        ○  ██
  .  ██    ○    ○    ██  .
   *   ██          ██   *
    .    ██══════██    .
      .  *  .      *  .
  `,
  `
      *  .  *  .      .
    .   ██═══════██   .
   .  ██    ○      ██  *
  *  ██  ○          ██  .
    ██ ○         ○  ██
   ██○          ○   ██
  ██          ○     ██
   ██○          ○   ██
    ██ ○         ○  ██
  *  ██  ○          ██  .
   .  ██    ○      ██  *
    .   ██═══════██   .
      *  .  *  .      .
  `,
  `
      .      *  .  *  .
    .  ██═══════██    .
   *  ██      ○    ██  .
  .  ██          ○  ██  *
    ██  ○         ○ ██
   ██   ○          ○██
  ██     ○          ██
   ██   ○          ○██
    ██  ○         ○ ██
  .  ██          ○  ██  *
   *  ██      ○    ██  .
    .  ██═══════██    .
      .      *  .  *  .
  `,
  `
      .  .      *  .  *
    .    ██═══════██   .
   .  ██    ○      ██  *
  *  ██        ○    ██  .
    ██ ○         ○  ██
   ██  ○         ○  ██
  ██    ○       ○   ██
   ██  ○         ○  ██
    ██ ○         ○  ██
  *  ██        ○    ██  .
   .  ██    ○      ██  *
    .    ██═══════██   .
      .  .      *  .  *
  `,
];

// ============================================================================
// NEURAL NETWORK ANIMATION - Pulsing connections between nodes
// ============================================================================
const networkFrames = [
  `
     [DNA]━━━━●━━━━[RNA]
       ┃     ┃     ┃
       ┃   ╔═╧═╗   ┃
       ●━━║ ◉ ║━━●
       ┃   ╚═╤═╝   ┃
     ╭─┴─╮   ┃   ╭─┴─╮
     │ ◎ │━━━●━━━│ ◎ │
     ╰─┬─╯       ╰─┬─╯
       ┗━━━━●━━━━━┛
         PROTEIN
  `,
  `
     [DNA]━━━━○━━━━[RNA]
       ║     ║     ║
       ║   ╔═╧═╗   ║
       ○━━║ ◎ ║━━○
       ║   ╚═╤═╝   ║
     ╭─┴─╮   ║   ╭─┴─╮
     │ ● │━━━○━━━│ ● │
     ╰─┬─╯       ╰─┬─╯
       ┗━━━━○━━━━━┛
         PROTEIN
  `,
  `
     [DNA]════●════[RNA]
       ┃     ┃     ┃
       ┃   ╔═╧═╗   ┃
       ●══║ ● ║══●
       ┃   ╚═╤═╝   ┃
     ╭─┴─╮   ┃   ╭─┴─╮
     │ ◉ │═══●═══│ ◉ │
     ╰─┬─╯       ╰─┬─╯
       ┗════●═════┛
         PROTEIN
  `,
  `
     [DNA]────◉────[RNA]
       │     │     │
       │   ╔═╧═╗   │
       ◉──║ ○ ║──◉
       │   ╚═╤═╝   │
     ╭─┴─╮   │   ╭─┴─╮
     │ ○ │───◉───│ ○ │
     ╰─┬─╯       ╰─┬─╯
       └────◉─────┘
         PROTEIN
  `,
];

// ============================================================================
// ML/ROI ANIMATION - Data flowing through ML to produce ROI
// ============================================================================
const mlRoiFrames = [
  `
  ┌─────────┐      ╔═══════╗      ┌─────────┐
  │ █ █ █ █ │  ──▶ ║  ◇◇◇  ║  ──▶ │    ╱──  │
  │ █ █ █ █ │      ║ ◇◇◇◇◇ ║      │   ╱     │
  │ █ █ █ █ │      ║  ◇◇◇  ║      │  ╱      │
  └─────────┘      ╚═══════╝      └─────────┘
     DATA             ML            GROWTH

       ┌──────────────────────────────┐
       │  $$$  REVENUE  ▲▲▲  +23%    │
       └──────────────────────────────┘
  `,
  `
  ┌─────────┐      ╔═══════╗      ┌─────────┐
  │ ▪ █ █ █ │  ▶▶▶ ║  ●○●  ║  ▶▶▶ │     ╱─  │
  │ █ ▪ █ █ │      ║ ○●○●○ ║      │    ╱    │
  │ █ █ ▪ █ │      ║  ●○●  ║      │  ─╱     │
  └─────────┘      ╚═══════╝      └─────────┘
     DATA             ML            GROWTH

       ┌──────────────────────────────┐
       │  $$$  REVENUE  ▲▲▲  +47%    │
       └──────────────────────────────┘
  `,
  `
  ┌─────────┐      ╔═══════╗      ┌─────────┐
  │ ▫ ▪ █ █ │  >>>║  ◆◇◆  ║>>>   │      ╱  │
  │ █ ▫ ▪ █ │      ║ ◇◆◇◆◇ ║      │     ╱   │
  │ █ █ ▫ ▪ │      ║  ◆◇◆  ║      │   ╱╱    │
  └─────────┘      ╚═══════╝      └─────────┘
     DATA             ML            GROWTH

       ┌──────────────────────────────┐
       │  $$$  REVENUE  ▲▲▲  +89%    │
       └──────────────────────────────┘
  `,
  `
  ┌─────────┐      ╔═══════╗      ┌─────────┐
  │ · ▫ ▪ █ │  ⟹  ║  ★☆★  ║  ⟹  │       ╱ │
  │ █ · ▫ ▪ │      ║ ☆★☆★☆ ║      │     ╱╱  │
  │ ▪ █ · ▫ │      ║  ★☆★  ║      │   ╱╱    │
  └─────────┘      ╚═══════╝      └─────────┘
     DATA             ML            GROWTH

       ┌──────────────────────────────┐
       │  $$$  REVENUE  ▲▲▲  +156%   │
       └──────────────────────────────┘
  `,
];

// Animation titles/labels
const titles = [
  { main: 'MOLECULAR DYNAMICS', sub: 'protein folding simulation' },
  { main: 'GENE REGULATORY NETWORK', sub: 'pathway analysis' },
  { main: 'ML PIPELINE', sub: 'data → intelligence → results' },
];

export default function AsciiHeroAnimation() {
  const [currentScene, setCurrentScene] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scenes = [proteinFrames, networkFrames, mlRoiFrames];

  // Animation loop for frames within a scene
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % scenes[currentScene].length);
    }, 400); // Frame rate for animation

    return () => clearInterval(frameInterval);
  }, [currentScene]);

  // Scene transition loop
  useEffect(() => {
    const sceneInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScene((prev) => (prev + 1) % scenes.length);
        setFrameIndex(0);
        setIsTransitioning(false);
      }, 300); // Transition duration
    }, 6000); // Time per scene

    return () => clearInterval(sceneInterval);
  }, []);

  const currentFrame = scenes[currentScene][frameIndex];
  const currentTitle = titles[currentScene];

  // Color classes based on scene
  const sceneColors = ['text-accent', 'text-cyan', 'text-amber'];
  const colorClass = sceneColors[currentScene];

  return (
    <div className="ascii-hero-container">
      <div className={`ascii-hero-label ${colorClass}`}>
        <span className="ascii-hero-main">{currentTitle.main}</span>
        <span className="ascii-hero-sub">{currentTitle.sub}</span>
      </div>
      <pre
        className={`ascii-hero ${colorClass} ${isTransitioning ? 'transitioning' : ''}`}
        aria-hidden="true"
      >
        {currentFrame}
      </pre>
      <div className="ascii-scene-indicators">
        {scenes.map((_, idx) => (
          <span
            key={idx}
            className={`scene-dot ${idx === currentScene ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
