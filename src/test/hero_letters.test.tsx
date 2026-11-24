import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from '../components/sections/HeroSection';
import { PreferencesProvider } from '../context';

describe('HeroSection Interactive Name Letters', () => {
  it('renders headline with accessible author name and per-letter interactive elements', () => {
    render(
      <PreferencesProvider>
        <HeroSection />
      </PreferencesProvider>
    );

    // Accessible h1 heading exists
    const h1 = screen.getByRole('heading', { level: 1, name: /Rajveersinh Vishal Pardeshi/i });
    expect(h1).toBeTruthy();

    // Check individual letters exist with hover pop-out classes
    const rLetters = screen.getAllByTitle(/Click to illuminate "R" orange/i);
    expect(rLetters.length).toBeGreaterThanOrEqual(1);
    expect(rLetters[0].className).toContain('hover:-translate-y-2.5');
    expect(rLetters[0].className).toContain('hover:scale-');
  });

  it('changes letter to orange when clicked and displays illumination counter', () => {
    render(
      <PreferencesProvider>
        <HeroSection />
      </PreferencesProvider>
    );

    const rLetter = screen.getAllByTitle(/Click to illuminate "R" orange/i)[0];
    // Initially not orange
    expect(rLetter.className).not.toContain('text-orange-500');

    // Click to illuminate
    fireEvent.click(rLetter);

    // Letter turns orange
    expect(rLetter.className).toContain('text-orange-500');

    // Illumination counter appears
    expect(screen.getByText(/1 of 25 letters illuminated/i)).toBeTruthy();

    // Reset button exists and clicking it clears illuminated letters
    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetBtn);

    expect(rLetter.className).not.toContain('text-orange-500');
    expect(screen.queryByText(/illuminated/i)).toBeNull();
  });

  it('illuminates all letters when clicking [All Orange ⚡]', () => {
    render(
      <PreferencesProvider>
        <HeroSection />
      </PreferencesProvider>
    );

    // Click one letter first to show controls
    const rLetter = screen.getAllByTitle(/Click to illuminate "R" orange/i)[0];
    fireEvent.click(rLetter);

    const allOrangeBtn = screen.getByRole('button', { name: /All Orange/i });
    fireEvent.click(allOrangeBtn);

    expect(screen.getByText(/25 of 25 letters illuminated/i)).toBeTruthy();
  });
});
