import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Info, Sliders, Compass, Activity, Layers, Box } from 'lucide-react';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { MaskedReveal } from '../common/MaskedReveal';
import { usePreferences } from '../../context';
import { ManifoldSimulator } from '../visuals/ManifoldSimulator';

type PlaygroundTab = 'lorenz' | 'cellular' | 'fractal' | 'homology' | 'manifold';

export const PlaygroundSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('lorenz');
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="playground"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
        >
          11
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              § 11
            </div>
            <MaskedReveal>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
                § 11. The Computational Workbench / Laboratorium Mathematicum
              </h2>
            </MaskedReveal>
            <MaskedReveal delayMs={150}>
              <p className="font-serif italic text-ink-muted text-sm sm:text-base">
                Mathematical Visual Playground — Continuous Chaos, Cellular Automata, Complex Dynamics &amp; Simplicial Homology
              </p>
            </MaskedReveal>
          </div>

          {/* Tab Selector — Engraved Plate Navigation */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded border border-paper-border-strong bg-paper-bg-subtle self-start md:self-auto font-mono text-xs shadow-sm">
            <button
              onClick={() => setActiveTab('lorenz')}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'lorenz'
                  ? 'bg-academic-amber text-paper-bg-base font-bold shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-bg-elevated'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Plate I: 1. Lorenz Attractor</span>
            </button>
            <button
              onClick={() => setActiveTab('cellular')}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'cellular'
                  ? 'bg-academic-amber text-paper-bg-base font-bold shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-bg-elevated'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Plate II: 2. Cellular Automata</span>
            </button>
            <button
              onClick={() => setActiveTab('fractal')}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'fractal'
                  ? 'bg-academic-amber text-paper-bg-base font-bold shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-bg-elevated'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Plate III: 3. Complex Fractal</span>
            </button>
            <button
              onClick={() => setActiveTab('homology')}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'homology'
                  ? 'bg-academic-amber text-paper-bg-base font-bold shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-bg-elevated'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Plate IV: 4. Simplicial Homology</span>
            </button>
            <button
              onClick={() => setActiveTab('manifold')}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'manifold'
                  ? 'bg-academic-amber text-paper-bg-base font-bold shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-bg-elevated'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Plate V: 5. 3D Manifolds</span>
            </button>
          </div>
        </div>

        {/* Scholarly Pedagogical Colophon */}
        <div className="p-4 rounded border-l-4 border-academic-amber bg-paper-bg-subtle border border-paper-border-subtle flex items-start space-x-3 text-xs font-mono text-ink-secondary">
          <Info className="w-4 h-4 text-academic-amber mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="text-ink-primary font-bold">Laboratorium Pedagogical Notice:</span>
            <p>
              These interactive mathematical instruments demonstrate canonical non-linear dynamical chaos, discrete Turing-complete cellular emergence, quadratic complex polynomial maps, Vietoris-Rips simplicial homology filtrations, and 3D parametric topological immersions. They function as genuine pedagogical testbeds and numerical experiments.
            </p>
          </div>
        </div>

        {/* Tab Content Panels — Archival Folio Container */}
        <div className="bg-paper-bg-subtle rounded border border-paper-border-strong shadow-sm p-6 sm:p-8">
          {activeTab === 'lorenz' && <LorenzSimulator />}
          {activeTab === 'cellular' && <CellularSimulator />}
          {activeTab === 'fractal' && <FractalSimulator />}
          {activeTab === 'homology' && <HomologySimulator />}
          {activeTab === 'manifold' && <ManifoldSimulator />}
        </div>
      </div>
    </section>
  );
};

/* =========================================================================
   1. Lorenz Attractor Simulation Component (Plate I)
   ========================================================================= */
