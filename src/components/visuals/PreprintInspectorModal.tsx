import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { PublicationEntry } from '../../types/content';
import { usePreferences } from '../../context';
import { copyTextToClipboard } from '../../utils/clipboard';
import { AcademicPopover } from '../common/AcademicPopover';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Sliders,
  Play,
  RotateCcw
} from 'lucide-react';

interface PreprintInspectorModalProps {
  publication: PublicationEntry | null;
  onClose: () => void;
}

export const PreprintInspectorModal: React.FC<PreprintInspectorModalProps> = ({
  publication,
  onClose,
}) => {
  const { playClick } = usePreferences();
  const [activeTheoremId, setActiveTheoremId] = useState<string>('thm1');
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [filtrationEpsilon, setFiltrationEpsilon] = useState<number>(0.45);
  const [lambdaMultiplier, setLambdaMultiplier] = useState<number>(1.2);
  const [isPlayingFiltration, setIsPlayingFiltration] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Focus close button on mount & lock body scroll
  useEffect(() => {
    if (!publication) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [publication, onClose]);

  // Automated filtration sweep animation
  useEffect(() => {
    if (!isPlayingFiltration) return;
    const interval = setInterval(() => {
      setFiltrationEpsilon((prev) => {
        if (prev >= 0.95) {
          setIsPlayingFiltration(false);
          return 0.95;
        }
        return Number((prev + 0.02).toFixed(2));
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isPlayingFiltration]);

  // Canvas drawing for topological or combinatorial simulation
  useEffect(() => {
    if (!publication) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const isTopologyPaper = publication.id === 'zenodo-22273633';

    if (isTopologyPaper) {
      // 1. TOPOLOGICAL HYPERGRAPH & SIMPLICIAL COMPLEX SIMULATION
      // Vertices with fixed positions
      const vertices = [
        { id: 0, x: width * 0.22, y: height * 0.32, label: 'v₀' },
        { id: 1, x: width * 0.52, y: height * 0.22, label: 'v₁' },
        { id: 2, x: width * 0.78, y: height * 0.38, label: 'v₂' },
        { id: 3, x: width * 0.65, y: height * 0.72, label: 'v₃' },
        { id: 4, x: width * 0.32, y: height * 0.68, label: 'v₄' },
        { id: 5, x: width * 0.46, y: height * 0.46, label: 'v₅' },
      ];

      // Edges with filtration birth times
      const edges = [
        { u: 0, v: 1, birth: 0.15 },
        { u: 1, v: 2, birth: 0.25 },
        { u: 2, v: 3, birth: 0.35 },
        { u: 3, v: 4, birth: 0.20 },
        { u: 4, v: 0, birth: 0.30 },
        { u: 0, v: 5, birth: 0.40 },
        { u: 1, v: 5, birth: 0.45 },
        { u: 3, v: 5, birth: 0.55 },
        { u: 4, v: 5, birth: 0.60 },
      ];

      // 2-simplices (triangles) with birth times
      const triangles = [
        { u: 0, v: 1, w: 5, birth: 0.52 },
        { u: 3, v: 4, w: 5, birth: 0.68 },
      ];

      // Draw active 2-simplices (filled triangles)
      triangles.forEach((tri) => {
        if (filtrationEpsilon >= tri.birth) {
          const v0 = vertices[tri.u];
          const v1 = vertices[tri.v];
          const v2 = vertices[tri.w];
          ctx.beginPath();
          ctx.moveTo(v0.x, v0.y);
          ctx.lineTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.closePath();
          ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
          ctx.stroke();
        }
      });

      // Draw active edges
      edges.forEach((edge) => {
        const active = filtrationEpsilon >= edge.birth;
        const v0 = vertices[edge.u];
        const v1 = vertices[edge.v];
        ctx.beginPath();
        ctx.moveTo(v0.x, v0.y);
        ctx.lineTo(v1.x, v1.y);
        if (active) {
          ctx.strokeStyle = '#d97706'; // academic amber
          ctx.lineWidth = 2.2;
        } else {
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)'; // inactive faint dashed
          if (ctx.setLineDash) ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1;
        }
        ctx.stroke();
        if (ctx.setLineDash) ctx.setLineDash([]);
      });

      // Draw vertices
      vertices.forEach((v) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#f59e0b';
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(v.label, v.x, v.y - 12);
      });

      // Draw dynamic Betti Numbers Overlay on canvas
      // Compute connected components and 1-cycles using Disjoint-Set Union-Find and 2-simplices
      const parent = [0, 1, 2, 3, 4, 5];
      const find = (i: number): number => {
        let curr = i;
        while (curr !== parent[curr]) {
          parent[curr] = parent[parent[curr]];
          curr = parent[curr];
        }
        return curr;
      };
      const union = (i: number, j: number): boolean => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
          parent[rootI] = rootJ;
          return true; // merged two distinct components
        }
        return false; // cycle-forming edge
      };

      let numComponents = 6;
      let cycleEdgesCount = 0;

      edges.forEach((edge) => {
        if (filtrationEpsilon >= edge.birth) {
          if (union(edge.u, edge.v)) {
            numComponents--;
          } else {
            cycleEdgesCount++;
          }
        }
      });

      const b0 = numComponents;

      // Active 2-simplices fill and eliminate independent 1-cycles
      const activeTriangles = triangles.filter((tri) => {
        if (filtrationEpsilon < tri.birth) return false;
        const e1Active = edges.some(
          (e) => filtrationEpsilon >= e.birth && ((e.u === tri.u && e.v === tri.v) || (e.u === tri.v && e.v === tri.u))
        );
        const e2Active = edges.some(
          (e) => filtrationEpsilon >= e.birth && ((e.u === tri.v && e.v === tri.w) || (e.u === tri.w && e.v === tri.v))
        );
        const e3Active = edges.some(
          (e) => filtrationEpsilon >= e.birth && ((e.u === tri.w && e.v === tri.u) || (e.u === tri.u && e.v === tri.w))
        );
        return e1Active && e2Active && e3Active;
      });

      const b1 = Math.max(0, cycleEdgesCount - activeTriangles.length);
      const eulerChi = b0 - b1;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(12, 12, 190, 75);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(12, 12, 190, 75);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`FILTRATION ε = ${filtrationEpsilon.toFixed(2)}`, 22, 30);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px monospace';
      ctx.fillText(`Betti β₀ (Components): ${b0}`, 22, 48);
      ctx.fillText(`Betti β₁ (1-Cycles):    ${b1}`, 22, 64);
      ctx.fillText(`Euler Char χ:          ${eulerChi}`, 22, 80);
    } else {
      // 2. LAGRANGIAN DUAL CONVEX HULL SIMULATION
      // Resource-Cost plane
      const padX = 40;
      const padY = 30;
      const graphW = width - padX * 2;
      const graphH = height - padY * 2;

      // Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padX, padY);
      ctx.lineTo(padX, padY + graphH);
      ctx.lineTo(padX + graphW, padY + graphH);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('Resource Consumption (R)', padX + graphW - 140, padY + graphH + 20);
      if (ctx.save && ctx.translate && ctx.rotate && ctx.restore) {
        ctx.save();
        ctx.translate(15, padY + graphH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Cost c(x)', 0, 0);
        ctx.restore();
      }

      // Resource budget limit line
      const budgetX = padX + graphW * 0.65;
      ctx.strokeStyle = '#ef4444';
      if (ctx.setLineDash) ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(budgetX, padY);
      ctx.lineTo(budgetX, padY + graphH);
      ctx.stroke();
      if (ctx.setLineDash) ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('Budget Limit B', budgetX - 40, padY + 12);

      // Candidate path states in (Resource, Cost)
      const states = [
        { r: 0.15, c: 0.85, name: 's₀' },
        { r: 0.28, c: 0.68, name: 's₁' },
        { r: 0.42, c: 0.45, name: 's₂' },
        { r: 0.58, c: 0.32, name: 's₃' },
        { r: 0.72, c: 0.22, name: 's₄' }, // beyond budget
        { r: 0.48, c: 0.70, name: 'd₁' }, // dominated
        { r: 0.62, c: 0.55, name: 'd₂' }, // dominated
      ];

      const budgetLimit = 0.65;

      // Real Lagrangian relaxation from first principles:
      // L(λ) = min_s [ c(s) + λ * (r(s) - B) ]
      let minLagrangianVal = Infinity;
      let optState = states[0];

      states.forEach((st) => {
        const val = st.c * 100 + lambdaMultiplier * (st.r - budgetLimit) * 100;
        if (val < minLagrangianVal) {
          minLagrangianVal = val;
          optState = st;
        }
      });

      // Real Pareto dominance pruning calculation
      const prunedStates = states.filter((st) => {
        return states.some(
          (other) =>
            other !== st &&
            other.r <= st.r &&
            other.c <= st.c &&
            (other.r < st.r || other.c < st.c)
        );
      });

      // Supporting dual hyperplane line passing through optState
      const slope = -lambdaMultiplier * 0.8;
      const optSx = padX + optState.r * graphW;
      const optSy = padY + graphH - optState.c * graphH;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const lineX0 = padX + 10;
      const lineY0 = optSy - slope * (lineX0 - optSx);
      const lineX1 = padX + graphW - 10;
      const lineY1 = optSy - slope * (lineX1 - optSx);
      ctx.moveTo(lineX0, Math.max(padY, Math.min(padY + graphH, lineY0)));
      ctx.lineTo(lineX1, Math.max(padY, Math.min(padY + graphH, lineY1)));
      ctx.stroke();

      // Draw states
      states.forEach((st) => {
        const sx = padX + st.r * graphW;
        const sy = padY + graphH - st.c * graphH;
        const isDominated = prunedStates.includes(st);
        const isFeasible = st.r <= budgetLimit;
        const isOpt = st === optState;

        ctx.beginPath();
        ctx.arc(sx, sy, isOpt ? 7 : 5, 0, Math.PI * 2);
        if (isOpt) {
          ctx.fillStyle = '#f59e0b'; // golden amber for optimal dual minimizer
          ctx.strokeStyle = '#ffffff';
        } else if (isDominated) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.35)'; // grayed pruned
          ctx.strokeStyle = '#64748b';
        } else if (isFeasible) {
          ctx.fillStyle = '#10b981'; // green Pareto feasible
          ctx.strokeStyle = '#059669';
        } else {
          ctx.fillStyle = '#ef4444'; // red infeasible
          ctx.strokeStyle = '#b91c1c';
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isOpt ? '#f59e0b' : '#cbd5e1';
        ctx.font = isOpt ? 'bold 10px monospace' : '9px monospace';
        ctx.fillText(st.name, sx + 7, sy + 3);
      });

      // Dual bound status overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(padX + 10, padY + 10, 215, 75);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(padX + 10, padY + 10, 215, 75);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`LAGRANGE MULTIPLIER λ = ${lambdaMultiplier.toFixed(2)}`, padX + 20, padY + 28);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px monospace';
      ctx.fillText(`Dual Lower Bound L(λ): ${minLagrangianVal.toFixed(1)}`, padX + 20, padY + 44);
      ctx.fillText(`Pruned Dominated States: ${prunedStates.length}`, padX + 20, padY + 58);
      ctx.fillText(`Optimal Active Path:     ${optState.name} (r: ${optState.r.toFixed(2)}, c: ${optState.c.toFixed(2)})`, padX + 20, padY + 72);
    }
  }, [publication, filtrationEpsilon, lambdaMultiplier]);

  if (!publication) return null;

  const isTopologyPaper = publication.id === 'zenodo-22273633';

  const bibtex = `@article{pardeshi_${publication.id},
  author    = {${publication.authors.join(' and ')}},
  title     = {${publication.title}},
  journal   = {Zenodo Archival Preprint},
  year      = {${publication.year ?? '2026'}},
  url       = {${publication.recordUrl}},
  note      = {Independently authored research deposit}
}`;

  const handleCopyBibtex = async () => {
    playClick(920);
    const success = await copyTextToClipboard(bibtex);
    if (success) {
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2000);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Scholarly Preprint Inspector: ${publication.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="max-w-6xl w-full my-auto max-h-[92vh] max-h-[92dvh] flex flex-col overflow-hidden bg-paper-bg-subtle border-2 border-paper-border-strong rounded-xs shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Masthead */}
        <div className="px-4 sm:px-6 py-3.5 border-b-2 border-paper-border-strong bg-paper-bg-base flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-academic-amber/50 bg-academic-amber/10 text-academic-amber font-bold">
              SCHOLARLY PREPRINT INSPECTOR
            </span>
            <span className="text-xs font-mono text-ink-muted truncate hidden sm:inline">
              Zenodo Accession: {publication.id}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={publication.recordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded border border-paper-border-subtle bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-secondary hover:text-ink-primary text-xs font-mono flex items-center space-x-1 transition-colors cursor-pointer"
              title="Open Official Zenodo Record"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zenodo</span>
            </a>

            <button
              onClick={handleCopyBibtex}
              className="px-2.5 py-1 rounded border border-paper-border-subtle bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-secondary hover:text-ink-primary text-xs font-mono flex items-center space-x-1 transition-colors cursor-pointer"
              title="Copy BibTeX Citation"
            >
              {copiedBibtex ? <Check className="w-3.5 h-3.5 text-academic-amber" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">BibTeX</span>
            </button>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1.5 rounded border border-paper-border-subtle bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
              aria-label="Close preprint inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-paper-border-strong">
          {/* LEFT PANE: Scholarly Text, Section Outlines & Theorem Navigation (cols 6) */}
          <div className="lg:col-span-6 p-4 sm:p-6 overflow-y-auto space-y-6 bg-paper-bg-subtle">
            {/* Paper Header */}
            <div className="space-y-2 border-b border-paper-border-subtle pb-4">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-ink-muted">
                <span className="font-semibold text-academic-seal">MSC2020:</span>
                {isTopologyPaper ? (
                  <>
                    <AcademicPopover type="msc" id="55N31">
                      55N31 (Persistent Homology)
                    </AcademicPopover>
                    <span>•</span>
                    <AcademicPopover type="msc" id="05C65">
                      05C65 (Hypergraphs)
                    </AcademicPopover>
                    <span>•</span>
                    <AcademicPopover type="msc" id="68W05">
                      68W05
                    </AcademicPopover>
                  </>
                ) : (
                  <>
                    <AcademicPopover type="msc" id="90C27">
                      90C27 (Combinatorial Optimization)
                    </AcademicPopover>
                    <span>•</span>
                    <AcademicPopover type="msc" id="90C06">
                      90C06 (Large-Scale Programming)
                    </AcademicPopover>
                    <span>•</span>
                    <AcademicPopover type="msc" id="68Q25">
                      68Q25
                    </AcademicPopover>
                  </>
                )}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary leading-tight">
                {publication.title}
              </h2>
              <div className="font-serif text-xs text-ink-secondary">
                By <span className="font-semibold text-ink-primary">{publication.authors.join(', ')}</span>
                <span className="text-academic-amber font-semibold ml-0.5">¹</span>
              </div>
              <div className="text-[11px] font-serif italic text-ink-muted">
                ¹ Independent Mathematical Researcher, Pune, Maharashtra, India
              </div>
            </div>

            {/* Abstract */}
            <div className="p-4 rounded-xs border-l-3 border-academic-amber bg-paper-bg-base border border-paper-border-subtle text-xs font-serif text-ink-secondary leading-relaxed">
              <span className="font-serif font-bold text-[11px] uppercase tracking-widest text-ink-primary mr-2">
                ABSTRACT.
              </span>
              {publication.shortAbstract}
            </div>

            {/* Interactive Theorem Navigator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-ink-muted">
                <span className="font-bold text-academic-amber">
                  Theorems, Formal Lemmas &amp; Invariants:
                </span>
                <span className="text-[10px]">Select to Inspect</span>
              </div>

              {isTopologyPaper ? (
                <div className="space-y-2.5">
                  <div
                    onClick={() => {
                      playClick(800);
                      setActiveTheoremId('thm1');
                    }}
                    className={`p-3 rounded-xs border transition-colors cursor-pointer text-xs font-serif ${
                      activeTheoremId === 'thm1'
                        ? 'border-academic-amber bg-paper-bg-base shadow-xs'
                        : 'border-paper-border-subtle bg-paper-bg-base/60 hover:bg-paper-bg-base'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-academic-amber font-bold mb-1">
                      THEOREM 1.1 (Functorial Continuity &amp; Nilpotence)
                    </div>
                    <p className="text-ink-primary leading-relaxed">
                      Let <span className="font-serif italic font-bold">H_T</span> be a weighted temporal hypergraph filtration. The path-crossing assignment yields a continuous functor <span className="font-mono">F: H_T → Ch(k)</span> satisfying boundary nilpotence <span className="font-mono font-bold">∂ ∘ ∂ = 0</span> at all filtration thresholds.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      playClick(840);
                      setActiveTheoremId('thm2');
                    }}
                    className={`p-3 rounded-xs border transition-colors cursor-pointer text-xs font-serif ${
                      activeTheoremId === 'thm2'
                        ? 'border-academic-amber bg-paper-bg-base shadow-xs'
                        : 'border-paper-border-subtle bg-paper-bg-base/60 hover:bg-paper-bg-base'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-academic-amber font-bold mb-1">
                      THEOREM 2.1 (Stability of Persistence Barcodes)
                    </div>
                    <p className="text-ink-primary leading-relaxed">
                      The bottleneck distance between persistence diagrams is upper-bounded by the interleaving distance of temporal hypergraph filtrations: <span className="font-mono font-bold">d_B(Dgm(F), Dgm(G)) ≤ d_I(F, G)</span>.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      playClick(880);
                      setActiveTheoremId('lem1');
                    }}
                    className={`p-3 rounded-xs border transition-colors cursor-pointer text-xs font-serif ${
                      activeTheoremId === 'lem1'
                        ? 'border-academic-amber bg-paper-bg-base shadow-xs'
                        : 'border-paper-border-subtle bg-paper-bg-base/60 hover:bg-paper-bg-base'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-academic-amber font-bold mb-1">
                      LEMMA 2.2 (Lean 4 Mechanized Proof Invariant)
                    </div>
                    <p className="text-ink-primary leading-relaxed">
                      Equational proof verified in Lean 4 theorem prover: All simplicial boundaries are proven algebraic cycles with 0 synthetic axioms.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div
                    onClick={() => {
                      playClick(800);
                      setActiveTheoremId('thm1');
                    }}
                    className={`p-3 rounded-xs border transition-colors cursor-pointer text-xs font-serif ${
                      activeTheoremId === 'thm1'
                        ? 'border-academic-amber bg-paper-bg-base shadow-xs'
                        : 'border-paper-border-subtle bg-paper-bg-base/60 hover:bg-paper-bg-base'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-academic-amber font-bold mb-1">
                      THEOREM 1.1 (Lagrangian Dual Concavity &amp; Bounded Gap)
                    </div>
                    <p className="text-ink-primary leading-relaxed">
                      The Lagrangian dual function <span className="font-mono">L(λ) = min_x [c^T x + λ^T (R x - B)]</span> is continuous, concave, and yields an admissible lower bound strictly preserving optimal solutions.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      playClick(840);
                      setActiveTheoremId('thm2');
                    }}
                    className={`p-3 rounded-xs border transition-colors cursor-pointer text-xs font-serif ${
                      activeTheoremId === 'thm2'
                        ? 'border-academic-amber bg-paper-bg-base shadow-xs'
                        : 'border-paper-border-subtle bg-paper-bg-base/60 hover:bg-paper-bg-base'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-academic-amber font-bold mb-1">
                      THEOREM 2.1 (Lower Convex Hull Dominance Pruning)
                    </div>
                    <p className="text-ink-primary leading-relaxed">
                      Any candidate search node lying strictly above the lower convex hull of the (Resource, Cost) Pareto frontier can be pruned without sacrificing optimality.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Live Interactive Mathematical & Topological Visualizer (cols 6) */}
          <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col justify-between space-y-4 bg-paper-bg-base">
            <div>
              <div className="flex items-center justify-between border-b border-paper-border-subtle pb-2.5">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-academic-amber" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-primary">
                    {isTopologyPaper
                      ? 'Live Simplicial Complex & Persistence Filtration'
                      : 'Live Lagrangian Dual Hull & Pareto Lattice'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-ink-muted">
                  Interactive Model
                </span>
              </div>
              <p className="text-[11px] font-serif text-ink-muted mt-1">
                {isTopologyPaper
                  ? 'Modulate the filtration threshold ε to witness simplicial complex birth, cycle emergence, and Betti numbers.'
                  : 'Adjust the Lagrange multiplier λ to observe dynamic supporting hyperplanes and convex hull pruning.'}
              </p>
            </div>

            {/* Interactive Canvas */}
            <div className="relative rounded border border-paper-border-strong bg-paper-bg-elevated overflow-hidden flex-1 min-h-[260px] sm:min-h-[320px]">
              <canvas
                ref={canvasRef}
                width={560}
                height={340}
                className="interactive-canvas w-full h-full block"
              />
            </div>

            {/* Interactive Control Dashboard */}
            <div className="p-3.5 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-3 font-mono text-xs">
              {isTopologyPaper ? (
                <>
                  <div className="flex items-center justify-between">
                    <label htmlFor="filtration-slider" className="text-ink-secondary font-semibold">
                      Filtration Threshold (ε):
                    </label>
                    <span className="font-bold text-academic-amber text-sm tabular-nums">
                      {filtrationEpsilon.toFixed(2)}
                    </span>
                  </div>

                  <input
                    id="filtration-slider"
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.01"
                    value={filtrationEpsilon}
                    onChange={(e) => {
                      setIsPlayingFiltration(false);
                      setFiltrationEpsilon(parseFloat(e.target.value));
                    }}
                    className="w-full accent-academic-amber cursor-pointer"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setIsPlayingFiltration(!isPlayingFiltration)}
                      className="px-2.5 py-1 rounded border border-paper-border-strong bg-paper-bg-base hover:bg-paper-bg-elevated text-ink-primary flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
                    >
                      <Play className="w-3 h-3 text-academic-amber" />
                      <span>{isPlayingFiltration ? 'Pause Sweep' : 'Auto-Sweep Filtration'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsPlayingFiltration(false);
                        setFiltrationEpsilon(0.20);
                      }}
                      className="px-2.5 py-1 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-ink-muted hover:text-ink-primary flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <label htmlFor="lambda-slider" className="text-ink-secondary font-semibold">
                      Lagrange Multiplier (λ):
                    </label>
                    <span className="font-bold text-academic-amber text-sm tabular-nums">
                      {lambdaMultiplier.toFixed(2)}
                    </span>
                  </div>

                  <input
                    id="lambda-slider"
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.05"
                    value={lambdaMultiplier}
                    onChange={(e) => setLambdaMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-academic-amber cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
                    <span>Pruning Status: Active Convex Hull</span>
                    <button
                      onClick={() => setLambdaMultiplier(1.2)}
                      className="px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-secondary hover:text-ink-primary cursor-pointer"
                    >
                      Reset λ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
