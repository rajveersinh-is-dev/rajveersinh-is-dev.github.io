import React, { useEffect, useState, useCallback } from 'react';
import { PreferencesContext, type ThemeMode } from './preferences-context';
import { audioService } from '../utils/audioFeedback';

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const storedTheme = localStorage.getItem('rvp_theme');
      if (storedTheme === 'amber-crt') return 'amber-crt';
      if (storedTheme === 'light') return 'paper';
      if (storedTheme === 'dark') return 'night';
      const storedReading = localStorage.getItem('rvp_reading_mode');
      if (storedReading !== null && JSON.parse(storedReading) === true) return 'paper';
      return 'night';
    } catch {
      return 'night';
    }
  });

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
      const storedTheme = localStorage.getItem('rvp_theme');
      if (storedTheme === 'amber-crt') return false;
      const stored = localStorage.getItem('rvp_reading_mode');
      if (stored !== null) return JSON.parse(stored);
      if (storedTheme === 'light') return true;
      if (storedTheme === 'dark') return false;
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

  const applyTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    const isPaper = newTheme === 'paper';
    setReadingModeState(isPaper);
    try {
      localStorage.setItem('rvp_reading_mode', JSON.stringify(isPaper));
      if (newTheme === 'amber-crt') {
        localStorage.setItem('rvp_theme', 'amber-crt');
      } else if (newTheme === 'paper') {
        localStorage.setItem('rvp_theme', 'light');
      } else {
        localStorage.setItem('rvp_theme', 'dark');
      }
    } catch {}
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    applyTheme(newTheme);
  }, [applyTheme]);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      let next: ThemeMode = 'night';
      if (current === 'night') next = 'paper';
      else if (current === 'paper') next = 'amber-crt';
      else next = 'night';

      const isPaper = next === 'paper';
      setReadingModeState(isPaper);
      try {
        localStorage.setItem('rvp_reading_mode', JSON.stringify(isPaper));
        if (next === 'amber-crt') {
          localStorage.setItem('rvp_theme', 'amber-crt');
        } else if (next === 'paper') {
          localStorage.setItem('rvp_theme', 'light');
        } else {
          localStorage.setItem('rvp_theme', 'dark');
        }
      } catch {}
      return next;
    });
    if (soundEnabled) audioService.playClick(1020);
  }, [soundEnabled]);

  const setReadingMode = (val: boolean) => {
    const nextTheme: ThemeMode = val ? 'paper' : 'night';
    applyTheme(nextTheme);
  };

  const toggleReadingMode = () => {
    const nextTheme: ThemeMode = theme === 'paper' ? 'night' : 'paper';
    applyTheme(nextTheme);
    if (soundEnabled) audioService.playToggle(nextTheme === 'paper');
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

  // Sync theme and reading mode classes to html document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'paper') {
      root.classList.add('reading-mode');
      root.classList.remove('dark', 'amber-crt');
    } else if (theme === 'amber-crt') {
      root.classList.add('amber-crt', 'dark');
      root.classList.remove('reading-mode');
    } else {
      root.classList.add('dark');
      root.classList.remove('reading-mode', 'amber-crt');
    }
  }, [theme]);

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        setTheme,
        cycleTheme,
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
