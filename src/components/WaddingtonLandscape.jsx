import { useEffect, useRef, useState } from 'react';

// ============================================================================
// WADDINGTON EPIGENETIC LANDSCAPE VISUALIZATION
// ============================================================================
// 3D terrain visualization showing cell fate decisions as valleys (attractors)
// in an epigenetic landscape. A ball (cell) rolls down the landscape, settling
// into different valleys based on stochastic signals.
//
// Valley positions (in normalized terrain coordinates):
// - STEM (center-back): pluripotent state
// - PRODUCER (front-left): high productivity fate
// - SURVIVAL (front-right): stress-adapted fate
// - SENESCENT (far-right): aged/exhausted fate

// Valley definitions with positions and characteristics
const VALLEYS = [
  { id: 'STEM', label: 'STEM', x: 0, z: -0.3, depth: 0.8, color: '#ffffff' },
  { id: 'PRODUCER', label: 'PRODUCER', x: -0.5, z: 0.5, depth: 1.2, color: '#00ff88' },
  { id: 'SURVIVAL', label: 'SURVIVAL', x: 0.5, z: 0.4, depth: 0.9, color: '#ff6b9d' },
  { id: 'SENESCENT', label: 'SENESCENT', x: 0.8, z: 0.6, depth: 0.6, color: '#ffaa00' },
];

// Cell fate cycle matching the regulatory frames
const FATE_CYCLE = [
  { fate: 'PRODUCER', frames: [0, 1, 2] },      // Optimal/Producer state
  { fate: 'STEM', frames: [3, 4, 5] },          // Transition through stem
  { fate: 'SURVIVAL', frames: [6, 7, 8] },      // Survival state
  { fate: 'PRODUCER', frames: [9, 10, 11] },    // Transition back to producer
];

// Simple noise function for organic terrain
function noise2D(x, z, seed = 0) {
  const n = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

// Fractal noise for terrain detail
function fractalNoise(x, z, octaves = 4) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * (noise2D(x * frequency, z * frequency) - 0.5);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
}

// Calculate terrain height at a point
function getTerrainHeight(x, z) {
  // Base terrain with gentle hills
  let height = 0.5 + fractalNoise(x * 2, z * 2, 3) * 0.3;

  // Add valleys (Gaussian wells)
  VALLEYS.forEach(valley => {
    const dx = x - valley.x;
    const dz = z - valley.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const valleyRadius = 0.35;

    // Gaussian valley shape
    const depression = valley.depth * Math.exp(-(dist * dist) / (2 * valleyRadius * valleyRadius));
    height -= depression * 0.5;
  });

  // Add ridges between valleys
  const ridgeNoise = fractalNoise(x * 4 + 10, z * 4 + 10, 2);
  height += Math.abs(ridgeNoise) * 0.15;

  return height;
}

// Get gradient at a point (for ball physics)
function getTerrainGradient(x, z) {
  const epsilon = 0.05;
  const hCenter = getTerrainHeight(x, z);
  const hRight = getTerrainHeight(x + epsilon, z);
  const hForward = getTerrainHeight(x, z + epsilon);

  return {
    x: (hRight - hCenter) / epsilon,
    z: (hForward - hCenter) / epsilon
  };
}

