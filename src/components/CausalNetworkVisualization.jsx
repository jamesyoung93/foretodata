import { useState, useEffect, useRef } from 'react';

// ============================================================================
// CAUSAL NETWORK VISUALIZATION - Accurate DAG Structure
// ============================================================================
// Dynamic visualization showing causal relationships between business levers
// and outcomes with proper 4-tier hierarchy:
//   TIER 1: MARKET (exogenous)
//   TIER 2: PRICE, PROMO, CHANNEL, OPS (levers)
//   TIER 3: AWARENESS, DEMAND, CONVERSION (mediators)
//   TIER 4: SATISFACTION, RETENTION, REVENUE (outcomes)

// Network node definitions - 4-tier layout
const nodes = {
  // TIER 1 - Exogenous (top, centered)
  MARKET: { id: 'MARKET', label: 'MARKET', tier: 0, x: 170, y: 15, type: 'exogenous' },

  // TIER 2 - Levers (row of 4)
  PRICE: { id: 'PRICE', label: 'PRICE', tier: 1, x: 45, y: 60, type: 'lever' },
  PROMO: { id: 'PROMO', label: 'PROMO', tier: 1, x: 120, y: 60, type: 'lever' },
  CHANNEL: { id: 'CHANNEL', label: 'CHANNEL', tier: 1, x: 205, y: 60, type: 'lever' },
  OPS: { id: 'OPS', label: 'OPS', tier: 1, x: 290, y: 60, type: 'lever' },

  // TIER 3 - Mediators (row of 3)
  AWARENESS: { id: 'AWARENESS', label: 'AWARE', tier: 2, x: 75, y: 115, type: 'mediator' },
  DEMAND: { id: 'DEMAND', label: 'DEMAND', tier: 2, x: 170, y: 115, type: 'mediator' },
  CONVERSION: { id: 'CONVERSION', label: 'CONV', tier: 2, x: 265, y: 115, type: 'mediator' },

  // TIER 4 - Outcomes (row of 3)
  SATISFACTION: { id: 'SATISFACTION', label: 'SATIS', tier: 3, x: 75, y: 170, type: 'outcome' },
  RETENTION: { id: 'RETENTION', label: 'RETAIN', tier: 3, x: 170, y: 170, type: 'outcome' },
  REVENUE: { id: 'REVENUE', label: 'REVENUE', tier: 3, x: 265, y: 170, type: 'outcome' },
};

// Edge definitions with causal direction
const edges = [
  // From MARKET
  { from: 'MARKET', to: 'DEMAND', positive: true },

  // From PRICE (all negative effects)
  { from: 'PRICE', to: 'DEMAND', positive: false },
  { from: 'PRICE', to: 'CONVERSION', positive: false },
  { from: 'PRICE', to: 'SATISFACTION', positive: false },

  // From PROMO
  { from: 'PROMO', to: 'AWARENESS', positive: true },

  // From CHANNEL
  { from: 'CHANNEL', to: 'AWARENESS', positive: true },
  { from: 'CHANNEL', to: 'CONVERSION', positive: true },

  // From OPS
  { from: 'OPS', to: 'CONVERSION', positive: true },
  { from: 'OPS', to: 'SATISFACTION', positive: true },

  // From AWARENESS
  { from: 'AWARENESS', to: 'DEMAND', positive: true },

  // From DEMAND
  { from: 'DEMAND', to: 'CONVERSION', positive: true },

  // From CONVERSION
  { from: 'CONVERSION', to: 'REVENUE', positive: true },

  // From SATISFACTION
  { from: 'SATISFACTION', to: 'RETENTION', positive: true },

  // FEEDBACK LOOPS
  { from: 'RETENTION', to: 'DEMAND', positive: true, feedback: true, side: 'left' },
  { from: 'REVENUE', to: 'PROMO', positive: true, feedback: true, side: 'right' },
];

// Intervention cycle - which levers activate in sequence
const interventionCycle = ['PRICE', 'PROMO', 'CHANNEL', 'OPS'];

