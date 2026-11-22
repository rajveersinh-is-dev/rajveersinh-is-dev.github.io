import { useContext } from 'react';
import { PreferencesContext, type PreferencesContextType } from './preferences-context';

const defaultPreferences: PreferencesContextType = {
  theme: 'night',
  setTheme: () => {},
  cycleTheme: () => {},
  visualEffectsEnabled: true,
  setVisualEffectsEnabled: () => {},
  toggleVisualEffects: () => {},
  readingMode: false,
  setReadingMode: () => {},
  toggleReadingMode: () => {},
  commandPaletteOpen: false,
  setCommandPaletteOpen: () => {},
  toggleCommandPalette: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
  toggleSound: () => {},
  terminalOpen: false,
  setTerminalOpen: () => {},
  toggleTerminal: () => {},
  playClick: () => {},
  playToggle: () => {},
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (!context) {
    return defaultPreferences;
  }
  return context;
};
