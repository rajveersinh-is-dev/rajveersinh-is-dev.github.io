import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { profileData } from '../data';
import { PreferencesProvider, usePreferences } from '../context';
import { audioService } from '../utils/audioFeedback';
import { HeroTelemetryTicker } from '../components/common/HeroTelemetryTicker';
import { CustomCursor } from '../components/common/CustomCursor';
import { TiltCard } from '../components/common/TiltCard';
import { MaskedReveal } from '../components/common/MaskedReveal';
import { AcademicPopover } from '../components/common/AcademicPopover';
import { NumLangLoweringWalkthrough } from '../components/visuals/NumLangLoweringWalkthrough';
import { PreprintInspectorModal } from '../components/visuals/PreprintInspectorModal';
import { MathTerminal } from '../components/common/MathTerminal';
import { publicationsData } from '../data';

describe('Modern Makeover Specification & Feature Verification', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // 1. Location Update & Hero Editorial Telemetry Ticker
  describe('1. Location Update & Editorial Telemetry Ticker', () => {
    it('verifies Pune, Maharashtra, India in profile data', () => {
      expect(profileData.location).toBe('Pune, Maharashtra, India');
    });

    it('renders real-time editorial telemetry ticker with Pune coordinates and clock', () => {
      render(
        <PreferencesProvider>
          <HeroTelemetryTicker />
        </PreferencesProvider>
      );

      expect(screen.getByText(/PUNE, MH, IN/i)).toBeTruthy();
      expect(screen.getByText(/18.5204° N, 73.8567° E/i)).toBeTruthy();
      expect(screen.getByText(/UTC\+05:30/i)).toBeTruthy();
      expect(screen.getByText(/CLOCK:/i)).toBeTruthy();
      expect(screen.getByText(/SSA SUPERCOMPILATION/i)).toBeTruthy();
    });
  });

  // 2. Subtle Web Audio Synthesizer & Mute State
  describe('2. Subtle Web Audio Synthesizer & Mute State', () => {
    it('synthesizes acoustic click, toggle, and terminal beep without error in browser context', () => {
      expect(() => audioService.playClick(850)).not.toThrow();
      expect(() => audioService.playToggle(true)).not.toThrow();
      expect(() => audioService.playTerminalBeep(true)).not.toThrow();
    });

    it('respects muted state and persists mute toggle in PreferencesContext', () => {
      const TestConsumer = () => {
        const { soundEnabled, toggleSound } = usePreferences();
        return (
          <div>
            <span data-testid="sound-status">{soundEnabled ? 'ENABLED' : 'MUTED'}</span>
            <button onClick={toggleSound}>Toggle Sound</button>
          </div>
        );
      };

      render(
        <PreferencesProvider>
          <TestConsumer />
        </PreferencesProvider>
      );

      const status = screen.getByTestId('sound-status');
      expect(status.textContent).toBe('ENABLED');

      const btn = screen.getByRole('button', { name: /Toggle Sound/i });
      fireEvent.click(btn);

      expect(status.textContent).toBe('MUTED');
      expect(localStorage.getItem('rvp_audio_feedback')).toBe('false');
      expect(audioService.getMuted()).toBe(true);
    });
  });

  // 3. Custom Magnetic Cursor & Canvas Reticle
  describe('3. Custom Magnetic Cursor & Canvas Reticle', () => {
    it('renders cursor indicator on fine pointer devices without error', () => {
      const { container } = render(
        <PreferencesProvider>
          <CustomCursor />
        </PreferencesProvider>
      );
      expect(container).toBeDefined();
    });
  });

  // 4. 3D Tilt Card & Soft Spotlight
  describe('4. Cursor-Tracking 3D Tilt Card & Soft Spotlight', () => {
    it('renders card content with spotlight container', () => {
      render(
        <TiltCard maxTilt={6}>
          <div data-testid="card-content">Monograph Card</div>
        </TiltCard>
      );

      const content = screen.getByTestId('card-content');
      expect(content).toBeTruthy();

      const card = content.parentElement;
      expect(card).toBeDefined();

      // Trigger mouse enter and mouse move
      if (card) {
        fireEvent.mouseEnter(card);
        fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
        fireEvent.mouseLeave(card);
      }
    });
  });

  // 5. Masked Overflow Line-Reveal
  describe('5. Masked Overflow Line-Reveal', () => {
    it('renders children inside masked overflow wrapper', () => {
      render(
        <MaskedReveal delayMs={100}>
          <span>Title Line</span>
        </MaskedReveal>
      );
      expect(screen.getByText('Title Line')).toBeTruthy();
    });
  });

  // 6. Oversized Low-Contrast Display Numerals
  describe('6. Oversized Low-Contrast Display Numerals', () => {
    it('renders display numerals across section headers in App', () => {
      render(<App />);

      // Section numerals
      expect(screen.getByText('01')).toBeTruthy();
      expect(screen.getByText('02')).toBeTruthy();
      expect(screen.getByText('03')).toBeTruthy();
      expect(screen.getByText('04')).toBeTruthy();
      expect(screen.getByText('05')).toBeTruthy();
      expect(screen.getByText('06')).toBeTruthy();
      expect(screen.getByText('07')).toBeTruthy();
      expect(screen.getByText('08')).toBeTruthy();
      expect(screen.getByText('09')).toBeTruthy();
      expect(screen.getByText('10')).toBeTruthy();
      expect(screen.getByText('11')).toBeTruthy();
      expect(screen.getByText('12')).toBeTruthy();
    });
  });

  // 7. Asymmetric Bento Grid with NumLang as Primary Anchor
  describe('7. Asymmetric Bento Grid with NumLang Anchor', () => {
    it('renders NumLang with primary research anchor badge and Bento span', () => {
      render(
        <PreferencesProvider>
          <App />
        </PreferencesProvider>
      );

      expect(screen.getByText(/PRIMARY RESEARCH ANCHOR • MONOGRAPH I/i)).toBeTruthy();
      expect(screen.getByText(/Interactive Step-by-Step Lowering Walkthrough Available/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /Launch Lowering Walkthrough/i })).toBeTruthy();
    });
  });

  // 8. NumLang Step-by-Step Lowering Walkthrough
  describe('8. NumLang Step-by-Step Lowering Walkthrough', () => {
    it('navigates through all 6 compilation phases and displays AST transformations', () => {
      render(
        <PreferencesProvider>
          <NumLangLoweringWalkthrough />
        </PreferencesProvider>
      );

      // Initial Phase 1: Surface DSL
      expect(screen.getByText(/Phase 1 \/ 6/i)).toBeTruthy();
      expect(screen.getByText(/Surface Mathematical DSL/i)).toBeTruthy();
      expect(screen.getByText(/fibonacci_polyhedral/i)).toBeTruthy();

      // Next to Phase 2: AST
      const nextBtn = screen.getByRole('button', { name: /Next Phase/i });
      fireEvent.click(nextBtn);
      expect(screen.getByText(/Phase 2 \/ 6/i)).toBeTruthy();
      expect(screen.getByText(/Typed Abstract Syntax Tree/i)).toBeTruthy();

      // Next to Phase 3: Polyhedral
      fireEvent.click(nextBtn);
      expect(screen.getByText(/Phase 3 \/ 6/i)).toBeTruthy();
      expect(screen.getByText(/Polyhedral Recurrence Extraction/i)).toBeTruthy();

      // Next to Phase 4: SSA IR
      fireEvent.click(nextBtn);
      expect(screen.getByText(/Phase 4 \/ 6/i)).toBeTruthy();
      expect(screen.getByText(/Static Single Assignment \(SSA IR\)/i)).toBeTruthy();

      // Next to Phase 5: Supercompilation & Lean 4 proof
      fireEvent.click(nextBtn);
      expect(screen.getByText(/Phase 5 \/ 6/i)).toBeTruthy();
      expect(screen.getByText(/Supercompilation & Homeomorphic Embedding/i)).toBeTruthy();
      expect(screen.getByText(/fib_supercompilation_soundness/i)).toBeTruthy();

      // Next to Phase 6: Assembly
      fireEvent.click(nextBtn);
      expect(screen.getByText(/Phase 6 \/ 6/i)).toBeTruthy();
      expect(screen.getByText(/Cranelift \/ Target Assembly/i)).toBeTruthy();

      // Previous button works
      const prevBtn = screen.getByRole('button', { name: /Previous Phase/i });
      fireEvent.click(prevBtn);
      expect(screen.getByText(/Phase 5 \/ 6/i)).toBeTruthy();
    });
  });

  // 9. Dual-Pane Scholarly Preprint Inspector Modal
  describe('9. Dual-Pane Scholarly Preprint Inspector Modal', () => {
    it('opens preprint inspector for topology preprint with theorem navigation and canvas', () => {
      const pub = publicationsData[0]; // zenodo-22273633
      const handleClose = vi.fn();

      render(
        <PreferencesProvider>
          <PreprintInspectorModal publication={pub} onClose={handleClose} />
        </PreferencesProvider>
      );

      expect(screen.getByText(/SCHOLARLY PREPRINT INSPECTOR/i)).toBeTruthy();
      expect(screen.getByText(/THEOREM 1.1 \(Functorial Continuity & Nilpotence\)/i)).toBeTruthy();
      expect(screen.getByText(/THEOREM 2.1 \(Stability of Persistence Barcodes\)/i)).toBeTruthy();
      expect(screen.getByText(/Filtration Threshold \(ε\):/i)).toBeTruthy();

      // Test filtration slider change
      const slider = screen.getByLabelText(/Filtration Threshold \(ε\):/i);
      fireEvent.change(slider, { target: { value: '0.65' } });
      expect((slider as HTMLInputElement).value).toBe('0.65');

      // Test close button
      const closeBtn = screen.getByRole('button', { name: /Close preprint inspector/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();
    });

    it('opens preprint inspector for optimization preprint with Lagrangian dual multiplier slider', () => {
      const pub = publicationsData[1]; // zenodo-22310401
      const handleClose = vi.fn();

      render(
        <PreferencesProvider>
          <PreprintInspectorModal publication={pub} onClose={handleClose} />
        </PreferencesProvider>
      );

      expect(screen.getByText(/THEOREM 1.1 \(Lagrangian Dual Concavity/i)).toBeTruthy();
      expect(screen.getByText(/Lagrange Multiplier \(λ\):/i)).toBeTruthy();

      const slider = screen.getByLabelText(/Lagrange Multiplier \(λ\):/i);
      fireEvent.change(slider, { target: { value: '2.0' } });
      expect((slider as HTMLInputElement).value).toBe('2');
    });
  });

  // 10. Mathematical Terminal (REPL)
  describe('10. Mathematical Terminal (REPL)', () => {
    it('opens terminal, executes commands, evaluates math, and runs simulations from first principles', () => {
      const TestTerminalHarness = () => {
        const { setTerminalOpen } = usePreferences();
        useEffect(() => {
          setTerminalOpen(true);
        }, [setTerminalOpen]);
        return <MathTerminal />;
      };

      render(
        <PreferencesProvider>
          <TestTerminalHarness />
        </PreferencesProvider>
      );

      expect(screen.getByText(/Acta Mathematica Terminal — Mathematical REPL/i)).toBeTruthy();

      const input = screen.getByPlaceholderText(/Type command/i);

      // Command: help
      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/AVAILABLE MATHEMATICAL COMMANDS:/i)).toBeTruthy();

      // Command: status
      fireEvent.change(input, { target: { value: 'status' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/TELEMETRY INVARIANT STATUS:/i)).toBeTruthy();
      expect(screen.getByText(/Pune, Maharashtra, India/i)).toBeTruthy();

      // Command: eval sqrt(144) + 3^4
      fireEvent.change(input, { target: { value: 'eval sqrt(144) + 3^4' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Result: 93/i)).toBeTruthy(); // 12 + 81 = 93

      // Command: eval gcd(48, 18)
      fireEvent.change(input, { target: { value: 'eval gcd(48, 18)' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Result: 6/i)).toBeTruthy();

      // Command: eval with postfix factorial and functions: 5!, max(10, 20), sqrt with spacing
      fireEvent.change(input, { target: { value: 'eval 5!' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Result: 120/i)).toBeTruthy();

      fireEvent.change(input, { target: { value: 'eval max(14, 99, 42)' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Result: 99/i)).toBeTruthy();

      fireEvent.change(input, { target: { value: 'eval sqrt(  64  )' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Result: 8/i)).toBeTruthy();

      // Command: lorenz with safe bounding on negative/zero steps
      fireEvent.change(input, { target: { value: 'lorenz -5' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/LORENZ DYNAMICAL SYSTEM \(RK4 INTEGRATION, 8 STEPS\)/i)).toBeTruthy();

      // Command: lorenz standard
      fireEvent.change(input, { target: { value: 'lorenz 28' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/LORENZ DYNAMICAL SYSTEM \(RK4 INTEGRATION, 28 STEPS\)/i)).toBeTruthy();
      expect(screen.getAllByText(/Chaotic Attractor Trajectory Verified/i).length).toBeGreaterThan(0);

      // Command: homology with real nilpotence check
      fireEvent.change(input, { target: { value: 'homology' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/PERSISTENT HOMOLOGY & SIMPLICIAL BOUNDARY VERIFICATION/i)).toBeTruthy();
      expect(screen.getByText(/Nilpotence Check: ∂₁ ∘ ∂₂ = 0 confirmed identically/i)).toBeTruthy();

      // Command: numlang dynamic compiler pipeline
      fireEvent.change(input, { target: { value: 'numlang fn collatz(n) = 3 * n + 1' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/NUMLANG DYNAMIC COMPILER PIPELINE/i)).toBeTruthy();
      expect(screen.getByText(/Signature: fn collatz\(n: i64\) -> i64/i)).toBeTruthy();
      expect(screen.getByText(/theorem collatz_bisimulation_soundness/i)).toBeTruthy();

      // Command: inspect numlang project
      fireEvent.change(input, { target: { value: 'inspect numlang' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/PROJECT RECORD: \[NumLang\]/i)).toBeTruthy();

      // Command: inspect preprint by accession ID
      fireEvent.change(input, { target: { value: 'inspect zenodo-22273633' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/ARCHIVAL PREPRINT RECORD: \[Path-Crossing Functors/i)).toBeTruthy();

      // Command: cite without argument shows usage
      fireEvent.change(input, { target: { value: 'cite' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Usage: cite <zenodo-id>/i)).toBeTruthy();

      // Command: cite zenodo-22273633
      fireEvent.change(input, { target: { value: 'cite zenodo-22273633' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/@article\{pardeshi_zenodo-22273633/i)).toBeTruthy();
    });
  });

  // 11. Rich Academic Popovers
  describe('11. Rich Academic Popover Tooltips', () => {
    it('displays formal tooltip on hover/focus for MSC classification', () => {
      render(
        <AcademicPopover type="msc" id="55N31">
          55N31
        </AcademicPopover>
      );

      const trigger = screen.getByText('55N31');
      expect(trigger).toBeTruthy();

      fireEvent.mouseEnter(trigger.parentElement!);
      expect(screen.getByText(/MSC 55N31: Persistent Homology/i)).toBeTruthy();
      expect(screen.getByText(/Algebraic Topology & Topological Data Analysis/i)).toBeTruthy();
    });

    it('handles keyboard toggle and stops event propagation inside interactive cards', () => {
      const handleCardClick = vi.fn();

      render(
        <div onClick={handleCardClick} data-testid="parent-card">
          <AcademicPopover type="theorem" id="thm-functorial">
            [Theorem 1.1]
          </AcademicPopover>
        </div>
      );

      const trigger = screen.getByText('[Theorem 1.1]');

      // Press Enter to toggle popover
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(screen.getByText(/Theorem 1.1: Functorial Continuity/i)).toBeTruthy();
      // Verify parent card click was NOT triggered
      expect(handleCardClick).not.toHaveBeenCalled();

      // Click trigger to toggle popover
      fireEvent.click(trigger);
      expect(handleCardClick).not.toHaveBeenCalled();

      // Press Escape to dismiss popover
      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(screen.queryByText(/Theorem 1.1: Functorial Continuity/i)).toBeNull();
    });
  });
});
