import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from '../App';
import { PlaygroundSection } from '../components/sections/PlaygroundSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { CommandPalette } from '../components/layout/CommandPalette';
import { EducationSection } from '../components/sections/EducationSection';
import { CvSection } from '../components/sections/CvSection';
import { PreprintsSection } from '../components/sections/PreprintsSection';
import { SkillsLandscapeSection } from '../components/sections/SkillsLandscapeSection';
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

  it('verifies React Portal architecture and viewport centering for project modal', () => {
    render(
      <PreferencesProvider>
        <ProjectsSection />
      </PreferencesProvider>
    );

    // Open project modal
    const viewButtons = screen.getAllByText(/View Specifications/i);
    fireEvent.click(viewButtons[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();

    // Verify it is mounted directly into document.body to break out of containing blocks
    expect(dialog.parentElement).toBe(document.body);

    // Verify viewport centering and sizing classes
    expect(dialog.className).toContain('fixed');
    expect(dialog.className).toContain('inset-0');
    expect(dialog.className).toContain('items-center');
    expect(dialog.className).toContain('justify-center');
    expect(dialog.className).toContain('overflow-y-auto');

    // Verify inner card sizing
    const innerCard = dialog.firstElementChild as HTMLElement;
    expect(innerCard).toBeTruthy();
    expect(innerCard.className).toContain('max-w-4xl');
    expect(innerCard.className).toContain('w-full');
    expect(innerCard.className).toContain('my-auto');

    // Test backdrop click closes modal
    fireEvent.click(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens project modal by clicking project title and handles Escape key', () => {
    render(
      <PreferencesProvider>
        <ProjectsSection />
      </PreferencesProvider>
    );

    // Click on NumLang title
    const numlangTitle = screen.getByRole('heading', { level: 3, name: /NumLang/i });
    fireEvent.click(numlangTitle);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.parentElement).toBe(document.body);

    // Press Escape to close
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens project modal for additional treatises and verifies portal mounting', () => {
    render(
      <PreferencesProvider>
        <ProjectsSection />
      </PreferencesProvider>
    );

    // Find Details button on additional treatises
    const detailsButtons = screen.getAllByText(/Details/i);
    expect(detailsButtons.length).toBeGreaterThan(0);
    fireEvent.click(detailsButtons[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.parentElement).toBe(document.body);

    // Close
    const closeBtn = screen.getByLabelText('Close details dialog');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens project modal by clicking anywhere on the card container or via keyboard', () => {
    render(
      <PreferencesProvider>
        <ProjectsSection />
      </PreferencesProvider>
    );

    // Find the card container for NumLang
    const numlangCard = screen.getByLabelText('View specifications for NumLang');
    expect(numlangCard).toBeTruthy();
    expect(numlangCard.getAttribute('tabIndex')).toBe('0');

    // Click card container directly
    fireEvent.click(numlangCard);
    let dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');

    // Close modal
    const closeBtn = screen.getByLabelText('Close details dialog');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');

    // Test keyboard activation (Enter key)
    fireEvent.keyDown(numlangCard, { key: 'Enter' });
    dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();

    // Close via Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes project modal automatically when browser hash navigates away', () => {
    render(
      <PreferencesProvider>
        <ProjectsSection />
      </PreferencesProvider>
    );

    const numlangCard = screen.getByLabelText('View specifications for NumLang');
    fireEvent.click(numlangCard);
    expect(screen.getByRole('dialog')).toBeTruthy();

    // Simulate browser navigation / back button
    window.location.hash = '#projects';
    fireEvent(window, new HashChangeEvent('hashchange'));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('verifies CommandPalette locks body scroll and uses flex-1 min-h-0', () => {
    render(
      <PreferencesProvider>
        <CommandPalette />
      </PreferencesProvider>
    );

    // Open command palette with Ctrl+K
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const dialog = screen.getByRole('dialog', { name: /Command Palette/i });
    expect(dialog).toBeTruthy();
    expect(dialog.parentElement).toBe(document.body);
    expect(document.body.style.overflow).toBe('hidden');

    // Verify results list has flex-1 and min-h-0
    const resultsContainer = dialog.querySelector('.divide-y');
    expect(resultsContainer?.className).toContain('flex-1');
    expect(resultsContainer?.className).toContain('min-h-0');

    // Close with Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('verifies PreprintsSection BibTeX drawer toggle and accessibility', () => {
    render(<PreprintsSection />);

    const bibtexButtons = screen.getAllByRole('button', { name: /View BibTeX/i });
    expect(bibtexButtons.length).toBeGreaterThan(0);

    // Initially drawer is not visible
    expect(screen.queryByText(/Bibliographic Entry \(BibTeX format\)/i)).toBeNull();

    // Click to open drawer
    fireEvent.click(bibtexButtons[0]);
    expect(screen.getByText(/Bibliographic Entry \(BibTeX format\)/i)).toBeTruthy();
    expect(bibtexButtons[0].getAttribute('aria-expanded')).toBe('true');

    // Click to close drawer
    fireEvent.click(bibtexButtons[0]);
    expect(screen.queryByText(/Bibliographic Entry \(BibTeX format\)/i)).toBeNull();
  });

  it('verifies SkillsLandscapeSection competency chips fast inspection', () => {
    render(<SkillsLandscapeSection />);

    // Click a skill chip
    const rustChip = screen.getByRole('button', { name: /Rust/i });
    expect(rustChip).toBeTruthy();
    fireEvent.click(rustChip);

    // Verify inspection panel updates
    const headings = screen.getAllByRole('heading', { level: 3 });
    const rustHeading = headings.find((h) => h.textContent?.includes('Rust'));
    expect(rustHeading).toBeTruthy();
  });
});
