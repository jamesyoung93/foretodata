import { useState, useEffect, useRef } from 'react';

// ============================================================================
// CAUSAL NETWORK VISUALIZATION
// ============================================================================
// Dynamic visualization showing causal relationships between business levers
// and outcomes. Features:
// - SVG-based network structure with nodes and edges
// - Edge pulse animations (brightness waves along paths)
// - Node glow pulses when signals arrive
// - Intervention notation (do() operator)
// - Clean 3-tier layout with feedback loops around perimeter

// Network node definitions - clean 3-tier layout with more spacing
const nodes = {
  // External factors (top tier - uncontrollable)
  MARKET: { id: 'MARKET', label: 'MARKET', tier: 0, x: 280, y: 20, controllable: false },

  // Levers (middle tier - controllable) - more horizontal spread
  PRICE: { id: 'PRICE', label: 'PRICE', tier: 1, x: 50, y: 70, controllable: true },
  PROMO: { id: 'PROMO', label: 'PROMO', tier: 1, x: 130, y: 70, controllable: true },
  CHANNEL: { id: 'CHANNEL', label: 'CHANNEL', tier: 1, x: 210, y: 70, controllable: true },
  OPS: { id: 'OPS', label: 'OPS', tier: 1, x: 290, y: 70, controllable: true },

  // Outcomes (bottom tier) - spread for clear flow
  DEMAND: { id: 'DEMAND', label: 'DEMAND', tier: 2, x: 90, y: 135, controllable: false },
  CONVERSION: { id: 'CONVERSION', label: 'CONV', tier: 2, x: 190, y: 135, controllable: false },
  REVENUE: { id: 'REVENUE', label: 'REVENUE', tier: 2, x: 290, y: 135, controllable: false },
};

// Edge definitions (coefficients kept for logic but not displayed)
const edges = [
  // Levers → Demand
  { from: 'PRICE', to: 'DEMAND', beta: -0.41 },
  { from: 'PROMO', to: 'DEMAND', beta: 0.33 },
  { from: 'CHANNEL', to: 'DEMAND', beta: 0.27 },
  { from: 'MARKET', to: 'DEMAND', beta: 0.52 },

  // Levers → Conversion
  { from: 'OPS', to: 'CONVERSION', beta: 0.19 },
  { from: 'CHANNEL', to: 'CONVERSION', beta: 0.22 },

  // Demand → Conversion → Revenue chain
  { from: 'DEMAND', to: 'CONVERSION', beta: 0.45 },
  { from: 'CONVERSION', to: 'REVENUE', beta: 0.89 },

  // FEEDBACK LOOPS - showing circularity in the system
  { from: 'REVENUE', to: 'PROMO', beta: 0.25, feedback: true },
  { from: 'CONVERSION', to: 'DEMAND', beta: 0.18, feedback: true },
];

// Intervention cycle - which levers activate in sequence
const interventionCycle = ['PRICE', 'PROMO', 'CHANNEL', 'OPS'];

// Calculate edge path with curve - handles feedback loops with large perimeter arcs
function getEdgePath(from, to, isFeedback = false) {
  const fromNode = nodes[from];
  const toNode = nodes[to];

  const dx = toNode.x - fromNode.x;

  if (isFeedback) {
    // REVENUE → PROMO: large arc above the network
    if (from === 'REVENUE' && to === 'PROMO') {
      const arcHeight = -20;
      const midX = (fromNode.x + toNode.x) / 2;
      return `M ${fromNode.x} ${fromNode.y - 12} Q ${midX} ${arcHeight} ${toNode.x} ${toNode.y - 12}`;
    }
    // CONVERSION → DEMAND: large arc below the network
    if (from === 'CONVERSION' && to === 'DEMAND') {
      const arcDepth = 175;
      const midX = (fromNode.x + toNode.x) / 2;
      return `M ${fromNode.x} ${fromNode.y + 12} Q ${midX} ${arcDepth} ${toNode.x} ${toNode.y + 12}`;
    }
  }

  // Regular edges: gentle curved path
  const midX = fromNode.x + dx * 0.5;
  const midY = fromNode.y + (nodes[to].y - fromNode.y) * 0.5;
  const curveOffset = Math.min(Math.abs(dx) * 0.08, 15);

  return `M ${fromNode.x} ${fromNode.y + 12} Q ${midX} ${midY + curveOffset} ${toNode.x} ${nodes[to].y - 12}`;
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
      if (edge.from === nodeId && !edge.feedback) {
        traverse(edge.to, delay + 1500); // 1.5s between node activations
      }
    });
  }

  traverse(startNode, 0);
  return path;
}

// Get edges from a node for pulse animation timing
function getEdgesFrom(nodeId) {
  return edges.filter(e => e.from === nodeId && !e.feedback);
}

