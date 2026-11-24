import React, { useState, useEffect } from 'react';
import { profileData } from '../../data';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import { AsciiDitherCanvas } from '../visuals/AsciiDitherCanvas';
import { HeroTelemetryTicker } from '../common/HeroTelemetryTicker';
import { MaskedReveal } from '../common/MaskedReveal';
import { usePreferences } from '../../context';
import { FileDown, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { visualEffectsEnabled, playClick, playLetterClick, theme } = usePreferences();

  const FIRST_NAME = 'RAJVEERSINH';
  const SECOND_NAME_VISHAL = 'VISHAL';
  const SECOND_NAME_PARDESHI = 'PARDESHI';

  const [orangeLetters, setOrangeLetters] = useState<Set<string>>(() => new Set());

  const toggleLetterOrange = (id: string, index: number) => {
    setOrangeLetters((prev) => {
      const next = new Set(prev);
      const willBeOrange = !next.has(id);
      if (willBeOrange) {
        next.add(id);
      } else {
        next.delete(id);
      }
      playLetterClick?.(index, willBeOrange);
      return next;
    });
  };

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden bg-paper-bg-base"
    >
      {/* ASCII Dither Canvas Backdrop with Fluid Trails */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <AsciiDitherCanvas
          mode="hidden-structures"
          density="normal"
          opacity={visualEffectsEnabled ? 0.65 : 0.15}
          interactive={visualEffectsEnabled}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-between py-6 pointer-events-none">
        {/* TOP-LEFT MONOSPACE STRIP & EDITORIAL TELEMETRY TICKER */}
        <div
          className={`pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            prefersReducedMotion ? '' : 'animate-fade-in'
          }`}
          style={prefersReducedMotion ? undefined : { animationDelay: '0ms' }}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-ink-muted">
            <span className="font-bold tracking-wider uppercase text-ink-primary">RVP</span>
            <span>•</span>
            <span>{profileData.professionalIdentity}</span>
            <span>•</span>
            <span>Pune, India</span>
            <span>•</span>
            <span>Age {profileData.age}</span>
          </div>

          {/* Real-time editorial telemetry ticker */}
          <div className="pointer-events-auto">
            <HeroTelemetryTicker />
          </div>
        </div>

        {/* CENTER TYPOGRAPHIC ANCHOR */}
        <div
          className={`my-auto py-8 sm:py-12 space-y-4 relative ${
            prefersReducedMotion ? '' : 'animate-fade-in'
          }`}
          style={prefersReducedMotion ? undefined : { animationDelay: '150ms' }}
        >
          {/* Ambient Drifting Proof Fragment & SSA Stream */}
          <div
            aria-hidden="true"
            className="absolute -top-4 sm:-top-8 right-2 sm:right-6 pointer-events-none select-none text-[10px] sm:text-xs font-mono text-ink-dim/15 dark:text-ink-dim/20 space-y-1 hidden sm:block animate-pulse text-right"
            style={{ animationDuration: '7s' }}
          >
            <div>∀ n : ℕ, fib(n) ≥ φⁿ⁻²</div>
            <div>∂² = 0 ⊢ H*(K, ∂)</div>
            <div>L(λ*) = max_λ &#123; min_x L(x, λ) &#125;</div>
            <div>SSA[L₁: φ(v₀, v₁)] ⇓ codegen</div>
          </div>

          <div className="space-y-1 pointer-events-auto select-none">
            <h1
              aria-label="Rajveersinh Vishal Pardeshi"
              className="font-serif tracking-tight text-ink-primary"
            >
              <span className="sr-only">Rajveersinh Vishal Pardeshi</span>
              <div aria-hidden="true">
                <MaskedReveal delayMs={100} className="overflow-visible" innerClassName="pt-2 pb-1">
                  <span className="block text-[2.75rem] min-[400px]:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight">
                    {FIRST_NAME.split('').map((char, i) => {
                      const id = `first-${i}`;
                      const isOrange = orangeLetters.has(id);
                      return (
                        <span
                          key={id}
                          onClick={() => toggleLetterOrange(id, i)}
                          className={`inline-block cursor-pointer select-none transition-all duration-200 ease-out origin-bottom hover:-translate-y-2.5 hover:scale-115 sm:hover:scale-120 hover:z-30 relative active:scale-95 ${
                            isOrange
                              ? 'text-orange-500 dark:text-[#ff6600] font-black'
                              : 'text-ink-primary hover:text-ink-primary hover:drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]'
                          }`}
                          style={{
                            textShadow: isOrange
                              ? theme === 'paper'
                                ? '0 0 14px rgba(234, 88, 12, 0.45)'
                                : '0 0 20px rgba(255, 102, 0, 0.8), 0 0 35px rgba(255, 102, 0, 0.45)'
                              : undefined,
                            filter: isOrange
                              ? theme === 'paper'
                                ? 'drop-shadow(0 2px 4px rgba(234, 88, 12, 0.35))'
                                : 'drop-shadow(0 0 12px rgba(255, 102, 0, 0.65))'
                              : undefined,
                          }}
                          title={`Click to illuminate "${char}" orange`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                </MaskedReveal>

                <MaskedReveal delayMs={200} className="overflow-visible" innerClassName="pt-1 pb-1">
                  <span className="block text-xl min-[400px]:text-2xl sm:text-4xl md:text-5xl font-serif font-light text-ink-muted sm:translate-x-8 md:translate-x-12 mt-1 sm:mt-2 tracking-normal">
                    {SECOND_NAME_VISHAL.split('').map((char, i) => {
                      const id = `second-v-${i}`;
                      const isOrange = orangeLetters.has(id);
                      const noteIndex = 11 + i;
                      return (
                        <span
                          key={id}
                          onClick={() => toggleLetterOrange(id, noteIndex)}
                          className={`inline-block cursor-pointer select-none transition-all duration-200 ease-out origin-bottom hover:-translate-y-1.5 hover:scale-115 hover:z-30 relative active:scale-95 ${
                            isOrange
                              ? 'text-orange-500 dark:text-[#ff6600] font-semibold'
                              : 'text-ink-muted hover:text-ink-primary'
                          }`}
                          style={{
                            textShadow: isOrange
                              ? theme === 'paper'
                                ? '0 0 10px rgba(234, 88, 12, 0.4)'
                                : '0 0 16px rgba(255, 102, 0, 0.75)'
                              : undefined,
                          }}
                          title={`Click to illuminate "${char}" orange`}
                        >
                          {char}
                        </span>
                      );
                    })}
                    <span className="inline-block w-[0.25em] sm:w-[0.3em] select-none">&nbsp;</span>
                    {SECOND_NAME_PARDESHI.split('').map((char, i) => {
                      const id = `second-p-${i}`;
                      const isOrange = orangeLetters.has(id);
                      const noteIndex = 17 + i;
                      return (
                        <span
                          key={id}
                          onClick={() => toggleLetterOrange(id, noteIndex)}
                          className={`inline-block cursor-pointer select-none transition-all duration-200 ease-out origin-bottom hover:-translate-y-1.5 hover:scale-115 hover:z-30 relative active:scale-95 ${
                            isOrange
                              ? 'text-orange-500 dark:text-[#ff6600] font-semibold'
                              : 'text-ink-muted hover:text-ink-primary'
                          }`}
                          style={{
                            textShadow: isOrange
                              ? theme === 'paper'
                                ? '0 0 10px rgba(234, 88, 12, 0.4)'
                                : '0 0 16px rgba(255, 102, 0, 0.75)'
                              : undefined,
                          }}
                          title={`Click to illuminate "${char}" orange`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                </MaskedReveal>
              </div>
            </h1>

            {/* Interactive Illumination Controls (shown when letters are illuminated) */}
            {orangeLetters.size > 0 && (
              <div className="pt-2 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-academic-amber animate-fade-in select-none">
                <span className="font-bold">● {orangeLetters.size} of 25 letters illuminated</span>
                <span className="text-ink-dim">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setOrangeLetters(new Set());
                    playClick(440);
                  }}
                  className="hover:underline text-ink-muted hover:text-academic-amber cursor-pointer px-1 py-0.5 rounded border border-paper-border-subtle hover:border-academic-amber/50"
                  title="Reset illuminated letters"
                >
                  [Reset ↺]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const all = new Set<string>();
                    FIRST_NAME.split('').forEach((_, i) => all.add(`first-${i}`));
                    SECOND_NAME_VISHAL.split('').forEach((_, i) => all.add(`second-v-${i}`));
                    SECOND_NAME_PARDESHI.split('').forEach((_, i) => all.add(`second-p-${i}`));
                    setOrangeLetters(all);
                    playClick(880);
                  }}
                  className="hover:underline text-ink-muted hover:text-academic-amber cursor-pointer px-1 py-0.5 rounded border border-paper-border-subtle hover:border-academic-amber/50"
                  title="Turn all letters orange"
                >
                  [All Orange ⚡]
                </button>
              </div>
            )}
          </div>

          {/* Restrained Italic Tagline */}
          <div className="pt-2">
            <MaskedReveal delayMs={300}>
              <p className="font-serif italic text-lg sm:text-2xl text-academic-amber font-normal">
                "{profileData.tagline}"
              </p>
            </MaskedReveal>
          </div>

          {/* Lower Human Voice Introduction (max-width 480px) */}
          <div className="pt-4 max-w-[500px]">
            <MaskedReveal delayMs={400}>
              <p className="font-serif text-sm sm:text-base text-ink-secondary leading-relaxed">
                I study mathematical structures from first principles, algorithm engineering, mechanized proof verification, and combinatorial systems. Currently developing treatises on persistent homology on temporal hypergraphs, Lagrangian dual relaxation for constrained routing, and verified SSA supercompilation. Driven by <em>"{profileData.targetImpression}"</em>
              </p>
            </MaskedReveal>
          </div>
        </div>

        {/* BOTTOM NAVIGATION & CV DOWNLOAD */}
        <div
          className={`pt-6 border-t border-paper-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto ${
            prefersReducedMotion ? '' : 'animate-fade-in'
          }`}
          style={prefersReducedMotion ? undefined : { animationDelay: '300ms' }}
        >
          {/* Research links — plain text with arrow morph */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-mono text-ink-primary">
            <a
              href="#research-interests"
              onClick={() => playClick(800)}
              className="hover:text-academic-amber transition-colors flex items-center space-x-1.5 group cursor-pointer"
            >
              <span>View Research</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-ink-muted group-hover:text-academic-amber font-serif">⟶</span>
            </a>
            <a
              href="#projects"
              onClick={() => playClick(820)}
              className="hover:text-academic-amber transition-colors flex items-center space-x-1.5 group cursor-pointer"
            >
              <span>Projects</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-ink-muted group-hover:text-academic-amber font-serif">⟶</span>
            </a>
            <a
              href="#preprints"
              onClick={() => playClick(840)}
              className="hover:text-academic-amber transition-colors flex items-center space-x-1.5 group cursor-pointer"
            >
              <span>Preprints</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-ink-muted group-hover:text-academic-amber font-serif">⟶</span>
            </a>
          </div>

          {/* Bottom-right CV download — ghost/outline only, small */}
          <div className="flex items-center space-x-4">
            <a
              href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
              download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
              onClick={(e) => {
                playClick(900);
                try {
                  downloadPdfCv();
                  e.preventDefault();
                } catch {}
              }}
              className="px-3 py-1.5 rounded-xs border border-paper-border-strong hover:border-academic-amber text-ink-secondary hover:text-ink-primary font-mono text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
              title="Download locally compiled Curriculum Vitae vector PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-ink-muted" />
              <span>Download CV (PDF)</span>
            </a>

            {/* Subtle scroll link to § 1 */}
            <a
              href="#about"
              onClick={() => playClick(700)}
              aria-label="Scroll down to About section"
              className="p-1.5 rounded-xs text-ink-muted hover:text-ink-primary transition-colors hidden md:inline-flex cursor-pointer"
            >
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
