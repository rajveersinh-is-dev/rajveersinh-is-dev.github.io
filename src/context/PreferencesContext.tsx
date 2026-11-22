import React, { useEffect, useState } from 'react';
import { PreferencesContext } from './preferences-context';

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visualEffectsEnabled, setVisualEffectsEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('rvp_visual_effects');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  const [readingMode, setReadingModeState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('rvp_reading_mode');
      if (stored !== null) return JSON.parse(stored);
      const theme = localStorage.getItem('rvp_theme');
      if (theme === 'light') return true;
      if (theme === 'dark') return false;
      return false; // Default: Night Study (false = dark mode)
    } catch {
      return false;
    }
  });

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const setVisualEffectsEnabled = (val: boolean) => {
    setVisualEffectsEnabledState(val);
    try {
      localStorage.setItem('rvp_visual_effects', JSON.stringify(val));
    } catch {}
  };

  const toggleVisualEffects = () => {
    setVisualEffectsEnabled(!visualEffectsEnabled);
  };

  const setReadingMode = (val: boolean) => {
    setReadingModeState(val);
    try {
      localStorage.setItem('rvp_reading_mode', JSON.stringify(val));
      localStorage.setItem('rvp_theme', val ? 'light' : 'dark');
    } catch {}
  };

  const toggleReadingMode = () => {
    setReadingMode(!readingMode);
  };

  const toggleCommandPalette = () => {
    setCommandPaletteOpen((prev) => !prev);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen]);

  // Sync reading mode and dark mode classes to html document
  useEffect(() => {
    if (readingMode) {
      document.documentElement.classList.add('reading-mode');
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('rvp_theme', 'light');
      } catch {}
    } else {
      document.documentElement.classList.remove('reading-mode');
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('rvp_theme', 'dark');
      } catch {}
    }
  }, [readingMode]);

  return (
    <PreferencesContext.Provider
      value={{
        visualEffectsEnabled,
        setVisualEffectsEnabled,
        toggleVisualEffects,
        readingMode,
        setReadingMode,
        toggleReadingMode,
        commandPaletteOpen,
        setCommandPaletteOpen,
        toggleCommandPalette,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
