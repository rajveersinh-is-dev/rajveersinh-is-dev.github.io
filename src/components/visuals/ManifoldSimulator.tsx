import React, { useState, useEffect, useRef } from 'react';
import { usePreferences } from '../../context';
import { RotateCcw, Play, Pause, Eye } from 'lucide-react';

export type ManifoldType = 'clifford' | 'klein' | 'calabi-yau';

interface Point3D {
  x: number;
  y: number;
  z: number;
  u: number;
  v: number;
}

/**
 * Plate V: 3D Parametric Topological Manifold Visualizer
 *
 * Renders 3D stereographic and immersion manifolds using pure HTML5 Canvas 2D
 * isometric / perspective transformations with zero external 3D libraries.
 *
 * Supported surfaces:
 * 1. Clifford Torus in S^3 (stereographic projection from R^4)
 * 2. Klein Bottle (figure-8 non-orientable topological immersion in R^3)
 * 3. Calabi-Yau 6D Quintic Three-Fold Cross-Section in C^2 ~ R^4
 */
export const ManifoldSimulator: React.FC = () => {
  const { theme, readingMode } = usePreferences();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Surface and rendering configuration
  const [surfaceType, setSurfaceType] = useState<ManifoldType>('clifford');
  const [renderMode, setRenderMode] = useState<'wireframe' | 'dither'>('dither');
  const [isRotating, setIsRotating] = useState(true);

  // Modulation Parameters
  const [resolution, setResolution] = useState(28); // Mesh grid resolution (N x N)
  const [zoom, setZoom] = useState(1.1);
  const [paramMod, setParamMod] = useState(1.4); // Clifford pole distance / deformation

  // Orbit rotation angles (Euler angles in radians)
  const [rotX, setRotX] = useState(0.45);
  const [rotY, setRotY] = useState(0.65);

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Reset view angles
  const handleReset = () => {
    setRotX(0.45);
    setRotY(0.65);
    setZoom(1.1);
    setParamMod(1.4);
    setIsRotating(true);
  };

  // Drag interaction to orbit surface in 3D
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + dx * 0.012);
    setRotX((prev) => Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev + dy * 0.012)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // Continuous auto-rotation when not dragging
  useEffect(() => {
    if (!isRotating) return;
    let animId: number;
    const spin = () => {
      if (!isDraggingRef.current) {
        setRotY((prev) => (prev + 0.006) % (Math.PI * 2));
      }
      animId = requestAnimationFrame(spin);
    };
    animId = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(animId);
  }, [isRotating]);

  // Compute 3D coordinates for (u, v) based on surface equations
  const computePoint = (u: number, v: number, type: ManifoldType, pMod: number): Point3D => {
    if (type === 'clifford') {
      // 1. Clifford Torus in S^3 stereographically projected from 4D
      // x1 = r*cos(u), x2 = r*sin(u), x3 = r*cos(v), x4 = r*sin(v)
      // r = 1/sqrt(2)
      const r = 1 / Math.SQRT2;
      const x1 = r * Math.cos(u);
      const x2 = r * Math.sin(u);
      const x3 = r * Math.cos(v);
      const x4 = r * Math.sin(v);

      // Stereographic projection: (X, Y, Z) = (x1, x2, x3) / (pole - x4)
      const pole = Math.max(1.1, pMod);
      const denom = pole - x4;
      return {
        x: (x1 / denom) * 1.8,
        y: (x2 / denom) * 1.8,
        z: (x3 / denom) * 1.8,
        u,
        v,
      };
    } else if (type === 'klein') {
      // 2. Klein Bottle Figure-8 Immersion in R^3
      // u in [0, 2pi], v in [0, 2pi]
      const r = pMod + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v);
      const x = r * Math.cos(u);
      const y = r * Math.sin(u);
      const z = Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v);
      return {
        x: x * 0.9,
        y: y * 0.9,
        z: z * 1.3,
        u,
        v,
      };
    } else {
      // 3. Calabi-Yau 6D Quintic Three-Fold Cross Section
      // Fermat quintic: z1^5 + z2^5 = 1
      const n = 5;
      const cu = Math.cos(u);
      const su = Math.sin(u);
      const r1 = Math.pow(Math.abs(cu), 2 / n) * Math.sign(cu);
      const r2 = Math.pow(Math.abs(su), 2 / n) * Math.sign(su);

      const alpha = pMod;
      const x = r1 * Math.cos(v) * 1.6;
      const y = r1 * Math.sin(v) * 1.6;
      const z = (r2 * Math.cos(v + alpha) * 0.8 + r2 * Math.sin(v + alpha) * 0.8) * 1.5;
      return { x, y, z, u, v };
    }
  };

  // Canvas render effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background fill
    const isDark = !readingMode;
    const isAmber = theme === 'amber-crt';
    ctx.fillStyle = isAmber ? '#0a0802' : isDark ? '#121110' : '#faf7f0';
    ctx.fillRect(0, 0, width, height);

    // Subtle coordinate grid in background
    ctx.strokeStyle = isAmber ? '#1a1408' : isDark ? '#24211e' : '#dfd8c7';
    ctx.lineWidth = 0.5;
    for (let x = 20; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 20; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3D Rotation matrices: Rx(rotX) and Ry(rotY)
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const project = (pt: Point3D) => {
      // Rotate around Y axis
      const x1 = pt.x * cosY + pt.z * sinY;
      const y1 = pt.y;
      const z1 = -pt.x * sinY + pt.z * cosY;

      // Rotate around X axis
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Perspective projection
      const cameraDist = 4.2;
      const fov = 380 * zoom;
      const depth = cameraDist - z2;
      const safeDepth = depth > 0.4 ? depth : 0.4;

      return {
        sx: width / 2 + (x2 / safeDepth) * fov,
        sy: height / 2 - (y2 / safeDepth) * fov,
        depth: z2,
      };
    };

    // Generate mesh grid of points
    const N = resolution;
    const uStep = (Math.PI * 2) / N;
    const vStep = (Math.PI * 2) / N;

    const grid: { sx: number; sy: number; depth: number }[][] = [];

    for (let i = 0; i <= N; i++) {
      const u = i * uStep;
      grid[i] = [];
      for (let j = 0; j <= N; j++) {
        const v = j * vStep;
        const pt = computePoint(u, v, surfaceType, paramMod);
        grid[i][j] = project(pt);
      }
    }

    // Sort quadrilateral mesh faces back-to-front (Painter's algorithm)
    interface QuadFace {
      i: number;
      j: number;
      avgDepth: number;
    }

    const faces: QuadFace[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const p0 = grid[i][j];
        const p1 = grid[i + 1][j];
        const p2 = grid[i + 1][j + 1];
        const p3 = grid[i][j + 1];
        const avgDepth = (p0.depth + p1.depth + p2.depth + p3.depth) / 4;
        faces.push({ i, j, avgDepth });
      }
    }

    // Sort by depth ascending (farthest first)
    faces.sort((a, b) => a.avgDepth - b.avgDepth);

    // 4x4 Bayer Matrix for authentic retro stippled halftone shading
    const bayer4x4 = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5],
    ];

    // Colors
    const primaryColor = isAmber ? '#ffd24d' : isDark ? '#d97706' : '#92400e';
    const wireColor = isAmber ? '#ffb000' : isDark ? '#ede8df' : '#1c1917';
    const fillColorBase = isAmber ? 'rgba(255, 176, 0, 0.12)' : isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(30, 58, 95, 0.12)';

    // Render faces
    faces.forEach((face) => {
      const p0 = grid[face.i][face.j];
      const p1 = grid[face.i + 1][face.j];
      const p2 = grid[face.i + 1][face.j + 1];
      const p3 = grid[face.i][face.j + 1];

      // Draw quadrilateral face
      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.lineTo(p2.sx, p2.sy);
      ctx.lineTo(p3.sx, p3.sy);
      ctx.closePath();

      if (renderMode === 'dither') {
        // Compute pseudo-lighting intensity based on depth and position
        const intensity = Math.max(0.05, Math.min(0.95, (face.avgDepth + 1.8) / 3.6));
        const bayerThreshold = Math.floor(intensity * 16);

        // Fill background translucency
        ctx.fillStyle = fillColorBase;
        ctx.fill();

        // Stipple dither dot inside face center if passes Bayer test
        const cx = Math.floor((p0.sx + p1.sx + p2.sx + p3.sx) / 4);
        const cy = Math.floor((p0.sy + p1.sy + p2.sy + p3.sy) / 4);
        const bayerVal = bayer4x4[Math.abs(cy % 4)][Math.abs(cx % 4)];

        if (bayerVal < bayerThreshold) {
          ctx.fillStyle = primaryColor;
          ctx.fillRect(cx - 1, cy - 1, 2, 2);
        }

        // Clean outline
        ctx.strokeStyle = isAmber ? 'rgba(255, 176, 0, 0.35)' : isDark ? 'rgba(217, 119, 6, 0.35)' : 'rgba(30, 58, 95, 0.35)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      } else {
        // Wireframe Mode
        ctx.strokeStyle = wireColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    // Outer HUD overlay
    ctx.fillStyle = isAmber ? '#ffd24d' : isDark ? '#ede8df' : '#1c1917';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`AZIMUTH: ${(rotY % (Math.PI * 2)).toFixed(2)} rad | ELEVATION: ${rotX.toFixed(2)} rad`, 16, height - 16);
    ctx.fillText(`RES: ${N}×${N} | SCALE: ${zoom.toFixed(2)}x`, 16, height - 30);
  }, [surfaceType, renderMode, resolution, zoom, paramMod, rotX, rotY, theme, readingMode]);

  return (
    <div className="space-y-6">
      {/* Plate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border-subtle">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted font-semibold">
            Plate V • Topological Manifolds &amp; Invariants
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
            3D Parametric Topological Manifold Visualizer
          </h3>
          <p className="text-xs text-ink-muted font-mono mt-1">
            Stereographic 4D immersions, non-orientable topological surfaces, and Calabi-Yau compactifications.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Surface Selector Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-mono text-ink-muted font-semibold hidden sm:inline">Manifold:</span>
            <select
              value={surfaceType}
              onChange={(e) => setSurfaceType(e.target.value as ManifoldType)}
              className="px-2.5 py-1.5 rounded border border-paper-border-strong bg-paper-bg-base text-ink-primary text-xs font-mono font-semibold cursor-pointer shadow-xs focus:ring-1 focus:ring-academic-amber"
            >
              <option value="clifford">Clifford Torus in 𝕊³ (Flat Torus in ℝ⁴)</option>
              <option value="klein">Klein Bottle (Figure-8 Non-Orientable Immersion)</option>
              <option value="calabi-yau">Calabi-Yau 6D Quintic Cross-Section</option>
            </select>
          </div>

          <button
            onClick={() => setRenderMode(renderMode === 'dither' ? 'wireframe' : 'dither')}
            className="px-3 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-academic-amber" />
            <span>{renderMode === 'dither' ? '1-Bit Dither' : 'Wireframe'}</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-secondary hover:text-ink-primary flex items-center space-x-1 cursor-pointer transition-colors"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5 text-academic-amber" /> : <Play className="w-3.5 h-3.5 text-academic-amber" />}
            <span>{isRotating ? 'Pause' : 'Orbit'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-xs font-mono text-ink-muted hover:text-ink-primary cursor-pointer transition-colors"
            title="Reset Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mathematical Formulation Display Plate */}
      <div
        className="math-display text-sm sm:text-base font-math"
        role="region"
        aria-label="Topological Manifold Invariant Formulation"
      >
        {surfaceType === 'clifford' && (
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-3 text-xs sm:text-sm">
            <span>𝕋² ⊂ 𝕊³ ⊂ ℝ⁴:</span>
            <span><var className="math-var">x</var>₁ = <span className="math-fraction"><span className="math-fraction-num">1</span><span className="math-fraction-den">√2</span></span> cos <var className="math-var">u</var>,</span>
            <span><var className="math-var">x</var>₃ = <span className="math-fraction"><span className="math-fraction-num">1</span><span className="math-fraction-den">√2</span></span> cos <var className="math-var">v</var></span>
            <span className="math-delimiter" aria-hidden="true">|</span>
            <span>Stereographic Projection: Π : 𝕊³ → ℝ³, (<var className="math-var">X</var>, <var className="math-var">Y</var>, <var className="math-var">Z</var>) = <span className="math-fraction"><span className="math-fraction-num">(<var className="math-var">x</var>₁, <var className="math-var">x</var>₂, <var className="math-var">x</var>₃)</span><span className="math-fraction-den"><var className="math-var">d</var> − <var className="math-var">x</var>₄</span></span></span>
            <span className="math-delimiter" aria-hidden="true">|</span>
            <span className="text-academic-amber font-mono font-bold">Euler χ = 0</span>
          </div>
        )}

        {surfaceType === 'klein' && (
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-3 text-xs sm:text-sm">
            <span>Klein Immersion:</span>
            <span><var className="math-var">r</var> = <var className="math-var">d</var> + cos(<span className="math-fraction"><span className="math-fraction-num"><var className="math-var">u</var></span><span className="math-fraction-den">2</span></span>) sin <var className="math-var">v</var> − sin(<span className="math-fraction"><span className="math-fraction-num"><var className="math-var">u</var></span><span className="math-fraction-den">2</span></span>) sin(2<var className="math-var">v</var>)</span>
            <span className="math-delimiter" aria-hidden="true">|</span>
            <span>(<var className="math-var">X</var>, <var className="math-var">Y</var>) = (<var className="math-var">r</var> cos <var className="math-var">u</var>, <var className="math-var">r</var> sin <var className="math-var">u</var>)</span>
            <span className="math-delimiter" aria-hidden="true">|</span>
            <span className="text-academic-amber font-mono font-bold">Non-Orientable (Orientability H₁ = ℤ ⊕ ℤ/2ℤ)</span>
          </div>
        )}

        {surfaceType === 'calabi-yau' && (
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-3 text-xs sm:text-sm">
            <span>Fermat Quintic Three-Fold Cross-Section:</span>
            <span><var className="math-var">z</var>₁⁵ + <var className="math-var">z</var>₂⁵ = 1  in  ℂ² ≅ ℝ⁴</span>
            <span className="math-delimiter" aria-hidden="true">|</span>
            <span>Projection: Π(Re <var className="math-var">z</var>₁, Im <var className="math-var">z</var>₁, <var className="math-var">z</var>₂ · <var className="math-var">e</var><sup>iα</sup>)</span>
            <span className="math-delimiter" aria-hidden="true">|</span>
            <span className="text-academic-amber font-mono font-bold">Hodge Numbers: <var className="math-var">h</var><sup>1,1</sup> = 1, <var className="math-var">h</var><sup>2,1</sup> = 101</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive 3D Canvas Reticle */}
        <div className="lg:col-span-8 bg-paper-bg-base rounded border-2 border-paper-border-strong overflow-hidden relative aspect-video flex items-center justify-center math-grid shadow-inner">
          <div className="absolute top-2 left-2 text-[9px] font-mono text-ink-muted tracking-widest uppercase pointer-events-none bg-paper-bg-base/80 px-2 py-0.5 rounded border border-paper-border-subtle shadow-xs">
            3D Isometric Manifold • Drag to Orbit View
          </div>
          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full block cursor-grab active:cursor-grabbing touch-none select-none"
          />
        </div>

        {/* Sliders Calibration Panel */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="p-4 rounded border border-paper-border-strong bg-paper-bg-base space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-paper-border-subtle pb-2">
              <span className="text-academic-amber font-bold uppercase tracking-wider text-[11px] font-serif">
                Manifold Calibration
              </span>
              <span className="text-[10px] text-ink-muted">Euler / Isometric</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Mesh Grid Resolution (N):</span>
                <span className="text-academic-amber font-bold">{resolution}×{resolution}</span>
              </div>
              <input
                type="range"
                min="16"
                max="44"
                step="2"
                value={resolution}
                onChange={(e) => setResolution(parseInt(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">Zoom / Scale:</span>
                <span className="text-academic-amber font-bold">{zoom.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="2.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-ink-secondary">
                <span className="font-serif">
                  {surfaceType === 'clifford' ? 'Stereographic Pole (d):' : surfaceType === 'klein' ? 'Core Radius (r₀):' : 'Fibration Phase (α):'}
                </span>
                <span className="text-academic-amber font-bold">{paramMod.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.1"
                max="3.0"
                step="0.05"
                value={paramMod}
                onChange={(e) => setParamMod(parseFloat(e.target.value))}
                className="w-full accent-academic-amber bg-paper-bg-elevated cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-paper-border-subtle space-y-1.5 text-[10px] text-ink-muted font-serif">
              <div>
                <span className="font-bold text-ink-secondary font-mono">Bayer 1-Bit Stippling:</span> Dynamic depth-based halftone dots computed directly on projected facets.
              </div>
              <div className="italic text-ink-dim">
                Drag canvas directly with fine cursor to inspect manifold geodesics and self-intersection lines.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
