import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from '../components/sections/HeroSection';
import { PreferencesProvider } from '../context';

describe('HeroSection Interactive Name Letters & Newton Apple Easter Egg', () => {
  it('renders headline with hyperbolic sine reflection Rajveersin(h) and per-letter interactive elements', () => {
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

    // Hyperbolic sine reflection (h) exists in the headline
    expect(screen.getAllByTitle(/Hyperbolic sine/i).length).toBeGreaterThanOrEqual(1);
  });

  it('changes letter to orange when clicked and displays illumination counter', () => {
    render(
      <PreferencesProvider>
        <HeroSection />
      </PreferencesProvider>
    );

    const rLetter = screen.getAllByTitle(/Click to illuminate "R" orange/i)[0];
    expect(rLetter.className).not.toContain('text-orange-500');

    // Click to illuminate
    fireEvent.click(rLetter);
    expect(rLetter.className).toContain('text-orange-500');

    // Illumination counter appears
    expect(screen.getByText(/1 of 27 letters illuminated/i)).toBeTruthy();

    // Reset button clears illuminated letters
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

    const rLetter = screen.getAllByTitle(/Click to illuminate "R" orange/i)[0];
    fireEvent.click(rLetter);

    const allOrangeBtn = screen.getByRole('button', { name: /All Orange/i });
    fireEvent.click(allOrangeBtn);

    expect(screen.getByText(/27 of 27 letters illuminated/i)).toBeTruthy();
  });

  it('triggers Newton Apple Free Body Diagram easter egg when clicking "A" multiple times', () => {
    render(
      <PreferencesProvider>
        <HeroSection />
      </PreferencesProvider>
    );

    // Find the 'A' letter with the easter egg trigger
    const aLetter = screen.getByTitle(/click 3x for Newton's apple/i);
    expect(aLetter).toBeTruthy();

    // Click 3 times rapidly
    fireEvent.click(aLetter);
    fireEvent.click(aLetter);
    fireEvent.click(aLetter);

    // Apple Free Body Diagram physics container is mounted
    const appleContainer = screen.getByLabelText(/Newton's Apple Free Body Diagram/i);
    expect(appleContainer).toBeTruthy();

    // Verify Free Body Diagram annotations are present
    expect(screen.getAllByText(/Fg = mg/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/FBD • m = 0.150 kg/i)).toBeTruthy();
  });
});
