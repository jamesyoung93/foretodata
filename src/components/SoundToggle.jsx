import { useState, useEffect } from 'react';
import { initSound, toggleSound, isEnabled } from '../utils/soundManager.js';

// Sound Toggle component - allows users to enable/disable retro terminal sounds
// Default: OFF (sounds are opt-in)
export default function SoundToggle({ compact = false }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Initialize sound manager and load preference
    initSound();
    setEnabled(isEnabled());
  }, []);

  const handleToggle = () => {
    const newState = toggleSound();
    setEnabled(newState);
  };

  // Compact version for footer
  if (compact) {
    return (
      <button
        className="sound-toggle"
        onClick={handleToggle}
        aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
        title={enabled ? 'Mute sounds' : 'Enable retro terminal sounds'}
      >
        {enabled ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    );
  }

  // Full version with prompt for top of sidebar
  return (
    <div className="audio-opt-in">
      <button
        className={`audio-opt-in-btn ${enabled ? 'enabled' : ''}`}
        onClick={handleToggle}
        aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
      >
        <span className="audio-icon">
          {enabled ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          )}
        </span>
        <span className="audio-text">
          {enabled ? 'Audio on' : 'Enable terminal sounds'}
        </span>
      </button>
    </div>
  );
}
