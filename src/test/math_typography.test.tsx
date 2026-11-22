import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { PlaygroundSection } from '../components/sections/PlaygroundSection';
import { ProjectVisualDemo } from '../components/visuals/ProjectVisualDemo';
import { PreferencesProvider } from '../context';
import { projectsData } from '../data';

describe('Mathematical Typography & Formula Rendering Integrity', () => {
  const forbiddenLatexRegex = /\\(?:frac|sigma|rho|beta|alpha|gamma|delta|epsilon|partial|quad|Big|dot|mathbb|mathcal|mathbf|mathrm|operatorname|cap|cup|in|le|ge|ne|to|text)\b/;

  it('Plate I (Lorenz Attractor): renders clean mathematical fractions and Greek characters with zero raw LaTeX', () => {
    const { container } = render(
      <PreferencesProvider>
        <PlaygroundSection />
      </PreferencesProvider>
    );

    // Verify mathematical formulation display plate exists
    const mathDisplay = container.querySelector('.math-display');
    expect(mathDisplay).toBeTruthy();
    expect(mathDisplay?.getAttribute('role')).toBe('region');
    expect(mathDisplay?.getAttribute('aria-label')).toContain('Lorenz');

    // Verify 3 distinct fractions for dx/dt, dy/dt, dz/dt
    const fractions = container.querySelectorAll('.math-fraction');
    expect(fractions.length).toBe(3);

    const numerators = container.querySelectorAll('.math-fraction-num');
    expect(numerators.length).toBe(3);
    expect(numerators[0].textContent).toBe('dx');
    expect(numerators[1].textContent).toBe('dy');
    expect(numerators[2].textContent).toBe('dz');

    const denominators = container.querySelectorAll('.math-fraction-den');
    expect(denominators.length).toBe(3);
    denominators.forEach((den) => {
      expect(den.textContent).toBe('dt');
    });

    // Verify Greek parameters σ, ρ, β in math typography
    expect(mathDisplay?.textContent).toContain('σ(y − x)');
    expect(mathDisplay?.textContent).toContain('x(ρ − z) − y');
    expect(mathDisplay?.textContent).toContain('xy − βz');

    // Verify mathematical variables (var.math-var) and delimiters (.math-delimiter)
    const mathVars = mathDisplay?.querySelectorAll('var.math-var');
    expect(mathVars && mathVars.length).toBeGreaterThanOrEqual(10);
    const varTexts = Array.from(mathVars || []).map((v) => v.textContent);
    expect(varTexts).toContain('x');
    expect(varTexts).toContain('y');
    expect(varTexts).toContain('z');
    expect(varTexts).toContain('t');
    expect(varTexts).toContain('σ');
    expect(varTexts).toContain('ρ');
    expect(varTexts).toContain('β');

    const delimiters = mathDisplay?.querySelectorAll('.math-delimiter');
    expect(delimiters?.length).toBe(2);

    const mathOps = mathDisplay?.querySelectorAll('.math-op');
    expect(mathOps && mathOps.length).toBeGreaterThanOrEqual(5);

    // Verify canvas badge contains Blackboard Bold ℝ³ and dotted ẋ
    expect(container.textContent).toContain('ℝ³ Phase Space • ẋ = F(x)');

    // Ensure zero raw LaTeX backslash commands in the entire container
    expect(container.innerHTML).not.toMatch(forbiddenLatexRegex);
    expect(container.innerHTML).not.toContain('\\frac');
    expect(container.innerHTML).not.toContain('\\sigma');
    expect(container.innerHTML).not.toContain('\\rho');
    expect(container.innerHTML).not.toContain('\\beta');
    expect(container.innerHTML).not.toContain('\\quad');
    expect(container.innerHTML).not.toContain('\\Big|');
    expect(container.innerHTML).not.toContain('\\dot');
  });

  it('Plate II (Cellular Automata): renders ℤ² lattice without raw LaTeX', () => {
    const { container } = render(
      <PreferencesProvider>
        <PlaygroundSection />
      </PreferencesProvider>
    );

    // Switch to Cellular Automata tab
    const cellularTab = screen.getByText(/2\. Cellular Automata/i);
    fireEvent.click(cellularTab);

    // Verify blackboard bold ℤ²
    expect(container.textContent).toContain('Discrete lattice ℤ²');
    expect(container.innerHTML).not.toContain('\\mathbb');
    expect(container.innerHTML).not.toMatch(forbiddenLatexRegex);
  });

  it('Plate III (Complex Julia Dynamics): renders complex quadratic dynamics and boundary without raw LaTeX', () => {
    const { container } = render(
      <PreferencesProvider>
        <PlaygroundSection />
      </PreferencesProvider>
    );

    // Switch to Complex Fractal tab
    const fractalTab = screen.getByText(/3\. Complex Fractal/i);
    fireEvent.click(fractalTab);

    // Verify math display contains formatted symbols
    const mathDisplay = container.querySelector('.math-display');
    expect(mathDisplay).toBeTruthy();
    expect(mathDisplay?.textContent).toContain('z² + c');
    expect(mathDisplay?.textContent).toContain('c = cr + i · ci ∈ ℂ');
    expect(mathDisplay?.textContent).toContain('J(fc) = ∂K(fc)');

    // Verify canvas badge and parameter label
    expect(container.textContent).toContain('ℂ Argand Plane • |z| ≤ 2');
    expect(container.textContent).toContain('c ∈ ℂ');

    // Ensure zero raw LaTeX
    expect(container.innerHTML).not.toMatch(forbiddenLatexRegex);
    expect(container.innerHTML).not.toContain('\\mathbb');
    expect(container.innerHTML).not.toContain('\\partial');
    expect(container.innerHTML).not.toContain('\\quad');
    expect(container.innerHTML).not.toContain('\\in');
    expect(container.innerHTML).not.toContain('\\le');
  });

  it('Plate IV (Simplicial Homology): renders Vietoris-Rips definition and Euler formula without raw LaTeX', () => {
    const { container } = render(
      <PreferencesProvider>
        <PlaygroundSection />
      </PreferencesProvider>
    );

    // Switch to Simplicial Homology tab
    const homologyTab = screen.getByText(/4\. Simplicial Homology/i);
    fireEvent.click(homologyTab);

    // Verify math display
    const mathDisplay = container.querySelector('.math-display');
    expect(mathDisplay).toBeTruthy();
    expect(mathDisplay?.textContent).toContain('VRε(X) = { σ ⊆ X : diam(σ) ≤ ε }');
    expect(mathDisplay?.textContent).toContain('χ = V − E + F = β₀ − β₁');

    // Verify filtration parameter label
    expect(container.textContent).toContain('ε ∈ [20, 130]');

    // Ensure zero raw LaTeX
    expect(container.innerHTML).not.toMatch(forbiddenLatexRegex);
    expect(container.innerHTML).not.toContain('\\mathrm');
    expect(container.innerHTML).not.toContain('\\epsilon');
    expect(container.innerHTML).not.toContain('\\Big');
    expect(container.innerHTML).not.toContain('\\subseteq');
    expect(container.innerHTML).not.toContain('\\operatorname');
    expect(container.innerHTML).not.toContain('\\beta');
  });

  it('ProjectVisualDemo: renders mathematical formulas with proper typography across all demo components', () => {
    // 1. Dual Pruned Decoding Visualizer
    const dualPrunedProj = projectsData.find((p) => p.id === 'dual-pruned-decoding')!;
    const { container: dualContainer } = render(
      <PreferencesProvider>
        <ProjectVisualDemo project={dualPrunedProj} />
      </PreferencesProvider>
    );
    expect(dualContainer.textContent).toContain('ℒ(x, λ) = NLL(x) + λ · Cost(x)');
    expect(dualContainer.innerHTML).not.toMatch(forbiddenLatexRegex);

    // 2. Certified Dose (Persistent Homology Hypergraph Visualizer)
    const doseProj = projectsData.find((p) => p.id === 'certified-dose')!;
    const { container: doseContainer } = render(
      <PreferencesProvider>
        <ProjectVisualDemo project={doseProj} />
      </PreferencesProvider>
    );
    expect(doseContainer.textContent).toContain('ℱ: TempHyperGraph → ChComplex; H₁ Invariant Intervals');
    expect(doseContainer.innerHTML).not.toMatch(forbiddenLatexRegex);

    // 3. Sunflower Conjecture Audit Visualizer
    const sunflowerProj = projectsData.find((p) => p.id === 'sunflower-conjecture-audit')!;
    const { container: sunflowerContainer } = render(
      <PreferencesProvider>
        <ProjectVisualDemo project={sunflowerProj} />
      </PreferencesProvider>
    );
    expect(sunflowerContainer.textContent).toContain('Ai ∩ Aj = Y (for all distinct i ≠ j)');
    expect(sunflowerContainer.textContent).toContain('r-sunflower with shared central kernel Y and mutually disjoint petals Pi');
    expect(sunflowerContainer.innerHTML).not.toContain('P_i');
    expect(sunflowerContainer.innerHTML).not.toMatch(forbiddenLatexRegex);
  });

  it('Full App: verifies zero raw LaTeX backslash commands rendered anywhere in the DOM', () => {
    const { container } = render(<App />);

    // Check that no raw LaTeX commands appear in the DOM
    expect(container.innerHTML).not.toMatch(forbiddenLatexRegex);
    expect(container.innerHTML).not.toContain('\\frac');
    expect(container.innerHTML).not.toContain('\\sigma');
    expect(container.innerHTML).not.toContain('\\rho');
    expect(container.innerHTML).not.toContain('\\beta');
    expect(container.innerHTML).not.toContain('\\partial');
    expect(container.innerHTML).not.toContain('\\mathbb');
    expect(container.innerHTML).not.toContain('\\mathcal');
  });
});
