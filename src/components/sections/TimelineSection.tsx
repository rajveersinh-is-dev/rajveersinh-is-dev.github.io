import React from 'react';
import { timelineData } from '../../data';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { MaskedReveal } from '../common/MaskedReveal';

export const TimelineSection: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
        >
          09
        </div>

        {/* Section Header */}
        <div className="space-y-3 relative z-10">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            § 9
          </div>
          <MaskedReveal>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              § 9. Scholarly Chronology &amp; Milestones
            </h2>
          </MaskedReveal>
          <MaskedReveal delayMs={150}>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Research &amp; Milestone Timeline — Progression of Academic Stages, Competitions, Preprints, &amp; Systems Engineering
            </p>
          </MaskedReveal>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Pure Typographic Timeline */}
        <div className="space-y-8 pl-2">
          {timelineData.map((milestone) => (
            <div key={milestone.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-start">
              {/* Left Column: Fixed Monospace Year */}
              <div className="sm:col-span-3 flex sm:justify-end items-center sm:items-start space-x-3 sm:space-x-0">
                <span className="text-xs font-mono font-bold text-ink-primary tracking-wider px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-subtle sm:text-right">
                  {milestone.yearOrPeriod}
                </span>
                <span className="sm:hidden text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                  {milestone.category}
                </span>
              </div>

              {/* Right Column: Thin vertical rule and content */}
              <div className="sm:col-span-9 pl-4 sm:pl-6 border-l border-paper-border-strong relative space-y-2">
                {/* Timeline marker: ink-muted dot, paper-border-strong ring */}
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-paper-bg-base border border-paper-border-strong flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-ink-muted" />
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-ink-primary">
                    {milestone.title}
                  </h3>
                  <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                    {milestone.category}
                  </span>
                </div>

                <p className="font-serif text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chronology Notice (Clock icon removed) */}
        <div className="pt-6 border-t border-paper-border-subtle text-xs font-mono text-ink-muted">
          <span>Verified Chronological Progression • Confirmed against Institutional Records &amp; Zenodo Depositions</span>
        </div>
      </div>
    </section>
  );
};