const LorenzSimulator: React.FC = () => {
  const { readingMode } = usePreferences();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  // System parameters
  const [sigma, setSigma] = useState(10.0);
  const [rho, setRho] = useState(28.0);
  const [beta, setBeta] = useState(2.666);
  const [dt, setDt] = useState(0.008);

  const stateRef = useRef({
    x: 0.1,
    y: 0.0,
    z: 0.0,
    angle: 0,
    trail: [] as { x: number; y: number; z: number }[],
  });

  const paramsRef = useRef({ sigma, rho, beta, dt, isRunning, readingMode });
  useEffect(() => {
    paramsRef.current = { sigma, rho, beta, dt, isRunning, readingMode };
  }, [sigma, rho, beta, dt, isRunning, readingMode]);

  const prevReadingModeRef = useRef<boolean | null>(null);

  const resetSimulation = () => {
    stateRef.current = {
      x: 0.1 + (Math.random() - 0.5) * 0.1,
      y: 0.0,
      z: 0.0,
      angle: 0,
      trail: [],
    };
    setSigma(10.0);
    setRho(28.0);
    setBeta(2.666);
    setDt(0.008);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = readingMode ? '#faf7f0' : '#121110';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Immediate canvas background initialization and reactive theme transitions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (prevReadingModeRef.current !== readingMode) {
      ctx.fillStyle = readingMode ? '#faf7f0' : '#121110';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      prevReadingModeRef.current = readingMode;
    }
  }, [readingMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const { sigma: s, rho: r, beta: b, dt: d, isRunning: running, readingMode: light } = paramsRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Dynamic theme wash for trajectory persistence (warm archival paper vs deep espresso slate)
      ctx.fillStyle = light ? 'rgba(250, 247, 240, 0.16)' : 'rgba(18, 17, 16, 0.14)';
      ctx.fillRect(0, 0, w, h);

      if (running) {
        // Integrate several sub-steps per frame for smooth trajectory
        for (let step = 0; step < 6; step++) {
          const { x, y, z } = stateRef.current;
          const dx = s * (y - x);
          const dy = x * (r - z) - y;
          const dz = x * y - b * z;

          stateRef.current.x += dx * d;
          stateRef.current.y += dy * d;
          stateRef.current.z += dz * d;

          stateRef.current.trail.push({
            x: stateRef.current.x,
            y: stateRef.current.y,
            z: stateRef.current.z,
          });

          if (stateRef.current.trail.length > 700) {
            stateRef.current.trail.shift();
          }
        }
        stateRef.current.angle += 0.005;
      }

      // 3D Isometric projection onto viewing manifold
      const cx = w / 2;
      const cy = h / 2 + 30;
      const scale = Math.min(w, h) * 0.016;
      const cosA = Math.cos(stateRef.current.angle);
      const sinA = Math.sin(stateRef.current.angle);

      const trail = stateRef.current.trail;
      const tLen = trail.length;

      if (tLen > 1) {
        ctx.lineWidth = 1.3;
        for (let i = 1; i < tLen; i++) {
          const p1 = trail[i - 1];
          const p2 = trail[i];

          // Rotate around Z axis
          const rx1 = p1.x * cosA - p1.y * sinA;
          const ry1 = p1.x * sinA + p1.y * cosA;
          const rx2 = p2.x * cosA - p2.y * sinA;
          const ry2 = p2.x * sinA + p2.y * cosA;

          const px1 = cx + rx1 * scale;
          const py1 = cy - (p1.z - 25) * scale + ry1 * scale * 0.3;
          const px2 = cx + rx2 * scale;
          const py2 = cy - (p2.z - 25) * scale + ry2 * scale * 0.3;

          const alpha = i / tLen;
          // Archival ink trajectory: Deep cobalt (#1e3a5f) in light mode, Glowing amber (#d97706) in dark mode
          ctx.strokeStyle = light
            ? `rgba(30, 58, 95, ${alpha * 0.95})`
            : `rgba(217, 119, 6, ${alpha * 0.92})`;
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        }

        // Current tip marker: Archival oxblood (#881337) in light mode, Glowing amber (#d97706) in dark mode
        const last = trail[tLen - 1];
        const lx = cx + (last.x * cosA - last.y * sinA) * scale;
        const ly = cy - (last.z - 25) * scale + (last.x * sinA + last.y * cosA) * scale * 0.3;
        ctx.fillStyle = light ? '#881337' : '#d97706';
        ctx.beginPath();
        ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="space-y-6">
      {/* Plate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border-subtle">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted font-semibold">
            Plate I • Continuous Dynamical Chaos
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
            Lorenz Strange Attractor (Non-Linear ODE System)
          </h3>
          <p className="text-xs text-ink-muted font-mono mt-1">
            dx/dt = σ(y − x) &nbsp;|&nbsp; dy/dt = x(ρ − z) − y &nbsp;|&nbsp; dz/dt = xy − βz
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3.5 py-1.5 rounded border border-paper-border-strong bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono flex items-center space-x-1.5 text-ink-primary transition-colors font-semibold"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 text-academic-amber" /> : <Play className="w-3.5 h-3.5 text-academic-amber" />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={resetSimulation}
            className="px-3.5 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono flex items-center space-x-1.5 text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Mathematical Formulation Display Plate */}
      <div
        className="math-display text-sm sm:text-base font-math"
        role="region"
        aria-label="Lorenz Strange Attractor Differential Equations: dx/dt = σ(y − x) | dy/dt = x(ρ − z) − y | dz/dt = xy − βz"
      >
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-2 sm:gap-x-4">
          <div className="inline-flex items-center">
            <span className="math-fraction">
              <span className="math-fraction-num">d<var className="math-var">x</var></span>
              <span className="math-fraction-den">d<var className="math-var">t</var></span>
            </span>
            <span className="math-op">=</span>
            <span><var className="math-var">σ</var>(<var className="math-var">y</var> <span className="math-op">−</span> <var className="math-var">x</var>)</span>
          </div>

          <span className="math-delimiter hidden sm:inline" aria-hidden="true">|</span>

          <div className="inline-flex items-center">
            <span className="math-fraction">
              <span className="math-fraction-num">d<var className="math-var">y</var></span>
              <span className="math-fraction-den">d<var className="math-var">t</var></span>
            </span>
            <span className="math-op">=</span>
            <span><var className="math-var">x</var>(<var className="math-var">ρ</var> <span className="math-op">−</span> <var className="math-var">z</var>) <span className="math-op">−</span> <var className="math-var">y</var></span>
          </div>

          <span className="math-delimiter hidden sm:inline" aria-hidden="true">|</span>

          <div className="inline-flex items-center">
            <span className="math-fraction">
              <span className="math-fraction-num">d<var className="math-var">z</var></span>
              <span className="math-fraction-den">d<var className="math-var">t</var></span>
            </span>
            <span className="math-op">=</span>
            <span><var className="math-var">x</var><var className="math-var">y</var> <span className="math-op">−</span> <var className="math-var">β</var><var className="math-var">z</var></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Display with Coordinate Framing */}
        <div className="lg:col-span-8 bg-paper-bg-base rounded border-2 border-paper-border-strong overflow-hidden relative aspect-video flex items-center justify-center math-grid shadow-inner">
          <div className="absolute top-2 left-2 text-[9px] font-mono text-ink-muted tracking-widest uppercase pointer-events-none bg-paper-bg-base/80 px-1.5 py-0.5 rounded border border-paper-border-subtle shadow-xs">
            ℝ³ Phase Space • ẋ = F(x)
          </div>
          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            className="w-full h-full block"
          />
        </div>

        {/* Controls Slider Panel — Archival Instrument Calibration */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="p-4 rounded border border-paper-border-strong bg-paper-bg-base space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-paper-border-subtle pb-2">
              <span className="text-academic-amber font-bold uppercase tracking-wider text-[11px] font-serif">
                Attractor Parameters
              </span>
              <span className="text-[10px] text-ink-muted">Runge-Kutta / Euler</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Prandtl Number (σ):</span>
                <span className="text-academic-amber font-bold">{sigma.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                value={sigma}
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Rayleigh Number (ρ):</span>
                <span className="text-academic-amber font-bold">{rho.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="50.0"
                step="0.5"
                value={rho}
                onChange={(e) => setRho(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Geometric Ratio (β):</span>
                <span className="text-academic-amber font-bold">{beta.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Integration Step (dt):</span>
                <span className="text-academic-amber font-bold">{dt.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.002"
                max="0.015"
                step="0.001"
                value={dt}
                onChange={(e) => setDt(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-paper-border-subtle text-[10px] text-ink-muted font-serif italic">
              Canonical chaotic regime at σ = 10, ρ = 28, β = 8/3 ≈ 2.666.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. Cellular Automata (Conway's Game of Life) Component (Plate II)
   ========================================================================= */
const CellularSimulator: React.FC = () => {
  const { readingMode } = usePreferences();
  const COLS = 48;
  const ROWS = 30;

  const [grid, setGrid] = useState<number[][]>(() => createEmptyGrid(ROWS, COLS));
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeBrush, setActiveBrush] = useState<'draw' | 'erase'>('draw');

  function createEmptyGrid(r: number, c: number) {
    return Array.from({ length: r }, () => Array(c).fill(0));
  }

  const randomizeGrid = () => {
    const next = createEmptyGrid(ROWS, COLS);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        next[r][c] = Math.random() > 0.78 ? 1 : 0;
      }
    }
    setGrid(next);
    setGeneration(0);
  };

  const loadPresetGlider = () => {
    const next = createEmptyGrid(ROWS, COLS);
    const midR = Math.floor(ROWS / 2) - 2;
    const midC = Math.floor(COLS / 2) - 2;
    const glider = [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ];
    glider.forEach(([dr, dc]) => {
      const r = (midR + dr + ROWS) % ROWS;
      const c = (midC + dc + COLS) % COLS;
      next[r][c] = 1;
    });
    setGrid(next);
    setGeneration(0);
  };

  const loadPresetPulsar = () => {
    const next = createEmptyGrid(ROWS, COLS);
    const midR = Math.floor(ROWS / 2);
    const midC = Math.floor(COLS / 2);

    // Period 3 Pulsar coordinates relative to center
    const deltas = [-6, -1, 1, 6];
    deltas.forEach((dr) => {
      for (const dc of [-4, -3, -2, 2, 3, 4]) {
        const r = (midR + dr + ROWS) % ROWS;
        const c = (midC + dc + COLS) % COLS;
        next[r][c] = 1;
      }
    });
    for (const dr of [-4, -3, -2, 2, 3, 4]) {
      deltas.forEach((dc) => {
        const r = (midR + dr + ROWS) % ROWS;
        const c = (midC + dc + COLS) % COLS;
        next[r][c] = 1;
      });
    }

    setGrid(next);
    setGeneration(0);
  };

  const loadGosperGun = () => {
    const next = createEmptyGrid(ROWS, COLS);
    const offsetR = 4;
    const offsetC = 2;

    const gunCoords = [
      [4, 0], [4, 1], [5, 0], [5, 1], // left block
      [4, 10], [5, 10], [6, 10], [3, 11], [7, 11], [2, 12], [8, 12], [2, 13], [8, 13],
      [5, 14], [3, 15], [7, 15], [4, 16], [5, 16], [6, 16], [5, 17], // left ship
      [2, 20], [3, 20], [4, 20], [2, 21], [3, 21], [4, 21], [1, 22], [5, 22],
      [0, 24], [1, 24], [5, 24], [6, 24], // right ship
      [2, 34], [3, 34], [2, 35], [3, 35] // right block
    ];

    gunCoords.forEach(([r, c]) => {
      const nr = (offsetR + r) % ROWS;
      const nc = (offsetC + c) % COLS;
      if (nr < ROWS && nc < COLS) {
        next[nr][nc] = 1;
      }
    });

    setGrid(next);
    setGeneration(0);
  };

  const stepSimulation = () => {
    setGrid((current) => {
      const next = createEmptyGrid(ROWS, COLS);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          let neighbors = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = (r + dr + ROWS) % ROWS;
              const nc = (c + dc + COLS) % COLS;
              neighbors += current[nr][nc];
            }
          }
          if (current[r][c] === 1 && (neighbors === 2 || neighbors === 3)) {
            next[r][c] = 1;
          } else if (current[r][c] === 0 && neighbors === 3) {
            next[r][c] = 1;
          }
        }
      }
      return next;
    });
    setGeneration((g) => g + 1);
  };

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      stepSimulation();
    }, 120);
    return () => clearInterval(timer);
  }, [isRunning]);

  const toggleCell = (r: number, c: number) => {
    setGrid((current) => {
      const copy = current.map((row) => [...row]);
      copy[r][c] = activeBrush === 'draw' ? (copy[r][c] ? 0 : 1) : 0;
      return copy;
    });
  };

  const handleCellPointerEnter = (r: number, c: number) => {
    if (!isDrawing) return;
    setGrid((current) => {
      if (current[r][c] === (activeBrush === 'draw' ? 1 : 0)) return current;
      const copy = current.map((row) => [...row]);
      copy[r][c] = activeBrush === 'draw' ? 1 : 0;
      return copy;
    });
  };

  const handleClearGrid = () => {
    setGrid(createEmptyGrid(ROWS, COLS));
    setGeneration(0);
    setIsRunning(false);
  };

  return (
    <div
      className="space-y-6 select-none"
      onPointerUp={() => setIsDrawing(false)}
      onPointerLeave={() => setIsDrawing(false)}
    >
      {/* Plate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border-subtle">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted font-semibold">
            Plate II • Emergent Discrete Complexity &amp; Interactive Brush
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
            Cellular Automata (Conway Emergence Engine)
          </h3>
          <p className="text-xs text-ink-muted font-mono mt-1">
            Click or drag across the lattice to draw live cells. Select classic mathematical stamp presets below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3.5 py-1.5 rounded border border-paper-border-strong bg-academic-amber text-paper-bg-base text-xs font-mono font-bold flex items-center space-x-1 shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Run'}</span>
          </button>
          <button
            onClick={stepSimulation}
            className="px-3 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
          >
            Step
          </button>
          <button
            onClick={randomizeGrid}
            className="px-3 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
          >
            Randomize
          </button>
          <button
            onClick={loadPresetGlider}
            className="px-3 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
          >
            Preset Glider
          </button>
          <button
            onClick={handleClearGrid}
            className="px-2.5 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-dim hover:text-ink-primary transition-colors cursor-pointer"
          >
            Clear Grid
          </button>
        </div>
      </div>

      {/* Stamp Palette Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded bg-paper-bg-base border border-paper-border-subtle text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold mr-1">
            Mathematical Stamp Palette:
          </span>
          <button
            onClick={loadPresetGlider}
            className="px-2 py-1 rounded bg-paper-bg-subtle hover:bg-paper-bg-elevated border border-paper-border-subtle text-ink-secondary hover:text-ink-primary cursor-pointer text-[11px]"
          >
            Glider
          </button>
          <button
            onClick={loadPresetPulsar}
            className="px-2 py-1 rounded bg-paper-bg-subtle hover:bg-paper-bg-elevated border border-paper-border-subtle text-ink-secondary hover:text-ink-primary cursor-pointer text-[11px]"
          >
            Pulsar (Period 3)
          </button>
          <button
            onClick={loadGosperGun}
            className="px-2 py-1 rounded bg-paper-bg-subtle hover:bg-paper-bg-elevated border border-paper-border-subtle text-ink-secondary hover:text-ink-primary cursor-pointer text-[11px]"
          >
            Gosper Glider Gun
          </button>
          <button
            onClick={randomizeGrid}
            className="px-2 py-1 rounded bg-paper-bg-subtle hover:bg-paper-bg-elevated border border-paper-border-subtle text-ink-secondary hover:text-ink-primary cursor-pointer text-[11px]"
          >
            Random Noise Seed
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-ink-muted">Brush Mode:</span>
          <button
            onClick={() => setActiveBrush('draw')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
              activeBrush === 'draw'
                ? 'bg-academic-amber text-paper-bg-base font-bold'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            Draw Cell
          </button>
          <button
            onClick={() => setActiveBrush('erase')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
              activeBrush === 'erase'
                ? 'bg-academic-amber text-paper-bg-base font-bold'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            Erase
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-ink-muted px-1">
          <span className="font-serif italic">Discrete lattice <span className="font-math not-italic">ℤ²</span> — Click or drag to draw live cells</span>
          <span className="font-bold text-academic-amber">Generation: {generation}</span>
        </div>

        {/* Lattice Grid with Archival Frame */}
        <div className="bg-paper-bg-base p-4 rounded border-2 border-paper-border-strong overflow-x-auto shadow-inner touch-none">
          <div
            className="grid gap-0.5 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(10px, 1fr))`,
              maxWidth: '820px',
            }}
          >
            {grid.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  onPointerDown={() => {
                    setIsDrawing(true);
                    toggleCell(r, c);
                  }}
                  onPointerEnter={() => handleCellPointerEnter(r, c)}
                  className={`aspect-square rounded-xs cursor-pointer transition-colors ${
                    val
                      ? (readingMode
                          ? 'bg-academic-cobalt border border-academic-cobalt/80 shadow-xs'
                          : 'bg-academic-amber border border-academic-amber/60 shadow-xs')
                      : 'bg-paper-bg-subtle hover:bg-paper-bg-elevated border border-paper-border-subtle'
                  }`}
                  title={`Cell (${r}, ${c}): ${val ? 'Alive' : 'Dead'} • Click or drag to draw`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. Complex Fractal (Julia / Mandelbrot Parameter Tweaker) (Plate III)
   ========================================================================= */
const FractalSimulator: React.FC = () => {
  const { readingMode } = usePreferences();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cr, setCr] = useState(-0.7);
  const [ci, setCi] = useState(0.27015);
  const [maxIter, setMaxIter] = useState(48);
  const [zoom, setZoom] = useState(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const scale = 2.8 / (Math.min(w, h) * zoom);

    for (let py = 0; py < h; py++) {
      const y0 = (py - h / 2) * scale;
      for (let px = 0; px < w; px++) {
        let x0 = (px - w / 2) * scale;
        let x = x0;
        let y = y0;
        let iter = 0;

        while (x * x + y * y <= 4 && iter < maxIter) {
          const xTemp = x * x - y * y + cr;
          y = 2 * x * y + ci;
          x = xTemp;
          iter++;
        }

        const idx = (py * w + px) * 4;
        if (readingMode) {
          if (iter === maxIter) {
            // Julia set interior: Carbon black #1c1917
            data[idx] = 28;
            data[idx + 1] = 25;
            data[idx + 2] = 23;
            data[idx + 3] = 255;
          } else {
            // Exterior escape gradient: Warm Archival Paper #faf7f0 -> Ochre #92400e -> Archival Oxblood #881337
            const norm = iter / maxIter;
            let r: number, g: number, b: number;
            if (norm < 0.5) {
              const t = norm * 2;
              r = Math.floor(250 + (146 - 250) * t);
              g = Math.floor(247 + (64 - 247) * t);
              b = Math.floor(240 + (14 - 240) * t);
            } else {
              const t = (norm - 0.5) * 2;
              r = Math.floor(146 + (136 - 146) * t);
              g = Math.floor(64 + (19 - 64) * t);
              b = Math.floor(14 + (55 - 14) * t);
            }
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        } else {
          if (iter === maxIter) {
            // Julia set interior: Deep Espresso Slate #121110
            data[idx] = 18;
            data[idx + 1] = 17;
            data[idx + 2] = 16;
            data[idx + 3] = 255;
          } else {
            // Exterior escape gradient: Deep Espresso Slate #121110 -> Glowing Amber #d97706
            const norm = iter / maxIter;
            data[idx] = Math.floor(18 + (217 - 18) * norm);
            data[idx + 1] = Math.floor(17 + (119 - 17) * norm);
            data[idx + 2] = Math.floor(16 + (6 - 16) * norm);
            data[idx + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [cr, ci, maxIter, zoom, readingMode]);

  return (
    <div className="space-y-6">
      {/* Plate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border-subtle">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted font-semibold">
            Plate III • Complex Quadratic Dynamics
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
            Complex Julia Dynamics: <span className="font-math font-normal">z<sub>n+1</sub> = z<sub>n</sub>² + c</span>
          </h3>
          <p className="text-xs text-ink-muted font-mono mt-1">
            Quadratic polynomial map on the complex plane with varying constant parameter c = cᵣ + i·cᵢ.
          </p>
        </div>

        <button
          onClick={() => {
            setCr(-0.7);
            setCi(0.27015);
            setMaxIter(48);
            setZoom(1.0);
          }}
          className="px-3.5 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary flex items-center space-x-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Mathematical Display Formula */}
      <div
        className="math-display text-sm sm:text-base font-math"
        role="region"
        aria-label="Complex Julia Dynamics Formulation: fc(z) = z² + c; c = cr + i·ci ∈ ℂ; J(fc) = ∂K(fc)"
      >
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-3 sm:gap-x-5">
          <div className="inline-flex items-center">
            <var className="math-var">f</var><sub><var className="math-var">c</var></sub>(<var className="math-var">z</var>) <span className="math-op">=</span> <var className="math-var">z</var>² <span className="math-op">+</span> <var className="math-var">c</var>
          </div>
          <span className="math-delimiter hidden sm:inline" aria-hidden="true">|</span>
          <div className="inline-flex items-center">
            <var className="math-var">c</var> <span className="math-op">=</span> <var className="math-var">c</var><sub><var className="math-var">r</var></sub> <span className="math-op">+</span> <var className="math-var">i</var> <span className="math-op">·</span> <var className="math-var">c</var><sub><var className="math-var">i</var></sub> <span className="math-op">∈</span> ℂ
          </div>
          <span className="math-delimiter hidden sm:inline" aria-hidden="true">|</span>
          <div className="inline-flex items-center">
            <var className="math-var">J</var>(<var className="math-var">f</var><sub><var className="math-var">c</var></sub>) <span className="math-op">=</span> <span className="math-op">∂</span><var className="math-var">K</var>(<var className="math-var">f</var><sub><var className="math-var">c</var></sub>)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 bg-paper-bg-base rounded border-2 border-paper-border-strong overflow-hidden relative aspect-video flex items-center justify-center math-grid shadow-inner">
          <div className="absolute top-2 left-2 text-[9px] font-mono text-ink-muted tracking-widest uppercase pointer-events-none bg-paper-bg-base/80 px-1.5 py-0.5 rounded border border-paper-border-subtle shadow-xs">
            ℂ Argand Plane • |z| ≤ 2
          </div>
          <canvas ref={canvasRef} width={400} height={250} className="w-full h-full block" />
        </div>

        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="p-4 rounded border border-paper-border-strong bg-paper-bg-base space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-paper-border-subtle pb-2">
              <span className="text-academic-amber font-bold uppercase tracking-wider text-[11px] font-serif">
                Complex Coordinates
              </span>
              <span className="text-[10px] text-ink-muted font-math">c ∈ ℂ</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Real component (cr):</span>
                <span className="text-academic-amber font-bold">{cr.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="-1.5"
                max="1.0"
                step="0.01"
                value={cr}
                onChange={(e) => setCr(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Imaginary component (ci):</span>
                <span className="text-academic-amber font-bold">{ci.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.01"
                value={ci}
                onChange={(e) => setCi(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Max Iterations:</span>
                <span className="text-academic-amber font-bold">{maxIter}</span>
              </div>
              <input
                type="range"
                min="16"
                max="96"
                step="4"
                value={maxIter}
                onChange={(e) => setMaxIter(parseInt(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Zoom Scale:</span>
                <span className="text-academic-amber font-bold">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-paper-border-subtle text-[10px] text-ink-muted font-serif italic">
              Connected Julia set occurs when critical point 0 does not escape under iteration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. Simplicial Homology & Topological Filtration Component (Plate IV)
   ========================================================================= */
const HomologySimulator: React.FC = () => {
  const { readingMode } = usePreferences();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [epsilon, setEpsilon] = useState<number>(65);
  const draggingIdxRef = useRef<number | null>(null);

  // Deterministic topological point set forming two prominent cavities
  const createDualCavities = () => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      pts.push({ x: 180 + Math.cos(a) * 60, y: 150 + Math.sin(a) * 60 });
    }
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      pts.push({ x: 380 + Math.cos(a) * 60, y: 150 + Math.sin(a) * 60 });
    }
    return pts;
  };

  const [points, setPoints] = useState<{ x: number; y: number }[]>(createDualCavities);

  // Preset loaders
  const loadSingleRing = () => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      pts.push({ x: 280 + Math.cos(a) * 90, y: 150 + Math.sin(a) * 90 });
    }
    setPoints(pts);
    setEpsilon(50);
  };

  const loadRandomCloud = () => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 22; i++) {
      pts.push({
        x: 60 + Math.random() * 440,
        y: 40 + Math.random() * 220,
      });
    }
    setPoints(pts);
  };

  // Calculate Betti numbers and 1-simplices / 2-simplices
  const [stats, setStats] = useState({ b0: 0, b1: 0, edgesCount: 0, trianglesCount: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const n = points.length;
    const adj: number[][] = Array.from({ length: n }, () => []);
    const edgePairs: [number, number][] = [];

    // Construct 1-simplices (Edges where dist <= epsilon)
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (dist <= epsilon) {
          adj[i].push(j);
          adj[j].push(i);
          edgePairs.push([i, j]);
        }
      }
    }

    // Construct 2-simplices (Filled triangles where all 3 pairwise dist <= epsilon)
    let triangles = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (!adj[i].includes(j)) continue;
        for (let k = j + 1; k < n; k++) {
          if (adj[i].includes(k) && adj[j].includes(k)) {
            triangles++;
            // Draw filled triangle simplex: Archival oxblood wash in light, warm amber wash in dark
            ctx.fillStyle = readingMode
              ? 'rgba(136, 19, 55, 0.15)'
              : 'rgba(217, 119, 6, 0.16)';
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.lineTo(points[k].x, points[k].y);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    }

    // Draw 1-simplices (Edges): Deep cobalt ink in light, glowing amber in dark
    ctx.strokeStyle = readingMode
      ? 'rgba(30, 58, 95, 0.85)'
      : 'rgba(217, 119, 6, 0.75)';
    ctx.lineWidth = 1.3;
    edgePairs.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[j].x, points[j].y);
      ctx.stroke();
    });

    // Draw 0-simplices (Vertices) & epsilon balls
    points.forEach((pt) => {
      // Epsilon neighborhood metric ball: Warm ochre in light, muted parchment in dark
      ctx.strokeStyle = readingMode
        ? 'rgba(146, 64, 14, 0.25)'
        : 'rgba(184, 173, 150, 0.22)';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, epsilon / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Vertex point: Deep cobalt with oxblood rim in light mode; parchment with glowing amber rim in dark mode
      ctx.fillStyle = readingMode ? '#1e3a5f' : '#ede8df';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = readingMode ? '#881337' : '#d97706';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });

    // Compute Connected Components (B0) using BFS
    const visited = new Array(n).fill(false);
    let components = 0;
    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        components++;
        const queue = [i];
        visited[i] = true;
        while (queue.length > 0) {
          const curr = queue.shift()!;
          adj[curr].forEach((neighbor) => {
            if (!visited[neighbor]) {
              visited[neighbor] = true;
              queue.push(neighbor);
            }
          });
        }
      }
    }

    // First Betti number approximation via Euler Characteristic: χ = V - E + F = b0 - b1
    const b0 = components;
    const b1 = Math.max(0, edgePairs.length - n - triangles + b0);

    setStats({
      b0,
      b1,
      edgesCount: edgePairs.length,
      trianglesCount: triangles,
    });
  }, [points, epsilon, readingMode]);

  // Interactive pointer handlers to add/drag vertices
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    // Check if clicking near an existing vertex to drag
    const foundIdx = points.findIndex((pt) => Math.hypot(pt.x - x, pt.y - y) <= 14);
    if (foundIdx !== -1) {
      draggingIdxRef.current = foundIdx;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for environments lacking pointer capture
      }
    } else {
      // Clicked empty space: add new vertex
      if (points.length < 35) {
        setPoints((prev) => [...prev, { x, y }]);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggingIdxRef.current !== null) {
      const { x, y } = getCanvasCoords(e);
      setPoints((prev) => {
        const copy = [...prev];
        copy[draggingIdxRef.current!] = { x, y };
        return copy;
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggingIdxRef.current !== null) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Fallback for environments lacking pointer capture
      }
      draggingIdxRef.current = null;
    }
  };

  const eulerChi = points.length - stats.edgesCount + stats.trianglesCount;

  return (
    <div className="space-y-6">
      {/* Plate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border-subtle">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted font-semibold">
            Plate IV • Algebraic Topology &amp; Filtration
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
            Vietoris-Rips Simplicial Complex Filtration
          </h3>
          <p className="text-xs text-ink-muted font-mono mt-1">
            Topological Data Analysis tracking homology invariants across varying filtration scale ε.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setPoints(createDualCavities());
              setEpsilon(65);
            }}
            className="px-3 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Dual Cavities</span>
          </button>
          <button
            onClick={loadSingleRing}
            className="px-3 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary transition-colors"
          >
            Single Ring
          </button>
          <button
            onClick={loadRandomCloud}
            className="px-3 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary transition-colors"
          >
            Random Cloud
          </button>
          <button
            onClick={() => setPoints([])}
            className="px-2.5 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-dim hover:text-ink-primary transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Mathematical Homology Definition */}
      <div
        className="math-display text-sm sm:text-base font-math"
        role="region"
        aria-label="Vietoris-Rips Homology Definition: VR_ε(X) = { σ ⊆ X : diam(σ) ≤ ε } | χ = V − E + F = β₀ − β₁"
      >
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-3 sm:gap-x-5">
          <div className="inline-flex items-center">
            <span className="font-serif not-italic">VR</span><sub><var className="math-var">ε</var></sub>(<var className="math-var">X</var>) <span className="math-op">=</span> &#123; <var className="math-var">σ</var> <span className="math-op">⊆</span> <var className="math-var">X</var> <span className="px-1.5">:</span> <span className="font-serif not-italic">diam</span>(<var className="math-var">σ</var>) <span className="math-op">≤</span> <var className="math-var">ε</var> &#125;
          </div>
          <span className="math-delimiter hidden sm:inline" aria-hidden="true">|</span>
          <div className="inline-flex items-center">
            <var className="math-var">χ</var> <span className="math-op">=</span> <var className="math-var">V</var> <span className="math-op">−</span> <var className="math-var">E</var> <span className="math-op">+</span> <var className="math-var">F</var> <span className="math-op">=</span> <var className="math-var">β</var>₀ <span className="math-op">−</span> <var className="math-var">β</var>₁
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Topological Coordinate Canvas */}
        <div className="lg:col-span-8 bg-paper-bg-base rounded border-2 border-paper-border-strong overflow-hidden relative aspect-video flex items-center justify-center math-grid shadow-inner">
          <div className="absolute top-2 left-2 text-[9px] font-mono text-ink-muted tracking-widest uppercase pointer-events-none bg-paper-bg-base/80 px-1.5 py-0.5 rounded border border-paper-border-subtle shadow-xs">
            Topological Manifold • Drag to deform • Click to insert
          </div>
          <canvas
            ref={canvasRef}
            width={560}
            height={300}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full block cursor-crosshair select-none touch-none"
          />
        </div>

        {/* Filtration Modulation Panel */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="p-4 rounded border border-paper-border-strong bg-paper-bg-base space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-paper-border-subtle pb-2">
              <span className="text-academic-amber font-bold uppercase tracking-wider text-[11px] font-serif">
                Filtration Parameter
              </span>
              <span className="text-[10px] text-ink-muted font-math">ε ∈ [20, 130]</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Filtration Distance (ε):</span>
                <span className="text-academic-amber font-bold">{epsilon} px</span>
              </div>
              <input
                type="range"
                min="20"
                max="130"
                step="1"
                value={epsilon}
                onChange={(e) => setEpsilon(parseInt(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-paper-border-subtle space-y-2">
              <div className="text-ink-primary font-bold font-serif">Topological Invariants:</div>
              <div className="flex justify-between py-1 border-b border-paper-border-subtle text-ink-secondary">
                <span className="font-serif">Betti 0 (Components):</span>
                <span className="text-academic-amber font-bold">{stats.b0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-paper-border-subtle text-ink-secondary">
                <span className="font-serif">Betti 1 (Independent Cycles):</span>
                <span className="text-academic-amber font-bold">{stats.b1}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-paper-border-subtle text-ink-secondary">
                <span className="font-serif">Euler Characteristic (χ):</span>
                <span className="text-academic-amber font-bold">{eulerChi}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-paper-border-subtle text-ink-secondary">
                <span>0-simplices (Vertices):</span>
                <span className="text-ink-primary font-bold">{points.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-paper-border-subtle text-ink-secondary">
                <span>1-simplices (Edges):</span>
                <span className="text-ink-primary">{stats.edgesCount}</span>
              </div>
              <div className="flex justify-between py-1 text-ink-secondary">
                <span>2-simplices (Triangles):</span>
                <span className="text-ink-primary">{stats.trianglesCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-paper-border-subtle text-[10px] text-ink-muted font-serif italic">
              Tip: Click empty space to add vertices • Drag vertices to manipulate cycles.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
