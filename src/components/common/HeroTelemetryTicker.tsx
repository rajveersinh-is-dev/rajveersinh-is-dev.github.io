import React, { useState, useEffect } from 'react';

export const HeroTelemetryTicker: React.FC = () => {
  const [puneTime, setPuneTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setPuneTime(`${formatter.format(now)} IST`);
      } catch {
        // Fallback calculation for UTC+5:30
        const now = new Date();
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        const istDate = new Date(utcMs + 5.5 * 3600000);
        const pad = (n: number) => n.toString().padStart(2, '0');
        setPuneTime(
          `${pad(istDate.getHours())}:${pad(istDate.getMinutes())}:${pad(istDate.getSeconds())} IST`
        );
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-label="Editorial Telemetry: Pune, India Location and Research Status"
      className="inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-1.5 rounded-xs border border-paper-border-strong bg-paper-bg-base/85 backdrop-blur-xs font-mono text-[11px] text-ink-secondary shadow-xs select-none max-w-full"
    >
      {/* Live research pulse indicator */}
      <div className="flex items-center space-x-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-academic-amber opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-academic-amber" />
        </span>
        <span className="font-bold text-ink-primary tracking-wider uppercase text-[10px]">
          PUNE, MH, IN
        </span>
      </div>

      <span className="text-paper-border-strong hidden sm:inline">|</span>

      {/* Geographic Coordinates */}
      <div className="flex items-center space-x-1 text-ink-muted">
        <span className="text-academic-seal font-semibold">LOC:</span>
        <span>18.5204° N, 73.8567° E</span>
        <span className="text-[10px] text-ink-muted">(UTC+05:30)</span>
      </div>

      <span className="text-paper-border-strong hidden md:inline">|</span>

      {/* Real-time local clock */}
      <div className="flex items-center space-x-1.5">
        <span className="text-academic-seal font-semibold">CLOCK:</span>
        <span className="text-ink-primary font-bold tabular-nums">
          {puneTime || '12:00:00 IST'}
        </span>
      </div>

      <span className="text-paper-border-strong hidden lg:inline">|</span>

      {/* Active research focus */}
      <div className="hidden lg:flex items-center space-x-1.5 text-ink-muted">
        <span className="text-academic-amber font-semibold">ACTIVE:</span>
        <span className="text-ink-secondary">SSA SUPERCOMPILATION &amp; TOPOLOGICAL INVARIANTS</span>
      </div>
    </div>
  );
};
