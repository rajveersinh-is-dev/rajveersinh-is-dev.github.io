import React, { useState, useEffect, useRef, useCallback } from 'react';
import { researchInterestsData } from '../../data';
import { GitBranch, CornerDownRight } from 'lucide-react';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { MaskedReveal } from '../common/MaskedReveal';
import { usePreferences } from '../../context';

export const ResearchInterestsSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();
  const { playClick } = usePreferences();

  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [latticeArcs, setLatticeArcs] = useState<{ id: string; d: string }[]>([]);

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

  // Compute SVG curved lattice lines between selected card and its dependencies
  const updateLatticeArcs = useCallback(() => {
    if (!selectedId || !gridContainerRef.current) {
      setLatticeArcs([]);
      return;
    }

    const containerRect = gridContainerRef.current.getBoundingClientRect();
    const sourceCard = cardRefs.current[selectedId];
    if (!sourceCard) {
      setLatticeArcs([]);
      return;
    }

    const sourceRect = sourceCard.getBoundingClientRect();
    const x1 = sourceRect.left + sourceRect.width / 2 - containerRect.left;
    const y1 = sourceRect.top + sourceRect.height / 2 - containerRect.top;

    const arcs: { id: string; d: string }[] = [];
    const node = researchInterestsData.find((r) => r.id === selectedId);
    if (!node) return;

    node.connections.forEach((targetId) => {
      const targetCard = cardRefs.current[targetId];
      if (!targetCard) return;
      const targetRect = targetCard.getBoundingClientRect();
      const x2 = targetRect.left + targetRect.width / 2 - containerRect.left;
      const y2 = targetRect.top + targetRect.height / 2 - containerRect.top;

      // Draw elegant cubic bezier curve
      const dx = x2 - x1;
      const dy = y2 - y1;
      const cx1 = x1 + dx * 0.25 - dy * 0.15;
      const cy1 = y1 + dy * 0.25 + dx * 0.15;
      const cx2 = x1 + dx * 0.75 + dy * 0.15;
      const cy2 = y1 + dy * 0.75 - dx * 0.15;

      arcs.push({
        id: `${selectedId}-${targetId}`,
        d: `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`,
      });
    });

    setLatticeArcs(arcs);
  }, [selectedId]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(updateLatticeArcs);
    window.addEventListener('resize', updateLatticeArcs);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateLatticeArcs);
    };
  }, [updateLatticeArcs]);

  // Keyboard Navigation: 1-9 to select, Arrows to traverse, Escape to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const items = researchInterestsData;
      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= items.length) {
        e.preventDefault();
        playClick(850);
        setSelectedId(items[keyNum - 1].id);
        return;
      }

      if (e.key === 'Escape' && selectedId) {
        e.preventDefault();
        playClick(700);
        setSelectedId(null);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (!selectedId) {
          setSelectedId(items[0].id);
        } else {
          const idx = items.findIndex((r) => r.id === selectedId);
          const nextIdx = (idx + 1) % items.length;
          setSelectedId(items[nextIdx].id);
        }
        playClick(880);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (!selectedId) {
          setSelectedId(items[items.length - 1].id);
        } else {
          const idx = items.findIndex((r) => r.id === selectedId);
          const prevIdx = (idx - 1 + items.length) % items.length;
          setSelectedId(items[prevIdx].id);
        }
        playClick(860);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, playClick]);

  return (
    <section
      ref={sectionRef}
      id="research-interests"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
        >
          02
        </div>

        {/* Section Header */}
        <div className="space-y-3 relative z-10">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            § 2
          </div>
          <MaskedReveal>
            <h2
              aria-label="§ 2. Theoretical Program &amp; Axiomatic Classification"
              className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight"
            >
              § 2. Theoretical Program &amp; Axiomatic Classification
            </h2>
          </MaskedReveal>
          <MaskedReveal delayMs={150}>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Theoretical Mathematics &amp; Research Directions — Interconnected Axiomatic Lattice
            </p>
          </MaskedReveal>
        </div>

        {/* Introduction text */}
        <p className="font-serif text-sm text-ink-secondary leading-relaxed max-w-3xl">
          Research directions are not isolated disciplines but an interconnected lattice. Click or use <kbd className="font-mono text-xs px-1.5 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-primary">[1–9]</kbd> to inspect dynamic structural connections across algorithmic design, formal verification, and topological computation.
        </p>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Connected Research Interests Grid with Visual Lattice SVG Layer */}
        <div ref={gridContainerRef} className="relative">
          {/* Real-time SVG Curved Lattice Arcs Overlay */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
          >
            <defs>
              <linearGradient id="latticeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--academic-amber)" stopOpacity="0.85" />
                <stop offset="100%" stopColor="var(--academic-seal)" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {latticeArcs.map((arc) => (
              <path
                key={arc.id}
                d={arc.d}
                fill="none"
                stroke="url(#latticeGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
                style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.5))' }}
              />
            ))}
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {researchInterestsData.map((interest, idx) => {
              const isSelected = selectedId === interest.id;
              const isConnectedToSelected =
                selectedInterest !== null &&
                (selectedInterest.connections.includes(interest.id) ||
                  interest.connections.includes(selectedInterest.id));

              const symbol = mathSymbols[interest.id] || '§';

              return (
                <div
                  key={interest.id}
                  ref={(el) => {
                    cardRefs.current[interest.id] = el;
                  }}
                  onClick={() => {
                    playClick(840);
                    setSelectedId(isSelected ? null : interest.id);
                  }}
                  className={`p-6 rounded border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-paper-bg-subtle border-2 border-academic-amber shadow-md scale-[1.01]'
                      : isConnectedToSelected
                      ? 'bg-paper-bg-elevated border-2 border-academic-amber/60 shadow-xs'
                      : 'bg-paper-bg-base border-paper-border-subtle hover:border-paper-border-strong hover:bg-paper-bg-subtle/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-serif text-xl sm:text-2xl text-academic-amber font-bold w-7 text-center select-none">
                          {symbol}
                        </span>
                        <div>
                          <h3
                            className={`font-serif text-base font-bold transition-colors ${
                              isSelected || isConnectedToSelected
                                ? 'text-academic-amber'
                                : 'text-ink-primary'
                            }`}
                          >
                            {interest.title}
                          </h3>
                          <span className="text-[10px] font-mono text-ink-muted">
                            [{idx + 1}]
                          </span>
                        </div>
                      </div>

                      {/* Distinct Math Glyph Status Toggle */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold flex items-center space-x-1 transition-colors ${
                          isSelected
                            ? 'bg-academic-amber text-paper-bg-base shadow-xs'
                            : isConnectedToSelected
                            ? 'bg-paper-bg-base border border-academic-amber/40 text-academic-amber'
                            : 'bg-paper-bg-elevated border border-paper-border-subtle text-ink-muted'
                        }`}
                      >
                        <span>{isSelected ? '● ⊢ ACTIVE' : isConnectedToSelected ? '○ RELATIONAL' : '○ INSPECT'}</span>
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
        </div>

        {/* Selected Focus Panel & Keyboard Traversal Hint */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono">
          {selectedInterest ? (
            <div className="p-4 rounded border border-academic-amber/50 bg-paper-bg-subtle flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-academic-amber font-bold">LATTICE ANCHOR:</span>
                <span className="text-ink-primary font-semibold">{selectedInterest.title}</span>
                <span className="text-ink-muted">
                  ({selectedInterest.connections.length} incident lattice relations highlighted via bezier arcs)
                </span>
              </div>
              <button
                onClick={() => {
                  playClick(750);
                  setSelectedId(null);
                }}
                className="text-academic-amber hover:underline font-semibold self-start sm:self-auto cursor-pointer flex items-center space-x-1"
              >
                <span>Clear Focus (Esc)</span>
              </button>
            </div>
          ) : (
            <div className="text-ink-muted flex items-center space-x-2 py-2">
              <CornerDownRight className="w-3.5 h-3.5 text-academic-amber" />
              <span>Keyboard Traversal: Press <kbd className="text-ink-primary font-bold">1–9</kbd> or <kbd className="text-ink-primary font-bold">↑↓ / ←→</kbd> arrow keys to navigate theoretical lattice.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
