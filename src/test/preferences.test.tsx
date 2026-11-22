import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { PreferencesProvider, usePreferences } from '../context';

const TestPreferencesConsumer = () => {
  const {
    readingMode,
    toggleReadingMode,
    visualEffectsEnabled,
    toggleVisualEffects,
    commandPaletteOpen,
    toggleCommandPalette,
  } = usePreferences();

  return (
    <div>
      <span data-testid="reading-mode-val">{String(readingMode)}</span>
      <span data-testid="visuals-val">{String(visualEffectsEnabled)}</span>
      <span data-testid="palette-val">{String(commandPaletteOpen)}</span>
      <button onClick={toggleReadingMode}>Toggle Reading</button>
      <button onClick={toggleVisualEffects}>Toggle Visuals</button>
      <button onClick={toggleCommandPalette}>Toggle Palette</button>
    </div>
  );
};

describe('Preferences Context & Reading Mode Dual Palette Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    cleanup();
  });

  it('initializes to Night Study dark mode by default without stark white screens', () => {
    render(
      <PreferencesProvider>
        <TestPreferencesConsumer />
      </PreferencesProvider>
    );

    expect(screen.getByTestId('reading-mode-val').textContent).toBe('false');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('reading-mode')).toBe(false);
  });

  it('switches between Night Study and Archival Paper reading mode and synchronizes document classes', () => {
    render(
      <PreferencesProvider>
        <TestPreferencesConsumer />
      </PreferencesProvider>
    );

    const toggleBtn = screen.getByText('Toggle Reading');

    // Switch to Archival Paper reading mode
    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.getByTestId('reading-mode-val').textContent).toBe('true');
    expect(document.documentElement.classList.contains('reading-mode')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('rvp_reading_mode')).toBe('true');
    expect(localStorage.getItem('rvp_theme')).toBe('light');

    // Switch back to Night Study
    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.getByTestId('reading-mode-val').textContent).toBe('false');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('reading-mode')).toBe(false);
    expect(localStorage.getItem('rvp_reading_mode')).toBe('false');
    expect(localStorage.getItem('rvp_theme')).toBe('dark');
  });

  it('toggles visual dynamics state accurately', () => {
    render(
      <PreferencesProvider>
        <TestPreferencesConsumer />
      </PreferencesProvider>
    );

    const toggleBtn = screen.getByText('Toggle Visuals');
    expect(screen.getByTestId('visuals-val').textContent).toBe('true');

    act(() => {
      fireEvent.click(toggleBtn);
    });
    expect(screen.getByTestId('visuals-val').textContent).toBe('false');
    expect(localStorage.getItem('rvp_visual_effects')).toBe('false');
  });
});
