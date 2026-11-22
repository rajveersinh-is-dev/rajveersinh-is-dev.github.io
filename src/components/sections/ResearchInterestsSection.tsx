import React, { useState } from 'react';
import { researchInterestsData } from '../../data';
import { GitBranch } from 'lucide-react';
import { useIntersectionObserver } from '../../utils/intersectionObserver';

export const ResearchInterestsSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  const selectedInterest = researchInterestsData.find((r) => r.id === selectedId) || null;

  // Domain mathematical symbols
  const mathSymbols: Record<string, string> = {
    'pure-math': '∑',
    'computational-math': '∆',
    'combinatorics': '∏',
    'graph-theory': 'ℋ',
    'dynamical-systems': '∂',
    'algorithm-design': '𝒪',
    'optimization': '∇',
    'scientific-computing': '∫',
    'compiler-theory': 'λ',
    'formal-verification': '⊢',
  };

  return (
    <section
      ref={sectionRef}
      id="research-interests"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Typographic Section Header Moment */}
        <div className="flex items-start space-x-6 sm:space-x-8">
          <div className="text-6xl sm:text-8xl font-serif font-bold text-ink-dim select-none leading-none flex-shrink-0">
            §2
          </div>
          <div className="space-y-2 pt-1 sm:pt-2">
            <h2
              aria-label="§ 2. Theoretical Program &amp; Axiomatic Classification"
              className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight"
            >
              Theoretical Program &amp; Axiomatic Classification
            </h2>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Theoretical Mathematics &amp; Research Directions — Interconnected Axiomatic Lattice
            </p>
          </div>
        </div>

        {/* Introduction text */}
        <p className="font-serif text-sm text-ink-secondary leading-relaxed max-w-3xl">
          Research directions are not isolated disciplines but an interconnected lattice. Click on any domain to inspect its structural connections across algorithmic design, formal verification, and topological computation.
        </p>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Connected Research Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {researchInterestsData.map((interest) => {
            const isSelected = selectedId === interest.id;
            const isConnectedToSelected =
              selectedInterest !== null &&
              (selectedInterest.connections.includes(interest.id) ||
                interest.connections.includes(selectedInterest.id));

            const symbol = mathSymbols[interest.id] || '§';

            return (
              <div
                key={interest.id}
                onClick={() => setSelectedId(isSelected ? null : interest.id)}
                className={`p-6 rounded border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-paper-bg-subtle border-2 border-academic-amber shadow-sm'
                    : isConnectedToSelected
                    ? 'bg-paper-bg-elevated border-paper-border-strong'
                    : 'bg-paper-bg-base border-paper-border-subtle hover:border-paper-border-strong hover:bg-paper-bg-subtle/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-serif text-xl sm:text-2xl text-academic-amber font-bold w-7 text-center select-none">
                        {symbol}
                      </span>
                      <h3
                        className={`font-serif text-base font-bold transition-colors ${
                          isSelected || isConnectedToSelected
                            ? 'text-academic-amber'
                            : 'text-ink-primary'
                        }`}
                      >
                        {interest.title}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                        isSelected
                          ? 'bg-academic-amber text-paper-bg-base'
                          : 'bg-paper-bg-elevated border border-paper-border-subtle text-ink-muted'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Inspect'}
                    </span>
                  </div>

                  <p className="font-serif text-xs text-ink-secondary leading-relaxed pt-1">
                    {interest.summary}
                  </p>
                </div>

                {/* Connected Lattice Nodes */}
                <div className="pt-4 mt-3 border-t border-paper-border-subtle flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-ink-muted flex items-center space-x-1 mr-1">
                    <GitBranch className="w-2.5 h-2.5" />
                    <span>Lattice:</span>
                  </span>
                  {interest.connections.map((connId) => {
                    const connNode = researchInterestsData.find((r) => r.id === connId);
                    if (!connNode) return null;
                    return (
                      <span
                        key={connId}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          selectedId === connId
                            ? 'bg-academic-amber text-paper-bg-base border-academic-amber font-semibold'
                            : 'bg-paper-bg-subtle border-paper-border-subtle text-ink-muted'
                        }`}
                      >
                        {connNode.title.split(' ')[0]}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Focus Panel */}
        {selectedInterest && (
          <div className="p-5 rounded border border-academic-amber/40 bg-paper-bg-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-academic-amber font-bold">FOCUSED DOMAIN:</span>
              <span className="text-ink-primary font-semibold">{selectedInterest.title}</span>
              <span className="text-ink-muted">
                ({selectedInterest.connections.length} relational connections in theoretical lattice)
              </span>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-academic-amber hover:underline font-semibold self-start sm:self-auto cursor-pointer"
            >
              Clear Focus
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
