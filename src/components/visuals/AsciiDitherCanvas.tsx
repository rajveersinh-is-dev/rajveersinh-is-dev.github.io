import React, { useEffect, useRef, useState } from 'react';

export type VisualMode = 'ascii-field' | 'dither-distortion' | 'hidden-structures' | 'hybrid';

interface AsciiDitherCanvasProps {
  mode?: VisualMode;
  density?: 'compact' | 'normal' | 'sparse';
  opacity?: number;
  className?: string;
  interactive?: boolean;
}

// Fixed Bayer 4x4 matrix for ordered dithering
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

// Mathematical glyph palette ordered by perceived visual density
const MATH_GLYPHS = [' ', '·', ':', '+', '×', '∂', '∫', '∑', '∇', '∆', '#', '█'];

export const AsciiDitherCanvas: React.FC<AsciiDitherCanvasProps> = ({
  mode = 'hybrid',
  density = 'normal',
  opacity = 0.85,
  className = '',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Interaction tracking with lerping
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 140,
    isInteracting: false,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Intersection observer to stop animation when not in viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cellSpacing = density === 'compact' ? 14 : density === 'sparse' ? 24 : 18;

    // Simulation grid particles for spring displacement
    interface GridNode {
      baseX: number;
      baseY: number;
      curX: number;
      curY: number;
      vx: number;
      vy: number;
      glyphIndex: number;
      revealLevel: number;
    }
    let gridNodes: GridNode[] = [];

    // Underlying mathematical structure: Clifford attractor parameters
    const clifford = {
      a: -1.4,
      b: 1.6,
      c: 1.0,
      d: 0.7,
      points: [] as { x: number; y: number }[],
    };

    // Precompute attractor points
    const generateAttractor = (w: number, h: number) => {
      clifford.points = [];
      let x = 0.1;
      let y = 0.1;
      const total = 1200;
      const scale = Math.min(w, h) * 0.22;
      for (let i = 0; i < total; i++) {
        const nx = Math.sin(clifford.a * y) + clifford.c * Math.cos(clifford.a * x);
        const ny = Math.sin(clifford.b * x) + clifford.d * Math.cos(clifford.b * y);
        x = nx;
        y = ny;
        if (i > 50) {
          clifford.points.push({
            x: w * 0.5 + x * scale,
            y: h * 0.5 + y * scale,
          });
        }
      }
    };

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / cellSpacing);
      rows = Math.ceil(height / cellSpacing);

      // Initialize grid nodes
      gridNodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * cellSpacing + cellSpacing / 2;
          const by = r * cellSpacing + cellSpacing / 2;
          gridNodes.push({
            baseX: bx,
            baseY: by,
            curX: bx,
            curY: by,
            vx: 0,
            vy: 0,
            glyphIndex: (r + c) % MATH_GLYPHS.length,
            revealLevel: 0,
          });
        }
      }

      generateAttractor(width, height);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      // Mouse position smoothing (lerp)
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.12;
      m.y += (m.targetY - m.y) * 0.12;
      m.vx = m.x - m.lastX;
      m.vy = m.y - m.lastY;
      m.lastX = m.x;
      m.lastY = m.y;

      // Clear canvas with subtle trail
      ctx.clearRect(0, 0, width, height);

      // Render mode: A. ASCII Field & Spring Displacement
      if (mode === 'ascii-field' || mode === 'hybrid') {
        ctx.font = `600 ${cellSpacing * 0.65}px ui-monospace, Menlo, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const len = gridNodes.length;
        for (let i = 0; i < len; i++) {
          const node = gridNodes[i];

          // Compute distance to pointer
          const dx = node.curX - m.x;
          const dy = node.curY - m.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = m.radius * m.radius;

          if (interactive && distSq < radiusSq && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / m.radius) * 18;
            const angle = Math.atan2(dy, dx);
            // Repulsive displacement with directional tangential drag
            node.vx += Math.cos(angle) * force * 0.4 + m.vx * 0.08;
            node.vy += Math.sin(angle) * force * 0.4 + m.vy * 0.08;
            node.revealLevel = Math.min(node.revealLevel + 0.15, 1);
          } else {
            node.revealLevel = Math.max(node.revealLevel - 0.02, 0);
          }

          // Hooke's spring force returning to base position
          const springK = 0.08;
          const damping = 0.82;
          const fBaseX = (node.baseX - node.curX) * springK;
          const fBaseY = (node.baseY - node.curY) * springK;

          node.vx = (node.vx + fBaseX) * damping;
          node.vy = (node.vy + fBaseY) * damping;

          node.curX += node.vx;
          node.curY += node.vy;

          // Compute harmonic wave intensity
          const wave = Math.sin(node.baseX * 0.015 + time) * Math.cos(node.baseY * 0.015 + time * 0.8);
          const normalized = (wave + 1) * 0.5;

          // Interpolate glyph based on reveal and wave
          const glyphIdx = Math.floor(
            (normalized * 0.6 + node.revealLevel * 0.4) * (MATH_GLYPHS.length - 1)
          );
          const glyph = MATH_GLYPHS[Math.max(0, Math.min(glyphIdx, MATH_GLYPHS.length - 1))];

          if (glyph !== ' ') {
            if (node.revealLevel > 0.2) {
              ctx.fillStyle = `rgba(245, 158, 11, ${0.4 + node.revealLevel * 0.55})`; // Amber highlight
            } else {
              const alpha = (0.12 + normalized * 0.18) * opacity;
              ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`; // Muted slate
            }
            ctx.fillText(glyph, node.curX, node.curY);
          }
        }
      }

      // Render mode: B. Dithered Distortion & procedural ripples
      if (mode === 'dither-distortion' || mode === 'hybrid') {
        const step = cellSpacing * 1.5;
        const dCols = Math.ceil(width / step);
        const dRows = Math.ceil(height / step);

        for (let r = 0; r < dRows; r++) {
          for (let c = 0; c < dCols; c++) {
            const x = c * step;
            const y = r * step;

            // Distance to pointer creates a ripple perturbation
            const dist = Math.hypot(x - m.x, y - m.y);
            const ripple = Math.sin(dist * 0.05 - time * 3) * Math.exp(-dist * 0.008);

            const val = (Math.sin(x * 0.02 + time) + Math.cos(y * 0.02 + time) + ripple * 2 + 2) / 4;
            const bayerX = c % 4;
            const bayerY = r % 4;
            const threshold = BAYER_4X4[bayerY][bayerX] / 16;

            if (val > threshold && val < threshold + 0.35) {
              const dAlpha = (0.04 + (dist < m.radius ? 0.18 : 0)) * opacity;
              ctx.fillStyle = dist < m.radius ? 'rgba(255, 119, 0, 0.45)' : `rgba(100, 116, 139, ${dAlpha})`;
              ctx.fillRect(x, y, 2, 2);
            }
          }
        }
      }

      // Render mode: C. Hidden Mathematical Structures (Clifford / Geometric Attractor)
      if (mode === 'hidden-structures' || mode === 'hybrid') {
        const pts = clifford.points;
        const pLen = pts.length;

        // Draw attractor points
        for (let i = 0; i < pLen; i += 2) {
          const pt = pts[i];
          const distToMouse = Math.hypot(pt.x - m.x, pt.y - m.y);

          // Structure is revealed when mouse is near
          if (distToMouse < m.radius * 1.3) {
            const proximity = 1 - distToMouse / (m.radius * 1.3);
            ctx.fillStyle = `rgba(245, 158, 11, ${proximity * 0.8})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.2 + proximity * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby points to form a visible simplicial mesh / graph
            if (i > 0 && Math.hypot(pt.x - pts[i - 1].x, pt.y - pts[i - 1].y) < 45) {
              ctx.strokeStyle = `rgba(255, 119, 0, ${proximity * 0.35})`;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(pts[i - 1].x, pts[i - 1].y);
              ctx.stroke();
            }
          } else {
            // Subtle ambient structure in background
            ctx.fillStyle = `rgba(51, 65, 85, ${0.08 * opacity})`;
            ctx.fillRect(pt.x, pt.y, 1, 1);
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // If reduced motion is requested, render once statically
    if (prefersReducedMotion) {
      render();
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [mode, density, opacity, interactive, prefersReducedMotion, isVisible]);

  // Pointer event handlers with touch support
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    mouseRef.current.isInteracting = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.targetX = e.clientX - rect.left;
    mouseRef.current.targetY = e.clientY - rect.top;
    mouseRef.current.isInteracting = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = -1000;
    mouseRef.current.targetY = -1000;
    mouseRef.current.isInteracting = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={interactive ? handlePointerDown : undefined}
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="interactive-canvas absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
