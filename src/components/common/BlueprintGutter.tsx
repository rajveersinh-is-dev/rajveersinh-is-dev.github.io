import React, { useState, useEffect } from 'react';

interface BlueprintGutterProps {
  side: 'left' | 'right';
}

/**
 * Desktop Margin Vernier Rails:
 * Fixed 20px-wide gutters on left and right margins displaying vertical pixel
 * coordinates and section tick marks (0000px ──┤, 0400px ──┤ § 01, etc.).
 */
export const BlueprintGutter: React.FC<BlueprintGutterProps> = ({ side }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section landmark thresholds (in pixels approximately or static markers)
  const ticks = [
    { px: 0, label: 'TOP' },
    { px: 400, label: '§ 01' },
    { px: 900, label: '§ 02' },
    { px: 1500, label: '§ 03' },
    { px: 2200, label: '§ 04' },
    { px: 2900, label: '§ 05' },
    { px: 3600, label: '§ 06' },
    { px: 4300, label: '§ 07' },
    { px: 5300, label: '§ 10' },
    { px: 6200, label: '§ 11' },
    { px: 7100, label: '§ 12' },
  ];

  const currentScrollPadded = String(Math.floor(scrollY)).padStart(4, '0');

  return (
    <aside
      aria-hidden="true"
      className={`hidden xl:flex fixed top-0 bottom-0 z-30 w-5 pointer-events-none select-none flex-col justify-between py-16 font-mono text-[9px] text-ink-dim/40 dark:text-ink-dim/50 ${
        side === 'left' ? 'left-1 items-start' : 'right-1 items-end'
      }`}
    >
      {/* Real-Time Vernier Coordinate Gauge */}
      <div
        className={`bg-paper-bg-base/80 backdrop-blur-xs py-1 px-0.5 rounded border border-paper-border-subtle/50 text-[8px] font-bold tracking-tighter text-academic-amber/80 ${
          side === 'left' ? 'text-left' : 'text-right'
        }`}
      >
        {side === 'left' ? `${currentScrollPadded}px──┤` : `├──${currentScrollPadded}px`}
      </div>

      {/* Vernier Tick Rail */}
      <div className="flex-1 flex flex-col justify-around py-4 w-full">
        {ticks.map((tick) => {
          const isNear = Math.abs(scrollY - tick.px) < 300;
          return (
            <div
              key={tick.px}
              className={`flex items-center space-x-0.5 transition-colors duration-200 ${
                isNear ? 'text-academic-amber font-bold opacity-100' : 'opacity-40'
              } ${side === 'left' ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}
            >
              <span className="text-[7px] tracking-tighter">
                {String(tick.px).padStart(4, '0')}
              </span>
              <span>{side === 'left' ? '──┤' : '├──'}</span>
              <span className="text-[7px] text-ink-muted/80">{tick.label}</span>
            </div>
          );
        })}
      </div>

      {/* Base Reticle */}
      <div className="text-[8px] opacity-40">
        {side === 'left' ? 'RET·L' : 'R·RET'}
      </div>
    </aside>
  );
};
