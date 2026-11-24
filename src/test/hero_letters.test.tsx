import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from '../components/sections/HeroSection';
import { PreferencesProvider } from '../context';

describe('HeroSection Interactive Name Letters & Newton Apple Easter Egg', () => {
  it('renders headline with hyperbolic sine reflection Rajveersin(h) where (h) is pre-highlighted in orange', () => {
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

    // Hyperbolic sine reflection (h) exists in the headline and is pre-highlighted in orange
    const hyperbolicLetters = screen.getAllByTitle(/Hyperbolic sine reflection/i);
    expect(hyperbolicLetters.length).toBe(3); // '(', 'h', ')'
    hyperbolicLetters.forEach((el) => {
      expect(el.className).toContain('text-orange-500');
    });

    // Verify counter and buttons are NOT present in the clean editorial UI
    expect(screen.queryByText(/letters illuminated/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /Reset/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /All Orange/i })).toBeNull();
  });

  it('changes unhighlighted letter to orange when clicked with audio feedback and no counter clutter', () => {
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

    // No counter or reset button clutter appears
    expect(screen.queryByText(/letters illuminated/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /Reset/i })).toBeNull();
  });

  it('triggers Newton Apple Free Body Diagram easter egg and dismisses via close button', () => {
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

    // Close button works cleanly without dragging
    const closeBtn = screen.getByRole('button', { name: /Close Easter egg/i });
    expect(closeBtn).toBeTruthy();

    fireEvent.click(closeBtn);

    // Apple container dismissed
    expect(screen.queryByLabelText(/Newton's Apple Free Body Diagram/i)).toBeNull();
  });

  it('dismisses Newton Apple simulation when pressing Escape key', () => {
    render(
      <PreferencesProvider>
        <HeroSection />
      </PreferencesProvider>
    );

    const aLetter = screen.getByTitle(/click 3x for Newton's apple/i);
    fireEvent.click(aLetter);
    fireEvent.click(aLetter);
    fireEvent.click(aLetter);

    expect(screen.getByLabelText(/Newton's Apple Free Body Diagram/i)).toBeTruthy();

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByLabelText(/Newton's Apple Free Body Diagram/i)).toBeNull();
  });
});