export default function WaddingtonLandscape({ frameIndex = 0 }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const ballRef = useRef(null);
  const trailRef = useRef([]);
  const targetPositionRef = useRef({ x: 0, z: -0.3 });
  const velocityRef = useRef({ x: 0, z: 0 });
  const [currentValley, setCurrentValley] = useState('STEM');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    const initThreeJS = () => {
      if (typeof window === 'undefined' || !window.THREE) {
        setTimeout(initThreeJS, 100);
        return;
      }

      if (!containerRef.current || sceneRef.current) return;

      try {
        const THREE = window.THREE;
        const container = containerRef.current;
        const width = 280;
        const height = 180;

        // Create scene
        const scene = new THREE.Scene();

        // Create camera with isometric-like view
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(2.5, 2.8, 2.5);
        camera.lookAt(0, 0, 0);

        // Create renderer with transparent background
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create terrain geometry
        const terrainSize = 2.5;
        const segments = 60;
        const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);

        // Modify vertices to create landscape
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i] / (terrainSize / 2);
          const z = positions[i + 1] / (terrainSize / 2);
          positions[i + 2] = getTerrainHeight(x, z);
        }
        geometry.computeVertexNormals();

        // Create wireframe material (cyan terminal aesthetic)
        const terrainMaterial = new THREE.MeshBasicMaterial({
          color: 0x00d4ff,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });

        const terrain = new THREE.Mesh(geometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 2;
        scene.add(terrain);

        // Create subtle solid surface beneath wireframe for depth
        const solidMaterial = new THREE.MeshBasicMaterial({
          color: 0x001820,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        });
        const solidTerrain = new THREE.Mesh(geometry.clone(), solidMaterial);
        solidTerrain.rotation.x = -Math.PI / 2;
        solidTerrain.position.y = -0.01;
        scene.add(solidTerrain);

        // Create the "cell" ball
        const ballGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const ballMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.95,
        });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);

        // Create glow effect for ball
        const glowGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.3,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        ball.add(glow);

        // Position ball at starting valley
        const startHeight = getTerrainHeight(0, -0.3);
        ball.position.set(0, startHeight + 0.1, -0.3 * (terrainSize / 2));
        scene.add(ball);
        ballRef.current = ball;

        // Create trail geometry
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.4,
        });
        const trailLine = new THREE.Line(trailGeometry, trailMaterial);
        scene.add(trailLine);
        trailRef.current = { line: trailLine, points: [] };

        // Add valley labels as sprites
        VALLEYS.forEach(valley => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 128;
          canvas.height = 32;

          ctx.fillStyle = valley.color;
          ctx.font = 'bold 14px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(valley.label, 64, 20);

          const texture = new THREE.CanvasTexture(canvas);
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.7,
          });
          const sprite = new THREE.Sprite(spriteMaterial);

          const labelHeight = getTerrainHeight(valley.x, valley.z) - 0.15;
          sprite.position.set(
            valley.x * (terrainSize / 2),
            labelHeight,
            valley.z * (terrainSize / 2)
          );
          sprite.scale.set(0.5, 0.125, 1);
          scene.add(sprite);
        });

        // Store references
        sceneRef.current = { scene, camera, renderer, terrain, terrainSize };
        setIsLoading(false);

        // Animation loop
        let rotationAngle = 0;
        const animate = () => {
          if (!sceneRef.current) return;

          // Slow camera rotation
          rotationAngle += 0.002;
          const radius = 3.5;
          camera.position.x = Math.cos(rotationAngle) * radius;
          camera.position.z = Math.sin(rotationAngle) * radius;
          camera.position.y = 2.8;
          camera.lookAt(0, 0, 0);

          // Update ball physics
          if (ballRef.current) {
            const ball = ballRef.current;
            const terrainSize = sceneRef.current.terrainSize;

            // Get current position in normalized coordinates
            const normX = ball.position.x / (terrainSize / 2);
            const normZ = ball.position.z / (terrainSize / 2);

            // Get target from ref
            const target = targetPositionRef.current;
            const velocity = velocityRef.current;

            // Calculate force toward target valley
            const dx = target.x - normX;
            const dz = target.z - normZ;
            const dist = Math.sqrt(dx * dx + dz * dz);

            // Apply force with some damping
            const force = 0.002;
            const damping = 0.92;

            if (dist > 0.05) {
              velocity.x += (dx / dist) * force;
              velocity.z += (dz / dist) * force;
            }

            // Add terrain gradient influence
            const gradient = getTerrainGradient(normX, normZ);
            velocity.x -= gradient.x * 0.001;
            velocity.z -= gradient.z * 0.001;

            // Apply damping
            velocity.x *= damping;
            velocity.z *= damping;

            // Update position
            const newNormX = normX + velocity.x;
            const newNormZ = normZ + velocity.z;

            // Clamp to terrain bounds
            const clampedX = Math.max(-0.9, Math.min(0.9, newNormX));
            const clampedZ = Math.max(-0.9, Math.min(0.9, newNormZ));

            const newHeight = getTerrainHeight(clampedX, clampedZ);

            ball.position.x = clampedX * (terrainSize / 2);
            ball.position.z = clampedZ * (terrainSize / 2);
            ball.position.y = newHeight + 0.1;

            // Update trail
            const trail = trailRef.current;
            trail.points.push(ball.position.clone());
            if (trail.points.length > 50) {
              trail.points.shift();
            }

            if (trail.points.length > 1) {
              const positions = new Float32Array(trail.points.length * 3);
              trail.points.forEach((p, i) => {
                positions[i * 3] = p.x;
                positions[i * 3 + 1] = p.y;
                positions[i * 3 + 2] = p.z;
              });
              trail.line.geometry.setAttribute('position',
                new THREE.BufferAttribute(positions, 3));
              trail.line.geometry.attributes.position.needsUpdate = true;
            }
          }

          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };
        animate();

      } catch (err) {
        console.error('Failed to initialize Three.js:', err);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    initThreeJS();

    return () => {
      if (sceneRef.current) {
        const { renderer } = sceneRef.current;
        if (renderer && renderer.domElement && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        renderer?.dispose();
        sceneRef.current = null;
        ballRef.current = null;
      }
    };
  }, []);

  // Update target valley based on frame
  useEffect(() => {
    // Determine current fate from frame index
    let currentFate = 'STEM';
    for (const cycle of FATE_CYCLE) {
      if (cycle.frames.includes(frameIndex % 12)) {
        currentFate = cycle.fate;
        break;
      }
    }

    // Find target valley
    const targetValley = VALLEYS.find(v => v.id === currentFate) || VALLEYS[0];

    // Update target position
    targetPositionRef.current = { x: targetValley.x, z: targetValley.z };
    setCurrentValley(currentFate);

    // Add some perturbation when switching states
    if (velocityRef.current) {
      velocityRef.current.x += (Math.random() - 0.5) * 0.02;
      velocityRef.current.z += (Math.random() - 0.5) * 0.02;
    }
  }, [frameIndex]);

  // Fallback visualization
  const FallbackVisualization = () => (
    <div className="waddington-fallback">
      <svg viewBox="0 0 100 80" className="waddington-fallback-svg">
        {/* Simple landscape silhouette */}
        <path
          d="M0 60 Q15 50 25 55 Q35 35 50 40 Q65 30 75 45 Q85 50 100 55 L100 80 L0 80 Z"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Ball */}
        <circle cx="50" cy="38" r="4" fill="#ffffff" opacity="0.9">
          <animate attributeName="cx" values="50;30;70;50" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cy" values="38;52;43;38" dur="4s" repeatCount="indefinite" />
        </circle>
        {/* Valley labels */}
        <text x="25" y="70" fill="#00ff88" fontSize="6" textAnchor="middle">PRODUCER</text>
        <text x="75" y="70" fill="#ff6b9d" fontSize="6" textAnchor="middle">SURVIVAL</text>
      </svg>
      <div className="fallback-label">EPIGENETIC LANDSCAPE</div>
    </div>
  );

  return (
    <div className="waddington-viewer-container">
      {loadError ? (
        <FallbackVisualization />
      ) : (
        <>
          <div
            ref={containerRef}
            className="waddington-viewer-canvas"
            style={{ opacity: isLoading ? 0 : 1 }}
          />
          {isLoading && (
            <div className="waddington-loading">
              <div className="loading-spinner" />
              <span>Loading landscape...</span>
            </div>
          )}
        </>
      )}
      <div className="waddington-labels">
        <div className="waddington-fate-indicator">
          <span className={`fate-dot ${currentValley.toLowerCase()}`} />
          <span className="fate-text">current fate</span>
        </div>
      </div>
    </div>
  );
}
