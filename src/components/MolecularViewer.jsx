import { useEffect, useRef, useState } from 'react';

// Lysozyme active site residues (catalytic): Glu35, Asp52
const ACTIVE_SITE_RESIDUES = [35, 52];

// Allosteric positions - distant from active site, affect function
// These are representative positions for visualization
const ALLOSTERIC_RESIDUES = [101, 117, 62];

export default function MolecularViewer({ allostericPulse = [false, false], frameIndex = 0 }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Initialize the 3D viewer
  useEffect(() => {
    // Wait for 3Dmol to be available
    const init3Dmol = () => {
      if (typeof window === 'undefined' || !window.$3Dmol) {
        // Retry if 3Dmol isn't loaded yet
        setTimeout(init3Dmol, 100);
        return;
      }

      if (!containerRef.current || viewerRef.current) return;

      try {
        // Create the viewer with transparent background
        const viewer = window.$3Dmol.createViewer(containerRef.current, {
          backgroundColor: 'transparent',
          antialias: true,
        });

        viewerRef.current = viewer;

        // Fetch and load lysozyme structure (1LYZ)
        window.$3Dmol.download('pdb:1LYZ', viewer, {}, function() {
          // Main structure: cartoon in terminal green
          viewer.setStyle({}, {
            cartoon: {
              color: '#00ff88',
              opacity: 0.85,
            }
          });

          // Active site residues: highlighted sticks in white/bright
          viewer.setStyle({ resi: ACTIVE_SITE_RESIDUES }, {
            cartoon: { color: '#00ff88', opacity: 0.85 },
            stick: {
              color: '#ffffff',
              radius: 0.15,
            }
          });

          // Allosteric residues: small spheres that will pulse
          viewer.setStyle({ resi: ALLOSTERIC_RESIDUES }, {
            cartoon: { color: '#00ff88', opacity: 0.85 },
            sphere: {
              color: '#00ffaa',
              radius: 0.6,
              opacity: 0.7,
            }
          });

          // Set initial view
          viewer.zoomTo();
          viewer.rotate(30, 'y');
          viewer.rotate(15, 'x');

          // Start slow continuous rotation
          viewer.spin('y', 0.3);

          viewer.render();
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Failed to initialize 3Dmol viewer:', err);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    init3Dmol();

    // Cleanup
    return () => {
      if (viewerRef.current) {
        viewerRef.current.spin(false);
        viewerRef.current = null;
      }
    };
  }, []);

  // Update allosteric residue opacity based on pulse state
  useEffect(() => {
    if (!viewerRef.current || isLoading) return;

    const viewer = viewerRef.current;

    // Calculate pulse opacity based on allosteric state
    const pulseActive = allostericPulse.some(p => p);
    const opacity = pulseActive ? 0.95 : 0.5;
    const radius = pulseActive ? 0.8 : 0.5;

    try {
      // Update allosteric spheres
      viewer.setStyle({ resi: ALLOSTERIC_RESIDUES }, {
        cartoon: { color: '#00ff88', opacity: 0.85 },
        sphere: {
          color: pulseActive ? '#00ffcc' : '#00ff88',
          radius: radius,
          opacity: opacity,
        }
      });

      // Update active site based on frame for optimization progress
      const optimizationProgress = (frameIndex % 6) / 5;
      const activeSiteColor = optimizationProgress > 0.7 ? '#ffffff' : '#ccffee';

      viewer.setStyle({ resi: ACTIVE_SITE_RESIDUES }, {
        cartoon: { color: '#00ff88', opacity: 0.85 },
        stick: {
          color: activeSiteColor,
          radius: 0.15 + optimizationProgress * 0.05,
        }
      });

      viewer.render();
    } catch (err) {
      // Silently handle render errors during animation
    }
  }, [allostericPulse, frameIndex, isLoading]);

  // Fallback SVG for when 3Dmol fails to load
  const FallbackVisualization = () => (
    <div className="molecular-fallback">
      <svg viewBox="0 0 100 100" className="molecular-fallback-svg">
        {/* Simplified protein silhouette */}
        <path
          d="M30 70 Q20 50 35 35 Q50 20 65 35 Q80 50 70 70 Q60 85 50 80 Q40 85 30 70"
          fill="none"
          stroke="#00ff88"
          strokeWidth="2"
          opacity="0.8"
        />
        {/* Active site marker */}
        <circle cx="50" cy="45" r="4" fill="#ffffff" opacity="0.9" />
        {/* Allosteric markers */}
        <circle cx="35" cy="60" r="3" fill="#00ffaa" opacity="0.7" className="allo-pulse" />
        <circle cx="65" cy="55" r="3" fill="#00ffaa" opacity="0.7" className="allo-pulse" />
        {/* Helix representations */}
        <path d="M40 55 Q45 50 50 55 Q55 60 60 55" fill="none" stroke="#00ff88" strokeWidth="1.5" />
        <path d="M38 65 Q43 60 48 65 Q53 70 58 65" fill="none" stroke="#00ff88" strokeWidth="1.5" />
      </svg>
      <div className="fallback-label">ENZYME STRUCTURE</div>
    </div>
  );

  return (
    <div className="molecular-viewer-container">
      {loadError ? (
        <FallbackVisualization />
      ) : (
        <>
          <div
            ref={containerRef}
            className="molecular-viewer-canvas"
            style={{ opacity: isLoading ? 0 : 1 }}
          />
          {isLoading && (
            <div className="molecular-loading">
              <div className="loading-spinner" />
              <span>Loading structure...</span>
            </div>
          )}
        </>
      )}
      <div className="molecular-labels">
        <div className="label-active-site">
          <span className="label-dot active" />
          <span className="label-text">active site</span>
        </div>
        <div className="label-allosteric">
          <span className={`label-dot allosteric ${allostericPulse.some(p => p) ? 'pulse' : ''}`} />
          <span className="label-text">allosteric</span>
        </div>
      </div>
    </div>
  );
}
