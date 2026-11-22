import React from 'react';
import { timelineData } from '../../data';
import { Clock } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  return (
    <section id="timeline" className="py-20 border-t border-paper-border-subtle relative bg-paper-bg-base">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-academic-seal font-semibold">
            Chronologia Mathematica • Section VIII
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
            § 8. Scholarly Chronology &amp; Milestones
          </h2>
          <p className="font-serif italic text-ink-muted text-sm sm:text-base">
            Research &amp; Milestone Timeline — Progression of Academic Stages, Competitions, Preprints, &amp; Systems Engineering
          </p>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Timeline Flow */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-paper-border-strong space-y-8 ml-2 sm:ml-4">
          {timelineData.map((milestone) => (
            <div key={milestone.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-paper-bg-base border-2 border-academic-seal flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-academic-seal" />
              </div>

              {/* Milestone Card */}
              <div className="p-6 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-border-subtle pb-2">
                  <span className="text-xs font-mono text-academic-seal font-bold px-2 py-0.5 rounded border border-academic-seal/30 bg-academic-seal/10">
                    {milestone.yearOrPeriod}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-elevated">
                    {milestone.category}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  {milestone.title}
                </h3>

                <p className="font-serif text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chronology Notice */}
        <div className="p-4 rounded border border-paper-border-subtle bg-paper-bg-subtle flex items-center space-x-2 text-xs font-mono text-ink-muted">
          <Clock className="w-4 h-4 text-academic-seal" />
          <span>Verified Chronological Progression • Confirmed against Institutional Records &amp; Zenodo Depositions</span>
        </div>
      </div>
    </section>
  );
};
