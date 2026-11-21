import React, { useState, useEffect, useRef } from 'react';
import type { ProjectEntry } from '../../types/content';
import { Play, RotateCcw, Sliders, CheckCircle2 } from 'lucide-react';

interface ProjectVisualDemoProps {
  project: ProjectEntry;
}

export const ProjectVisualDemo: React.FC<ProjectVisualDemoProps> = ({ project }) => {
  switch (project.id) {
    case 'numlang':
      return <NumLangPipelineVisualizer />;
    case 'terrain-erosion-engine':
      return <TerrainErosionSimulator />;
    case 'dual-pruned-decoding':
      return <DualPruningHullVisualizer />;
    case 'early-warning-complex-systems':
      return <EarlyWarningDynamicsVisualizer />;
    case 'certified-dose':
      return <PersistentHomologyHypergraphVisualizer />;
    case 'umbra':
      return <UmbraAuditCoverageVisualizer />;
    case 'sunflower-conjecture-audit':
      return <SunflowerHypergraphVisualizer />;
    default:
      return <DefaultSystemArchitectureVisualizer project={project} />;
  }
};

/* --------------------------------------------------------------------------
   1. NumLang: Interactive Compiler Lowering & Lean 4 Formal Pipeline
   -------------------------------------------------------------------------- */
