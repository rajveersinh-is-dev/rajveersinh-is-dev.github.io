import React, { useState } from 'react';
import { researchInterestsData } from '../../data';
import { GitBranch, Sigma } from 'lucide-react';

export const ResearchInterestsSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    <section id="research-interests" className="py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-academic-seal font-semibold">
              Programma Theoreticum • Section II
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
              § 2. Theoretical Program &amp; Axiomatic Classification
            </h2>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Theoretical Mathematics &amp; Research Directions — Interconnected Axiomatic Lattice
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded border border-academic-seal/30 bg-academic-seal/10 text-academic-seal font-mono text-xs flex items-center space-x-2 self-start md:self-auto font-semibold">
            <Sigma className="w-3.5 h-3.5" />
            <span>Foundational Identity: Theoretical Mathematics</span>
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
                    ? 'bg-paper-bg-subtle border-2 border-academic-seal shadow-sm'
                    : isConnectedToSelected
                    ? 'bg-paper-bg-elevated border-academic-amber'
                    : 'bg-paper-bg-base border-paper-border-subtle hover:border-paper-border-strong hover:bg-paper-bg-subtle/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-serif text-xl sm:text-2xl text-academic-seal font-bold w-7 text-center select-none">
                        {symbol}
                      </span>
                      <h3
                        className={`font-serif text-base font-bold transition-colors ${
                          isSelected
                            ? 'text-academic-seal'
                            : isConnectedToSelected
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
                          ? 'bg-academic-seal text-white'
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
                            ? 'bg-academic-seal text-white border-academic-seal font-semibold'
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
          <div className="p-5 rounded border border-academic-seal/40 bg-paper-bg-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-academic-seal font-bold">FOCUSED DOMAIN:</span>
              <span className="text-ink-primary font-semibold">{selectedInterest.title}</span>
              <span className="text-ink-muted">
                ({selectedInterest.connections.length} relational connections in theoretical lattice)
              </span>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-academic-seal hover:underline font-semibold self-start sm:self-auto"
            >
              Clear Focus
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
