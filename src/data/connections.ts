import type { GraphConnectionNode } from '../types/content';

export const connectionsGraphData: GraphConnectionNode[] = [
  // Research Areas
  {
    id: "r-pure-math",
    name: "Pure Mathematics",
    type: "research",
    description: "Rigorous axiomatic inquiry into topological spaces and discrete algebra.",
    connections: ["c-persistent-homology", "c-hypergraphs", "t-lean4"]
  },
  {
    id: "r-optimization",
    name: "Optimization",
    type: "research",
    description: "Convex duality, combinatorial lattices, and resource-bounded shortest paths.",
    connections: ["c-lagrangian-relaxation", "p-adhp-cspp", "p-dual-pruning"]
  },
  {
    id: "r-compilers",
    name: "Compiler Theory",
    type: "research",
    description: "SSA intermediate representations, loop recurrence restructuring, and formal lowering.",
    connections: ["p-numlang", "t-llvm", "t-cranelift", "t-lean4"]
  },
  {
    id: "r-dynamical-systems",
    name: "Dynamical Systems",
    type: "research",
    description: "Bifurcations, phase space trajectories, and spectral critical slowing down.",
    connections: ["p-early-warning", "c-critical-transitions", "t-python"]
  },

  // Projects
  {
    id: "p-numlang",
    name: "NumLang",
    type: "project",
    description: "Rust compiler featuring SSA IR, polyhedral recurrence detection, and Lean 4 semantics.",
    connections: ["r-compilers", "t-rust", "t-llvm", "t-cranelift", "t-lean4"]
  },
  {
    id: "p-adhp-cspp",
    name: "ADHP-CSPP",
    type: "project",
    description: "Adaptive dual-heuristic pruning for constrained shortest path problems.",
    connections: ["r-optimization", "c-lagrangian-relaxation", "t-rust"]
  },
  {
    id: "p-dual-pruning",
    name: "Dual-Pruned Decoding",
    type: "project",
    description: "Lagrangian hull pruning for budget-constrained language model generation.",
    connections: ["r-optimization", "c-lagrangian-relaxation", "t-python"]
  },
  {
    id: "p-certified-dose",
    name: "Certified Dose",
    type: "project",
    description: "Persistent homology of weighted temporal hypergraphs via path-crossing functors.",
    connections: ["r-pure-math", "c-persistent-homology", "c-hypergraphs", "t-lean4"]
  },
  {
    id: "p-early-warning",
    name: "Early Warning Systems",
    type: "project",
    description: "Detecting critical transitions in stochastic dynamical systems.",
    connections: ["r-dynamical-systems", "c-critical-transitions", "t-python"]
  },
  {
    id: "p-terrain-erosion",
    name: "Terrain Erosion Engine",
    type: "project",
    description: "Procedural hydraulic erosion and discrete physical simulation.",
    connections: ["t-typescript", "c-pde-discretization"]
  },

  // Concepts
  {
    id: "c-persistent-homology",
    name: "Persistent Homology",
    type: "concept",
    description: "Topological invariant tracking connected components and higher-order cavities across filtration scales.",
    connections: ["r-pure-math", "p-certified-dose"]
  },
  {
    id: "c-lagrangian-relaxation",
    name: "Lagrangian Relaxation",
    type: "concept",
    description: "Dualizing hard coupling constraints into objective penalties via Lagrange multipliers.",
    connections: ["r-optimization", "p-adhp-cspp", "p-dual-pruning"]
  },
  {
    id: "c-hypergraphs",
    name: "Temporal Hypergraphs",
    type: "concept",
    description: "Generalization of graphs where hyperedges contain arbitrary sets of vertices parameterized over time.",
    connections: ["r-pure-math", "p-certified-dose"]
  },
  {
    id: "c-critical-transitions",
    name: "Critical Transitions",
    type: "concept",
    description: "Catastrophic regime shifts characterized by critical slowing down and variance divergence.",
    connections: ["r-dynamical-systems", "p-early-warning"]
  },
  {
    id: "c-pde-discretization",
    name: "PDE Discretization",
    type: "concept",
    description: "Finite-difference approximations of fluid transport and sediment conservation laws.",
    connections: ["p-terrain-erosion"]
  },

  // Technologies
  {
    id: "t-lean4",
    name: "Lean 4",
    type: "technology",
    description: "Interactive theorem prover and dependently typed programming language.",
    connections: ["p-numlang", "p-certified-dose", "r-compilers", "r-pure-math"]
  },
  {
    id: "t-rust",
    name: "Rust",
    type: "technology",
    description: "Systems programming language with zero-cost abstractions and formal memory safety guarantees.",
    connections: ["p-numlang", "p-adhp-cspp"]
  },
  {
    id: "t-llvm",
    name: "LLVM",
    type: "technology",
    description: "Industrial compiler infrastructure for target optimization and machine code generation.",
    connections: ["p-numlang", "r-compilers"]
  },
  {
    id: "t-cranelift",
    name: "Cranelift",
    type: "technology",
    description: "Low-latency code generator producing optimized native machine code.",
    connections: ["p-numlang", "r-compilers"]
  },
  {
    id: "t-python",
    name: "Python",
    type: "technology",
    description: "Scientific stack (NumPy, SciPy) for exploratory mathematical algorithms.",
    connections: ["p-dual-pruning", "p-early-warning"]
  },
  {
    id: "t-typescript",
    name: "TypeScript",
    type: "technology",
    description: "Type-safe language for procedural simulation engines and interactive canvases.",
    connections: ["p-terrain-erosion"]
  }
];
