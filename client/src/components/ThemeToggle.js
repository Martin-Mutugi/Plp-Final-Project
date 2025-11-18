import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeConfig = {
    light: { name: 'Light', icon: '☀️', color: 'from-amber-400 to-orange-500' },
    dark: { name: 'Dark', icon: '🌙', color: 'from-indigo-900 to-purple-900' },
    green: { name: 'Nature', icon: '🌿', color: 'from-emerald-500 to-green-600' },
    blue: { name: 'Ocean', icon: '🌊', color: 'from-blue-500 to-cyan-600' }
  };

  return (
    <div className="theme-toggle-container">
      <button
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
      >
        <span className="theme-icon">
          {themeConfig[theme].icon}
        </span>
        <span className="theme-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <span>Choose Theme</span>
          </div>
          <div className="theme-options">
            {themes.map((themeOption) => (
              <button
                key={themeOption}
                className={`theme-option ${theme === themeOption ? 'active' : ''}`}
                onClick={() => {
                  toggleTheme(themeOption);
                  setIsOpen(false);
                }}
              >
                <div className="theme-preview">
                  <div className={`theme-preview-circle bg-gradient-to-r ${themeConfig[themeOption].color}`}>
                    {themeConfig[themeOption].icon}
                  </div>
                </div>
                <div className="theme-info">
                  <span className="theme-name">{themeConfig[themeOption].name}</span>
                  {theme === themeOption && (
                    <span className="theme-active">Active</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="theme-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle;