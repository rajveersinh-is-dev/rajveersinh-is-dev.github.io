import React from 'react';
import { profileData, experienceData } from '../../data';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { MaskedReveal } from '../common/MaskedReveal';

export const AboutSection: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
        >
          01
        </div>

        {/* Section Header */}
        <div className="space-y-3 relative z-10">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            § 1
          </div>
          <MaskedReveal>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              § 1. Foundational Profile &amp; Research Philosophy
            </h2>
          </MaskedReveal>
          <MaskedReveal delayMs={150}>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              About &amp; Research Philosophy — An Intellectual Manifesto &amp; Foundations
            </p>
          </MaskedReveal>
        </div>

        {/* Classical Oxford Double Rule */}
        <hr className="oxford-rule" />

        {/* Wide-Margin Scholarly Narrative Layout */}
        <div className="space-y-8">
          {/* First-Person Intellectual Manifesto with Drop Cap */}
          <div className="space-y-5 font-serif text-ink-secondary text-base sm:text-lg leading-relaxed max-w-4xl">
            <p className="drop-cap text-ink-primary">
              I am an independent researcher focused on mathematical discoveries, algorithm design, and computational approaches to understanding complex structures. My interests span theoretical mathematics and computation, with a particular emphasis on developing original ideas through rigorous reasoning.
            </p>
            <p>
              My interest in mathematics began early, and I earned multiple medals in SOF IMO Olympiads during my school years. I now pursue independent research while exploring the connections between mathematical theory, algorithms, scientific computing, and formal verification.
            </p>
            <p className="italic text-ink-primary font-medium">
              I believe in approaching difficult problems with curiosity, persistence, and intellectual honesty.
            </p>
          </div>

          {/* Research Philosophy Formal Theorem Box (oxford-rule left border in academic-seal) */}
          <div className="my-8 p-6 bg-paper-bg-subtle border-l-4 border-academic-seal space-y-3">
            <div className="font-serif font-bold text-xs uppercase tracking-wider text-academic-amber">
              Axiom I.1 — Research Philosophy
            </div>
            <blockquote className="font-serif italic text-base sm:text-lg text-ink-primary leading-relaxed">
              "{profileData.researchPhilosophy}"
            </blockquote>
            <div className="pt-2 flex justify-end">
              <span className="tombstone font-serif text-sm text-academic-amber font-bold">∎</span>
            </div>
          </div>

          {/* Academic Aspirations & Research Direction: Single-Column, Wide-Margin Pull-Quote Style */}
          <div className="py-6 space-y-6 max-w-3xl border-t border-b border-paper-border-subtle">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block">
                Long-Term Ambition
              </span>
              <p className="font-serif italic text-xl sm:text-2xl text-ink-primary leading-relaxed">
                "{profileData.longTermAmbition}"
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block">
                Five-Year Aspiration
              </span>
              <p className="font-serif italic text-lg sm:text-xl text-ink-secondary leading-relaxed">
                "{profileData.fiveYearAspiration}"
              </p>
            </div>
          </div>

          {/* Practical Technical Stewardship & Applied Systems */}
          <div className="pt-6 space-y-4">
            <div className="text-xs font-mono text-ink-primary uppercase tracking-wider font-bold">
              Applied Technical Stewardship &amp; Practical Systems Experience
            </div>

            <div className="space-y-4">
              {experienceData.map((exp) => (
                <div
                  key={exp.id}
                  className="py-5 border-b border-paper-border-subtle space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-paper-border-subtle pb-2">
                    <div className="font-serif text-base font-bold text-ink-primary">
                      {exp.organization}
                    </div>
                    <div className="text-xs font-mono px-2.5 py-0.5 rounded border border-paper-border-strong bg-paper-bg-elevated text-ink-primary font-semibold">
                      {exp.role}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-ink-muted">
                    Commercial Enterprise Affiliation: <span className="text-ink-secondary font-medium">{exp.subsidiaryOrFamilyBusiness}</span>
                  </div>

                  <ul className="text-xs sm:text-sm text-ink-secondary space-y-1.5 pt-1 font-serif">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <span className="text-ink-muted select-none">—</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Cross-Reference Link to Centralized Education Section */}
            <div className="pt-4 flex items-center justify-between text-xs font-mono text-ink-muted">
              <span>Verified Institutional Credentials &amp; Enrolment:</span>
              <a
                href="#education"
                className="text-academic-amber hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Inspect § 7. Academic Enrolment &amp; Institutional Credentials →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