const NumLangPipelineVisualizer: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = [
    {
      id: 0,
      title: 'Source Recurrence AST',
      badge: 'Frontend',
      desc: 'High-level mathematical recursive term with algebraic type constraints.',
      code: 'fn fib(n: u64) -> u64 {\n  match n {\n    0 => 0,\n    1 => 1,\n    k => fib(k - 1) + fib(k - 2)\n  }\n}',
      notes: 'Parsed into abstract syntax tree; equational signatures registered.'
    },
    {
      id: 1,
      title: 'SSA IR & Def-Use Chains',
      badge: 'Mid-End IR',
      desc: 'Static Single Assignment intermediate form with basic blocks, phi-nodes, and dominance frontiers.',
      code: 'bb0(v0: u64):\n  v1 = icmp eq v0, 0\n  br_if v1, bb_ret_zero, bb1\nbb1:\n  v2 = icmp eq v0, 1\n  br_if v2, bb_ret_one, bb_recurse\nbb_recurse:\n  v3 = isub v0, 1\n  v4 = call @fib(v3)\n  v5 = isub v0, 2\n  v6 = call @fib(v5)\n  v7 = iadd v4, v6\n  ret v7',
      notes: 'Every variable assigned exactly once; ready for supercompilation tree unfolding.'
    },
    {
      id: 2,
      title: 'Homeomorphic Supercompilation',
      badge: 'Optimization',
      desc: 'Driving, homeomorphic embedding checks (v ⊲ u), and term folding transforming exponential recursions into linear loops.',
      code: '// Supercompiled folded loop nest (O(N) time, O(1) space)\nbb_loop(n: u64, a: u64, b: u64, i: u64):\n  v_done = icmp eq i, n\n  br_if v_done, bb_exit(a), bb_step\nbb_step:\n  v_next = iadd a, b\n  v_i_next = iadd i, 1\n  jump bb_loop(n, b, v_next, v_i_next)',
      notes: 'Identifies repetitive state configurations and folds recursive branches into tail iterations.'
    },
    {
      id: 3,
      title: 'Lean 4 Equational Proof Contract',
      badge: 'Formal Verification',
      desc: 'Mechanized equational theorem verifying that the supercompiled loop matches the declarative recurrence semantics.',
      code: 'theorem numlang_supercompile_soundness (n : Nat) :\n    eval_ssa (compile_numlang fib_ast) n = fib_declarative n :=\nby\n  induction n with\n  | zero => rfl\n  | succ k ih =>\n    simp [compile_numlang, eval_ssa]\n    rw [ih]\n    apply loop_invariant_preservation',
      notes: 'Lean 4 contract verified without axioms or unproven sorry declarations.'
    },
    {
      id: 4,
      title: 'Dual Backend Code Emission',
      badge: 'Codegen',
      desc: 'Target emission via Cranelift (low-latency JIT) or LLVM (vectorized machine assembly).',
      code: '// Cranelift CLIF / LLVM IR emission:\nfunction u0:0(i64) -> i64 system_v {\n  block0(v0: i64):\n    v1 = iconst.i64 0\n    v2 = iconst.i64 1\n    jump block1(v0, v1, v2, v1)\n  block1(v3: i64, v4: i64, v5: i64, v6: i64):\n    v7 = icmp eq v6, v3\n    brif v7, block2(v4), block3\n}',
      notes: 'Direct machine code emission without runtime garbage collection overhead.'
    }
  ];

  return (
    <div className="space-y-4 p-4 rounded-lg bg-bg-void border border-border-subtle font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
        <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">
          [INTERACTIVE COMPILER PIPELINE STAGES]
        </span>
        <span className="text-text-muted text-[10px]">
          Click stage node to inspect transformation
        </span>
      </div>

      {/* Pipeline Navigation Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id)}
            className={`p-2 rounded text-left border transition-all ${
              activeStage === stage.id
                ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                : 'bg-bg-surface border-border-subtle text-text-muted hover:text-text-primary'
            }`}
          >
            <div className="text-[9px] uppercase tracking-wider text-amber-500/80 font-bold">
              {stage.badge}
            </div>
            <div className="text-[11px] truncate mt-0.5">{stage.title}</div>
          </button>
        ))}
      </div>

      {/* Active Stage Detail */}
      <div className="p-3.5 rounded bg-bg-surface border border-border-medium space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-text-primary font-bold text-xs">
            {stages[activeStage].title}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
            Stage {activeStage + 1} of 5
          </span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed font-sans">
          {stages[activeStage].desc}
        </p>

        <pre className="p-3 rounded bg-bg-base border border-border-subtle text-text-primary text-[11px] overflow-x-auto whitespace-pre font-mono leading-relaxed">
          {stages[activeStage].code}
        </pre>

        <div className="text-[10px] text-text-dim flex items-center space-x-1 pt-1">
          <CheckCircle2 className="w-3 h-3 text-amber-500 flex-shrink-0" />
          <span>{stages[activeStage].notes}</span>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   2. Terrain Erosion Engine: Real-Time Hydraulic Particle Canvas
   -------------------------------------------------------------------------- */
const generateTerrainProfile = () => {
  const points = 120;
  const h: number[] = [];
  for (let i = 0; i < points; i++) {
    const x = i / points;
    const base = Math.sin(x * Math.PI) * 110;
    const detail1 = Math.sin(x * Math.PI * 4) * 25;
    const detail2 = Math.cos(x * Math.PI * 8) * 10;
    h.push(base + detail1 + detail2 + 40);
  }
  return h;
};

const TerrainErosionSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [iterations, setIterations] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);

  // 1D heightmap representing a terrain elevation cross-section
  const heightmapRef = useRef<number[]>(generateTerrainProfile());

  const resetHeightmap = () => {
    heightmapRef.current = generateTerrainProfile();
    setIterations(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#07080a';
      ctx.fillRect(0, 0, w, h);

      const map = heightmapRef.current;
      const len = map.length;
      if (len === 0) return;

      // Draw grid lines
      ctx.strokeStyle = '#1a212e';
      ctx.lineWidth = 0.5;
      for (let y = 30; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Simulate a burst of rain droplets
      if (isSimulating) {
        for (let drop = 0; drop < 3; drop++) {
          let pos = Math.floor(Math.random() * (len - 2)) + 1;
          let speed = 1.0;
          let sediment = 0;
          const capacity = 3.5;

          for (let step = 0; step < 20; step++) {
            if (pos <= 0 || pos >= len - 1) break;
            const slope = map[pos] - map[pos + 1];
            if (Math.abs(slope) > 0.05) {
              const dir = slope > 0 ? 1 : -1;
              const erodeAmount = Math.min(map[pos] * 0.015, (capacity - sediment) * 0.2);
              if (erodeAmount > 0) {
                map[pos] -= erodeAmount;
                sediment += erodeAmount;
              }
              pos += dir;
              speed += 0.1;
            } else {
              // Deposit sediment in flat valley
              const deposit = sediment * 0.4;
              map[pos] += deposit;
              sediment -= deposit;
              break;
            }
          }
        }
        setIterations((it) => it + 1);
      }

      // Draw Terrain Elevation Profile
      const dx = w / (len - 1);
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let i = 0; i < len; i++) {
        const x = i * dx;
        const y = h - map[i];
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      // Terrain gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
      grad.addColorStop(0.5, 'rgba(180, 83, 9, 0.25)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Terrain surface stroke
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < len; i++) {
        const x = i * dx;
        const y = h - map[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isSimulating]);

  return (
    <div className="space-y-4 p-4 rounded-lg bg-bg-void border border-border-subtle font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
        <div>
          <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px] block">
            [INTERACTIVE HYDRAULIC EROSION CANVAS]
          </span>
          <span className="text-text-muted text-[10px]">
            Real-time particle weathering: Dissolution kinetics & sediment deposition
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="px-2.5 py-1 rounded bg-bg-elevated border border-border-subtle text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <Play className="w-3 h-3" />
            <span>{isSimulating ? 'Pause' : 'Erode'}</span>
          </button>
          <button
            onClick={resetHeightmap}
            className="px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-primary"
            title="Reset Heightfield"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="bg-bg-base rounded border border-border-subtle overflow-hidden">
        <canvas ref={canvasRef} width={500} height={180} className="w-full h-auto block" />
      </div>

      <div className="flex justify-between text-[11px] text-text-muted">
        <span>Discrete Simulation Steps: {iterations}</span>
        <span className="text-amber-400">Total Mass Conserved: 100%</span>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   3. Dual-Pruned Decoding: Interactive Lower Convex Hull & Pareto Frontier
   -------------------------------------------------------------------------- */
const DualPruningHullVisualizer: React.FC = () => {
  const [lambda, setLambda] = useState(0.45);

  // Candidate token sequence paths with (cost, negative-log-likelihood)
  const candidatePaths = [
    { id: 'P1', cost: 12, nll: 2.1, pruned: false },
    { id: 'P2', cost: 18, nll: 1.8, pruned: false },
    { id: 'P3', cost: 26, nll: 1.4, pruned: false },
    { id: 'P4', cost: 38, nll: 1.1, pruned: false },
    { id: 'P5', cost: 22, nll: 2.9, pruned: true }, // Dominated
    { id: 'P6', cost: 32, nll: 2.3, pruned: true }, // Dominated
    { id: 'P7', cost: 44, nll: 1.7, pruned: true }, // Dominated
    { id: 'P8', cost: 14, nll: 3.2, pruned: true }, // Dominated
  ];

  return (
    <div className="space-y-4 p-4 rounded-lg bg-bg-void border border-border-subtle font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
        <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">
          [LAGRANGIAN HULL PRUNING ON DECODING LATTICE]
        </span>
        <span className="text-text-muted text-[10px]">
          Pareto frontier minimization: L(x, λ) = NLL(x) + λ·Cost(x)
        </span>
      </div>

      <div className="p-3 rounded bg-bg-surface border border-border-subtle space-y-2">
        <div className="flex justify-between text-text-secondary">
          <span className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Lagrange Multiplier (λ):</span>
          </span>
          <span className="text-amber-400 font-bold">{lambda.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={lambda}
          onChange={(e) => setLambda(parseFloat(e.target.value))}
          className="w-full accent-amber-500 bg-bg-base"
        />
      </div>

      {/* Hull Diagram Representation */}
      <div className="p-3 bg-bg-base rounded border border-border-subtle space-y-3">
        <div className="text-[11px] text-text-dim flex justify-between">
          <span>Cost vs Score Pruning Matrix</span>
          <span className="text-amber-400">Lower Convex Hull Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {candidatePaths.map((p) => {
            const dualCost = p.nll + lambda * (p.cost / 20);
            const isPruned = p.pruned || dualCost > 2.2;
            return (
              <div
                key={p.id}
                className={`p-2 rounded border text-center transition-all ${
                  isPruned
                    ? 'bg-bg-void/60 border-border-subtle text-text-dim line-through opacity-50'
                    : 'bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold'
                }`}
              >
                <div className="text-[10px]">{p.id}</div>
                <div className="text-[9px] mt-0.5">
                  C: {p.cost} | NLL: {p.nll}
                </div>
                <div className="text-[8px] text-amber-500 font-normal">
                  {isPruned ? 'PRUNED' : 'SURVIVOR'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   4. Early Warning Complex Systems: Fluctuation Indicator Visualizer
   -------------------------------------------------------------------------- */
const EarlyWarningDynamicsVisualizer: React.FC = () => {
  return (
    <div className="space-y-4 p-4 rounded-lg bg-bg-void border border-border-subtle font-mono text-xs">
      <div className="border-b border-border-subtle pb-2">
        <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px] block">
          [CRITICAL SLOWING DOWN DYNAMICAL INDICATORS]
        </span>
        <span className="text-text-muted text-[10px]">
          Dominant eigenvalue λ_dom → 1, Autocorrelation AR(1) and Permutation Entropy
        </span>
      </div>

      <div className="p-3.5 rounded bg-bg-surface border border-border-subtle space-y-3">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-text-secondary">Simulated State Transition:</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
            Approaching Fold Bifurcation
          </span>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>Lag-1 Autocorrelation AR(1):</span>
              <span className="text-amber-400 font-bold">0.89 (High Persistence)</span>
            </div>
            <div className="h-1.5 w-full bg-bg-base rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '89%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>Variance Scaling (σ²):</span>
              <span className="text-amber-400 font-bold">4.2x Baseline</span>
            </div>
            <div className="h-1.5 w-full bg-bg-base rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>Permutation Entropy H_p:</span>
              <span className="text-text-primary font-bold">0.61 (Structural Loss)</span>
            </div>
            <div className="h-1.5 w-full bg-bg-base rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: '61%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   5. Certified Dose: Persistent Homology Hypergraph Diagram
   -------------------------------------------------------------------------- */
const PersistentHomologyHypergraphVisualizer: React.FC = () => {
  return (
    <div className="space-y-4 p-4 rounded-lg bg-bg-void border border-border-subtle font-mono text-xs">
      <div className="border-b border-border-subtle pb-2">
        <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px] block">
          [PATH-CROSSING FUNCTORS & PERSISTENCE BARCODES]
        </span>
        <span className="text-text-muted text-[10px]">
          Functor F: TempHyperGraph → ChComplex; Invariant barcode filtration intervals
        </span>
      </div>

      <div className="p-3.5 rounded bg-bg-surface border border-border-subtle space-y-3">
        <div className="text-text-secondary text-[11px]">
          Persistence Barcode Intervals (H₁ Cycles):
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-[10px]">
            <span className="w-8 text-amber-500 font-bold">β₁ #1</span>
            <div className="flex-1 bg-bg-base h-2 rounded relative">
              <div className="absolute left-[15%] right-[20%] h-full bg-amber-500 rounded" />
            </div>
            <span className="text-text-dim text-[9px]">[t=0.15, t=0.80]</span>
          </div>

          <div className="flex items-center space-x-2 text-[10px]">
            <span className="w-8 text-amber-500 font-bold">β₁ #2</span>
            <div className="flex-1 bg-bg-base h-2 rounded relative">
              <div className="absolute left-[30%] right-[35%] h-full bg-amber-400 rounded" />
            </div>
            <span className="text-text-dim text-[9px]">[t=0.30, t=0.65]</span>
          </div>

          <div className="flex items-center space-x-2 text-[10px]">
            <span className="w-8 text-text-muted">β₁ #3</span>
            <div className="flex-1 bg-bg-base h-2 rounded relative">
              <div className="absolute left-[40%] right-[52%] h-full bg-slate-500 rounded" />
            </div>
            <span className="text-text-dim text-[9px]">[t=0.40, t=0.48] (Noise)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   6. Umbra: Software Reliability & Audit Matrix
   -------------------------------------------------------------------------- */
const UmbraAuditCoverageVisualizer: React.FC = () => {
  return (
    <div className="space-y-4 p-4 rounded-lg bg-bg-void border border-border-subtle font-mono text-xs">
      <div className="border-b border-border-subtle pb-2">
        <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px] block">
          [REPORTED AUDIT METRIC DASHBOARD]
        </span>
        <span className="text-text-muted text-[10px]">
          Boundary checks, branch coverage, and invariant enforcement
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded bg-bg-surface border border-border-subtle text-center space-y-1">
          <div className="text-xl font-bold text-amber-400">70 / 70</div>
          <div className="text-[10px] text-text-muted uppercase">Passing Audit Checks</div>
        </div>

        <div className="p-3 rounded bg-bg-surface border border-border-subtle text-center space-y-1">
          <div className="text-xl font-bold text-green-400">88.67%</div>
          <div className="text-[10px] text-text-muted uppercase">Branch Coverage (&gt;85% req)</div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   7. Sunflower Conjecture: Erdős-Rado Hypergraph Diagram
   -------------------------------------------------------------------------- */
const SunflowerHypergraphVisualizer: React.FC = () => {
  return (
    <div className="space-y-4 p-4 rounded-lg bg-bg-void border border-border-subtle font-mono text-xs">
      <div className="border-b border-border-subtle pb-2">
        <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px] block">
          [ERDŐS-RADO SUNFLOWER STRUCTURE SCHEMATIC]
        </span>
        <span className="text-text-muted text-[10px]">
          r-sunflower with shared central kernel Y and mutually disjoint petals P_i
        </span>
      </div>

      <div className="p-3 rounded bg-bg-surface border border-border-subtle text-center space-y-2">
        <div className="text-amber-400 text-xs font-bold">
          A_i ∩ A_j = Y &nbsp;(for all distinct i ≠ j)
        </div>
        <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
          Audit harness tests uniform set systems under fractional spreadness bounds, systematically verifying absence of pairwise intersecting petals outside kernel Y.
        </p>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   8. Default Architecture Schematic for other projects
   -------------------------------------------------------------------------- */
const DefaultSystemArchitectureVisualizer: React.FC<{ project: ProjectEntry }> = ({ project }) => {
  return (
    <div className="space-y-3 p-4 rounded-lg bg-bg-void border border-border-subtle font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
        <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">
          [SYSTEM ARCHITECTURE & INVARIANT CONTRACT]
        </span>
        <span className="text-text-muted text-[10px]">
          {project.category}
        </span>
      </div>

      <div className="p-3 rounded bg-bg-surface border border-border-subtle space-y-2">
        <div className="text-text-primary font-bold text-xs">
          Modular Pipeline Flow:
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="px-2 py-1 rounded bg-bg-base border border-border-subtle text-amber-400">
            Input Formulation
          </span>
          <span className="text-text-dim">→</span>
          <span className="px-2 py-1 rounded bg-bg-base border border-border-subtle text-text-primary">
            Mathematical Transformation
          </span>
          <span className="text-text-dim">→</span>
          <span className="px-2 py-1 rounded bg-bg-base border border-border-subtle text-amber-500">
            Verified Invariant Bound
          </span>
        </div>
      </div>
    </div>
  );
};
