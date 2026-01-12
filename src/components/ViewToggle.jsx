import { useState, useEffect } from 'react';

// ViewToggle component - switches between Terminal (dark) and Classic (light ggplot2-style) themes
export default function ViewToggle() {
  const [view, setView] = useState('terminal');

  // Load saved preference on mount
  useEffect(() => {
    const savedView = localStorage.getItem('siteView');
    if (savedView === 'classic') {
      setView('classic');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('classic');
    }
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem('siteView', newView);

    if (newView === 'classic') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('classic');
    } else {
      document.documentElement.classList.remove('classic');
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className="view-toggle-container">
      <span className="view-toggle-label">View</span>
      <div className="view-toggle-group">
        <button
          className={`view-toggle-btn ${view === 'terminal' ? 'active' : ''}`}
          onClick={() => handleViewChange('terminal')}
          aria-pressed={view === 'terminal'}
        >
          Terminal
        </button>
        <button
          className={`view-toggle-btn ${view === 'classic' ? 'active' : ''}`}
          onClick={() => handleViewChange('classic')}
          aria-pressed={view === 'classic'}
        >
          Classic
        </button>
      </div>
    </div>
  );
}
