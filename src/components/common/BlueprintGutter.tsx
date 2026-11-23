import React, { useState, useEffect } from 'react';
import {
  computeNeedleProgress,
  getMeasuredSections,
} from '../../utils/vernierRail';

interface BlueprintGutterProps {
  side: 'left' | 'right';
}

/**
 * Desktop Margin Vernier Rails:
 * Fixed gutters on left and right margins displaying vertical pixel coordinates,
 * section landmark ticks (0000 ──┤ TOP ... § 12), and a dynamic real-time
 * vernier needle tracking scroll position without clipping or overflowing.
 */
export const BlueprintGutter: React.FC<BlueprintGutterProps> = ({ side }) => {
  const [scrollY, setScrollY] = useState(0);
  const [needleProgress, setNeedleProgress] = useState(0);
  const [ticks, setTicks] = useState(() => getMeasuredSections());
  const [activeSectionId, setActiveSectionId] = useState('hero');

  useEffect(() => {
    let ticking = false;
    let maxScroll = 1;
    let cachedTicks = getMeasuredSections();

    const measureLayout = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      const docHeight = Math.max(
        document.documentElement?.scrollHeight || 0,
        document.body?.scrollHeight || 0,
        document.documentElement?.offsetHeight || 0,
        document.body?.offsetHeight || 0,
        1
      );
      const winHeight = window.innerHeight || document.documentElement?.clientHeight || 1;
      maxScroll = Math.max(1, docHeight - winHeight);

      cachedTicks = getMeasuredSections();
      setTicks(cachedTicks);
    };

    const updateScrollMetrics = () => {
      if (typeof window === 'undefined') return;

      const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      const progress = computeNeedleProgress(y, maxScroll, cachedTicks);

      setScrollY(y);
      setNeedleProgress(progress);

      // Determine active section landmark
      const winHeight = window.innerHeight || 800;
      const scrollPosition = y + Math.min(200, winHeight * 0.25);
      let activeId = cachedTicks[0]?.id || 'hero';
      for (const tick of cachedTicks) {
        if (tick.px <= scrollPosition) {
          activeId = tick.id;
        }
      }
      setActiveSectionId(activeId);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollMetrics();
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResizeOrMutation = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          measureLayout();
          updateScrollMetrics();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Defer initial calculation to next animation frame to prevent cascading render warning
    window.requestAnimationFrame(() => {
      measureLayout();
      updateScrollMetrics();
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResizeOrMutation, { passive: true });

    // Observe body mutations/resizes (dynamic content, font load, accordions)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        handleResizeOrMutation();
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResizeOrMutation);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const currentScrollPadded = String(Math.max(0, Math.floor(scrollY))).padStart(4, '0');

  return (
    <aside
      aria-hidden="true"
      data-testid={`blueprint-gutter-${side}`}
      className={`hidden xl:flex fixed top-0 bottom-0 z-30 w-5 pointer-events-none select-none flex-col justify-between py-16 font-mono text-[9px] text-ink-dim/40 dark:text-ink-dim/50 ${
        side === 'left' ? 'left-1 items-start' : 'right-1 items-end'
      }`}
    >
      {/* Top Vernier Reticle */}
      <div className="text-[8px] opacity-40 px-0.5 whitespace-nowrap">
        {side === 'left' ? 'RET·T' : 'T·RET'}
      </div>

      {/* Vernier Rail Track Container */}
      <div className="relative flex-1 w-full my-2">
        {/* Section Landmark Ticks */}
        <div className="flex flex-col justify-between w-full h-full py-1">
          {ticks.map((tick) => {
            const isActive =
              activeSectionId === tick.id || Math.abs(scrollY - tick.px) < 300;
            return (
              <div
                key={tick.id}
                data-testid={`blueprint-gutter-tick-${tick.id}`}
                className={`flex items-center space-x-0.5 whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'text-academic-amber font-bold opacity-100'
                    : 'opacity-40'
                } ${
                  side === 'left'
                    ? 'flex-row'
                    : 'flex-row-reverse space-x-reverse'
                }`}
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

        {/* Dynamic Real-Time Vernier Coordinate Needle / Gauge */}
        <div
          data-testid="blueprint-gutter-needle"
          style={{
            top: `${needleProgress * 100}%`,
            transform: `translateY(-${needleProgress * 100}%)`,
          }}
          className={`absolute z-20 pointer-events-none whitespace-nowrap ${
            side === 'left' ? 'left-0' : 'right-0'
          }`}
        >
          <div
            data-testid="blueprint-gutter-needle-badge"
            className={`bg-paper-bg-base/95 backdrop-blur-xs py-0.5 px-1 rounded-xs border border-academic-amber text-[8px] font-bold tracking-tighter text-academic-amber shadow-xs flex items-center ${
              side === 'left' ? 'text-left' : 'text-right'
            }`}
          >
            <span>
              {side === 'left'
                ? `${currentScrollPadded}px──┤`
                : `├──${currentScrollPadded}px`}
            </span>
          </div>
        </div>
      </div>

      {/* Base Reticle */}
      <div className="text-[8px] opacity-40 px-0.5 whitespace-nowrap">
        {side === 'left' ? 'RET·L' : 'R·RET'}
      </div>
    </aside>
  );
};