// Calculate edge path with proper curves
function getEdgePath(from, to, isFeedback = false, feedbackSide = null) {
  const fromNode = nodes[from];
  const toNode = nodes[to];

  if (isFeedback) {
    // RETENTION → DEMAND: curve around left side
    if (feedbackSide === 'left') {
      const leftX = -15;
      const midY = (fromNode.y + toNode.y) / 2;
      return `M ${fromNode.x - 25} ${fromNode.y} ` +
             `C ${leftX} ${fromNode.y}, ${leftX} ${toNode.y}, ${toNode.x - 25} ${toNode.y}`;
    }
    // REVENUE → PROMO: curve around right side
    if (feedbackSide === 'right') {
      const rightX = 355;
      const midY = (fromNode.y + toNode.y) / 2;
      return `M ${fromNode.x + 25} ${fromNode.y} ` +
             `C ${rightX} ${fromNode.y}, ${rightX} ${toNode.y}, ${toNode.x + 25} ${toNode.y}`;
    }
  }

  // Determine connection points based on relative positions
  const dy = toNode.y - fromNode.y;
  const dx = toNode.x - fromNode.x;

  // From node: exit from bottom if going down a tier
  const fromY = fromNode.y + 10;
  const fromX = fromNode.x;

  // To node: enter from top
  const toY = toNode.y - 10;
  const toX = toNode.x;

  // Gentle curve for regular edges
  const midY = (fromY + toY) / 2;
  const curveOffset = Math.abs(dx) * 0.15;

  return `M ${fromX} ${fromY} Q ${fromX + dx * 0.5} ${midY + curveOffset} ${toX} ${toY}`;
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
        traverse(edge.to, delay + 1200);
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
  const [pulsingEdges, setPulsingEdges] = useState(new Map());
  const [intervention, setIntervention] = useState(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [nodeGlows, setNodeGlows] = useState(new Map());
  const pulseTimersRef = useRef([]);

  // Breathing animation for subtle "living system" feel
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase(p => (p + 1) % 100);
    }, 40);
    return () => clearInterval(breathInterval);
  }, []);

  // Determine which lever is currently being intervened on
  const currentIntervention = interventionCycle[Math.floor(frameIndex / 5) % interventionCycle.length];

  // Handle intervention cycle with edge pulses and node glows
  useEffect(() => {
    pulseTimersRef.current.forEach(timer => clearTimeout(timer));
    pulseTimersRef.current = [];

    const newActiveNode = currentIntervention;
    const downstreamPath = getDownstreamPath(newActiveNode);

    setActiveNode(newActiveNode);
    setActivatedNodes(new Set([newActiveNode]));
    setPulsingEdges(new Map());
    setNodeGlows(new Map([[newActiveNode, 1]]));

    // Determine intervention direction based on first edge
    const firstEdge = edges.find(e => e.from === newActiveNode && !e.feedback);
    const direction = firstEdge && !firstEdge.positive ? '↓' : '↑';
    setIntervention(`do(${newActiveNode}${direction})`);

    // Animate cascade
    downstreamPath.forEach(({ nodeId, delay }) => {
      if (delay > 0) {
        const glowTimer = setTimeout(() => {
          setActivatedNodes(prev => new Set([...prev, nodeId]));
          setNodeGlows(prev => new Map([...prev, [nodeId, 1]]));

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

    // Animate edges
    downstreamPath.forEach(({ nodeId, delay }) => {
      const outgoingEdges = getEdgesFrom(nodeId);
      outgoingEdges.forEach(edge => {
        const edgeKey = `${edge.from}-${edge.to}`;
        const edgePulseDuration = 1000;

        const startTimer = setTimeout(() => {
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

    // Pulse feedback edges after main cascade (slower, subtler)
    const maxDelay = Math.max(...downstreamPath.map(p => p.delay), 0);
    const feedbackEdges = edges.filter(e => e.feedback);
    feedbackEdges.forEach((edge, i) => {
      const edgeKey = `${edge.from}-${edge.to}`;
      const feedbackDelay = maxDelay + 1500 + i * 1000;
      const edgePulseDuration = 2000; // Slower for feedback

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

    // Clear intervention text after brief display
    const clearTimer = setTimeout(() => {
      setIntervention(null);
    }, 2000);
    pulseTimersRef.current.push(clearTimer);

    return () => {
      pulseTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [currentIntervention, frameIndex]);

  // Calculate breathing scale for nodes
  const getBreathingScale = (nodeId) => {
    const offset = nodeId.charCodeAt(0) * 7;
    const phase = (breathPhase + offset) % 100;
    const breathCycle = Math.sin((phase / 100) * Math.PI * 2);
    return 1 + breathCycle * 0.02;
  };

  // Approximate path length for dash animation
  const getPathLength = (from, to, isFeedback, feedbackSide) => {
    const fromNode = nodes[from];
    const toNode = nodes[to];
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const straightDist = Math.sqrt(dx * dx + dy * dy);
    if (isFeedback) return straightDist * 2.5;
    return straightDist * 1.3;
  };

  return (
    <div className="causal-network-container">
      {/* Intervention notation */}
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
        viewBox="-20 -10 380 210"
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

          {/* Arrowhead marker */}
          <marker
            id="arrowhead-amber"
            markerWidth="6"
            markerHeight="4"
            refX="5"
            refY="2"
            orient="auto"
          >
            <polygon points="0 0, 6 2, 0 4" fill="#ffaa00" opacity="0.6" />
          </marker>
          <marker
            id="arrowhead-red"
            markerWidth="6"
            markerHeight="4"
            refX="5"
            refY="2"
            orient="auto"
          >
            <polygon points="0 0, 6 2, 0 4" fill="#ff7b6b" opacity="0.6" />
          </marker>
        </defs>

        {/* Edges */}
        <g className="causal-edges">
          {edges.map((edge, i) => {
            const isFeedback = edge.feedback || false;
            const feedbackSide = edge.side || null;
            const path = getEdgePath(edge.from, edge.to, isFeedback, feedbackSide);
            const isNegative = !edge.positive;
            const edgeKey = `${edge.from}-${edge.to}`;
            const pulseProgress = pulsingEdges.get(edgeKey) || 0;
            const isPulsing = pulseProgress > 0 && pulseProgress < 1;
            const pathLength = getPathLength(edge.from, edge.to, isFeedback, feedbackSide);

            // Colors: amber for positive, coral/red for negative
            const baseColor = isNegative ? '#ff7b6b' : '#ffaa00';
            const pulseColor = isNegative ? '#ff9999' : '#ffcc44';

            // Thickness: thinner for feedback
            const thickness = isFeedback ? 1 : 1.5;

            // Opacity: lower for feedback
            const baseOpacity = isFeedback ? 0.2 : 0.35;
            const activeOpacity = isFeedback ? 0.5 : 0.8;

            return (
              <g key={i} className="causal-edge-group">
                {/* Base edge path */}
                <path
                  d={path}
                  fill="none"
                  stroke={baseColor}
                  strokeWidth={thickness}
                  strokeOpacity={baseOpacity}
                  strokeDasharray={isFeedback ? '6,4' : 'none'}
                  markerEnd={isNegative ? 'url(#arrowhead-red)' : 'url(#arrowhead-amber)'}
                />

                {/* Pulse overlay */}
                {isPulsing && (
                  <path
                    d={path}
                    fill="none"
                    stroke={pulseColor}
                    strokeWidth={thickness + 1}
                    strokeOpacity={activeOpacity}
                    strokeDasharray={`${pathLength * 0.12} ${pathLength * 0.88}`}
                    strokeDashoffset={pathLength * (1 - pulseProgress)}
                    filter="url(#edge-glow)"
                    style={{ transition: 'none' }}
                  />
                )}

                {/* Completed pulse glow */}
                {pulseProgress >= 1 && (
                  <path
                    d={path}
                    fill="none"
                    stroke={baseColor}
                    strokeWidth={thickness}
                    strokeOpacity={0.6}
                    strokeDasharray={isFeedback ? '6,4' : 'none'}
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
            const isSource = node.id === activeNode;
            const breathScale = getBreathingScale(node.id);
            const glowIntensity = nodeGlows.get(node.id) || 0;

            // Node styling by type
            const isLever = node.type === 'lever';
            const isExogenous = node.type === 'exogenous';
            const isMediatorType = node.type === 'mediator';
            const isOutcome = node.type === 'outcome';

            // Glow filter
            const nodeFilter = isSource ? 'url(#glow-strong)' :
                              (glowIntensity > 0.5 ? 'url(#glow-amber)' : 'none');

            // Fill and stroke based on type
            let fill = 'rgba(0, 0, 0, 0.5)';
            let stroke = '#666';
            let strokeWidth = 1;

            if (isExogenous) {
              stroke = '#888';
              strokeWidth = 1.5;
            } else if (isLever) {
              fill = isActive ? 'rgba(255, 170, 0, 0.2)' : 'rgba(255, 170, 0, 0.08)';
              stroke = isActive ? '#ffaa00' : '#996600';
              strokeWidth = 1.5;
            } else if (isMediatorType) {
              fill = isActive ? 'rgba(0, 212, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)';
              stroke = isActive ? '#00d4ff' : '#555';
            } else if (isOutcome) {
              fill = isActive ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 255, 136, 0.05)';
              stroke = isActive ? '#00ff88' : '#448866';
              strokeWidth = 1.5;
            }

            if (isActive) {
              fill = node.type === 'lever' ? `rgba(255, 170, 0, ${0.15 + glowIntensity * 0.15})` :
                     node.type === 'outcome' ? `rgba(0, 255, 136, ${0.1 + glowIntensity * 0.1})` :
                     `rgba(0, 212, 255, ${0.1 + glowIntensity * 0.1})`;
            }

            // Label color
            let labelColor = '#888';
            if (isActive) {
              labelColor = isLever ? '#ffaa00' : isOutcome ? '#00ff88' : '#00d4ff';
            } else if (isLever) {
              labelColor = '#aa8844';
            } else if (isOutcome) {
              labelColor = '#55aa77';
            }

            return (
              <g
                key={node.id}
                className={`causal-node ${isActive ? 'active' : ''}`}
                transform={`translate(${node.x}, ${node.y}) scale(${breathScale * (1 + glowIntensity * 0.08)})`}
                filter={nodeFilter}
                style={{ transformOrigin: 'center', transition: 'transform 0.15s ease-out' }}
              >
                {/* Node background */}
                <rect
                  x="-26"
                  y="-10"
                  width="52"
                  height="20"
                  rx="3"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isSource ? 2 : strokeWidth}
                />

                {/* Lever indicator bar */}
                {isLever && (
                  <rect
                    x="-22"
                    y="6"
                    width="10"
                    height="2"
                    rx="1"
                    fill={isActive ? '#ffaa00' : '#666'}
                    opacity={0.5}
                  />
                )}

                {/* Exogenous indicator (small dot) */}
                {isExogenous && (
                  <circle
                    cx="-20"
                    cy="0"
                    r="2"
                    fill="none"
                    stroke="#888"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                )}

                {/* Node label */}
                <text
                  className="node-label"
                  fill={labelColor}
                  fontSize="8"
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

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeEdge {
          from { stroke-opacity: 0.6; }
          to { stroke-opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
