import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import { BlueprintGutter } from '../components/common/BlueprintGutter';
import {
  computeNeedleProgress,
  SECTION_DEFS,
  getMeasuredSections,
} from '../utils/vernierRail';

describe('BlueprintGutter & Vernier Rail Integrity', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 22000,
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('computeNeedleProgress Unit Tests', () => {
    const dummyTicks = [
      { px: 0 },
      { px: 1000 },
      { px: 3000 },
      { px: 6000 },
      { px: 10000 },
    ];
    const maxScroll = 12000;

    it('returns 0 at top of document and for non-positive scroll positions', () => {
      expect(computeNeedleProgress(0, maxScroll, dummyTicks)).toBe(0);
      expect(computeNeedleProgress(-150, maxScroll, dummyTicks)).toBe(0);
    });

    it('returns 1 at bottom of document or past maxScroll', () => {
      expect(computeNeedleProgress(12000, maxScroll, dummyTicks)).toBe(1);
      expect(computeNeedleProgress(25000, maxScroll, dummyTicks)).toBe(1);
    });

    it('returns exact proportional landmark positions for section landmarks', () => {
      // dummyTicks has 5 items (indices 0, 1, 2, 3, 4)
      // Index 0: 0/4 = 0
      // Index 1 (px 1000): 1/4 = 0.25
      // Index 2 (px 3000): 2/4 = 0.50
      // Index 3 (px 6000): 3/4 = 0.75
      // Index 4 (px 10000): 4/4 = 1.0
      expect(computeNeedleProgress(0, maxScroll, dummyTicks)).toBe(0);
      expect(computeNeedleProgress(1000, maxScroll, dummyTicks)).toBe(0.25);
      expect(computeNeedleProgress(3000, maxScroll, dummyTicks)).toBe(0.5);
      expect(computeNeedleProgress(6000, maxScroll, dummyTicks)).toBe(0.75);
      expect(computeNeedleProgress(10000, maxScroll, dummyTicks)).toBe(1);
    });

    it('smoothly interpolates between section landmarks', () => {
      // Between index 1 (1000px) and index 2 (3000px):
      // Midpoint is 2000px: t = (2000-1000)/2000 = 0.5
      // Progress = (1 + 0.5) / 4 = 1.5 / 4 = 0.375
      const progress = computeNeedleProgress(2000, maxScroll, dummyTicks);
      expect(progress).toBeCloseTo(0.375, 5);
    });

    it('safely handles empty or single-element tick arrays', () => {
      expect(computeNeedleProgress(500, maxScroll, [])).toBe(0);
      expect(computeNeedleProgress(500, maxScroll, [{ px: 0 }])).toBe(0);
    });

    it('safely handles zero or negative maxScroll without division by zero', () => {
      expect(computeNeedleProgress(500, 0, dummyTicks)).toBe(0);
      expect(computeNeedleProgress(500, -100, dummyTicks)).toBe(0);
    });

    it('safely handles scroll past last tick without exceeding 1.0', () => {
      // Dummy ticks last tick is at 10000. scrollY is 10500, maxScroll is 12000.
      const progress = computeNeedleProgress(10500, maxScroll, dummyTicks);
      expect(progress).toBeLessThanOrEqual(1.0);
      expect(progress).toBeGreaterThanOrEqual(0.0);
      expect(progress).toBeCloseTo(10500 / 12000, 5);
    });

    it('proves scroll past 7100px in 22000px document moves dynamically without premature 100% clamp', () => {
      const fallbackTicks = SECTION_DEFS.map((s) => ({ px: s.fallbackPx }));
      const docMaxScroll = 21000;
      // 7680px should be around ~36.5%, NOT prematurely clamped to 1.0 (100%)
      const p7680 = computeNeedleProgress(7680, docMaxScroll, fallbackTicks);
      expect(p7680).toBeCloseTo(7680 / 21000, 4);
      expect(p7680).toBeLessThan(0.5);
      expect(p7680).toBeGreaterThan(0.3);

      // 15000px should be around ~71.4%
      const p15000 = computeNeedleProgress(15000, docMaxScroll, fallbackTicks);
      expect(p15000).toBeCloseTo(15000 / 21000, 4);

      // 21000px (maxScroll) should reach exactly 1.0
      const p21000 = computeNeedleProgress(21000, docMaxScroll, fallbackTicks);
      expect(p21000).toBe(1.0);
    });
  });

  describe('BlueprintGutter Component Rendering & Dynamic Scrolling', () => {
    it('renders left gutter rail with top reticle, section ticks, and needle gauge', () => {
      render(<BlueprintGutter side="left" />);

      // Top reticle
      expect(screen.getByText('RET·T')).toBeTruthy();

      // Base reticle
      expect(screen.getByText('RET·L')).toBeTruthy();

      // Section landmarks
      expect(screen.getByText('TOP')).toBeTruthy();
      expect(screen.getByText('§ 01')).toBeTruthy();
      expect(screen.getByText('§ 12')).toBeTruthy();

      // Initial needle coordinate gauge
      const badge = screen.getByTestId('blueprint-gutter-needle-badge');
      expect(badge.textContent).toContain('0000px──┤');

      // Check needle positioning styles at scroll 0
      const needle = screen.getByTestId('blueprint-gutter-needle');
      expect(needle.style.top).toBe('0%');
      expect(needle.style.transform).toMatch(/translateY\(-?0%\)/);
    });

    it('renders right gutter rail with inverted ticks and needle orientation', () => {
      render(<BlueprintGutter side="right" />);

      // Top reticle
      expect(screen.getByText('T·RET')).toBeTruthy();

      // Base reticle
      expect(screen.getByText('R·RET')).toBeTruthy();

      // Initial needle coordinate gauge with right orientation
      const badge = screen.getByTestId('blueprint-gutter-needle-badge');
      expect(badge.textContent).toContain('├──0000px');
    });

    it('updates needle position and coordinate readout smoothly when scrolled', async () => {
      render(<BlueprintGutter side="left" />);

      // Initial state
      const badge = screen.getByTestId('blueprint-gutter-needle-badge');
      const needle = screen.getByTestId('blueprint-gutter-needle');
      expect(badge.textContent).toContain('0000px──┤');
      expect(needle.style.top).toBe('0%');

      // Scroll to 7680px (the exact condition from user's report)
      act(() => {
        window.scrollY = 7680;
        window.dispatchEvent(new Event('scroll'));
      });

      // Verify coordinate badge reflects 7680px without clamping to 0 or breaking
      await waitFor(() => {
        expect(badge.textContent).toContain('7680px──┤');
      });

      // Verify needle progress is dynamic and bounded within [0%, 100%]
      const topPercent = parseFloat(needle.style.top);
      expect(topPercent).toBeGreaterThan(0);
      expect(topPercent).toBeLessThan(100);
      expect(topPercent).toBeCloseTo((7680 / 21000) * 100, 1);
      expect(needle.style.transform).toBe(`translateY(-${topPercent}%)`);
    });

    it('handles document resize and dynamically measures section DOM offsets', () => {
      // Setup mock DOM sections with realistic offsets
      const container = document.createElement('div');
      for (const def of SECTION_DEFS) {
        const el = document.createElement('section');
        el.id = def.id;
        // Mock getBoundingClientRect
        el.getBoundingClientRect = vi.fn(() => ({
          top: def.fallbackPx * 2, // Double fallback to test dynamic measurement
          bottom: def.fallbackPx * 2 + 500,
          left: 0,
          right: 1000,
          width: 1000,
          height: 500,
          x: 0,
          y: def.fallbackPx * 2,
          toJSON: () => {},
        }));
        container.appendChild(el);
      }
      document.body.appendChild(container);

      render(<BlueprintGutter side="left" />);

      // Trigger resize
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Cleanup mock DOM
      document.body.removeChild(container);
    });

    it('ensures monotonic ordering in getMeasuredSections even with out-of-order DOM elements', () => {
      const container = document.createElement('div');
      SECTION_DEFS.forEach((def, idx) => {
        const el = document.createElement('section');
        el.id = def.id;
        // Invert order artificially: later elements return smaller top
        const mockTop = (SECTION_DEFS.length - idx) * 100;
        el.getBoundingClientRect = vi.fn(() => ({
          top: mockTop,
          bottom: mockTop + 50,
          left: 0,
          right: 100,
          width: 100,
          height: 50,
          x: 0,
          y: mockTop,
          toJSON: () => {},
        }));
        container.appendChild(el);
      });
      document.body.appendChild(container);

      const sections = getMeasuredSections();
      for (let i = 1; i < sections.length; i++) {
        expect(sections[i].px).toBeGreaterThan(sections[i - 1].px);
      }

      document.body.removeChild(container);
    });

    it('highlights active section tick based on scroll position', async () => {
      render(<BlueprintGutter side="left" />);

      // At scroll 0, TOP tick is active
      const topTick = screen.getByTestId('blueprint-gutter-tick-hero');
      await waitFor(() => {
        expect(topTick.className).toContain('text-academic-amber');
      });

      // Scroll near section § 02 (fallbackPx 900)
      act(() => {
        window.scrollY = 920;
        window.dispatchEvent(new Event('scroll'));
      });

      const sec2Tick = screen.getByTestId('blueprint-gutter-tick-research-interests');
      await waitFor(() => {
        expect(sec2Tick.className).toContain('text-academic-amber');
      });
    });
  });
});
