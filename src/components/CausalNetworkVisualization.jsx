import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// CAUSAL NETWORK VISUALIZATION
// ============================================================================
// Dynamic visualization showing causal relationships between business levers
// and outcomes. Features:
// - SVG-based network structure with nodes and edges
// - Animated pulse propagation showing influence flow
// - Intervention notation (do() operator)
// - Particle effects for continuous flow visualization
// - Responsive design with terminal aesthetic

// Network node definitions - positions adjusted for larger nodes and feedback loops
const nodes = {
  // External factors (top tier - uncontrollable)
  MARKET: { id: 'MARKET', label: 'MARKET', tier: 0, x: 260, y: 18, controllable: false },

  // Levers (middle tier - controllable)
  PRICE: { id: 'PRICE', label: 'PRICE', tier: 1, x: 45, y: 60, controllable: true },
  PROMO: { id: 'PROMO', label: 'PROMO', tier: 1, x: 120, y: 60, controllable: true },
  CHANNEL: { id: 'CHANNEL', label: 'CHANNEL', tier: 1, x: 195, y: 60, controllable: true },
  OPS: { id: 'OPS', label: 'OPS', tier: 1, x: 270, y: 60, controllable: true },

  // Outcomes (bottom tier) - spread out more for feedback loop clarity
  DEMAND: { id: 'DEMAND', label: 'DEMAND', tier: 2, x: 85, y: 115, controllable: false },
  CONVERSION: { id: 'CONVERSION', label: 'CONV', tier: 2, x: 180, y: 115, controllable: false },
  REVENUE: { id: 'REVENUE', label: 'REVENUE', tier: 2, x: 280, y: 115, controllable: false },

  // Hidden node for feedback tracking (CHURN affects demand through reputation)
  CHURN: { id: 'CHURN', label: 'CHURN', tier: 2, x: 330, y: 75, controllable: false, hidden: true },
};

// Edge definitions with causal coefficients
const edges = [
  // Levers → Demand
  { from: 'PRICE', to: 'DEMAND', beta: -0.41, label: 'β=-0.41' },
  { from: 'PROMO', to: 'DEMAND', beta: 0.33, label: 'β=+0.33' },
  { from: 'CHANNEL', to: 'DEMAND', beta: 0.27, label: 'β=+0.27' },
  { from: 'MARKET', to: 'DEMAND', beta: 0.52, label: 'β=+0.52' },

  // Levers → Conversion
  { from: 'OPS', to: 'CONVERSION', beta: 0.19, label: 'β=+0.19' },
  { from: 'CHANNEL', to: 'CONVERSION', beta: 0.22, label: 'β=+0.22' },

  // Demand → Conversion → Revenue chain
  { from: 'DEMAND', to: 'CONVERSION', beta: 0.45, label: 'β=+0.45' },
  { from: 'CONVERSION', to: 'REVENUE', beta: 0.89, label: 'β=+0.89' },

  // FEEDBACK LOOPS - showing circularity in the system
  // Revenue feeds back to Promo (profits fund marketing spend)
  { from: 'REVENUE', to: 'PROMO', beta: 0.25, label: 'reinvest', feedback: true },
  // Conversion affects Demand through reputation/churn effects
  { from: 'CONVERSION', to: 'DEMAND', beta: 0.18, label: 'reputation', feedback: true },
];

// Intervention cycle - which levers activate in sequence
const interventionCycle = ['PRICE', 'PROMO', 'CHANNEL', 'OPS'];

// Calculate edge path with curve - handles feedback loops with arced paths
function getEdgePath(from, to, isFeedback = false) {
  const fromNode = nodes[from];
  const toNode = nodes[to];

  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;

  if (isFeedback) {
    // Feedback loops use pronounced arcs that go around the outside
    // REVENUE → PROMO: arc above the network
    if (from === 'REVENUE' && to === 'PROMO') {
      // Large arc going above, from right to left
      const arcHeight = -60; // Above the nodes
      const midX = (fromNode.x + toNode.x) / 2;
      return `M ${fromNode.x} ${fromNode.y - 10} Q ${midX} ${arcHeight} ${toNode.x} ${toNode.y + 10}`;
    }
    // CONVERSION → DEMAND: arc below the network
    if (from === 'CONVERSION' && to === 'DEMAND') {
      // Arc going below and to the left
      const arcDepth = 155; // Below the nodes
      const midX = (fromNode.x + toNode.x) / 2;
      return `M ${fromNode.x} ${fromNode.y + 10} Q ${midX} ${arcDepth} ${toNode.x} ${toNode.y + 10}`;
    }
  }

  // Regular edges: simple curved path
  const midX = fromNode.x + dx * 0.5;
  const midY = fromNode.y + dy * 0.5;
  const curveOffset = Math.abs(dx) * 0.12;

  return `M ${fromNode.x} ${fromNode.y + 10} Q ${midX} ${midY + curveOffset} ${toNode.x} ${toNode.y - 10}`;
}

