import React from 'react';

interface AsciiFrameProps {
  titleLeft?: string;
  titleRight?: string;
  footerLeft?: string;
  footerRight?: string;
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}

/**
 * Architectural cadastral ASCII corner framing:
 * ┌[ID: NUMLANG]──────────────────────────────────[ℝ⁴ • SSA]┐
 * │                                                         │
 * └─────────────────────────────────────────────────[▼ 48ms]┘
 */
export const AsciiFrame: React.FC<AsciiFrameProps> = ({
  titleLeft,
  titleRight,
  footerLeft,
  footerRight,
  children,
  className = '',
  borderColor = 'border-paper-border-strong text-ink-muted',
}) => {
  return (
    <div className={`relative flex flex-col font-mono ${className}`}>
      {/* Top Cadastral ASCII Header Bar */}
      <div
        className={`flex items-center text-[10px] leading-none select-none pointer-events-none font-mono ${borderColor}`}
        aria-hidden="true"
      >
        <span>┌</span>
        {titleLeft && (
          <span className="px-1 text-academic-amber font-semibold">[{titleLeft}]</span>
        )}
        <div className="flex-1 border-t border-current mx-0.5" />
        {titleRight && (
          <span className="px-1 text-ink-secondary">[{titleRight}]</span>
        )}
        <span>┐</span>
      </div>

      {/* Content Body with Left & Right Vertical ASCII Reticles */}
      <div className="relative border-l border-r border-paper-border-subtle/40 px-3 py-2 sm:px-4 sm:py-3">
        {children}
      </div>

      {/* Bottom Cadastral ASCII Footer Bar */}
      <div
        className={`flex items-center text-[10px] leading-none select-none pointer-events-none font-mono ${borderColor}`}
        aria-hidden="true"
      >
        <span>└</span>
        {footerLeft && (
          <span className="px-1 text-ink-muted">[{footerLeft}]</span>
        )}
        <div className="flex-1 border-t border-current mx-0.5" />
        {footerRight && (
          <span className="px-1 text-academic-amber font-mono font-bold">[{footerRight}]</span>
        )}
        <span>┘</span>
      </div>
    </div>
  );
};
