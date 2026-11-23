import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !isCoarse && !prefersReducedMotion;
  });

  const [isOverCanvas, setIsOverCanvas] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const coordsLabelRef = useRef<HTMLDivElement | null>(null);

  const isOverCanvasRef = useRef(false);
  const isHoveringRef = useRef(false);
  const magneticOffset = useRef({ x: 0, y: 0 });

  const pos = useRef({
    x: -100,
    y: -100,
    targetX: -100,
    targetY: -100,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const coarseMedia = window.matchMedia('(pointer: coarse)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateEnabled = () => {
      const active = !coarseMedia.matches && !motionMedia.matches;
      setEnabled(active);
    };

    coarseMedia.addEventListener('change', updateEnabled);
    motionMedia.addEventListener('change', updateEnabled);

    if (coarseMedia.matches || motionMedia.matches) {
      return () => {
        coarseMedia.removeEventListener('change', updateEnabled);
        motionMedia.removeEventListener('change', updateEnabled);
      };
    }

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if cursor is over an interactive canvas or charted astronomical SVG
      const canvasEl = target.closest('canvas, [data-reticle-cursor="true"]');
      const overCanvas = Boolean(canvasEl);

      if (overCanvas !== isOverCanvasRef.current) {
        isOverCanvasRef.current = overCanvas;
        setIsOverCanvas(overCanvas);
      }

      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect();
        const cx = Math.round(e.clientX - rect.left);
        const cy = Math.round(e.clientY - rect.top);
        if (coordsLabelRef.current) {
          coordsLabelRef.current.textContent = `[${cx}, ${cy}]`;
        }
      }

      // Check for magnetic interactive controls
      const interactiveEl = target.closest(
        'button, a, [role="button"], input, select, textarea'
      ) as HTMLElement | null;

      const hovering = Boolean(interactiveEl && !canvasEl);
      if (hovering !== isHoveringRef.current) {
        isHoveringRef.current = hovering;
        setIsHoveringInteractive(hovering);
      }

      if (hovering && interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pullX = (centerX - e.clientX) * 0.28;
        const pullY = (centerY - e.clientY) * 0.28;
        magneticOffset.current = { x: pullX, y: pullY };
      } else {
        magneticOffset.current = { x: 0, y: 0 };
      }
    };

    const render = () => {
      if (isOverCanvasRef.current) {
        // Pinpoint reticle alignment directly on current cursor target
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${pos.current.targetX}px, ${pos.current.targetY}px, 0)`;
        }
      } else {
        pos.current.x += (pos.current.targetX - pos.current.x) * 0.24;
        pos.current.y += (pos.current.targetY - pos.current.y) * 0.24;

        if (cursorRef.current) {
          const cx = pos.current.x + magneticOffset.current.x;
          const cy = pos.current.y + magneticOffset.current.y;
          cursorRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        }

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${pos.current.targetX}px, ${pos.current.targetY}px, 0)`;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      coarseMedia.removeEventListener('change', updateEnabled);
      motionMedia.removeEventListener('change', updateEnabled);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none" aria-hidden="true">
      {/* Reticle Mode over Interactive Canvases */}
      {isOverCanvas ? (
        <div
          ref={cursorRef}
          className="absolute -top-4 -left-4 flex items-center justify-center transition-opacity duration-150"
        >
          {/* Fine Coordinate Reticle */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute w-8 h-[1px] bg-academic-amber/70" />
            <div className="absolute h-8 w-[1px] bg-academic-amber/70" />
            <div className="w-3 h-3 rounded-full border border-academic-amber bg-academic-amber/10 shadow-xs" />
          </div>

          {/* Live Monospace Coordinates Pill */}
          <div
            ref={coordsLabelRef}
            className="absolute left-8 top-1 bg-paper-bg-base/95 border border-paper-border-strong px-1.5 py-0.5 rounded-xs font-mono text-[9px] text-academic-amber whitespace-nowrap shadow-xs backdrop-blur-xs"
          >
            [0, 0]
          </div>
        </div>
      ) : (
        <>
          {/* Outer Spring Ring with Magnetic Expansion */}
          <div
            ref={cursorRef}
            className={`absolute -top-3.5 -left-3.5 rounded-full border pointer-events-none transition-all duration-150 flex items-center justify-center ${
              isHoveringInteractive
                ? 'w-10 h-10 -top-5 -left-5 border-academic-amber/80 bg-academic-amber/10 scale-110 shadow-xs'
                : 'w-7 h-7 border-ink-primary/35 bg-transparent'
            }`}
          />

          {/* Sharp Center Dot */}
          <div
            ref={dotRef}
            className={`absolute -top-1 -left-1 w-2 h-2 rounded-full pointer-events-none transition-colors duration-100 ${
              isHoveringInteractive ? 'bg-academic-amber scale-75' : 'bg-ink-primary/75'
            }`}
          />
        </>
      )}
    </div>
  );
};
