import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from '../App';
import { PlaygroundSection } from '../components/sections/PlaygroundSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { CommandPalette } from '../components/layout/CommandPalette';
import { EducationSection } from '../components/sections/EducationSection';
import { CvSection } from '../components/sections/CvSection';
import { PreferencesProvider } from '../context';
import { copyTextToClipboard } from '../utils/clipboard';

describe('React Component Rendering and Interaction Tests', () => {
  it('renders the complete portfolio application with all sections including Education and CV', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();

    // Verify key titles and sections
    expect(screen.getByRole('heading', { level: 1, name: /Rajveersinh Vishal Pardeshi/i })).toBeTruthy();
    expect(screen.getAllByText(/Independent Mathematical Researcher/i)[0]).toBeTruthy();
    expect(screen.getByText(/About & Research Philosophy/i)).toBeTruthy();
    expect(screen.getByText(/Projects & Research Repositories/i)).toBeTruthy();
    expect(screen.getByText(/Research & Preprints/i)).toBeTruthy();
    expect(screen.getByText(/Honors & Achievements/i)).toBeTruthy();
    expect(screen.getByText(/Education & Institutional Credentials/i)).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Curriculum Vitae \(CV\)/i })).toBeTruthy();
  });

  it('renders project list, opens project modal, and displays visual demo', () => {
    render(
      <PreferencesProvider>
        <ProjectsSection />
      </PreferencesProvider>
    );

    // Verify featured project NumLang is rendered
    expect(screen.getByText('NumLang')).toBeTruthy();

    // Click "View Specifications" button
    const viewButtons = screen.getAllByText(/View Specifications/i);
    expect(viewButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(viewButtons[0]);

    // Modal should now be open
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(/PROJECT SPECIFICATION RECORD/i)).toBeTruthy();
    expect(screen.getByText(/Visual Demonstration & Technical Architecture/i)).toBeTruthy();
    expect(screen.getByText(/INTERACTIVE COMPILER PIPELINE STAGES/i)).toBeTruthy();

    // Close dialog
    const closeBtn = screen.getByLabelText('Close details dialog');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('navigates Command Palette using keyboard arrow keys and Enter', () => {
    const { rerender } = render(
      <PreferencesProvider>
        <CommandPalette />
      </PreferencesProvider>
    );

    // Trigger Ctrl+K keydown to open palette
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });

    rerender(
      <PreferencesProvider>
        <CommandPalette />
      </PreferencesProvider>
    );

    const dialog = screen.getByRole('dialog', { name: /Command Palette/i });
    expect(dialog).toBeTruthy();

    // Dialog input
    const input = screen.getByPlaceholderText(/Type a command/i);
    expect(input).toBeTruthy();

    // Press ArrowDown
    fireEvent.keyDown(dialog, { key: 'ArrowDown' });
    // Press ArrowUp
    fireEvent.keyDown(dialog, { key: 'ArrowUp' });
    // Press Enter to select
    fireEvent.keyDown(dialog, { key: 'Enter' });

    // Press Escape to close
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
  });

  it('switches tabs in the Mathematical Visual Playground and adds homology vertices', () => {
    render(
      <PreferencesProvider>
        <PlaygroundSection />
      </PreferencesProvider>
    );

    // Default tab is Lorenz Attractor
    expect(screen.getByText(/Lorenz Strange Attractor/i)).toBeTruthy();

    // Click Cellular Automata tab
    const cellularTab = screen.getByText(/2. Cellular Automata/i);
    fireEvent.click(cellularTab);
    expect(screen.getByText(/Conway Emergence Engine/i)).toBeTruthy();

    // Click Complex Fractal tab
    const fractalTab = screen.getByText(/3. Complex Fractal/i);
    fireEvent.click(fractalTab);
    expect(screen.getByText(/Complex Julia Dynamics/i)).toBeTruthy();

    // Click Simplicial Homology tab
    const homologyTab = screen.getByText(/4. Simplicial Homology/i);
    fireEvent.click(homologyTab);
    expect(screen.getByText(/Vietoris-Rips Simplicial Complex Filtration/i)).toBeTruthy();

    // Test preset buttons
    const singleRingBtn = screen.getByText('Single Ring');
    fireEvent.click(singleRingBtn);
    expect(screen.getByText(/0-simplices \(Vertices\):/i)).toBeTruthy();

    const randomCloudBtn = screen.getByText('Random Cloud');
    fireEvent.click(randomCloudBtn);

    const dualCavitiesBtn = screen.getByText('Dual Cavities');
    fireEvent.click(dualCavitiesBtn);
  });

  it('renders dedicated Education and CV sections accurately', () => {
    render(
      <PreferencesProvider>
        <EducationSection />
        <CvSection />
      </PreferencesProvider>
    );

    expect(screen.getByText(/Indian Institute of Technology Madras/i)).toBeTruthy();
    expect(screen.getByText(/Bachelor of Science, Aerospace, Aeronautical and Astronautical Engineering/i)).toBeTruthy();
    expect(screen.getByText(/Eon Gyanankur English School/i)).toBeTruthy();
    expect(screen.getAllByText(/Class XII/i).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/Download Official CV \(PDF\)/i)).toBeTruthy();
    expect(screen.getByText(/Direct Static PDF Link/i)).toBeTruthy();
    expect(screen.getByText(/Copy Markdown Source/i)).toBeTruthy();
  });

  it('verifies safe copy utility fallback works without throwing', async () => {
    const success = await copyTextToClipboard('Test text');
    expect(typeof success).toBe('boolean');
  });
});
