import React from 'react';
import { timelineData } from '../../data';

export const TimelineSection: React.FC = () => {
  return (
    <section id="timeline" className="py-20 border-t border-border-subtle relative bg-bg-base/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <span>07 // Chronology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
            Research & Milestone Timeline
          </h2>
          <p className="text-xs text-text-muted font-mono max-w-2xl">
            Chronological progression of academic stages, competitions, independent preprints, and systems engineering.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative pl-6 sm:pl-8 border-l border-border-medium space-y-8 ml-2 sm:ml-4">
          {timelineData.map((milestone) => (
            <div key={milestone.id} className="relative group">
              {/* Dot marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-bg-surface border-2 border-amber-500 group-hover:scale-125 transition-transform flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>

              {/* Milestone Card */}
              <div className="p-5 rounded-lg bg-bg-surface border border-border-subtle hover:border-border-medium transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {milestone.yearOrPeriod}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle">
                    {milestone.category}
                  </span>
                </div>

                <h3 className="font-mono text-base font-bold text-text-primary group-hover:text-amber-400 transition-colors">
                  {milestone.title}
                </h3>

                <p className="text-xs text-text-secondary font-sans leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
