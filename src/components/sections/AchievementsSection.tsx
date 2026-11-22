import React from 'react';
import { achievementsData } from '../../data';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { useIntersectionObserver } from '../../utils/intersectionObserver';

export const AchievementsSection: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            § 5
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            § 5. Verified Academic Milestones &amp; Honors
          </h2>
          <p className="font-serif italic text-ink-muted text-sm sm:text-base">
            Honors &amp; Achievements — Recorded Academic Distinctions &amp; Verified Competitive Standings
          </p>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Horizontal Table-Like Typographic Layout */}
        <div className="divide-y divide-paper-border-subtle border-t border-b border-paper-border-subtle">
          {achievementsData.map((item) => (
            <div
              key={item.id}
              className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start"
            >
              {/* Organization Name Column */}
              <div className="md:col-span-3 space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-ink-muted font-bold block">
                  {item.organization}
                </span>
                {item.isOngoing && (
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded border border-academic-amber/40 bg-academic-amber/10 text-academic-amber font-semibold">
                    Active Cycle
                  </span>
                )}
              </div>

              {/* Distinction & Details Column */}
              <div className="md:col-span-9 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-primary">
                    {item.title}
                  </h3>
                </div>

                {/* Primary Description */}
                <p className="font-serif text-sm sm:text-base text-ink-primary leading-relaxed">
                  {item.description}
                </p>

                {/* Additional Details */}
                <p className="font-serif text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {item.details}
                </p>

                {/* Transparency Note for ongoing competition */}
                {item.isOngoing && (
                  <div className="p-3 rounded border border-paper-border-subtle bg-paper-bg-subtle flex items-start space-x-2 text-xs font-mono text-ink-muted">
                    <AlertCircle className="w-3.5 h-3.5 text-academic-amber mt-0.5 flex-shrink-0" />
                    <span>
                      Leaderboard standing reflects current public rank during an active competition cycle (~13,000 entries).
                    </span>
                  </div>
                )}

                {item.url && (
                  <div className="pt-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-academic-amber hover:underline inline-flex items-center space-x-1.5 font-semibold"
                    >
                      <span>View Competition Registry Record</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
