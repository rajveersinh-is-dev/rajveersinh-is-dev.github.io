import React from 'react';
import { profileData } from '../../data';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import { ArrowDown, FileDown, BookOpen, Cpu, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Frontispiece Title Plate */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-8 p-6 sm:p-10 md:p-12 border-2 border-paper-border-strong bg-paper-bg-subtle/80 shadow-sm">
        {/* Archival Journal Header */}
        <div className="pb-3 border-b border-paper-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-academic-seal font-semibold">
          <span>Acta Mathematica &amp; Computatoria</span>
          <span>Vol. I, Fasc. 2026 • Satara, Maharashtra, India</span>
        </div>

        {/* Scholarly Metadata Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-ink-muted">
          <span className="text-academic-seal font-bold uppercase tracking-wider">
            {profileData.professionalIdentity}
          </span>
          <span>•</span>
          <span>Age {profileData.age}</span>
          <span>•</span>
          <span>{profileData.location}</span>
          <span>•</span>
          <span>MSC2020: 55N31, 90C27, 68N20</span>
        </div>

        {/* Main Title & Role */}
        <div className="space-y-3 pt-2">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink-primary uppercase">
            {profileData.fullName}
          </h1>
          <p className="font-serif text-base sm:text-lg text-ink-secondary tracking-widest uppercase font-medium">
            {profileData.professionalIdentity}
          </p>
        </div>

        {/* Classical Oxford Double Rule */}
        <hr className="oxford-rule my-4" />

        {/* Research Epigraph */}
        <div className="py-1">
          <blockquote className="font-serif italic text-lg sm:text-2xl text-academic-amber max-w-2xl mx-auto font-normal leading-relaxed">
            "{profileData.tagline}"
          </blockquote>
        </div>

        {/* Scholarly Abstract Block */}
        <div className="max-w-3xl mx-auto text-left p-5 sm:p-6 border-l-3 border-academic-seal bg-paper-bg-base border border-paper-border-subtle space-y-2">
          <div className="font-serif font-bold text-xs uppercase tracking-widest text-academic-seal flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Abstract of Research Program</span>
          </div>
          <p className="font-serif text-sm sm:text-base text-ink-secondary leading-relaxed">
            An independent research program in theoretical mathematics, algorithm engineering, mechanized proof verification, and combinatorial structures. Primary treatises address persistent homology on temporal hypergraphs, Lagrangian dual relaxation with provable bounds for constrained shortest paths, and certified supercompilation via SSA lowering in Lean 4 with Cranelift code generation. Dedicated to <span className="text-ink-primary font-medium italic">"{profileData.targetImpression}"</span>
          </p>
        </div>

        {/* Dignified Archival Action Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <a
            href="#preprints"
            className="px-5 py-2.5 rounded border border-academic-seal bg-academic-seal/10 hover:bg-academic-seal text-academic-seal hover:text-white font-mono font-medium text-xs tracking-wider uppercase transition-colors flex items-center space-x-2"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Archival Preprints</span>
          </a>

          <a
            href="#projects"
            className="px-5 py-2.5 rounded border border-paper-border-strong bg-paper-bg-elevated hover:bg-paper-border-subtle text-ink-primary font-mono font-medium text-xs tracking-wider uppercase transition-colors flex items-center space-x-2"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Computational Treatises</span>
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
            className="px-5 py-2.5 rounded border border-paper-border-subtle hover:border-paper-border-strong bg-paper-bg-base text-ink-secondary hover:text-ink-primary font-mono text-xs tracking-wider uppercase transition-colors flex items-center space-x-2 cursor-pointer"
            title="Download locally compiled Curriculum Vitae vector PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-academic-amber" />
            <span>Curriculum Vitae</span>
          </a>
        </div>
      </div>

      {/* Subtle bottom scroll link to § 1 */}
      <a
        href="#about"
        aria-label="Scroll down to About section"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 text-ink-muted hover:text-academic-seal transition-colors"
      >
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
