import React from 'react';
import { achievementsData } from '../../data';
import { Trophy, Award, ExternalLink, AlertCircle } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  return (
    <section id="achievements" className="py-20 border-t border-border-subtle relative bg-bg-base/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <span>05 // Verified Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
            Honors & Achievements
          </h2>
          <p className="text-xs text-text-muted font-mono max-w-2xl">
            Recorded competitive and academic distinctions strictly verified against supplied authoritative data.
          </p>
        </div>

        {/* Achievements Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievementsData.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-lg bg-bg-surface border border-border-medium hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      {item.organization === 'Kaggle' ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-semibold block">
                        {item.organization}
                      </span>
                      <h3 className="font-mono text-lg font-bold text-text-primary">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {item.isOngoing && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Ongoing
                    </span>
                  )}
                </div>

                {/* Primary Description (Prominent Leaderboard / Medal indicator) */}
                <div className="p-3.5 rounded bg-bg-elevated border border-border-subtle font-mono text-xs text-text-primary font-semibold">
                  {item.description}
                </div>

                <p className="text-xs text-text-secondary font-sans leading-relaxed">
                  {item.details}
                </p>

                {/* Explicit Transparency Note for ongoing competition */}
                {item.isOngoing && (
                  <div className="p-2.5 rounded bg-bg-base border border-border-subtle flex items-start space-x-2 text-[11px] font-mono text-text-muted">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Leaderboard standing reflects current public rank during an active competition cycle (~13,000 entries).
                    </span>
                  </div>
                )}
              </div>

              {item.url && (
                <div className="pt-2 border-t border-border-subtle">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-amber-500 hover:text-amber-400 flex items-center space-x-1.5 font-semibold"
                  >
                    <span>View Competition Details</span>
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
