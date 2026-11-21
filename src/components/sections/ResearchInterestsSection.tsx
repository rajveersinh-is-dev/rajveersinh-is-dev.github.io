import React, { useState } from 'react';
import { researchInterestsData } from '../../data';
import { GitBranch, Sigma } from 'lucide-react';

export const ResearchInterestsSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedInterest = researchInterestsData.find((r) => r.id === selectedId) || null;

  return (
    <section id="research-interests" className="py-20 border-t border-border-subtle relative bg-bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
              <span>02 // Research Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
              Theoretical Mathematics & Research Directions
            </h2>
          </div>

          <div className="px-3.5 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs flex items-center space-x-2 self-start md:self-auto">
            <Sigma className="w-3.5 h-3.5" />
            <span>Primary Identity: Theoretical Mathematics</span>
          </div>
        </div>

        {/* Introduction text */}
        <p className="text-sm text-text-secondary font-mono max-w-3xl leading-relaxed">
          Research directions are not isolated disciplines but an interconnected lattice. Click on any domain to inspect its structural connections across algorithmic design, formal verification, and topological computation.
        </p>

        {/* Connected Research Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchInterestsData.map((interest) => {
            const isSelected = selectedId === interest.id;
            const isConnectedToSelected =
              selectedInterest !== null &&
              (selectedInterest.connections.includes(interest.id) ||
                interest.connections.includes(selectedInterest.id));

            return (
              <div
                key={interest.id}
                onClick={() => setSelectedId(isSelected ? null : interest.id)}
                className={`p-5 rounded-lg border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-bg-card border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                    : isConnectedToSelected
                    ? 'bg-bg-elevated border-amber-500/50 text-text-primary'
                    : 'bg-bg-surface border-border-subtle hover:border-border-medium hover:bg-bg-elevated'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3
                    className={`font-mono text-sm font-bold tracking-tight transition-colors ${
                      isSelected
                        ? 'text-amber-400'
                        : isConnectedToSelected
                        ? 'text-amber-300'
                        : 'text-text-primary'
                    }`}
                  >
                    {interest.title}
                  </h3>
                  <span
                    className={`text-xs p-1 rounded font-mono ${
                      isSelected ? 'bg-amber-500/20 text-amber-400' : 'text-text-muted'
                    }`}
                  >
                    {isSelected ? 'ACTIVE' : 'EXPAND'}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed font-sans pt-2">
                  {interest.summary}
                </p>

                {/* Connected badges */}
                <div className="pt-4 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-text-dim flex items-center space-x-1 mr-1">
                    <GitBranch className="w-2.5 h-2.5" />
                    <span>LATTICE:</span>
                  </span>
                  {interest.connections.map((connId) => {
                    const connNode = researchInterestsData.find((r) => r.id === connId);
                    if (!connNode) return null;
                    return (
                      <span
                        key={connId}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          selectedId === connId
                            ? 'bg-amber-500 text-bg-void font-bold border-amber-500'
                            : 'bg-bg-base border-border-subtle text-text-muted'
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

        {/* Selected Focus Bar */}
        {selectedInterest && (
          <div className="p-4 rounded-lg bg-bg-elevated border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-amber-500 font-bold">FOCUS:</span>
              <span className="text-text-primary">{selectedInterest.title}</span>
              <span className="text-text-muted">
                (Linked to {selectedInterest.connections.length} domains in the theoretical lattice)
              </span>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-text-muted hover:text-amber-400 underline self-start sm:self-auto"
            >
              Clear Focus
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
