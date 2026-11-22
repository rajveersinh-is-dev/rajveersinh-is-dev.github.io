import React from 'react';
import { achievementsData } from '../../data';
import { Trophy, Award, ExternalLink, AlertCircle } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  return (
    <section id="achievements" className="py-20 border-t border-paper-border-subtle relative bg-paper-bg-base">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-academic-seal font-semibold">
            Documenta et Laureae • Section V
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
            § 5. Verified Academic Milestones &amp; Honors
          </h2>
          <p className="font-serif italic text-ink-muted text-sm sm:text-base">
            Honors &amp; Achievements — Recorded Academic Distinctions &amp; Verified Competitive Standings
          </p>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Achievements Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievementsData.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded border border-paper-border-strong bg-paper-bg-subtle flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-paper-border-subtle pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded border border-academic-seal/30 bg-academic-seal/10 text-academic-seal">
                      {item.organization === 'Kaggle' ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-academic-seal font-semibold block">
                        {item.organization}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-ink-primary">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {item.isOngoing && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-academic-amber/40 bg-academic-amber/10 text-academic-amber font-semibold">
                      Active Cycle
                    </span>
                  )}
                </div>

                {/* Primary Description */}
                <div className="p-3.5 rounded border border-paper-border-subtle bg-paper-bg-base font-serif text-sm text-ink-primary font-medium">
                  {item.description}
                </div>

                <p className="font-serif text-xs text-ink-secondary leading-relaxed">
                  {item.details}
                </p>

                {/* Transparency Note for ongoing competition */}
                {item.isOngoing && (
                  <div className="p-3 rounded border border-paper-border-subtle bg-paper-bg-elevated flex items-start space-x-2 text-xs font-mono text-ink-muted">
                    <AlertCircle className="w-3.5 h-3.5 text-academic-amber mt-0.5 flex-shrink-0" />
                    <span>
                      Leaderboard standing reflects current public rank during an active competition cycle (~13,000 entries).
                    </span>
                  </div>
                )}
              </div>

              {item.url && (
                <div className="pt-2 border-t border-paper-border-subtle">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-academic-seal hover:text-academic-seal/80 flex items-center space-x-1.5 font-semibold"
                  >
                    <span>View Competition Registry Record</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
