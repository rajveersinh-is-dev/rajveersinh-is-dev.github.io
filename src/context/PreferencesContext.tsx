import React, { useEffect, useState, useCallback } from 'react';
import { PreferencesContext } from './preferences-context';
import { audioService } from '../utils/audioFeedback';

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

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('rvp_audio_feedback');
      return stored !== null ? JSON.parse(stored) : true; // Default sound enabled
    } catch {
      return true;
    }
  });

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Sync audio service mute state
  useEffect(() => {
    audioService.setMuted(!soundEnabled);
  }, [soundEnabled]);

  const setVisualEffectsEnabled = (val: boolean) => {
    setVisualEffectsEnabledState(val);
    try {
      localStorage.setItem('rvp_visual_effects', JSON.stringify(val));
    } catch {}
  };

  const toggleVisualEffects = () => {
    setVisualEffectsEnabled(!visualEffectsEnabled);
    if (soundEnabled) audioService.playToggle(!visualEffectsEnabled);
  };

  const setReadingMode = (val: boolean) => {
    setReadingModeState(val);
    try {
      localStorage.setItem('rvp_reading_mode', JSON.stringify(val));
      localStorage.setItem('rvp_theme', val ? 'light' : 'dark');
    } catch {}
  };

  const toggleReadingMode = () => {
    const next = !readingMode;
    setReadingMode(next);
    if (soundEnabled) audioService.playToggle(next);
  };

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    try {
      localStorage.setItem('rvp_audio_feedback', JSON.stringify(val));
    } catch {}
    audioService.setMuted(!val);
    if (val) audioService.playClick(920);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const toggleCommandPalette = () => {
    if (soundEnabled) audioService.playClick(780);
    setCommandPaletteOpen((prev) => !prev);
  };

  const toggleTerminal = () => {
    if (soundEnabled) audioService.playClick(880);
    setTerminalOpen((prev) => !prev);
  };

  const playClick = useCallback((pitch?: number) => {
    if (soundEnabled) audioService.playClick(pitch);
  }, [soundEnabled]);

  const playToggle = useCallback((active: boolean) => {
    if (soundEnabled) audioService.playToggle(active);
  }, [soundEnabled]);

  // Global Keyboard shortcuts: Ctrl+K (Concordance), Backtick or Ctrl+\ (Terminal), Esc (Close dialogs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable);

      // Backtick (`) or Ctrl+\ for Terminal REPL (when not typing in an input field)
      if ((e.key === '`' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) ||
          ((e.ctrlKey || e.metaKey) && e.key === '\\')) {
        e.preventDefault();
        if (soundEnabled) audioService.playClick(880);
        setTerminalOpen((prev) => !prev);
        return;
      }

      // Ctrl+K / Cmd+K for Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (soundEnabled) audioService.playClick(780);
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Escape to close open overlays
      if (e.key === 'Escape') {
        if (terminalOpen) {
          setTerminalOpen(false);
        } else if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, terminalOpen, soundEnabled]);

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
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        terminalOpen,
        setTerminalOpen,
        toggleTerminal,
        playClick,
        playToggle,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
