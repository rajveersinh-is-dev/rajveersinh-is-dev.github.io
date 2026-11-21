import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';

type PlaygroundTab = 'lorenz' | 'cellular' | 'fractal' | 'homology';

export const PlaygroundSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('lorenz');

  return (
    <section id="playground" className="py-20 border-t border-border-subtle relative bg-bg-base/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
              <span>09 // Computational Laboratory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
              Mathematical Visual Playground
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-bg-surface border border-border-subtle self-start md:self-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab('lorenz')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'lorenz'
                  ? 'bg-amber-500 text-bg-void font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              1. Lorenz Attractor
            </button>
            <button
              onClick={() => setActiveTab('cellular')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'cellular'
                  ? 'bg-amber-500 text-bg-void font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              2. Cellular Automata
            </button>
            <button
              onClick={() => setActiveTab('fractal')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'fractal'
                  ? 'bg-amber-500 text-bg-void font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              3. Complex Fractal
            </button>
            <button
              onClick={() => setActiveTab('homology')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'homology'
                  ? 'bg-amber-500 text-bg-void font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              4. Simplicial Homology
            </button>
          </div>
        </div>

        {/* Educational Disclaimer Banner */}
        <div className="p-3.5 rounded-lg bg-bg-surface border border-border-subtle flex items-start space-x-2 text-xs font-mono text-text-muted">
          <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <span>
            Demonstration Notice: These interactive mathematical models illustrate canonical non-linear dynamics, cellular emergence, complex fractals, and topological simplicial filtrations. They are educational demonstrations, not original research discoveries.
          </span>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-bg-surface rounded-xl border border-border-medium overflow-hidden shadow-2xl p-6">
          {activeTab === 'lorenz' && <LorenzSimulator />}
          {activeTab === 'cellular' && <CellularSimulator />}
          {activeTab === 'fractal' && <FractalSimulator />}
          {activeTab === 'homology' && <HomologySimulator />}
        </div>
      </div>
    </section>
  );
};

/* =========================================================================
   1. Lorenz Attractor Simulation Component
   ========================================================================= */
const LorenzSimulator: React.FC = () => {
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
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Dark translucent fade for continuous motion trail
      ctx.fillStyle = 'rgba(7, 8, 10, 0.12)';
      ctx.fillRect(0, 0, w, h);

      if (isRunning) {
        // Integrate several sub-steps per frame for smooth trajectory
        for (let s = 0; s < 6; s++) {
          const { x, y, z } = stateRef.current;
          const dx = sigma * (y - x);
          const dy = x * (rho - z) - y;
          const dz = x * y - beta * z;

          stateRef.current.x += dx * dt;
          stateRef.current.y += dy * dt;
          stateRef.current.z += dz * dt;

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

      // 3D Isometric projection
      const cx = w / 2;
      const cy = h / 2 + 30;
      const scale = Math.min(w, h) * 0.016;
      const cosA = Math.cos(stateRef.current.angle);
      const sinA = Math.sin(stateRef.current.angle);

      const trail = stateRef.current.trail;
      const tLen = trail.length;

      if (tLen > 1) {
        ctx.lineWidth = 1.2;
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
          ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        }

        // Current tip marker
        const last = trail[tLen - 1];
        const lx = cx + (last.x * cosA - last.y * sinA) * scale;
        const ly = cy - (last.z - 25) * scale + (last.x * sinA + last.y * cosA) * scale * 0.3;
        ctx.fillStyle = '#ff7700';
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, sigma, rho, beta, dt]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-lg font-bold text-text-primary">
            Lorenz Strange Attractor (Non-Linear ODE System)
          </h3>
          <p className="text-xs text-text-secondary font-mono">
            dx/dt = σ(y - x) &nbsp;|&nbsp; dy/dt = x(ρ - z) - y &nbsp;|&nbsp; dz/dt = xy - βz
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 rounded bg-bg-elevated border border-border-subtle hover:border-amber-500/50 text-xs font-mono flex items-center space-x-1.5 text-text-primary"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={resetSimulation}
            className="px-3 py-1.5 rounded bg-bg-elevated border border-border-subtle hover:border-amber-500/50 text-xs font-mono flex items-center space-x-1.5 text-text-secondary hover:text-text-primary"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Display */}
        <div className="lg:col-span-8 bg-bg-void rounded-lg border border-border-subtle overflow-hidden relative aspect-video flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            className="w-full h-full block"
          />
        </div>

        {/* Controls Slider Panel */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="p-4 rounded-lg bg-bg-elevated border border-border-subtle space-y-3">
            <div className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">
              Attractor Parameters
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Prandtl Number (σ):</span>
                <span className="text-amber-400 font-bold">{sigma.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                value={sigma}
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Rayleigh Number (ρ):</span>
                <span className="text-amber-400 font-bold">{rho.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="50.0"
                step="0.5"
                value={rho}
                onChange={(e) => setRho(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Geometric Ratio (β):</span>
                <span className="text-amber-400 font-bold">{beta.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Integration Step (dt):</span>
                <span className="text-amber-400 font-bold">{dt.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.002"
                max="0.015"
                step="0.001"
                value={dt}
                onChange={(e) => setDt(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. Cellular Automata (Conway's Game of Life) Component
   ========================================================================= */
const CellularSimulator: React.FC = () => {
  const COLS = 48;
  const ROWS = 30;

  const [grid, setGrid] = useState<number[][]>(() => createEmptyGrid(ROWS, COLS));
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

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
    // Glider
    const midR = Math.floor(ROWS / 2);
    const midC = Math.floor(COLS / 2);
    next[midR][midC + 1] = 1;
    next[midR + 1][midC + 2] = 1;
    next[midR + 2][midC] = 1;
    next[midR + 2][midC + 1] = 1;
    next[midR + 2][midC + 2] = 1;
    // Pulsar nearby
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
      copy[r][c] = copy[r][c] ? 0 : 1;
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-lg font-bold text-text-primary">
            Cellular Automata (Conway Emergence Engine)
          </h3>
          <p className="text-xs text-text-secondary font-mono">
            Deterministic discrete lattice updates generating Turing-complete emergent structures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-bg-void text-xs font-mono font-bold flex items-center space-x-1"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Run'}</span>
          </button>
          <button
            onClick={stepSimulation}
            className="px-3 py-1.5 rounded bg-bg-elevated border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary"
          >
            Step
          </button>
          <button
            onClick={randomizeGrid}
            className="px-3 py-1.5 rounded bg-bg-elevated border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary"
          >
            Randomize
          </button>
          <button
            onClick={loadPresetGlider}
            className="px-3 py-1.5 rounded bg-bg-elevated border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary"
          >
            Preset Glider
          </button>
          <button
            onClick={() => {
              setGrid(createEmptyGrid(ROWS, COLS));
              setGeneration(0);
              setIsRunning(false);
            }}
            className="px-2.5 py-1.5 rounded bg-bg-elevated border border-border-subtle text-xs font-mono text-text-dim hover:text-text-primary"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-text-muted">
          <span>Click grid cells to draw or toggle states</span>
          <span>Generation: {generation}</span>
        </div>

        <div className="bg-bg-void p-3 rounded-lg border border-border-subtle overflow-x-auto">
          <div
            className="grid gap-0.5 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(10px, 1fr))`,
              maxWidth: '800px',
            }}
          >
            {grid.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  onClick={() => toggleCell(r, c)}
                  className={`aspect-square rounded-sm cursor-pointer transition-colors ${
                    val
                      ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                      : 'bg-[#12161f] hover:bg-[#1a212e]'
                  }`}
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
   3. Complex Fractal (Julia / Mandelbrot Parameter Tweaker) Component
   ========================================================================= */
const FractalSimulator: React.FC = () => {
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
        if (iter === maxIter) {
          data[idx] = 7;
          data[idx + 1] = 8;
          data[idx + 2] = 10;
          data[idx + 3] = 255;
        } else {
          // Color based on escape iteration (Monochromatic amber gradient)
          const norm = iter / maxIter;
          data[idx] = Math.floor(norm * 245);
          data[idx + 1] = Math.floor(norm * 158);
          data[idx + 2] = Math.floor(norm * 11);
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [cr, ci, maxIter, zoom]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-lg font-bold text-text-primary">
            Complex Julia Dynamics: z_(n+1) = z_n^2 + c
          </h3>
          <p className="text-xs text-text-secondary font-mono">
            Quadratic polynomial map on the complex plane with varying constant parameter c = cr + i·ci.
          </p>
        </div>

        <button
          onClick={() => {
            setCr(-0.7);
            setCi(0.27015);
            setMaxIter(48);
            setZoom(1.0);
          }}
          className="px-3 py-1.5 rounded bg-bg-elevated border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 bg-bg-void rounded-lg border border-border-subtle overflow-hidden relative aspect-video flex items-center justify-center">
          <canvas ref={canvasRef} width={400} height={250} className="w-full h-full block" />
        </div>

        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="p-4 rounded-lg bg-bg-elevated border border-border-subtle space-y-3">
            <div className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">
              Complex Coordinates
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Real component (cr):</span>
                <span className="text-amber-400 font-bold">{cr.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="-1.5"
                max="1.0"
                step="0.01"
                value={cr}
                onChange={(e) => setCr(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Imaginary component (ci):</span>
                <span className="text-amber-400 font-bold">{ci.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.01"
                value={ci}
                onChange={(e) => setCi(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Max Iterations:</span>
                <span className="text-amber-400 font-bold">{maxIter}</span>
              </div>
              <input
                type="range"
                min="16"
                max="96"
                step="4"
                value={maxIter}
                onChange={(e) => setMaxIter(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Zoom Scale:</span>
                <span className="text-amber-400 font-bold">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. Simplicial Homology & Topological Filtration Component
   ========================================================================= */
const HomologySimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [epsilon, setEpsilon] = useState<number>(65);

  // Fixed deterministic topological point set forming two prominent holes
  const [points, setPoints] = useState<{ x: number; y: number }[]>(() => {
    const pts: { x: number; y: number }[] = [];
    // Ring 1 (Left cavity)
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      pts.push({ x: 180 + Math.cos(a) * 60, y: 150 + Math.sin(a) * 60 });
    }
    // Ring 2 (Right cavity)
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      pts.push({ x: 380 + Math.cos(a) * 60, y: 150 + Math.sin(a) * 60 });
    }
    return pts;
  });

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
            // Draw filled triangle simplex
            ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
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

    // Draw 1-simplices (Edges)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1.2;
    edgePairs.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[j].x, points[j].y);
      ctx.stroke();
    });

    // Draw 0-simplices (Vertices) & epsilon balls
    points.forEach((pt) => {
      // Epsilon neighborhood circle
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, epsilon / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Vertex
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Compute Connected Components (B0) using BFS/Disjoint Set
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

    // Approximate 1st Betti number via Euler Characteristic: χ = V - E + F = b0 - b1
    // => b1 = E - V - F + b0
    const b0 = components;
    const b1 = Math.max(0, edgePairs.length - n - triangles + b0);

    setStats({
      b0,
      b1,
      edgesCount: edgePairs.length,
      trianglesCount: triangles,
    });
  }, [points, epsilon]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-lg font-bold text-text-primary">
            Vietoris-Rips Simplicial Complex Filtration
          </h3>
          <p className="text-xs text-text-secondary font-mono">
            Topological Data Analysis tracking homology invariants across varying filtration scale ε.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const pts: { x: number; y: number }[] = [];
              for (let i = 0; i < 10; i++) {
                const a = (i / 10) * Math.PI * 2;
                pts.push({ x: 180 + Math.cos(a) * 60, y: 150 + Math.sin(a) * 60 });
              }
              for (let i = 0; i < 10; i++) {
                const a = (i / 10) * Math.PI * 2;
                pts.push({ x: 380 + Math.cos(a) * 60, y: 150 + Math.sin(a) * 60 });
              }
              setPoints(pts);
              setEpsilon(65);
            }}
            className="px-3 py-1.5 rounded bg-bg-elevated border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Dual Cavities</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 bg-bg-void rounded-lg border border-border-subtle overflow-hidden relative aspect-video flex items-center justify-center">
          <canvas ref={canvasRef} width={560} height={300} className="w-full h-full block" />
        </div>

        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="p-4 rounded-lg bg-bg-elevated border border-border-subtle space-y-3">
            <div className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">
              Filtration Parameter
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Filtration Distance (ε):</span>
                <span className="text-amber-400 font-bold">{epsilon} px</span>
              </div>
              <input
                type="range"
                min="20"
                max="130"
                step="1"
                value={epsilon}
                onChange={(e) => setEpsilon(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-bg-base"
              />
            </div>

            <div className="pt-2 border-t border-border-subtle space-y-2">
              <div className="text-text-primary font-bold">Topological Invariants:</div>
              <div className="flex justify-between py-1 border-b border-border-subtle text-text-secondary">
                <span>Betti 0 (Components):</span>
                <span className="text-amber-400 font-bold">{stats.b0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle text-text-secondary">
                <span>Betti 1 (Independent Cycles):</span>
                <span className="text-amber-400 font-bold">{stats.b1}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle text-text-secondary">
                <span>1-simplices (Edges):</span>
                <span className="text-text-primary">{stats.edgesCount}</span>
              </div>
              <div className="flex justify-between py-1 text-text-secondary">
                <span>2-simplices (Triangles):</span>
                <span className="text-text-primary">{stats.trianglesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
