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

// Network node definitions
const nodes = {
  // External factors (top tier - uncontrollable)
  MARKET: { id: 'MARKET', label: 'MARKET', tier: 0, x: 280, y: 15, controllable: false },

  // Levers (middle tier - controllable)
  PRICE: { id: 'PRICE', label: 'PRICE', tier: 1, x: 40, y: 55, controllable: true },
  PROMO: { id: 'PROMO', label: 'PROMO', tier: 1, x: 120, y: 55, controllable: true },
  CHANNEL: { id: 'CHANNEL', label: 'CHANNEL', tier: 1, x: 200, y: 55, controllable: true },
  OPS: { id: 'OPS', label: 'OPS', tier: 1, x: 280, y: 55, controllable: true },

  // Outcomes (bottom tier)
  DEMAND: { id: 'DEMAND', label: 'DEMAND', tier: 2, x: 100, y: 100, controllable: false },
  CONVERSION: { id: 'CONVERSION', label: 'CONV', tier: 2, x: 200, y: 100, controllable: false },
  REVENUE: { id: 'REVENUE', label: 'REVENUE', tier: 2, x: 300, y: 100, controllable: false },
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
];

// Intervention cycle - which levers activate in sequence
const interventionCycle = ['PRICE', 'PROMO', 'CHANNEL', 'OPS'];

// Calculate edge path with curve
function getEdgePath(from, to) {
  const fromNode = nodes[from];
  const toNode = nodes[to];

  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;

  // Simple curved path
  const midX = fromNode.x + dx * 0.5;
  const midY = fromNode.y + dy * 0.5;
  const curveOffset = Math.abs(dx) * 0.15;

  return `M ${fromNode.x} ${fromNode.y + 8} Q ${midX} ${midY + curveOffset} ${toNode.x} ${toNode.y - 8}`;
}

// Get downstream nodes for cascade animation
function getDownstreamPath(startNode) {
  const visited = new Set();
  const path = [];

  function traverse(nodeId, delay) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    path.push({ nodeId, delay });

    edges.forEach(edge => {
      if (edge.from === nodeId) {
        traverse(edge.to, delay + 400);
      }
    });
  }

  traverse(startNode, 0);
  return path;
}

// Particle class for canvas animation
class Particle {
  constructor(edge, progress = 0) {
    this.edge = edge;
    this.progress = progress;
    this.speed = 0.008 + Math.random() * 0.004;
    this.size = 2 + Math.random() * 1.5;
    this.alpha = 0.6 + Math.random() * 0.4;
  }

  update() {
    this.progress += this.speed;
    return this.progress < 1;
  }

