import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { PreferencesProvider, usePreferences } from '../context';
import { PlaygroundSection } from '../components/sections/PlaygroundSection';

const PlaygroundThemeTester = () => {
  const { readingMode, toggleReadingMode } = usePreferences();
  return (
    <div>
      <button data-testid="toggle-theme-btn" onClick={toggleReadingMode}>
        Toggle Theme
      </button>
      <span data-testid="current-theme">{readingMode ? 'light' : 'dark'}</span>
      <PlaygroundSection />
    </div>
  );
};

describe('PlaygroundSection (§ 11 The Computational Workbench) Theme Adaptation', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('P1: renders without hardcoded dark background hexes in containers and coordinate badges', () => {
    const { container } = render(
      <PreferencesProvider>
        <PlaygroundThemeTester />
      </PreferencesProvider>
    );

    // Verify container styling uses theme tokens instead of hardcoded hex
    const darkHexElements = container.querySelectorAll('.bg-\\[\\#121110\\]');
    expect(darkHexElements.length).toBe(0);

    const darkBadgeBorders = container.querySelectorAll('.border-\\[\\#38332d\\]');
    expect(darkBadgeBorders.length).toBe(0);

    const darkBadgeTexts = container.querySelectorAll('.text-\\[\\#a8a29e\\]');
    expect(darkBadgeTexts.length).toBe(0);

    // Verify canvas wrapper has responsive theme token
    const canvasWrapper = container.querySelector('.math-grid');
    expect(canvasWrapper).toBeTruthy();
    expect(canvasWrapper?.className).toContain('bg-paper-bg-base');

    // Verify slider inputs use theme-adaptive accent
    const sliders = container.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBeGreaterThan(0);
    sliders.forEach((slider) => {
      expect(slider.className).toContain('accent-academic-amber');
      expect(slider.className).not.toContain('accent-amber-600');
    });
  });

  it('P2: Plate I (Lorenz Attractor) initializes background and adapts to theme transitions without slider wiping', () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    const fillStyleLog: string[] = [];
    const mockCtx = {
      fillRect: vi.fn().mockImplementation((_x: number, _y: number, _w: number, _h: number) => {
        if (mockCtx.fillStyle) {
          fillStyleLog.push(mockCtx.fillStyle);
        }
      }),
      clearRect: vi.fn(),
      strokeRect: vi.fn(),
      getImageData: () => ({ data: new Array(100) }),
      putImageData: vi.fn(),
      createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    };

    HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
      if (contextId === '2d') return mockCtx;
      return null;
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    const { container, unmount } = render(
      <PreferencesProvider>
        <PlaygroundThemeTester />
      </PreferencesProvider>
    );

    // In dark mode (default): canvas background should initialize with #121110
    expect(mockCtx.fillRect).toHaveBeenCalled();
    expect(fillStyleLog).toContain('#121110');

    // Changing a slider parameter (e.g. sigma) should update simulation parameters WITHOUT wiping canvas with solid fill
    const fillCallsBeforeSlider = fillStyleLog.length;
    const sigmaSlider = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(sigmaSlider).toBeTruthy();
    act(() => {
      fireEvent.change(sigmaSlider, { target: { value: '15.0' } });
    });
    // No new solid background fill should be triggered purely by slider adjustments
    const newSolidFills = fillStyleLog.slice(fillCallsBeforeSlider).filter((c) => c === '#121110' || c === '#faf7f0');
    expect(newSolidFills.length).toBe(0);

    // Toggling reading mode to light mode
    const toggleBtn = screen.getByTestId('toggle-theme-btn');
    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.getByTestId('current-theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('reading-mode')).toBe(true);

    // Theme transition must clear canvas with warm archival paper (#faf7f0)
    expect(fillStyleLog).toContain('#faf7f0');

    // Reset button in light mode clears with #faf7f0
    const resetBtn = screen.getByText('Reset');
    act(() => {
      fireEvent.click(resetBtn);
    });
    expect(mockCtx.fillStyle).toBe('#faf7f0');

    unmount();
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('P3: Plate II (Cellular Automata) adapts cell styles dynamically between dark and light modes', () => {
    const { container } = render(
      <PreferencesProvider>
        <PlaygroundThemeTester />
      </PreferencesProvider>
    );

    // Navigate to Plate II
    const cellularTab = screen.getByText(/Plate II: 2\. Cellular Automata/i);
    fireEvent.click(cellularTab);

    // Preset Glider to create alive cells
    const gliderBtn = screen.getByText('Preset Glider');
    fireEvent.click(gliderBtn);

    // In dark mode: alive cells have bg-academic-amber and border-academic-amber/60
    const aliveCellDark = container.querySelector('.aspect-square.bg-academic-amber');
    expect(aliveCellDark).toBeTruthy();
    expect(aliveCellDark?.className).toContain('border-academic-amber/60');
    expect(aliveCellDark?.className).not.toContain('border-amber-400');

    // Dead cells should use responsive theme token
    const deadCell = container.querySelector('.aspect-square.bg-paper-bg-subtle');
    expect(deadCell).toBeTruthy();
    expect(deadCell?.className).toContain('border-paper-border-subtle');

    // Switch to light mode
    const toggleBtn = screen.getByTestId('toggle-theme-btn');
    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.getByTestId('current-theme').textContent).toBe('light');

    // In light mode: alive cells dynamically adapt to archival deep cobalt (bg-academic-cobalt)
    const aliveCellLight = container.querySelector('.aspect-square.bg-academic-cobalt');
    expect(aliveCellLight).toBeTruthy();
    expect(aliveCellLight?.className).toContain('border-academic-cobalt/80');
  });

  it('P4: Plate III (Complex Julia Dynamics) computes exact theme-dependent pixel matrices', () => {
    let capturedImageData: { data: Uint8ClampedArray } | null = null;
    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    const mockCtx = {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      strokeRect: vi.fn(),
      getImageData: () => ({ data: new Array(100) }),
      putImageData: vi.fn().mockImplementation((imgData: { data: Uint8ClampedArray }) => {
        capturedImageData = imgData;
      }),
      createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    };

    HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
      if (contextId === '2d') return mockCtx;
      return null;
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    const { unmount } = render(
      <PreferencesProvider>
        <PlaygroundThemeTester />
      </PreferencesProvider>
    );

    // Navigate to Plate III
    const fractalTab = screen.getByText(/Plate III: 3\. Complex Fractal/i);
    fireEvent.click(fractalTab);

    expect(mockCtx.putImageData).toHaveBeenCalled();
    expect(capturedImageData).not.toBeNull();

    // Verify dark mode pixels:
    // Exterior corner pixel (px=0, py=0) where points escape immediately:
    // base RGB must match deep espresso slate #121110 (18, 17, 16)
    const darkCornerR = capturedImageData!.data[0];
    const darkCornerG = capturedImageData!.data[1];
    const darkCornerB = capturedImageData!.data[2];
    expect(darkCornerR).toBe(18);
    expect(darkCornerG).toBe(17);
    expect(darkCornerB).toBe(16);

    // Switch to light mode
    const toggleBtn = screen.getByTestId('toggle-theme-btn');
    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.getByTestId('current-theme').textContent).toBe('light');
    expect(mockCtx.putImageData).toHaveBeenCalled();

    // Verify light mode pixels:
    // Exterior corner pixel (px=0, py=0) escaping immediately:
    // must match warm archival paper #faf7f0 (250, 247, 240)
    const lightCornerR = capturedImageData!.data[0];
    const lightCornerG = capturedImageData!.data[1];
    const lightCornerB = capturedImageData!.data[2];
    expect(lightCornerR).toBe(250);
    expect(lightCornerG).toBe(247);
    expect(lightCornerB).toBe(240);

    unmount();
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('P5: Plate IV (Simplicial Homology) renders topological filtration with active archival inks', () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    const fillStyleLog: string[] = [];
    const strokeStyleLog: string[] = [];

    const mockCtx = {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      strokeRect: vi.fn(),
      getImageData: () => ({ data: new Array(100) }),
      putImageData: vi.fn(),
      createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn().mockImplementation(() => {
        if (mockCtx.strokeStyle) strokeStyleLog.push(mockCtx.strokeStyle);
      }),
      fill: vi.fn().mockImplementation(() => {
        if (mockCtx.fillStyle) fillStyleLog.push(mockCtx.fillStyle);
      }),
      arc: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    };

    HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
      if (contextId === '2d') return mockCtx;
      return null;
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    const { container, unmount } = render(
      <PreferencesProvider>
        <PlaygroundThemeTester />
      </PreferencesProvider>
    );

    // Navigate to Plate IV
    const homologyTab = screen.getByText(/Plate IV: 4\. Simplicial Homology/i);
    fireEvent.click(homologyTab);

    // Increase epsilon slider to 80 so 2-simplex triangles form across the cavities
    const epsSlider = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(epsSlider).toBeTruthy();
    act(() => {
      fireEvent.change(epsSlider, { target: { value: '80' } });
    });

    // In dark mode:
    // 0-simplex vertices filled with parchment (#ede8df) and stroked with glowing amber (#d97706)
    expect(fillStyleLog).toContain('#ede8df');
    expect(strokeStyleLog).toContain('#d97706');
    // 1-simplex edges stroked with glowing amber rgba(217, 119, 6, 0.75)
    expect(strokeStyleLog).toContain('rgba(217, 119, 6, 0.75)');
    // 2-simplex triangles filled with amber wash rgba(217, 119, 6, 0.16)
    expect(fillStyleLog).toContain('rgba(217, 119, 6, 0.16)');
    // metric balls stroked with parchment rgba(184, 173, 150, 0.22)
    expect(strokeStyleLog).toContain('rgba(184, 173, 150, 0.22)');

    // Clear logs before theme switch
    fillStyleLog.length = 0;
    strokeStyleLog.length = 0;

    // Switch to light mode
    const toggleBtn = screen.getByTestId('toggle-theme-btn');
    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.getByTestId('current-theme').textContent).toBe('light');

    // In light mode:
    // 0-simplex vertices filled with deep cobalt (#1e3a5f) and rimmed with oxblood (#881337)
    expect(fillStyleLog).toContain('#1e3a5f');
    expect(strokeStyleLog).toContain('#881337');
    // 1-simplex edges stroked with deep cobalt rgba(30, 58, 95, 0.85)
    expect(strokeStyleLog).toContain('rgba(30, 58, 95, 0.85)');
    // 2-simplex triangles filled with archival oxblood wash rgba(136, 19, 55, 0.15)
    expect(fillStyleLog).toContain('rgba(136, 19, 55, 0.15)');
    // metric balls stroked with warm ochre rgba(146, 64, 14, 0.25)
    expect(strokeStyleLog).toContain('rgba(146, 64, 14, 0.25)');

    // Verify coordinate badge overlay uses theme tokens
    const badge = container.querySelector('.bg-paper-bg-base\\/80');
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toContain('Topological Manifold');

    // Verify slider uses theme-adaptive accent
    expect(epsSlider.className).toContain('accent-academic-amber');

    unmount();
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('P6: Plate IV (Simplicial Homology) supports interactive vertex addition and pointer manipulation', () => {
    const { container, unmount } = render(
      <PreferencesProvider>
        <PlaygroundThemeTester />
      </PreferencesProvider>
    );

    // Navigate to Plate IV
    const homologyTab = screen.getByText(/Plate IV: 4\. Simplicial Homology/i);
    fireEvent.click(homologyTab);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toBeTruthy();

    // Mock getBoundingClientRect
    canvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 560,
      bottom: 300,
      width: 560,
      height: 300,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Mock pointer capture functions
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn().mockReturnValue(true);

    // Pointer down on empty space adds a vertex
    act(() => {
      fireEvent.pointerDown(canvas, { clientX: 50, clientY: 50, pointerId: 1 });
    });

    // Pointer down on existing vertex initiates drag with pointer capture
    act(() => {
      fireEvent.pointerDown(canvas, { clientX: 50, clientY: 50, pointerId: 1 });
    });
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(1);

    // Pointer move updates vertex position
    act(() => {
      fireEvent.pointerMove(canvas, { clientX: 60, clientY: 60, pointerId: 1 });
    });

    // Pointer up releases capture
    act(() => {
      fireEvent.pointerUp(canvas, { pointerId: 1 });
    });
    expect(canvas.releasePointerCapture).toHaveBeenCalledWith(1);

    unmount();
  });
});
