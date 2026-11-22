import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ShieldCheck, Tag, ExternalLink } from 'lucide-react';

interface AcademicPopoverProps {
  type: 'msc' | 'theorem' | 'citation';
  id: string;
  children: React.ReactNode;
  className?: string;
}

interface MetadataItem {
  title: string;
  category: string;
  description: string;
  formalReference?: string;
  link?: string;
}

const REGISTRY: Record<string, MetadataItem> = {
  // MSC2020 Codes
  '55N31': {
    title: 'MSC 55N31: Persistent Homology',
    category: 'Algebraic Topology & Topological Data Analysis',
    description: 'Mathematical study of topological features (connected components, 1-cycles, voids) across a parameterized filtration scale. Quantifies barcode persistence intervals.',
    formalReference: 'Mathematical Subject Classification (MSC2020) — Algebraic Topology',
  },
  '05C65': {
    title: 'MSC 05C65: Hypergraphs',
    category: 'Combinatorics & Extremal Set Systems',
    description: 'Higher-order graphs where generalized hyperedges can encompass arbitrary subsets of vertices. Essential for modeling non-pairwise multiway relations.',
    formalReference: 'MSC2020 — Graph Theory & Extremal Combinatorics',
  },
  '90C27': {
    title: 'MSC 90C27: Combinatorial Optimization',
    category: 'Mathematical Programming & Operations Research',
    description: 'Techniques for optimizing linear and non-linear objective functions over discrete combinatorial spaces, including shortest path, knapsack, and matching structures.',
    formalReference: 'MSC2020 — Operations Research & Mathematical Programming',
  },
  '90C06': {
    title: 'MSC 90C06: Large-Scale Programming',
    category: 'Optimization & Numerical Linear Algebra',
    description: 'Algorithms and dual decomposition techniques designed specifically for high-dimensional, sparse, and block-angular mathematical optimization problems.',
    formalReference: 'MSC2020 — Operations Research',
  },
  '68W05': {
    title: 'MSC 68W05: Nonnumerical Algorithms',
    category: 'Theoretical Computer Science',
    description: 'Discrete, graph-theoretic, and combinatorial algorithms prioritizing computational complexity bounds and asymptotic exactness.',
    formalReference: 'MSC2020 — Computer Science Algorithms',
  },
  '68N18': {
    title: 'MSC 68N18: Functional Programming & Lambda Calculus',
    category: 'Programming Languages & Formal Semantics',
    description: 'Denotational semantics, operational semantics, typed lambda calculi, and equational reasoning over pure functional programming constructs.',
    formalReference: 'MSC2020 — Theory of Software',
  },
  '68Q25': {
    title: 'MSC 68Q25: Analysis of Algorithms & Complexity',
    category: 'Computational Complexity',
    description: 'Formal classification of algorithmic time and space complexity, resource bounds, and hardness reductions.',
    formalReference: 'MSC2020 — Computational Complexity',
  },

  // Theorems & Invariants
  'thm-functorial': {
    title: 'Theorem 1.1: Functorial Continuity',
    category: 'Algebraic Invariant Contract',
    description: 'Proves the path-crossing filtration map constitutes an exact functor from the category of temporal hypergraphs to chain complexes, preserving boundary nilpotence ∂² = 0.',
    formalReference: 'Verified Equational Contract in Lean 4',
  },
  'thm-barcode': {
    title: 'Theorem 2.1: Barcode Stability',
    category: 'Topological Metric Stability',
    description: 'Guarantees the bottleneck distance between persistence barcodes is strictly bounded by the interleaving distance between hypergraph filtrations.',
    formalReference: 'Zenodo Archival Deposit: 22273633',
  },
  'thm-lagrangian': {
    title: 'Theorem 1.1: Lagrangian Dual Lower Bound',
    category: 'Dual Optimization Bound',
    description: 'Establishes that the dual objective function L(λ) is continuous and piecewise linear-concave, providing a valid lower bound on the primal integer optimum.',
    formalReference: 'Zenodo Archival Deposit: 22310401',
  },
  'thm-supercompilation': {
    title: 'Supercompilation Induction Contract',
    category: 'Mechanized Compiler Theory',
    description: 'Homeomorphic embedding whistle tests detect inductive loops and fold dynamic recursive calls into provably equivalent zero-allocation residual loops.',
    formalReference: 'NumLang Research Specification',
  },

  // Citations & Preprints
  'zenodo-22273633': {
    title: 'Path-Crossing Functors on Temporal Hypergraphs',
    category: 'Independently Authored Zenodo Preprint (2026)',
    description: 'Pardeshi, R. V. (2026). Formulates functorial persistence and combinatorial invariants on dynamic hypergraph interaction networks.',
    formalReference: 'DOI: 10.5281/zenodo.22273633',
    link: 'https://zenodo.org/records/22273633',
  },
  'zenodo-22310401': {
    title: 'Lagrangian Dual Pruning in Combinatorial Lattices',
    category: 'Independently Authored Zenodo Preprint (2026)',
    description: 'Pardeshi, R. V. (2026). Dual decomposition and convex hull pruning for resource-constrained shortest path problems.',
    formalReference: 'DOI: 10.5281/zenodo.22310401',
    link: 'https://zenodo.org/records/22310401',
  },
};

export const AcademicPopover: React.FC<AcademicPopoverProps> = ({
  type,
  id,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);

  const meta = REGISTRY[id] || {
    title: `${type.toUpperCase()} Record [${id}]`,
    category: 'Scholarly Classification',
    description: 'Formal mathematical reference and archival metadata annotation.',
    formalReference: 'Pardeshi Mathematical Archive',
  };

  const getIcon = () => {
    switch (type) {
      case 'msc':
        return <Tag className="w-3.5 h-3.5 text-academic-cobalt" />;
      case 'theorem':
        return <ShieldCheck className="w-3.5 h-3.5 text-academic-amber" />;
      case 'citation':
        return <BookOpen className="w-3.5 h-3.5 text-academic-seal" />;
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      setIsOpen(false);
    }
  };

  return (
    <span
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <span
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="cursor-help border-b border-dotted border-academic-amber text-ink-primary hover:text-academic-amber transition-colors outline-none focus:ring-1 focus:ring-academic-amber rounded-xs px-0.5"
      >
        {children}
      </span>

      {/* Popover Card */}
      {isOpen && (
        <div
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 sm:w-80 p-3.5 rounded-xs border-2 border-paper-border-strong bg-paper-bg-base/98 text-ink-primary shadow-xl backdrop-blur-xs select-none pointer-events-auto animate-fade-in"
        >
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider border-b border-paper-border-subtle pb-1.5">
              {getIcon()}
              <span className="font-bold text-ink-secondary">{meta.category}</span>
            </div>

            <div className="font-serif font-bold text-xs text-ink-primary leading-tight">
              {meta.title}
            </div>

            <p className="font-serif text-[11px] text-ink-secondary leading-relaxed">
              {meta.description}
            </p>

            {meta.formalReference && (
              <div className="pt-1 text-[10px] font-mono text-academic-amber flex items-center justify-between">
                <span>{meta.formalReference}</span>
                {meta.link && (
                  <a
                    href={meta.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-0.5 hover:underline"
                  >
                    <span>Record</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Bottom Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-paper-border-strong" />
        </div>
      )}
    </span>
  );
};
