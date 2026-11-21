import React, { useState } from 'react';
import { profileData } from '../../data';
import { AsciiDitherCanvas } from '../visuals/AsciiDitherCanvas';
import type { VisualMode } from '../visuals/AsciiDitherCanvas';
import { usePreferences } from '../../context';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import { ArrowDown, FileDown, Sparkles, Compass, MapPin, Calendar } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { visualEffectsEnabled } = usePreferences();
  const [activeVisualMode, setActiveVisualMode] = useState<VisualMode>('hybrid');

  const modes: { id: VisualMode; label: string }[] = [
    { id: 'hybrid', label: 'Hybrid Mesh' },
    { id: 'ascii-field', label: 'ASCII Tensor' },
    { id: 'dither-distortion', label: 'Bayer Dither' },
    { id: 'hidden-structures', label: 'Manifold Core' },
  ];

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Interactive ASCII / Dither Background */}
      {visualEffectsEnabled && (
        <div className="absolute inset-0 z-0 opacity-75">
          <AsciiDitherCanvas mode={activeVisualMode} density="normal" opacity={0.8} />
          {/* Subtle gradient vignette so text remains razor sharp */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-void/70 via-bg-void/40 to-bg-void pointer-events-none" />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Meta badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-3.5 py-1.5 rounded-full border border-border-medium bg-bg-surface/80 backdrop-blur-md text-xs font-mono text-text-secondary">
          <span className="flex items-center space-x-1 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
            <span>{profileData.professionalIdentity}</span>
          </span>
          <span className="text-border-medium">•</span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-text-muted" />
            <span>Age {profileData.age}</span>
          </span>
          <span className="text-border-medium">•</span>
          <span className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-text-muted" />
            <span>{profileData.location}</span>
          </span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-text-primary uppercase font-mono">
            {profileData.fullName}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-amber-500 font-serif italic max-w-3xl mx-auto font-normal tracking-wide">
            "{profileData.tagline}"
          </p>
        </div>

        {/* Core Impression Quote */}
        <div className="max-w-2xl mx-auto pt-2">
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono">
            Independent research bridging theoretical mathematics, algorithm design, formal verification in Lean 4, and computational structures. Driven by <span className="text-text-primary font-semibold">"{profileData.targetImpression}"</span>
          </p>
        </div>

        {/* Primary Call to Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
          <a
            href="#research-interests"
            className="px-6 py-3 rounded bg-amber-500 hover:bg-amber-600 text-bg-void font-mono font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Research</span>
          </a>

          <a
            href="#projects"
            className="px-6 py-3 rounded bg-bg-surface hover:bg-bg-elevated border border-border-medium hover:border-amber-500/50 text-text-primary font-mono text-xs tracking-wider uppercase transition-all flex items-center space-x-2"
          >
            <span>View Projects</span>
            <ArrowDown className="w-3.5 h-3.5 text-amber-500" />
          </a>

          <a
            href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
            download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
            onClick={(e) => {
              try {
                downloadPdfCv();
                e.preventDefault();
              } catch {}
            }}
            className="px-5 py-3 rounded bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-border-highlight text-text-secondary hover:text-amber-400 font-mono text-xs tracking-wider uppercase transition-all flex items-center space-x-2 cursor-pointer"
            title="Download locally generated Curriculum Vitae PDF"
          >
            <FileDown className="w-4 h-4 text-amber-500" />
            <span>Curriculum Vitae</span>
          </a>
        </div>

        {/* Visual Engine Mode Selector Pill */}
        {visualEffectsEnabled && (
          <div className="pt-8">
            <div className="inline-flex items-center space-x-1 p-1 rounded-lg bg-bg-surface/90 border border-border-subtle backdrop-blur-md">
              <span className="text-[10px] font-mono text-text-muted px-2 hidden sm:inline flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>CANVAS MODE:</span>
              </span>
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveVisualMode(m.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                    activeVisualMode === m.id
                      ? 'bg-amber-500 text-bg-void font-bold shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subtle bottom scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll down to About section"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 text-text-muted hover:text-amber-400 transition-colors"
      >
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
