import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsLandscapeSection } from '../components/sections/SkillsLandscapeSection';
import { PreferencesProvider } from '../context/PreferencesContext';
import { skillsData } from '../data';

describe('Skills Constellation & Competency Clusters Suite', () => {
  it('contains all 4 rich competency categories with Intermediate proficiency', () => {
    expect(skillsData.length).toBe(4);
    const categoryNames = skillsData.map((c) => c.categoryName);
    expect(categoryNames).toContain('Core & Systems Languages');
    expect(categoryNames).toContain('Formal Verification & Compiler Architecture');
    expect(categoryNames).toContain('Topological & Mathematical Formalisms');
    expect(categoryNames).toContain('Scientific Computing & Systems Engineering');

    skillsData.forEach((cat) => {
      expect(cat.proficiencyLevel).toBe('Intermediate');
      expect(cat.skills.length).toBeGreaterThanOrEqual(7);
      cat.skills.forEach((skill) => {
        expect(skill.name.trim().length).toBeGreaterThan(0);
        expect(skill.description.trim().length).toBeGreaterThan(0);
        expect(skill.associatedTopics.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('verifies that each category possesses authentic shared-topic connections', () => {
    // Proves that the constellation is an interconnected topological graph rather than disjoint nodes
    skillsData.forEach((cat) => {
      const skills = cat.skills;
      let sharedCount = 0;
      for (let i = 0; i < skills.length; i++) {
        for (let j = i + 1; j < skills.length; j++) {
          const shared = skills[i].associatedTopics.filter((t) =>
            skills[j].associatedTopics.includes(t)
          );
          if (shared.length > 0) {
            sharedCount++;
          }
        }
      }
      expect(
        sharedCount,
        `Category "${cat.categoryName}" must possess at least 3 shared topic edges`
      ).toBeGreaterThanOrEqual(3);
    });
  });

  it('renders interactive SVG constellation with multi-orbit nodes and central hub', () => {
    const { container } = render(
      <PreferencesProvider>
        <SkillsLandscapeSection />
      </PreferencesProvider>
    );

    const svg = container.querySelector('svg[role="img"]');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 720 340');

    // Central hub elements exist
    const hub = container.querySelector('g.hub-center');
    expect(hub).toBeTruthy();
    expect(hub?.textContent).toContain('CLUSTER CORE');

    // Celestial background grid and fixed stars exist
    const stars = container.querySelectorAll('g.celestial-grid circle');
    expect(stars.length).toBeGreaterThan(20);

    // Initial category nodes rendered
    const nodes = container.querySelectorAll('g.nodes > g');
    expect(nodes.length).toBe(skillsData[0].skills.length);

    // Initial edges rendered
    const edges = container.querySelectorAll('g.edges > line');
    expect(edges.length).toBeGreaterThan(0);

    // Initial state has primary skill active (e.g. Rust) and graph neighbors visible
    const rustHeading = screen.getByRole('heading', { level: 3, name: /Rust/i });
    expect(rustHeading).toBeTruthy();
  });

  it('switches categories and updates constellation nodes, chips, and active skill', () => {
    const { container } = render(
      <PreferencesProvider>
        <SkillsLandscapeSection />
      </PreferencesProvider>
    );

    // Click tab for Formal Verification & Compiler Architecture
    const formalTab = screen.getByRole('button', { name: /Formal Verification & Compiler Architecture/i });
    expect(formalTab).toBeTruthy();
    fireEvent.click(formalTab);

    // Check that Lean 4 chip is visible
    const leanChip = screen.getByRole('button', { name: /Lean 4/i });
    expect(leanChip).toBeTruthy();

    // Verify SVG nodes match category skills count
    const nodes = container.querySelectorAll('g.nodes > g');
    expect(nodes.length).toBe(skillsData[1].skills.length);

    // The primary skill for the new category (Lean 4) is immediately active
    const leanHeading = screen.getByRole('heading', { level: 3, name: /Lean 4/i });
    expect(leanHeading).toBeTruthy();

    // Graph neighbors are immediately active for Lean 4
    const neighborButtons = screen.getAllByRole('button', { name: /→/i });
    expect(neighborButtons.length).toBeGreaterThan(0);
  });

  it('navigates via graph neighbors buttons in the inspection drawer', () => {
    render(
      <PreferencesProvider>
        <SkillsLandscapeSection />
      </PreferencesProvider>
    );

    // Initially Rust is active
    expect(screen.getByRole('heading', { level: 3, name: /Rust/i })).toBeTruthy();

    // Find any graph neighbor button
    const neighborButtons = screen.getAllByRole('button', { name: /→/i });
    expect(neighborButtons.length).toBeGreaterThan(0);

    // Click the first neighbor button
    const targetName = neighborButtons[0].textContent?.replace(' →', '').trim();
    fireEvent.click(neighborButtons[0]);

    // Inspection panel updates to neighbor
    const headings = screen.getAllByRole('heading', { level: 3 });
    const activeHeading = headings.find((h) => h.textContent?.includes(targetName || ''));
    expect(activeHeading).toBeTruthy();
  });

  it('verifies strict rendered text bounding boxes stay within viewBox bounds and do not overlap center hub across all 4 categories', () => {
    const { container } = render(
      <PreferencesProvider>
        <SkillsLandscapeSection />
      </PreferencesProvider>
    );

    const charWidth = 6.4; // Conservative width per monospace char
    const hubMinX = 335;
    const hubMaxX = 385;
    const hubMinY = 150;
    const hubMaxY = 190;

    for (const cat of skillsData) {
      const tab = screen.getByRole('button', { name: new RegExp(cat.categoryName, 'i') });
      fireEvent.click(tab);

      const labelTexts = container.querySelectorAll('g.nodes text');
      expect(labelTexts.length).toBe(cat.skills.length);

      labelTexts.forEach((textEl) => {
        const anchor = textEl.getAttribute('text-anchor') || 'middle';
        const labelX = parseFloat(textEl.getAttribute('x') || '0');
        const labelY = parseFloat(textEl.getAttribute('y') || '0');

        const tspans = textEl.querySelectorAll('tspan');
        const lines = tspans.length > 0
          ? Array.from(tspans).map((t) => t.textContent || '')
          : [textEl.textContent || ''];

        lines.forEach((line, lIdx) => {
          const lineWidth = line.length * charWidth;
          const lineY = labelY + lIdx * 11;

          let left = labelX;
          let right = labelX;
          if (anchor === 'middle') {
            left = labelX - lineWidth / 2;
            right = labelX + lineWidth / 2;
          } else if (anchor === 'end') {
            left = labelX - lineWidth;
            right = labelX;
          } else {
            left = labelX;
            right = labelX + lineWidth;
          }

          // Strict canvas containment check: viewBox [0 0 720 340]
          expect(left, `Label line "${line}" left edge must be >= 5`).toBeGreaterThanOrEqual(5);
          expect(right, `Label line "${line}" right edge must be <= 715`).toBeLessThanOrEqual(715);
          expect(lineY, `Label line "${line}" Y must be >= 20`).toBeGreaterThanOrEqual(20);
          expect(lineY, `Label line "${line}" Y must be <= 335`).toBeLessThanOrEqual(335);

          // Center cluster hub collision check: no label may cross [335, 385] x [150, 190]
          const collidesWithHub =
            left < hubMaxX && right > hubMinX && lineY > hubMinY && lineY < hubMaxY;
          expect(
            collidesWithHub,
            `Label line "${line}" collides with center hub zone [${left.toFixed(1)}, ${right.toFixed(1)}] @ y=${lineY}`
          ).toBe(false);
        });
      });
    }
  });

  it('clicking background deselects active node and shows category overview', () => {
    const { container } = render(
      <PreferencesProvider>
        <SkillsLandscapeSection />
      </PreferencesProvider>
    );

    // Initial state has Rust active
    expect(screen.getByRole('heading', { level: 3, name: /Rust/i })).toBeTruthy();

    // Click SVG container background
    const bgContainer = container.querySelector('div.relative.w-full.select-none');
    expect(bgContainer).toBeTruthy();
    if (bgContainer) {
      fireEvent.click(bgContainer);
    }

    // Now shows category overview heading
    expect(
      screen.getByRole('heading', { level: 3, name: /Core & Systems Languages Overview/i })
    ).toBeTruthy();
    expect(screen.getByText(/Topological graph view active/i)).toBeTruthy();
  });
});
