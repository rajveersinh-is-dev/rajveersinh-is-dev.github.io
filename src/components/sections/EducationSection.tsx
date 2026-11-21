import React from 'react';
import { educationData } from '../../data';
import { GraduationCap, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-20 border-t border-border-subtle relative bg-bg-surface/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
              <span>07 // Academic Enrolment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
              Education & Institutional Credentials
            </h2>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-bg-surface border border-border-subtle text-text-muted font-mono text-xs flex items-center space-x-2 self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Strictly Verified Enrolment Data</span>
          </div>
        </div>

        {/* Institutional Integrity Notice */}
        <p className="text-xs text-text-secondary font-mono max-w-3xl leading-relaxed">
          Academic credentials are strictly bounded by confirmed institutional enrolment records. Consistent with research portfolio integrity standards, no unverified graduation dates, admission years, or synthetic grades are claimed.
        </p>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationData.map((edu) => {
            const isHigher = edu.type === 'higher-education';
            return (
              <div
                key={edu.id}
                className="p-6 sm:p-8 rounded-lg bg-bg-surface border border-border-medium hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-6 shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        {isHigher ? (
                          <GraduationCap className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-semibold block">
                          {isHigher ? 'Higher Education' : 'School Education'}
                        </span>
                        <h3 className="font-mono text-lg sm:text-xl font-bold text-text-primary">
                          {edu.institution}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold flex-shrink-0">
                      {edu.status}
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-elevated border border-border-subtle space-y-1">
                    <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider block">
                      Programme / Academic Stage:
                    </span>
                    <div className="font-mono text-sm text-text-primary font-bold">
                      {edu.programmeOrStage}
                    </div>
                  </div>

                  {edu.notes && (
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      {edu.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-muted">
                  <span className="flex items-center space-x-1.5 text-amber-400/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Authoritatively Confirmed Record</span>
                  </span>
                  <span className="text-[10px] text-text-dim">Editable Configuration</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
