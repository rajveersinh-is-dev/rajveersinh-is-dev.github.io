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
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);