  getPosition() {
    const from = nodes[this.edge.from];
    const to = nodes[this.edge.to];

    // Quadratic bezier interpolation
    const t = this.progress;
    const dx = to.x - from.x;
    const curveOffset = Math.abs(dx) * 0.15;

    const midX = from.x + dx * 0.5;
    const midY = from.y + (to.y - from.y) * 0.5 + curveOffset;

    // Bezier formula
    const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*midX + t*t*to.x;
    const y = (1-t)*(1-t)*(from.y + 8) + 2*(1-t)*t*midY + t*t*(to.y - 8);

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

  // Determine which lever is currently being intervened on
  const currentIntervention = interventionCycle[Math.floor(frameIndex / 3) % interventionCycle.length];

  // Handle intervention cycle
  useEffect(() => {
    const newActiveNode = currentIntervention;
    const downstreamPath = getDownstreamPath(newActiveNode);

    // Reset states
    setActiveNode(newActiveNode);
    setActivatedNodes(new Set([newActiveNode]));
    setPulsingEdges(new Set());

    // Determine intervention direction based on coefficient
    const firstEdge = edges.find(e => e.from === newActiveNode);
    const direction = firstEdge && firstEdge.beta < 0 ? '↓' : '↑';
    setIntervention(`do(${newActiveNode}${direction})`);

    // Cascade activation through network
    downstreamPath.forEach(({ nodeId, delay }) => {
      if (delay > 0) {
        setTimeout(() => {
          setActivatedNodes(prev => new Set([...prev, nodeId]));

          // Find and pulse the edge leading to this node
          edges.forEach(edge => {
            if (edge.to === nodeId) {
              setPulsingEdges(prev => new Set([...prev, `${edge.from}-${edge.to}`]));
            }
          });
        }, delay);
      }
    });

    // Clear intervention text after animation
    const clearTimer = setTimeout(() => {
      setIntervention(null);
    }, 1800);

    return () => clearTimeout(clearTimer);
  }, [currentIntervention, frameIndex]);

  // Particle animation loop
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Spawn new particles occasionally
    if (Math.random() < 0.15) {
      const randomEdge = edges[Math.floor(Math.random() * edges.length)];
      particlesRef.current.push(new Particle(randomEdge));
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      const alive = particle.update();
      if (alive) {
        const pos = particle.getPosition();
        const isNegative = particle.edge.beta < 0;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);

        // Color based on edge type
        if (isNegative) {
          ctx.fillStyle = `rgba(255, 107, 107, ${particle.alpha * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(255, 170, 0, ${particle.alpha})`;
        }
        ctx.fill();

        // Glow effect
        ctx.shadowColor = isNegative ? 'rgba(255, 107, 107, 0.6)' : 'rgba(255, 170, 0, 0.6)';
        ctx.shadowBlur = 4;
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

  // Calculate edge thickness based on coefficient magnitude
  const getEdgeThickness = (beta) => {
    return 1 + Math.abs(beta) * 2;
  };

  return (
    <div className="causal-network-container">
      {/* Intervention notation */}
      {intervention && (
        <div className="intervention-label">
          {intervention}
        </div>
      )}

      {/* SVG Network Layer */}
      <svg
        className="causal-network-svg"
        viewBox="0 0 350 130"
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

          {/* Glow filter for active nodes */}
          <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        <g className="causal-edges">
          {edges.map((edge, i) => {
            const path = getEdgePath(edge.from, edge.to);
            const isNegative = edge.beta < 0;
            const isPulsing = pulsingEdges.has(`${edge.from}-${edge.to}`);
            const thickness = getEdgeThickness(edge.beta);

            return (
              <g key={i} className="causal-edge-group">
                {/* Edge path */}
                <path
                  d={path}
                  fill="none"
                  stroke={isNegative ? '#ff6b6b' : '#ffaa00'}
                  strokeWidth={thickness}
                  strokeOpacity={isPulsing ? 0.9 : 0.4}
                  className={`causal-edge ${isPulsing ? 'pulsing' : ''}`}
                  strokeDasharray={isNegative ? '4,2' : 'none'}
                />

                {/* Coefficient label */}
                <text
                  x={nodes[edge.from].x + (nodes[edge.to].x - nodes[edge.from].x) * 0.5}
                  y={nodes[edge.from].y + (nodes[edge.to].y - nodes[edge.from].y) * 0.4}
                  className="edge-coefficient"
                  fill={isNegative ? '#ff6b6b' : '#ffaa00'}
                  opacity={isPulsing ? 1 : 0.5}
                  fontSize="5"
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
          {Object.values(nodes).map((node) => {
            const isActive = activatedNodes.has(node.id);
            const isLever = node.controllable;
            const isSource = node.id === activeNode;

            return (
              <g
                key={node.id}
                className={`causal-node ${isActive ? 'active' : ''} ${isSource ? 'source' : ''}`}
                transform={`translate(${node.x}, ${node.y})`}
                filter={isSource ? 'url(#glow-strong)' : isActive ? 'url(#glow-amber)' : 'none'}
              >
                {/* Node background */}
                <rect
                  x="-22"
                  y="-8"
                  width="44"
                  height="16"
                  rx="3"
                  className={`node-bg ${isLever ? 'lever' : ''} ${isActive ? 'active' : ''}`}
                  fill={isActive ? 'rgba(255, 170, 0, 0.15)' : 'rgba(0, 0, 0, 0.4)'}
                  stroke={isActive ? '#ffaa00' : '#555'}
                  strokeWidth={isSource ? 1.5 : 1}
                />

                {/* Lever indicator */}
                {isLever && (
                  <rect
                    x="-19"
                    y="5"
                    width="10"
                    height="1.5"
                    rx="0.5"
                    fill={isActive ? '#ffaa00' : '#555'}
                    opacity={0.5}
                  />
                )}

                {/* Node label */}
                <text
                  className="node-label"
                  fill={isActive ? '#ffaa00' : '#888'}
                  fontSize="6"
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

      {/* Canvas for particle effects */}
      <canvas
        ref={canvasRef}
        className="causal-particles-canvas"
        width="350"
        height="130"
      />
    </div>
  );
}