export default function CausalNetworkVisualization({ frameIndex = 0 }) {
  const [activeNode, setActiveNode] = useState(null);
  const [activatedNodes, setActivatedNodes] = useState(new Set());
  const [pulsingEdges, setPulsingEdges] = useState(new Map()); // edge key -> pulse progress (0-1)
  const [intervention, setIntervention] = useState(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [nodeGlows, setNodeGlows] = useState(new Map()); // node id -> glow intensity (0-1)
  const pulseTimersRef = useRef([]);

  // Breathing animation for subtle "living system" feel
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase(p => (p + 1) % 100);
    }, 40);
    return () => clearInterval(breathInterval);
  }, []);

  // Determine which lever is currently being intervened on
  // Each intervention lasts 5 frames (~7.5 seconds at 1.5s/frame)
  const currentIntervention = interventionCycle[Math.floor(frameIndex / 5) % interventionCycle.length];

  // Handle intervention cycle with edge pulses and node glows
  useEffect(() => {
    // Clear any existing timers
    pulseTimersRef.current.forEach(timer => clearTimeout(timer));
    pulseTimersRef.current = [];

    const newActiveNode = currentIntervention;
    const downstreamPath = getDownstreamPath(newActiveNode);

    // Reset states
    setActiveNode(newActiveNode);
    setActivatedNodes(new Set([newActiveNode]));
    setPulsingEdges(new Map());
    setNodeGlows(new Map([[newActiveNode, 1]])); // Source node starts glowing

    // Determine intervention direction
    const firstEdge = edges.find(e => e.from === newActiveNode && !e.feedback);
    const direction = firstEdge && firstEdge.beta < 0 ? '↓' : '↑';
    setIntervention(`do(${newActiveNode}${direction})`);

    // Animate cascade: source glows → edges pulse → destination glows → repeat
    downstreamPath.forEach(({ nodeId, delay }) => {
      if (delay > 0) {
        // Start node glow when signal arrives
        const glowTimer = setTimeout(() => {
          setActivatedNodes(prev => new Set([...prev, nodeId]));
          setNodeGlows(prev => new Map([...prev, [nodeId, 1]]));

          // Fade out glow after 0.5s
          setTimeout(() => {
            setNodeGlows(prev => {
              const newMap = new Map(prev);
              newMap.set(nodeId, 0.3);
              return newMap;
            });
          }, 500);
        }, delay);
        pulseTimersRef.current.push(glowTimer);
      }
    });

    // Animate edges: pulse travels along each edge
    downstreamPath.forEach(({ nodeId, delay }) => {
      const outgoingEdges = getEdgesFrom(nodeId);
      outgoingEdges.forEach(edge => {
        const edgeKey = `${edge.from}-${edge.to}`;
        const edgePulseDuration = 1200; // 1.2s for pulse to travel edge

        // Start edge pulse
        const startTimer = setTimeout(() => {
          // Animate pulse progress from 0 to 1
          const startTime = Date.now();
          const animateEdge = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / edgePulseDuration);

            setPulsingEdges(prev => {
              const newMap = new Map(prev);
              newMap.set(edgeKey, progress);
              return newMap;
            });

            if (progress < 1) {
              requestAnimationFrame(animateEdge);
            }
          };
          animateEdge();
        }, delay);
        pulseTimersRef.current.push(startTimer);
      });
    });

    // Pulse feedback edges after main cascade completes
    const maxDelay = Math.max(...downstreamPath.map(p => p.delay), 0);
    const feedbackEdges = edges.filter(e => e.feedback);
    feedbackEdges.forEach((edge, i) => {
      const edgeKey = `${edge.from}-${edge.to}`;
      const feedbackDelay = maxDelay + 1000 + i * 800;
      const edgePulseDuration = 1500;

      const feedbackTimer = setTimeout(() => {
        const startTime = Date.now();
        const animateFeedback = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / edgePulseDuration);

          setPulsingEdges(prev => {
            const newMap = new Map(prev);
            newMap.set(edgeKey, progress);
            return newMap;
          });

          if (progress < 1) {
            requestAnimationFrame(animateFeedback);
          }
        };
        animateFeedback();
      }, feedbackDelay);
      pulseTimersRef.current.push(feedbackTimer);
    });

    // Clear intervention text after brief display (2s)
    const clearTimer = setTimeout(() => {
      setIntervention(null);
    }, 2000);
    pulseTimersRef.current.push(clearTimer);

    return () => {
      pulseTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [currentIntervention, frameIndex]);

  // Calculate edge thickness - thinner for feedback edges
  const getEdgeThickness = (beta, isFeedback = false) => {
    if (isFeedback) return 1.2;
    return 1.5 + Math.abs(beta) * 2;
  };

  // Calculate breathing scale for nodes
  const getBreathingScale = (nodeId) => {
    const offset = nodeId.charCodeAt(0) * 7;
    const phase = (breathPhase + offset) % 100;
    const breathCycle = Math.sin((phase / 100) * Math.PI * 2);
    return 1 + breathCycle * 0.025;
  };

  // Calculate edge path length for stroke-dashoffset animation
  const getPathLength = (from, to, isFeedback) => {
    // Approximate path length for dash animation
    const fromNode = nodes[from];
    const toNode = nodes[to];
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const straightDist = Math.sqrt(dx * dx + dy * dy);
    // Curved paths are ~1.2-1.5x longer
    return isFeedback ? straightDist * 1.8 : straightDist * 1.3;
  };

  return (
    <div className="causal-network-container">
      {/* Intervention notation - smaller, appears briefly */}
      {intervention && (
        <div className="intervention-label" style={{
          fontSize: '10px',
          opacity: 0.8,
          transition: 'opacity 0.3s ease-out'
        }}>
          {intervention}
        </div>
      )}

      {/* SVG Network Layer */}
      <svg
        className="causal-network-svg"
        viewBox="-10 -40 360 230"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow filter for active nodes */}
          <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Edge glow filter for pulses */}
          <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Edges - with pulse animation */}
        <g className="causal-edges">
          {edges.map((edge, i) => {
            const isFeedback = edge.feedback || false;
            const path = getEdgePath(edge.from, edge.to, isFeedback);
            const isNegative = edge.beta < 0;
            const edgeKey = `${edge.from}-${edge.to}`;
            const pulseProgress = pulsingEdges.get(edgeKey) || 0;
            const isPulsing = pulseProgress > 0 && pulseProgress < 1;
            const thickness = getEdgeThickness(edge.beta, isFeedback);
            const pathLength = getPathLength(edge.from, edge.to, isFeedback);

            // Base colors - feedback edges are more transparent
            let baseColor = '#ffaa00';
            if (isNegative) baseColor = '#ff6b6b';
            if (isFeedback) baseColor = '#c88c00';

            // Edge opacity - lower for feedback, higher when pulsing
            const baseOpacity = isFeedback ? 0.25 : 0.4;
            const activeOpacity = isFeedback ? 0.6 : 0.85;

            return (
              <g key={i} className="causal-edge-group">
                {/* Base edge path (dim) */}
                <path
                  d={path}
                  fill="none"
                  stroke={baseColor}
                  strokeWidth={thickness}
                  strokeOpacity={baseOpacity}
                  strokeDasharray={isFeedback ? '8,6' : (isNegative ? '6,4' : 'none')}
                />

                {/* Pulse overlay - animated brightness wave */}
                {isPulsing && (
                  <path
                    d={path}
                    fill="none"
                    stroke={isNegative ? '#ff9999' : '#ffcc44'}
                    strokeWidth={thickness + 1}
                    strokeOpacity={activeOpacity}
                    strokeDasharray={`${pathLength * 0.15} ${pathLength * 0.85}`}
                    strokeDashoffset={pathLength * (1 - pulseProgress)}
                    filter="url(#edge-glow)"
                    style={{ transition: 'none' }}
                  />
                )}

                {/* Completed pulse glow (brief) */}
                {pulseProgress >= 1 && (
                  <path
                    d={path}
                    fill="none"
                    stroke={baseColor}
                    strokeWidth={thickness}
                    strokeOpacity={0.7}
                    strokeDasharray={isFeedback ? '8,6' : (isNegative ? '6,4' : 'none')}
                    style={{
                      animation: 'fadeEdge 0.5s ease-out forwards',
                    }}
                  />
                )}
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
            const breathScale = getBreathingScale(node.id);
            const glowIntensity = nodeGlows.get(node.id) || 0;

            // Node glow effect
            const nodeFilter = isSource ? 'url(#glow-strong)' :
                              (glowIntensity > 0.5 ? 'url(#glow-amber)' : 'none');

            return (
              <g
                key={node.id}
                className={`causal-node ${isActive ? 'active' : ''} ${isSource ? 'source' : ''}`}
                transform={`translate(${node.x}, ${node.y}) scale(${breathScale * (1 + glowIntensity * 0.1)})`}
                filter={nodeFilter}
                style={{ transformOrigin: 'center', transition: 'transform 0.15s ease-out' }}
              >
                {/* Node background */}
                <rect
                  x="-32"
                  y="-12"
                  width="64"
                  height="24"
                  rx="4"
                  className={`node-bg ${isLever ? 'lever' : ''} ${isActive ? 'active' : ''}`}
                  fill={isActive ? `rgba(255, 170, 0, ${0.15 + glowIntensity * 0.15})` : 'rgba(0, 0, 0, 0.5)'}
                  stroke={isActive ? '#ffaa00' : '#666'}
                  strokeWidth={isSource ? 2 : 1.5}
                />

                {/* Lever indicator */}
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

                {/* Node label */}
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

      {/* CSS for edge fade animation */}
      <style>{`
        @keyframes fadeEdge {
          from { stroke-opacity: 0.7; }
          to { stroke-opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
