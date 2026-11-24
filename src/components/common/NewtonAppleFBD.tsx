import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePreferences } from '../../context';
import { audioService } from '../../utils/audioFeedback';

interface NewtonAppleFBDProps {
  onDismiss: () => void;
  initialX?: number;
}

type AppleMode = 'falling' | 'grounded' | 'dragging' | 'thrown';

export const NewtonAppleFBD: React.FC<NewtonAppleFBDProps> = ({ onDismiss, initialX }) => {
  const { theme } = usePreferences();
  const [mode, setMode] = useState<AppleMode>('falling');
  const [showToast, setShowToast] = useState<boolean>(false);

  // References for zero-latency direct DOM updates
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appleGroupRef = useRef<SVGGElement | null>(null);
  const velLineRef = useRef<SVGLineElement | null>(null);
  const velTextRef = useRef<SVGTextElement | null>(null);
  const dragLineRef = useRef<SVGLineElement | null>(null);
  const dragTextRef = useRef<SVGTextElement | null>(null);
  const accLineRef = useRef<SVGLineElement | null>(null);
  const accTextRef = useRef<SVGTextElement | null>(null);
  const normalLineRef = useRef<SVGLineElement | null>(null);
  const normalTextRef = useRef<SVGTextElement | null>(null);
  const equilibriumTextRef = useRef<SVGTextElement | null>(null);
  const hudStateRef = useRef<HTMLSpanElement | null>(null);
  const hudVelRef = useRef<HTMLSpanElement | null>(null);
  const hudAccRef = useRef<HTMLSpanElement | null>(null);

  const startX = initialX ?? (typeof window !== 'undefined' ? window.innerWidth * 0.38 : 300);
  const startY = -60;

  // High-performance physics state kept in refs (no React state updates in RAF loop)
  const posRef = useRef<{ x: number; y: number }>({
    x: startX,
    y: startY,
  });
  const velRef = useRef<{ x: number; y: number }>({ x: 45, y: 160 });
  const accRef = useRef<{ x: number; y: number }>({ x: 0, y: 980 });
  const rotRef = useRef<number>(18);
  const rotVelRef = useRef<number>(45); // Natural tumble angular velocity in deg/s
  const modeRef = useRef<AppleMode>('falling');

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Keyboard shortcut: Escape closes the simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  // Pointer drag tracking
  const isDraggingRef = useRef<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragSamplesRef = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const lastTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Direct GPU DOM update helper
  const updateDOM = useCallback(() => {
    const { x, y } = posRef.current;
    const { x: vx, y: vy } = velRef.current;
    const { x: ax, y: ay } = accRef.current;
    const rot = rotRef.current;
    const curMode = modeRef.current;
    const speed = Math.hypot(vx, vy);
    const accMag = Math.hypot(ax, ay);

    // 1. Move container via GPU translate3d with no CSS transition
    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${x - 40}px, ${y - 40}px, 0)`;
    }

    // 2. Rotate apple body
    if (appleGroupRef.current) {
      appleGroupRef.current.style.transform = `rotate(${rot}deg)`;
    }

    // 3. Normal force (grounded)
    const isGrounded = curMode === 'grounded';
    if (normalLineRef.current) normalLineRef.current.style.display = isGrounded ? 'block' : 'none';
    if (normalTextRef.current) normalTextRef.current.style.display = isGrounded ? 'block' : 'none';
    if (equilibriumTextRef.current) equilibriumTextRef.current.style.display = isGrounded ? 'block' : 'none';

    // 4. Velocity vector (moving)
    const showVel = !isGrounded && speed > 20;
    if (velLineRef.current && velTextRef.current) {
      velLineRef.current.style.display = showVel ? 'block' : 'none';
      velTextRef.current.style.display = showVel ? 'block' : 'none';
      if (showVel) {
        const vScale = Math.min(75, Math.max(22, speed * 0.1));
        const vDirX = (vx / speed) * vScale;
        const vDirY = (vy / speed) * vScale;
        velLineRef.current.setAttribute('x2', `${vDirX}`);
        velLineRef.current.setAttribute('y2', `${vDirY}`);
        velTextRef.current.setAttribute('x', `${vDirX + 6}`);
        velTextRef.current.setAttribute('y', `${vDirY}`);
        velTextRef.current.textContent = `v: ${Math.round(speed)}px/s`;
      }
    }

    // 5. Drag force vector (opposing velocity in flight)
    const showDrag = (curMode === 'falling' || curMode === 'thrown') && speed > 35;
    if (dragLineRef.current && dragTextRef.current) {
      dragLineRef.current.style.display = showDrag ? 'block' : 'none';
      dragTextRef.current.style.display = showDrag ? 'block' : 'none';
      if (showDrag) {
        const dragScale = Math.min(60, Math.max(18, speed * 0.08));
        const dragDirX = (-vx / speed) * dragScale;
        const dragDirY = (-vy / speed) * dragScale;
        dragLineRef.current.setAttribute('x2', `${dragDirX}`);
        dragLineRef.current.setAttribute('y2', `${dragDirY}`);
        dragTextRef.current.setAttribute('x', `${dragDirX + 6}`);
        dragTextRef.current.setAttribute('y', `${dragDirY}`);
      }
    }

    // 6. Acceleration vector (dragging)
    const showAcc = curMode === 'dragging' && accMag > 50;
    if (accLineRef.current && accTextRef.current) {
      accLineRef.current.style.display = showAcc ? 'block' : 'none';
      accTextRef.current.style.display = showAcc ? 'block' : 'none';
      if (showAcc) {
        const accScale = Math.min(70, Math.max(20, accMag * 0.04));
        const accDirX = (ax / accMag) * accScale;
        const accDirY = (ay / accMag) * accScale;
        accLineRef.current.setAttribute('x2', `${accDirX}`);
        accLineRef.current.setAttribute('y2', `${accDirY}`);
        accTextRef.current.setAttribute('x', `${accDirX + 6}`);
        accTextRef.current.setAttribute('y', `${accDirY}`);
        accTextRef.current.textContent = `a: ${Math.round(accMag)}px/s²`;
      }
    }

    // 7. Telemetry HUD text
    if (hudStateRef.current) hudStateRef.current.textContent = curMode.toUpperCase();
    if (hudVelRef.current) hudVelRef.current.textContent = `|v|: ${Math.round(speed)} px/s`;
    if (hudAccRef.current) hudAccRef.current.textContent = `|a|: ${Math.round(accMag)} px/s²`;
  }, []);

  // Trigger discovery chime once on mount
  useEffect(() => {
    audioService.playEasterEggChime();
  }, []);

  // Main physics loop: 60/120fps with zero React state thrashing
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = now;
      const dt = Math.min(0.033, Math.max(0.001, (now - lastTimeRef.current) / 1000));
      lastTimeRef.current = now;

      const currentMode = modeRef.current;
      const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const groundY = winH - 52;

      if (!isDraggingRef.current && (currentMode === 'falling' || currentMode === 'thrown')) {
        const g = 1400; // px/s²
        const cd = 0.00085; // aerodynamic drag
        const curVel = velRef.current;
        const curPos = posRef.current;
        const speed = Math.hypot(curVel.x, curVel.y);

        // Aerodynamic drag force Fd = -cd * v * |v|
        const fdx = -cd * curVel.x * speed;
        const fdy = -cd * curVel.y * speed;

        const newAx = fdx / 0.15;
        const newAy = g + fdy / 0.15;

        let newVx = curVel.x + newAx * dt;
        let newVy = curVel.y + newAy * dt;

        let newX = curPos.x + newVx * dt;
        let newY = curPos.y + newVy * dt;
        let newRot = rotRef.current + (rotVelRef.current + newVx * 0.25) * dt;

        // Ground collision check
        if (newY >= groundY && newX >= -80 && newX <= winW + 80) {
          newY = groundY;
          if (Math.abs(newVy) > 90) {
            // Restitution bounce
            newVy = -newVy * 0.40;
            newVx = newVx * 0.70;
            // Ground bounce imparts torque and spin
            rotVelRef.current = -newVx * 0.8 + (Math.random() - 0.5) * 40;
            audioService.playAppleBounce(Math.min(1.5, Math.abs(newVy) / 380));
          } else {
            // Settle on ground naturally on its curved side/cheek (not upright)
            newVy = 0;
            newVx = 0;
            rotVelRef.current = 0;
            const rollDir = Math.sign(newVx) || (rotRef.current >= 0 ? 1 : -1) || 1;
            newRot = rollDir * 64; // Natural resting tilt angle ~64°
            modeRef.current = 'grounded';
            setMode('grounded');
          }
        }

        // Screen exit check when thrown
        if (currentMode === 'thrown') {
          const isOffScreen =
            newX < -150 || newX > winW + 150 || newY < -150 || newY > winH + 150;
          if (isOffScreen) {
            audioService.playAppleThrow();
            setShowToast(true);
            setTimeout(() => {
              onDismiss();
            }, 600);
            return;
          }
        }

        posRef.current = { x: newX, y: newY };
        velRef.current = { x: newVx, y: newVy };
        accRef.current = { x: newAx, y: newAy };
        rotRef.current = newRot;

        updateDOM();
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [onDismiss, updateDOM]);

  // Pointer drag handlers: butter-smooth direct tracking
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    modeRef.current = 'dragging';
    setMode('dragging');

    dragOffsetRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    dragSamplesRef.current = [
      { x: e.clientX, y: e.clientY, time: performance.now() },
    ];
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;

    const samples = dragSamplesRef.current;
    samples.push({ x: e.clientX, y: e.clientY, time: now });
    if (samples.length > 5) samples.shift();

    let computedVx = 0;
    let computedVy = 0;
    let computedAx = 0;
    let computedAy = 0;

    if (samples.length >= 2) {
      const p1 = samples[0];
      const p2 = samples[samples.length - 1];
      const dtSec = Math.max(0.008, (p2.time - p1.time) / 1000);
      computedVx = (p2.x - p1.x) / dtSec;
      computedVy = (p2.y - p1.y) / dtSec;

      const prevVx = velRef.current.x;
      const prevVy = velRef.current.y;
      computedAx = (computedVx - prevVx) / dtSec;
      computedAy = (computedVy - prevVy) / dtSec;
    }

    posRef.current = { x: newX, y: newY };
    velRef.current = { x: computedVx, y: computedVy };
    accRef.current = { x: computedAx, y: computedAy };
    rotRef.current = computedVx * 0.05;
    rotVelRef.current = computedVx * 0.2;

    updateDOM();
  }, [updateDOM]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    isDraggingRef.current = false;
    const curVel = velRef.current;
    const speed = Math.hypot(curVel.x, curVel.y);
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const curPos = posRef.current;

    // Check if thrown with speed or dragged beyond screen boundaries
    if (speed > 240 || curPos.x < 30 || curPos.x > winW - 30 || curPos.y < 30) {
      modeRef.current = 'thrown';
      setMode('thrown');
      audioService.playAppleThrow();
    } else if (curPos.y >= winH - 75) {
      modeRef.current = 'grounded';
      setMode('grounded');
      velRef.current = { x: 0, y: 0 };
      accRef.current = { x: 0, y: 0 };
      rotVelRef.current = 0;
      const rollDir = Math.sign(curVel.x) || (rotRef.current >= 0 ? 1 : -1) || 1;
      rotRef.current = rollDir * 64; // Settle naturally on side
      posRef.current.y = winH - 52;
      updateDOM();
    } else {
      modeRef.current = 'falling';
      setMode('falling');
    }
  }, [updateDOM]);

  // Initial values for SSR/first paint
  const isAmber = theme === 'amber-crt';
  const isPaper = theme === 'paper';

  const appleFill = isAmber ? '#ffb000' : isPaper ? '#c2410c' : '#dc2626';
  const appleStroke = isAmber ? '#ffd24d' : isPaper ? '#7c2d12' : '#991b1b';
  const stemColor = isAmber ? '#805800' : '#78350f';
  const leafColor = isAmber ? '#ffb000' : '#16a34a';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none font-mono"
      aria-label="Newton's Apple Free Body Diagram Physics Simulation"
    >
      {/* Off-screen escape announcement toast */}
      {showToast && (
        <div className="absolute top-6 inset-x-0 mx-auto w-max max-w-sm px-4 py-2 rounded border border-academic-amber bg-black/85 text-academic-amber text-xs text-center shadow-lg pointer-events-auto">
          ⚡ Newton's apple escaped into orbital space (<code className="font-bold">v &gt; v_esc</code>)!
        </div>
      )}

      {/* Ground contact line indicator */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 border-t border-academic-amber/30 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(217, 119, 6, 0.2) 6px, rgba(217, 119, 6, 0.2) 12px)',
        }}
      />

      {/* Main Interactive Physics Container (Hardware Accelerated) */}
      <div
        ref={containerRef}
        className="absolute pointer-events-auto cursor-grab active:cursor-grabbing touch-none will-change-transform"
        style={{
          transform: `translate3d(${startX - 40}px, ${startY - 40}px, 0)`,
          width: '80px',
          height: '80px',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Newtonian Apple: Drag to observe forces, or throw outside screen!"
      >
        {/* SVG Free Body Diagram & Apple Body */}
        <svg
          viewBox="-110 -110 220 220"
          className="w-[220px] h-[220px] absolute -top-[70px] -left-[70px] overflow-visible pointer-events-none"
        >
          <defs>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
            </marker>
            <marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
            </marker>
          </defs>

          {/* 1. Downward Gravity Force Vector (W = mg) */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="50"
            stroke="#ef4444"
            strokeWidth="2.5"
            markerEnd="url(#arrow-red)"
          />
          <text
            x="8"
            y="54"
            fill="#ef4444"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            Fg = mg
          </text>

          {/* 2. Upward Normal Force Vector N (when grounded) */}
          <line
            ref={normalLineRef}
            x1="0"
            y1="0"
            x2="0"
            y2="-50"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#arrow-emerald)"
            style={{ display: mode === 'grounded' ? 'block' : 'none' }}
          />
          <text
            ref={normalTextRef}
            x="8"
            y="-46"
            fill="#10b981"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            style={{ display: mode === 'grounded' ? 'block' : 'none' }}
          >
            N = 1.47N ↑
          </text>
          <text
            ref={equilibriumTextRef}
            x="-55"
            y="-65"
            fill="#10b981"
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
            style={{ display: mode === 'grounded' ? 'block' : 'none' }}
          >
            ΣF = N - mg = 0
          </text>

          {/* 3. Drag Force Fd (opposing velocity in air) */}
          <line
            ref={dragLineRef}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="#06b6d4"
            strokeWidth="2"
            markerEnd="url(#arrow-cyan)"
            style={{ display: 'none' }}
          />
          <text
            ref={dragTextRef}
            x="0"
            y="0"
            fill="#06b6d4"
            fontSize="8"
            fontFamily="monospace"
            style={{ display: 'none' }}
          >
            F_drag
          </text>

          {/* 4. Velocity Vector v */}
          <line
            ref={velLineRef}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#arrow-emerald)"
            style={{ display: 'none' }}
          />
          <text
            ref={velTextRef}
            x="0"
            y="0"
            fill="#10b981"
            fontSize="8"
            fontFamily="monospace"
            style={{ display: 'none' }}
          >
            v
          </text>

          {/* 5. Acceleration Vector a (when dragging) */}
          <line
            ref={accLineRef}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="#f97316"
            strokeWidth="2"
            markerEnd="url(#arrow-orange)"
            style={{ display: 'none' }}
          />
          <text
            ref={accTextRef}
            x="0"
            y="0"
            fill="#f97316"
            fontSize="8"
            fontFamily="monospace"
            style={{ display: 'none' }}
          >
            a
          </text>

          {/* Rotatable Apple Body Centered at Origin */}
          <g ref={appleGroupRef}>
            {/* Apple Stem */}
            <path
              d="M 0 -18 C 2 -26, 8 -30, 9 -34"
              stroke={stemColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Apple Leaf */}
            <path
              d="M 2 -22 C 9 -28, 18 -26, 21 -30 C 18 -20, 9 -18, 2 -22 Z"
              fill={leafColor}
              stroke={isAmber ? '#ffd24d' : '#14532d'}
              strokeWidth="1"
            />
            {/* Apple Body */}
            <path
              d="M 0 -18 C 12 -25, 26 -14, 26 2 C 26 20, 14 26, 0 23 C -14 26, -26 20, -26 2 C -26 -14, -12 -25, 0 -18 Z"
              fill={appleFill}
              stroke={appleStroke}
              strokeWidth="2"
              className="drop-shadow-md"
            />
            {/* Specular Highlight Sheen */}
            <path
              d="M -15 -8 C -12 -16, -4 -16, -2 -14 C -6 -12, -12 -6, -15 -8 Z"
              fill={isAmber ? '#fff' : '#fecaca'}
              opacity="0.45"
            />
            {/* Center of Mass Reticle ⊕ */}
            <circle cx="0" cy="2" r="4.5" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.8" />
            <line x1="-3" y1="2" x2="3" y2="2" stroke="#fff" strokeWidth="1" opacity="0.8" />
            <line x1="0" y1="-1" x2="0" y2="5" stroke="#fff" strokeWidth="1" opacity="0.8" />
            <text x="7" y="5" fill="#fff" fontSize="7" opacity="0.85" fontFamily="monospace">
              CM
            </text>
          </g>
        </svg>

        {/* Floating Physics Telemetry Badge */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute -top-24 left-14 min-w-[210px] p-2 rounded border border-academic-amber/60 bg-black/90 backdrop-blur-xs text-ink-primary shadow-xl pointer-events-auto select-none cursor-default"
          style={{ fontSize: '9px', lineHeight: '1.4' }}
        >
          <div className="flex items-center justify-between border-b border-paper-border-strong pb-1 mb-1 font-bold text-academic-amber">
            <span>FBD • m = 0.150 kg</span>
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="text-ink-muted hover:text-red-400 hover:bg-white/10 active:scale-90 cursor-pointer w-5 h-5 flex items-center justify-center rounded text-sm font-bold leading-none transition-colors"
              title="Close Easter egg"
              aria-label="Close Easter egg"
            >
              ×
            </button>
          </div>
          <div className="text-ink-muted">
            STATE: <span ref={hudStateRef} className="text-academic-amber uppercase font-semibold">{mode}</span>
          </div>
          <div className="flex justify-between">
            <span ref={hudVelRef}>|v|: 0 px/s</span>
            <span ref={hudAccRef}>|a|: 0 px/s²</span>
          </div>
          <div className="text-[8px] text-ink-dim pt-1 border-t border-paper-border-strong/60 mt-1 flex justify-between items-center">
            <span>Drag to test forces</span>
            <span className="text-academic-amber">Throw off-screen ↗</span>
          </div>
        </div>
      </div>
    </div>
  );
};
