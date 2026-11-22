import { createContext } from 'react';

export type ThemeMode = 'night' | 'paper' | 'amber-crt';

export interface PreferencesContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
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
