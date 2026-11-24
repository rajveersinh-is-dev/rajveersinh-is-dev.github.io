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

  // Position, velocity, acceleration, rotation
  const [pos, setPos] = useState<{ x: number; y: number }>(() => ({
    x: initialX ?? (typeof window !== 'undefined' ? window.innerWidth * 0.38 : 300),
    y: -60,
  }));
  const [vel, setVel] = useState<{ x: number; y: number }>({ x: 40, y: 160 });
  const [acc, setAcc] = useState<{ x: number; y: number }>({ x: 0, y: 980 });
  const [rot, setRot] = useState<number>(0);
  const [mode, setMode] = useState<AppleMode>('falling');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Animation frame and drag refs
  const posRef = useRef(pos);
  const velRef = useRef(vel);
  const accRef = useRef(acc);
  const rotRef = useRef(rot);
  const modeRef = useRef(mode);

  useEffect(() => {
    posRef.current = pos;
    velRef.current = vel;
    accRef.current = acc;
    rotRef.current = rot;
    modeRef.current = mode;
  }, [pos, vel, acc, rot, mode]);

  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragSamplesRef = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const lastTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Trigger discovery chime once on mount
  useEffect(() => {
    audioService.playEasterEggChime();
  }, []);

  // Main physics loop
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const currentMode = modeRef.current;
      const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const groundY = winH - 52; // Ground height

      if (currentMode === 'falling' || currentMode === 'thrown') {
        const g = 1380; // px/s²
        const cd = 0.0009; // aerodynamic drag
        const curVel = velRef.current;
        const curPos = posRef.current;
        const speed = Math.hypot(curVel.x, curVel.y);

        // Aerodynamic drag force Fd = -cd * v * |v|
        const fdx = -cd * curVel.x * speed;
        const fdy = -cd * curVel.y * speed;

        const newAcc = {
          x: fdx / 0.15,
          y: g + fdy / 0.15,
        };

        const newVx = curVel.x + newAcc.x * dt;
        const newVy = curVel.y + newAcc.y * dt;

        let newX = curPos.x + newVx * dt;
        let newY = curPos.y + newVy * dt;
        let newRot = rotRef.current + (curVel.x * 0.15) * dt * 50;

        // Ground collision check
        if (newY >= groundY && newX >= -80 && newX <= winW + 80) {
          newY = groundY;
          if (Math.abs(newVy) > 100) {
            // Restitution bounce
            const bounceVy = -newVy * 0.42;
            const bounceVx = newVx * 0.72;
            audioService.playAppleBounce(Math.min(1.5, Math.abs(newVy) / 400));
            velRef.current = { x: bounceVx, y: bounceVy };
          } else {
            // Settle on ground
            setMode('grounded');
            modeRef.current = 'grounded';
            velRef.current = { x: 0, y: 0 };
            newRot = 0;
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
            }, 800);
            return;
          }
        }

        setPos({ x: newX, y: newY });
        setVel(velRef.current);
        setAcc(newAcc);
        setRot(newRot);
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [onDismiss]);

  // Pointer drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setMode('dragging');
    modeRef.current = 'dragging';

    dragOffsetRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    dragSamplesRef.current = [
      { x: e.clientX, y: e.clientY, time: performance.now() },
    ];
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (modeRef.current !== 'dragging') return;

    const now = performance.now();
    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;

    // Track pointer movement for dynamic velocity and acceleration
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

    setPos({ x: newX, y: newY });
    setVel({ x: computedVx, y: computedVy });
    setAcc({ x: computedAx, y: computedAy });
    setRot(computedVx * 0.05);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const curVel = velRef.current;
    const speed = Math.hypot(curVel.x, curVel.y);
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const curPos = posRef.current;

    // If released with high velocity or outside screen, it's thrown!
    if (
      speed > 280 ||
      curPos.x < 20 ||
      curPos.x > winW - 20 ||
      curPos.y < 20
    ) {
      setMode('thrown');
      modeRef.current = 'thrown';
      audioService.playAppleThrow();
    } else if (curPos.y >= winH - 75) {
      // Sits on ground
      setMode('grounded');
      modeRef.current = 'grounded';
      setVel({ x: 0, y: 0 });
      setPos({ x: curPos.x, y: winH - 52 });
    } else {
      // Drop under gravity
      setMode('falling');
      modeRef.current = 'falling';
    }
  }, []);

  const speed = Math.hypot(vel.x, vel.y);
  const accMag = Math.hypot(acc.x, acc.y);

  // Theme palettes for vector diagram
  const isAmber = theme === 'amber-crt';
  const isPaper = theme === 'paper';

  const appleFill = isAmber ? '#ffb000' : isPaper ? '#c2410c' : '#dc2626';
  const appleStroke = isAmber ? '#ffd24d' : isPaper ? '#7c2d12' : '#991b1b';
  const stemColor = isAmber ? '#805800' : '#78350f';
  const leafColor = isAmber ? '#ffb000' : '#16a34a';

  // Dynamic vector arrows from Center of Mass (0, 0)
  // 1. Gravity (Weight W = mg)
  const fgLen = 50;

  // 2. Normal force N (when grounded)
  const showNormal = mode === 'grounded';
  const nLen = 50;

  // 3. Velocity vector v (when moving)
  const showVelocity = mode !== 'grounded' && speed > 25;
  const vScale = Math.min(80, Math.max(22, speed * 0.1));
  const vDirX = speed > 0 ? (vel.x / speed) * vScale : 0;
  const vDirY = speed > 0 ? (vel.y / speed) * vScale : 0;

  // 4. Drag force Fd (opposing velocity when in air)
  const showDrag = (mode === 'falling' || mode === 'thrown') && speed > 35;
  const dragScale = Math.min(65, Math.max(18, speed * 0.08));
  const dragDirX = speed > 0 ? (-vel.x / speed) * dragScale : 0;
  const dragDirY = speed > 0 ? (-vel.y / speed) * dragScale : 0;

  // 5. Applied force / Acceleration (when dragging)
  const showAcc = mode === 'dragging' && accMag > 50;
  const accScale = Math.min(75, Math.max(20, accMag * 0.04));
  const accDirX = accMag > 0 ? (acc.x / accMag) * accScale : 0;
  const accDirY = accMag > 0 ? (acc.y / accMag) * accScale : 0;

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

      {/* Ground contact line indicator when apple is near bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 border-t border-academic-amber/30 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(217, 119, 6, 0.2) 6px, rgba(217, 119, 6, 0.2) 12px)',
        }}
      />

      {/* Main Interactive Physics Container */}
      <div
        className="absolute pointer-events-auto cursor-grab active:cursor-grabbing touch-none transition-transform"
        style={{
          transform: `translate3d(${pos.x - 40}px, ${pos.y - 40}px, 0)`,
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
            {/* Arrowhead Markers */}
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
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* 1. Downward Gravity Force Vector (W = mg) */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={fgLen}
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray={mode === 'grounded' ? 'none' : '3 2'}
            markerEnd="url(#arrow-red)"
          />
          <text
            x="8"
            y={fgLen + 4}
            fill="#ef4444"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            Fg = mg
          </text>

          {/* 2. Upward Normal Force Vector N (when grounded) */}
          {showNormal && (
            <>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={-nLen}
                stroke="#10b981"
                strokeWidth="2.5"
                markerEnd="url(#arrow-emerald)"
              />
              <text
                x="8"
                y={-nLen + 4}
                fill="#10b981"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                N = 1.47N ↑
              </text>
              {/* Static equilibrium tag */}
              <text
                x="-55"
                y="-65"
                fill="#10b981"
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
                className="bg-black/80 px-1 py-0.5 rounded"
              >
                ΣF = N - mg = 0
              </text>
            </>
          )}

          {/* 3. Drag Force Fd (opposing velocity in air) */}
          {showDrag && (
            <>
              <line
                x1="0"
                y1="0"
                x2={dragDirX}
                y2={dragDirY}
                stroke="#06b6d4"
                strokeWidth="2"
                markerEnd="url(#arrow-cyan)"
              />
              <text
                x={dragDirX + 6}
                y={dragDirY}
                fill="#06b6d4"
                fontSize="8"
                fontFamily="monospace"
              >
                F_drag
              </text>
            </>
          )}

          {/* 4. Velocity Vector v */}
          {showVelocity && (
            <>
              <line
                x1="0"
                y1="0"
                x2={vDirX}
                y2={vDirY}
                stroke="#10b981"
                strokeWidth="2"
                markerEnd="url(#arrow-emerald)"
              />
              <text
                x={vDirX + 6}
                y={vDirY}
                fill="#10b981"
                fontSize="8"
                fontFamily="monospace"
              >
                v: {Math.round(speed)}px/s
              </text>
            </>
          )}

          {/* 5. Acceleration Vector a (when dragging) */}
          {showAcc && (
            <>
              <line
                x1="0"
                y1="0"
                x2={accDirX}
                y2={accDirY}
                stroke="#f97316"
                strokeWidth="2"
                markerEnd="url(#arrow-orange)"
              />
              <text
                x={accDirX + 6}
                y={accDirY}
                fill="#f97316"
                fontSize="8"
                fontFamily="monospace"
              >
                a = d²r/dt²
              </text>
            </>
          )}

          {/* Rotatable Apple Body Centered at Origin */}
          <g transform={`rotate(${rot})`}>
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
          className="absolute -top-24 left-14 min-w-[210px] p-2 rounded border border-academic-amber/60 bg-black/90 backdrop-blur-xs text-ink-primary shadow-xl pointer-events-auto"
          style={{ fontSize: '9px', lineHeight: '1.4' }}
        >
          <div className="flex items-center justify-between border-b border-paper-border-strong pb-1 mb-1 font-bold text-academic-amber">
            <span>FBD • m = 0.150 kg</span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-ink-muted hover:text-red-400 cursor-pointer px-1 text-[11px] font-bold"
              title="Close Easter egg"
            >
              ×
            </button>
          </div>
          <div className="text-ink-muted">
            STATE: <span className="text-academic-amber uppercase font-semibold">{mode}</span>
          </div>
          <div className="flex justify-between">
            <span>|v|: {Math.round(speed)} px/s</span>
            <span>|a|: {Math.round(accMag)} px/s²</span>
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