// Get downstream nodes for cascade animation - slowed down for contemplative pace
function getDownstreamPath(startNode) {
  const visited = new Set();
  const path = [];

  function traverse(nodeId, delay) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    path.push({ nodeId, delay });

    edges.forEach(edge => {
      if (edge.from === nodeId && !edge.feedback) {
        // 1200ms between node activations (was 400ms) - slow enough to track
        traverse(edge.to, delay + 1200);
      }
    });
  }

  traverse(startNode, 0);
  return path;
}

// Particle class for canvas animation - slower, more trackable particles
class Particle {
  constructor(edge, progress = 0) {
    this.edge = edge;
    this.progress = progress;
    // Slowed down: 30-40% of original speed for trackable movement
    this.speed = 0.003 + Math.random() * 0.002;
    this.size = 2.5 + Math.random() * 2; // Slightly larger
    this.alpha = 0.7 + Math.random() * 0.3;
    this.isFeedback = edge.feedback || false;
  }

  update() {
    this.progress += this.speed;
    return this.progress < 1;
  }

  getPosition() {
    const from = nodes[this.edge.from];
    const to = nodes[this.edge.to];
    const t = this.progress;

    // Handle feedback loop paths differently
    if (this.isFeedback) {
      if (this.edge.from === 'REVENUE' && this.edge.to === 'PROMO') {
        // Arc above the network
        const arcHeight = -60;
        const midX = (from.x + to.x) / 2;
        const startY = from.y - 10;
        const endY = to.y + 10;
        // Quadratic bezier for arc
        const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*midX + t*t*to.x;
        const y = (1-t)*(1-t)*startY + 2*(1-t)*t*arcHeight + t*t*endY;
        return { x, y };
      }
      if (this.edge.from === 'CONVERSION' && this.edge.to === 'DEMAND') {
        // Arc below the network
        const arcDepth = 155;
        const midX = (from.x + to.x) / 2;
        const startY = from.y + 10;
        const endY = to.y + 10;
        const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*midX + t*t*to.x;
        const y = (1-t)*(1-t)*startY + 2*(1-t)*t*arcDepth + t*t*endY;
        return { x, y };
      }
    }

    // Regular edge quadratic bezier interpolation
    const dx = to.x - from.x;
    const curveOffset = Math.abs(dx) * 0.12;

    const midX = from.x + dx * 0.5;
    const midY = from.y + (to.y - from.y) * 0.5 + curveOffset;

    // Bezier formula
    const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*midX + t*t*to.x;
    const y = (1-t)*(1-t)*(from.y + 10) + 2*(1-t)*t*midY + t*t*(to.y - 10);

    return { x, y };
  }
}

