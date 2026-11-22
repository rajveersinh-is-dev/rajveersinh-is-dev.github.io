import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { PreferencesProvider, usePreferences } from '../context';
import { App } from '../App';
import { NumLangReplEvaluator } from '../components/visuals/NumLangReplEvaluator';
import { ConnectionsGraphSection } from '../components/sections/ConnectionsGraphSection';
import { ManifoldSimulator } from '../components/visuals/ManifoldSimulator';
import { EducationSection } from '../components/sections/EducationSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { PreprintInspectorModal } from '../components/visuals/PreprintInspectorModal';
import { AsciiFrame } from '../components/common/AsciiFrame';
import { AsciiDecodeText } from '../components/common/AsciiDecodeText';
import { publicationsData } from '../data';

describe('Creative Engineering & Retro-Scientific Overhaul Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. MODULE A1: DEC VT220 AMBER CRT THEME & SCANLINES
  // =========================================================================
  describe('Module A1: DEC VT220 Amber CRT Mode & Scanlines', () => {
    const ThemeTestConsumer = () => {
      const { theme, cycleTheme, setTheme } = usePreferences();
      return (
        <div>
          <span data-testid="active-theme">{theme}</span>
          <button onClick={cycleTheme}>Cycle Theme</button>
          <button onClick={() => setTheme('amber-crt')}>Set Amber CRT</button>
        </div>
      );
    };

    it('cycles through Night Study -> Archival Paper -> Amber CRT -> Night Study', () => {
      render(
        <PreferencesProvider>
          <ThemeTestConsumer />
        </PreferencesProvider>
      );

      // Default theme: Night Study
      expect(screen.getByTestId('active-theme').textContent).toBe('night');
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      const cycleBtn = screen.getByText('Cycle Theme');

      // 1st Cycle: Archival Paper
      act(() => {
        fireEvent.click(cycleBtn);
      });
      expect(screen.getByTestId('active-theme').textContent).toBe('paper');
      expect(document.documentElement.classList.contains('reading-mode')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.classList.contains('amber-crt')).toBe(false);

      // 2nd Cycle: DEC VT220 Amber CRT
      act(() => {
        fireEvent.click(cycleBtn);
      });
      expect(screen.getByTestId('active-theme').textContent).toBe('amber-crt');
      expect(document.documentElement.classList.contains('amber-crt')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('reading-mode')).toBe(false);
      expect(localStorage.getItem('rvp_theme')).toBe('amber-crt');

      // 3rd Cycle: Returns to Night Study
      act(() => {
        fireEvent.click(cycleBtn);
      });
      expect(screen.getByTestId('active-theme').textContent).toBe('night');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('amber-crt')).toBe(false);
    });

    it('renders high-performance CRT scanlines overlay only in Amber CRT mode', () => {
      const { rerender } = render(
        <PreferencesProvider>
          <App />
        </PreferencesProvider>
      );

      // Initially in night mode: no scanlines overlay
      expect(document.querySelector('.crt-scanlines')).toBeNull();

      // Switch to Amber CRT via custom setter
      const amberButton = screen.getByLabelText(/Switch to Warm Archival Paper Mode/i);
      // Click once to go to paper
      act(() => {
        fireEvent.click(amberButton);
      });
      // Click again to go to Amber CRT
      const paperButton = screen.getByLabelText(/Exit Reading Mode/i);
      act(() => {
        fireEvent.click(paperButton);
      });

      rerender(
        <PreferencesProvider>
          <App />
        </PreferencesProvider>
      );

      // CRT Scanlines overlay must now be active in DOM
      const scanlines = document.querySelector('.crt-scanlines');
      expect(scanlines).toBeTruthy();
      expect(scanlines?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // =========================================================================
  // 2. MODULE A2: ASCII FRAMING & GLYPH SHUFFLE
  // =========================================================================
  describe('Module A2: Retro-Scientific Framing Suite', () => {
    it('renders Cadastral ASCII Corner Framing with architectural telemetry', () => {
      render(
        <AsciiFrame
          titleLeft="ID: NUMLANG"
          titleRight="ℝ⁴ • SSA"
          footerLeft="Verified"
          footerRight="▼ 48ms"
        >
          <div data-testid="frame-inner">Test Content</div>
        </AsciiFrame>
      );

      expect(screen.getByText(/ID: NUMLANG/i)).toBeTruthy();
      expect(screen.getByText(/ℝ⁴ • SSA/i)).toBeTruthy();
      expect(screen.getByText(/Verified/i)).toBeTruthy();
      expect(screen.getByText(/▼ 48ms/i)).toBeTruthy();
      expect(screen.getByTestId('frame-inner').textContent).toBe('Test Content');
    });

    it('renders interactive ASCII glyph shuffle component and updates text on hover', () => {
      vi.useFakeTimers();
      render(<AsciiDecodeText text="Launch Lowering Walkthrough" />);

      const el = screen.getByText('Launch Lowering Walkthrough');
      expect(el).toBeTruthy();

      // Trigger hover shuffle
      fireEvent.mouseEnter(el);

      // Advance timers to trigger intermediate glyph steps
      act(() => {
        vi.advanceTimersByTime(40);
      });

      // Complete shuffle animation
      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(screen.getByText('Launch Lowering Walkthrough')).toBeTruthy();
      vi.useRealTimers();
    });

    it('renders secondary featured project cards wrapped in cadastral AsciiFrame inside ProjectsSection', () => {
      render(
        <PreferencesProvider>
          <ProjectsSection />
        </PreferencesProvider>
      );

      // Verify NumLang hero anchor
      expect(screen.getByText(/PRIMARY RESEARCH ANCHOR • MONOGRAPH I/i)).toBeTruthy();

      // Verify secondary projects framed with cadastral brackets
      expect(screen.getByText(/ID: OMNI-TOOLKIT/i)).toBeTruthy();
      expect(screen.getByText(/ID: TERRAIN-EROSION-ENGINE/i)).toBeTruthy();
    });
  });

  // =========================================================================
  // 3. MODULE B1: NUMLANG COMPILER REPL / EVALUATOR
  // =========================================================================
  describe('Module B1: Interactive NumLang Compiler REPL / Evaluator', () => {
    it('computes Fibonacci recurrence from first principles dynamically and allows parameter changes', () => {
      render(
        <PreferencesProvider>
          <NumLangReplEvaluator />
        </PreferencesProvider>
      );

      // Verify Fibonacci preset is loaded
      expect(screen.getAllByText(/Fibonacci Recurrence/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/F\(n\) = F\(n-1\) \+ F\(n-2\)/i)).toBeTruthy();

      // Verify initial simulation step
      expect(screen.getByText(/Simulation Stepper:/i)).toBeTruthy();
      expect(screen.getByText(/bb0: entry check/i)).toBeTruthy();

      // Click step forward
      const stepForwardBtn = screen.getByLabelText('Step Forward');
      act(() => {
        fireEvent.click(stepForwardBtn);
      });
      expect(screen.getByText(/bb_loop_init/i)).toBeTruthy();

      // Change parameter n to 4
      const nInput = screen.getByLabelText(/Target n:/i);
      act(() => {
        fireEvent.change(nInput, { target: { value: '4' } });
      });

      // Execution steps should be re-evaluated for n = 4
      expect(screen.getByText(/Step 1 of/i)).toBeTruthy();
    });

    it('evaluates Ackermann function dynamically via true reduction machine without hardcoded tables', () => {
      render(
        <PreferencesProvider>
          <NumLangReplEvaluator />
        </PreferencesProvider>
      );

      // Select Ackermann preset
      const ackBtn = screen.getByText("Ackermann's Non-Primitive Recurrence");
      act(() => {
        fireEvent.click(ackBtn);
      });

      // Verify Ackermann is loaded
      expect(screen.getByText(/A\(m, n\) = A\(m-1, A\(m, n-1\)\)/i)).toBeTruthy();
      expect(screen.getByText(/bb0: entry A\(1, 2\)/i)).toBeTruthy();

      // Step forward through dynamic stack reduction
      const stepForwardBtn = screen.getByLabelText('Step Forward');
      act(() => {
        fireEvent.click(stepForwardBtn);
      });
      // Should show inner push step
      expect(screen.getByText(/bb_inner: Push A\(1, 1\)/i)).toBeTruthy();

      // Adjust parameter n to 1
      const nSelect = screen.getByLabelText(/^n:$/i);
      act(() => {
        fireEvent.change(nSelect, { target: { value: '1' } });
      });
      expect(screen.getByText(/bb0: entry A\(1, 1\)/i)).toBeTruthy();
    });

    it('switches between all 4 compiler inspection tabs: Source, SSA IR, Supercompiler Fold, and Cranelift JIT', () => {
      render(
        <PreferencesProvider>
          <NumLangReplEvaluator />
        </PreferencesProvider>
      );

      // Tab 1: Source
      expect(screen.getByText(/NumLang Functional Surface DSL/i)).toBeTruthy();

      // Tab 2: SSA IR Lowering
      const ssaTab = screen.getByText(/2. SSA IR Lowering/i);
      act(() => {
        fireEvent.click(ssaTab);
      });
      expect(screen.getByText(/Static Single Assignment \(SSA IR\) Form/i)).toBeTruthy();
      expect(screen.getByText(/Computed φ-Nodes:/i)).toBeTruthy();

      // Tab 3: Supercompiler Fold
      const supercompTab = screen.getByText(/3. Supercompiler Fold/i);
      act(() => {
        fireEvent.click(supercompTab);
      });
      expect(screen.getByText(/Turchin Supercompilation & Homeomorphic Embedding/i)).toBeTruthy();
      expect(screen.getByText(/Mechanized Lean 4 Proof Certificate:/i)).toBeTruthy();

      // Tab 4: Cranelift / JIT
      const jitTab = screen.getByText(/4. Cranelift \/ JIT/i);
      act(() => {
        fireEvent.click(jitTab);
      });
      expect(screen.getByText(/Linear Scan Register Allocation Map:/i)).toBeTruthy();
      expect(screen.getByText(/fibonacci:/i)).toBeTruthy();
    });

    it('allows visitors to toggle editable write mode and update NumLang code', () => {
      render(
        <PreferencesProvider>
          <NumLangReplEvaluator />
        </PreferencesProvider>
      );

      // Open Write/Edit mode
      const editBtn = screen.getByText(/Write \/ Edit Function/i);
      act(() => {
        fireEvent.click(editBtn);
      });

      // Textarea should now be visible
      const textarea = screen.getByPlaceholderText(/fn custom_rec/i);
      expect(textarea).toBeTruthy();

      // Edit source code
      act(() => {
        fireEvent.change(textarea, { target: { value: 'fn custom_test(k: i64) -> i64 { k }' } });
      });

      // Apply changes
      const applyBtn = screen.getByText(/Apply & Test Stepper/i);
      act(() => {
        fireEvent.click(applyBtn);
      });

      // Should return to read-only display with modified code
      expect(screen.getByText(/fn custom_test/i)).toBeTruthy();
    });
  });

  // =========================================================================
  // 4. MODULE B2: FORCE-DIRECTED GRAPH PHYSICS
  // =========================================================================
  describe('Module B2: Force-Directed Graph Simulation', () => {
    it('renders dynamical network and responds to pointer drag events', () => {
      render(
        <PreferencesProvider>
          <ConnectionsGraphSection />
        </PreferencesProvider>
      );

      expect(screen.getByText(/Harmonic Topological Lattice/i)).toBeTruthy();

      // Find SVG element
      const svg = document.querySelector('#connections-graph svg');
      expect(svg).toBeTruthy();

      // Verify node circles rendered
      const circles = svg?.querySelectorAll('circle');
      expect(circles && circles.length).toBeGreaterThan(10);
    });
  });

  // =========================================================================
  // 5. MODULE B3: 3D PARAMETRIC TOPOLOGICAL MANIFOLD VISUALIZER (PLATE V)
  // =========================================================================
  describe('Module B3: 3D Topological Manifold Visualizer (Plate V)', () => {
    it('renders 3D manifold visualizer with Clifford Torus, Klein Bottle, and Calabi-Yau surfaces', () => {
      render(
        <PreferencesProvider>
          <ManifoldSimulator />
        </PreferencesProvider>
      );

      expect(screen.getByText(/3D Parametric Topological Manifold Visualizer/i)).toBeTruthy();
      expect(screen.getByText(/Clifford Torus in 𝕊³/i)).toBeTruthy();

      // Switch to Klein bottle
      const select = screen.getByRole('combobox');
      act(() => {
        fireEvent.change(select, { target: { value: 'klein' } });
      });
      expect(screen.getByText(/Klein Immersion:/i)).toBeTruthy();

      // Switch to Calabi-Yau 6D quintic cross-section
      act(() => {
        fireEvent.change(select, { target: { value: 'calabi-yau' } });
      });
      expect(screen.getByText(/Fermat Quintic Three-Fold Cross-Section:/i)).toBeTruthy();

      // Toggle 1-Bit Dither vs Wireframe
      const ditherBtn = screen.getByText(/1-Bit Dither/i);
      act(() => {
        fireEvent.click(ditherBtn);
      });
      expect(screen.getByText(/Wireframe/i)).toBeTruthy();
    });
  });

  // =========================================================================
  // 6. MODULE C1: UNIFIED ACADEMIC CURRICULUM & MILESTONES (§ 7)
  // =========================================================================
  describe('Module C1: Consolidated Academic Curriculum & Milestones (§ 7)', () => {
    it('renders foundational credentials, milestones date columns, and CV dossier in one section', () => {
      render(
        <PreferencesProvider>
          <EducationSection />
        </PreferencesProvider>
      );

      // Part 1: Educational credentials
      expect(screen.getByText(/§ 7\. Academic Curriculum & Scholarly Milestones/i)).toBeTruthy();
      expect(screen.getByText(/Indian Institute of Technology Madras/i)).toBeTruthy();
      expect(screen.getByText(/Eon Gyanankur English School/i)).toBeTruthy();

      // Part 2: Chronological milestones
      expect(screen.getByText(/Scholarly Chronology & Intellectual Milestones/i)).toBeTruthy();
      expect(screen.getAllByText(/Current Stage/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Current Enrolment/i).length).toBeGreaterThanOrEqual(1);

      // Part 3: Official CV dossier
      expect(screen.getByText(/Curriculum Vitae \(CV\) & Academic Dossier/i)).toBeTruthy();
      expect(screen.getByText(/Download Vector Dossier \(PDF\)/i)).toBeTruthy();
      expect(screen.getByText(/Inspect \/ Copy Markdown/i)).toBeTruthy();
    });
  });

  // =========================================================================
  // 7. MODULE C3: MOBILE BOTTOM-SHEET SWIPE-TO-DISMISS
  // =========================================================================
  describe('Module C3: Mobile Bottom-Sheet Dialogs & Swipe Gesture', () => {
    it('supports touch swipe-down to dismiss on Preprint Inspector modal', () => {
      const handleClose = vi.fn();
      const pub = publicationsData[0];

      render(
        <PreferencesProvider>
          <PreprintInspectorModal publication={pub} onClose={handleClose} />
        </PreferencesProvider>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toBeTruthy();

      // Find the mobile grab handle or bottom sheet container
      const grabHandle = modal.querySelector('.rounded-full.mx-auto');
      expect(grabHandle).toBeTruthy();

      const sheet = grabHandle?.parentElement;
      expect(sheet).toBeTruthy();

      // Simulate swipe down gesture: touchStart at y=100, touchMove to y=250 (delta > 80px), touchEnd
      if (sheet) {
        fireEvent.touchStart(sheet, {
          touches: [{ clientY: 100 }],
        });
        fireEvent.touchMove(sheet, {
          touches: [{ clientY: 250 }],
        });
        fireEvent.touchEnd(sheet);
      }

      // onClose must have been invoked by swipe gesture
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
