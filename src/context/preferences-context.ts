import { createContext } from 'react';

export interface PreferencesContextType {
  visualEffectsEnabled: boolean;
  setVisualEffectsEnabled: (enabled: boolean) => void;
  toggleVisualEffects: () => void;
  readingMode: boolean;
  setReadingMode: (enabled: boolean) => void;
  toggleReadingMode: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  terminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  toggleTerminal: () => void;
  playClick: (pitch?: number) => void;
  playToggle: (active: boolean) => void;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);