export default function CausalNetworkVisualization({ frameIndex = 0 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const [activeNode, setActiveNode] = useState(null);
  const [activatedNodes, setActivatedNodes] = useState(new Set());
  const [pulsingEdges, setPulsingEdges] = useState(new Set());
  const [intervention, setIntervention] = useState(null);
  const [breathPhase, setBreathPhase] = useState(0); // For node breathing animation

  // Breathing animation - slow oscillation for "living system" feel
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase(p => (p + 1) % 100);
    }, 40); // ~25fps for smooth breathing
    return () => clearInterval(breathInterval);
  }, []);

  // Determine which lever is currently being intervened on
  // Slowed down: each intervention lasts longer (was /3, now /5)
  const currentIntervention = interventionCycle[Math.floor(frameIndex / 5) % interventionCycle.length];

  // Handle intervention cycle - slowed down for contemplative pace
  useEffect(() => {
    const newActiveNode = currentIntervention;
    const downstreamPath = getDownstreamPath(newActiveNode);

    // Reset states
    setActiveNode(newActiveNode);
    setActivatedNodes(new Set([newActiveNode]));
    setPulsingEdges(new Set());

    // Determine intervention direction based on coefficient
    const firstEdge = edges.find(e => e.from === newActiveNode && !e.feedback);
    const direction = firstEdge && firstEdge.beta < 0 ? '↓' : '↑';
    setIntervention(`do(${newActiveNode}${direction})`);

    // Cascade activation through network - slower delays for trackable propagation
    downstreamPath.forEach(({ nodeId, delay }) => {
      if (delay > 0) {
        setTimeout(() => {
          setActivatedNodes(prev => new Set([...prev, nodeId]));

          // Find and pulse the edges leading to this node (including feedback)
          edges.forEach(edge => {
            if (edge.to === nodeId) {
              setPulsingEdges(prev => new Set([...prev, `${edge.from}-${edge.to}`]));
            }
          });
        }, delay);
      }
    });

    // Pulse feedback edges with additional delay to show cyclical nature
    const maxDelay = Math.max(...downstreamPath.map(p => p.delay), 0);
    edges.filter(e => e.feedback).forEach((edge, i) => {
      setTimeout(() => {
        setPulsingEdges(prev => new Set([...prev, `${edge.from}-${edge.to}`]));
      }, maxDelay + 800 + i * 600);
    });

    // Clear intervention text after longer animation (was 1800ms)
    const clearTimer = setTimeout(() => {
      setIntervention(null);
    }, 4000);

    return () => clearTimeout(clearTimer);
  }, [currentIntervention, frameIndex]);

  // Particle animation loop - fewer particles, more trackable
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Spawn new particles less frequently (was 0.15, now 0.04)
    // Quality over quantity - each particle should be trackable
    if (Math.random() < 0.04 && particlesRef.current.length < 15) {
      const randomEdge = edges[Math.floor(Math.random() * edges.length)];
      particlesRef.current.push(new Particle(randomEdge));
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      const alive = particle.update();
      if (alive) {
        const pos = particle.getPosition();
        const isNegative = particle.edge.beta < 0;
        const isFeedback = particle.isFeedback;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);

        // Color based on edge type - feedback edges use dimmer amber
        if (isNegative) {
          ctx.fillStyle = `rgba(255, 107, 107, ${particle.alpha * 0.8})`;
        } else if (isFeedback) {
          ctx.fillStyle = `rgba(200, 140, 0, ${particle.alpha * 0.7})`; // Dimmer amber for feedback
        } else {
          ctx.fillStyle = `rgba(255, 170, 0, ${particle.alpha})`;
        }
        ctx.fill();

        // Glow effect
        if (isFeedback) {
          ctx.shadowColor = 'rgba(200, 140, 0, 0.5)';
        } else if (isNegative) {
          ctx.shadowColor = 'rgba(255, 107, 107, 0.6)';
        } else {
          ctx.shadowColor = 'rgba(255, 170, 0, 0.6)';
        }
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      return alive;
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  }, []);

  // Start particle animation
  useEffect(() => {
    animateParticles();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateParticles]);

  // Calculate edge thickness based on coefficient magnitude - increased for readability
  const getEdgeThickness = (beta, isFeedback = false) => {
    const base = isFeedback ? 1.5 : 2; // Feedback edges slightly thinner
    return base + Math.abs(beta) * 3; // Increased multiplier for thicker edges
  };

  // Calculate breathing scale for nodes (subtle 5% variation over 3-4 second cycle)
  const getBreathingScale = (nodeId) => {
    // Different nodes breathe at slightly different rates for organic feel
    const offset = nodeId.charCodeAt(0) * 7;
    const phase = (breathPhase + offset) % 100;
    const breathCycle = Math.sin((phase / 100) * Math.PI * 2);
    return 1 + breathCycle * 0.025; // 2.5% scale variation each way = 5% total
  };

  return (
    <div className="causal-network-container">
      {/* Intervention notation */}
      {intervention && (
        <div className="intervention-label">
          {intervention}
        </div>
      )}

      {/* SVG Network Layer - expanded viewBox for feedback loops */}
      <svg
        className="causal-network-svg"
        viewBox="-10 -70 370 240"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient for positive edges */}
          <linearGradient id="edge-positive" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ffaa00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.3" />
          </linearGradient>

          {/* Gradient for negative edges */}
          <linearGradient id="edge-negative" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ff6b6b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.3" />
          </linearGradient>

          {/* Gradient for feedback edges - dimmer amber */}
          <linearGradient id="edge-feedback" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c88c00" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#c88c00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c88c00" stopOpacity="0.2" />
          </linearGradient>

          {/* Glow filter for active nodes */}
          <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        <g className="causal-edges">
          {edges.map((edge, i) => {
            const isFeedback = edge.feedback || false;
            const path = getEdgePath(edge.from, edge.to, isFeedback);
            const isNegative = edge.beta < 0;
            const isPulsing = pulsingEdges.has(`${edge.from}-${edge.to}`);
            const thickness = getEdgeThickness(edge.beta, isFeedback);

            // Determine edge color
            let strokeColor = '#ffaa00';
            if (isNegative) strokeColor = '#ff6b6b';
            if (isFeedback) strokeColor = '#c88c00'; // Dimmer amber for feedback

            // Calculate label position - different for feedback loops
            let labelX, labelY;
            if (isFeedback && edge.from === 'REVENUE') {
              labelX = (nodes[edge.from].x + nodes[edge.to].x) / 2;
              labelY = -35; // Above the arc
            } else if (isFeedback && edge.from === 'CONVERSION') {
              labelX = (nodes[edge.from].x + nodes[edge.to].x) / 2;
              labelY = 145; // Below the arc
            } else {
              labelX = nodes[edge.from].x + (nodes[edge.to].x - nodes[edge.from].x) * 0.5;
              labelY = nodes[edge.from].y + (nodes[edge.to].y - nodes[edge.from].y) * 0.4;
            }

            return (
              <g key={i} className="causal-edge-group">
                {/* Edge path */}
                <path
                  d={path}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={thickness}
                  strokeOpacity={isPulsing ? 0.9 : (isFeedback ? 0.35 : 0.5)}
                  className={`causal-edge ${isPulsing ? 'pulsing' : ''} ${isFeedback ? 'feedback' : ''}`}
                  strokeDasharray={isFeedback ? '6,4' : (isNegative ? '5,3' : 'none')}
                />

                {/* Coefficient label - larger font */}
                <text
                  x={labelX}
                  y={labelY}
                  className="edge-coefficient"
                  fill={strokeColor}
                  opacity={isPulsing ? 1 : 0.6}
                  fontSize="8"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g className="causal-nodes">
          {Object.values(nodes).filter(n => !n.hidden).map((node) => {
            const isActive = activatedNodes.has(node.id);
            const isLever = node.controllable;
            const isSource = node.id === activeNode;
            const breathScale = getBreathingScale(node.id);

            return (
              <g
                key={node.id}
                className={`causal-node ${isActive ? 'active' : ''} ${isSource ? 'source' : ''}`}
                transform={`translate(${node.x}, ${node.y}) scale(${breathScale})`}
                filter={isSource ? 'url(#glow-strong)' : isActive ? 'url(#glow-amber)' : 'none'}
                style={{ transformOrigin: 'center', transition: 'transform 0.1s ease-out' }}
              >
                {/* Node background - 50-75% larger */}
                <rect
                  x="-32"
                  y="-12"
                  width="64"
                  height="24"
                  rx="4"
                  className={`node-bg ${isLever ? 'lever' : ''} ${isActive ? 'active' : ''}`}
                  fill={isActive ? 'rgba(255, 170, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)'}
                  stroke={isActive ? '#ffaa00' : '#666'}
                  strokeWidth={isSource ? 2 : 1.5}
                />

                {/* Lever indicator - larger */}
                {isLever && (
                  <rect
                    x="-28"
                    y="8"
                    width="14"
                    height="2"
                    rx="1"
                    fill={isActive ? '#ffaa00' : '#666'}
                    opacity={0.6}
                  />
                )}

                {/* Node label - larger font */}
                <text
                  className="node-label"
                  fill={isActive ? '#ffaa00' : '#aaa'}
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Canvas for particle effects - expanded to match viewBox */}
      <canvas
        ref={canvasRef}
        className="causal-particles-canvas"
        width="370"
        height="240"
        style={{ marginTop: '-70px', marginLeft: '-10px' }}
      />
    </div>
  );
}
