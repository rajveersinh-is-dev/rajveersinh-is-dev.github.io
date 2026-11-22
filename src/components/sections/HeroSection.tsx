import React, { useState, useEffect } from 'react';
import { profileData } from '../../data';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import { AsciiDitherCanvas } from '../visuals/AsciiDitherCanvas';
import { HeroTelemetryTicker } from '../common/HeroTelemetryTicker';
import { MaskedReveal } from '../common/MaskedReveal';
import { usePreferences } from '../../context';
import { FileDown, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { visualEffectsEnabled, playClick } = usePreferences();

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
          className={`my-auto py-8 sm:py-12 space-y-4 ${
            prefersReducedMotion ? '' : 'animate-fade-in'
          }`}
          style={prefersReducedMotion ? undefined : { animationDelay: '150ms' }}
        >
          <div className="space-y-1">
            <h1
              aria-label="Rajveersinh Vishal Pardeshi"
              className="font-serif font-bold tracking-tight text-ink-primary"
            >
              <MaskedReveal delayMs={100}>
                <span className="block text-[2.75rem] min-[400px]:text-5xl sm:text-7xl md:text-8xl leading-none">
                  RAJVEERSINH
                </span>
              </MaskedReveal>
              <MaskedReveal delayMs={200}>
                <span className="block text-[2.75rem] min-[400px]:text-5xl sm:text-7xl md:text-8xl leading-none sm:translate-x-8 md:translate-x-12 mt-1 sm:mt-2 text-ink-primary">
                  VISHAL PARDESHI
                </span>
              </MaskedReveal>
            </h1>
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
          {/* Research links — plain text with arrow */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-mono text-ink-primary">
            <a
              href="#research-interests"
              onClick={() => playClick(800)}
              className="hover:text-academic-amber transition-colors flex items-center space-x-1.5 group cursor-pointer"
            >
              <span>View Research</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#projects"
              onClick={() => playClick(820)}
              className="hover:text-academic-amber transition-colors flex items-center space-x-1.5 group cursor-pointer"
            >
              <span>Projects</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#preprints"
              onClick={() => playClick(840)}
              className="hover:text-academic-amber transition-colors flex items-center space-x-1.5 group cursor-pointer"
            >
              <span>Preprints</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
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
