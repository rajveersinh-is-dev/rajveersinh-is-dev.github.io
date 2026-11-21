import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { PlaygroundSection } from '../components/sections/PlaygroundSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { PreferencesProvider } from '../context';

describe('React Component Rendering and Interaction Tests', () => {
  it('renders the complete portfolio application without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();

    // Verify key titles and sections
    expect(screen.getByRole('heading', { level: 1, name: /Rajveersinh Vishal Pardeshi/i })).toBeTruthy();
    expect(screen.getAllByText(/Independent Mathematical Researcher/i)[0]).toBeTruthy();
    expect(screen.getByText(/About & Research Philosophy/i)).toBeTruthy();
    expect(screen.getByText(/Projects & Research Repositories/i)).toBeTruthy();
    expect(screen.getByText(/Research & Preprints/i)).toBeTruthy();
    expect(screen.getByText(/Honors & Achievements/i)).toBeTruthy();
  });

  it('renders project list and opens project specification modal', () => {
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
    expect(screen.getByText(/SPECIFICATION RECORD/i)).toBeTruthy();

    // Close dialog
    const closeBtn = screen.getByLabelText('Close details dialog');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('switches tabs in the Mathematical Visual Playground', () => {
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
  });
});
