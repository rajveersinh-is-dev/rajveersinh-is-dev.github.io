import type { SkillCategory } from '../types/content';

export const skillsData: SkillCategory[] = [
  {
    categoryName: "Core & Systems Languages",
    proficiencyLevel: "Intermediate",
    skills: [
      {
        name: "Rust",
        description: "Memory-safe systems programming, zero-cost abstractions, compiler engineering, algebraic types, and data-parallel concurrency with Rayon.",
        associatedTopics: ["Systems Programming", "Zero-Cost Abstractions", "Memory Safety", "Data-Parallel Concurrency", "Type Invariants"]
      },
      {
        name: "Python",
        description: "Scientific computing, numerical algorithms, dynamical systems modeling, symbolic algebra, and accelerated JIT kernels via Numba.",
        associatedTopics: ["Scientific Computing", "Numerical Algorithms", "Data-Parallel Concurrency", "Symbolic Algebra", "Native Bindings"]
      },
      {
        name: "TypeScript",
        description: "Strict type-level programming, numerical simulations, interactive WebGL/Canvas graphics engines, and modular asynchronous architecture.",
        associatedTopics: ["Web Runtimes", "Type Invariants", "Interactive Graphics", "Async Pipelines", "Modular Systems"]
      },
      {
        name: "C / C++",
        description: "Low-level systems programming, cache-conscious data layouts, manual pointer semantics, and OpenMP shared-memory parallelism.",
        associatedTopics: ["Systems Programming", "Memory Safety", "Native Bindings", "Cache Efficiency", "Pointer Semantics"]
      },
      {
        name: "WebAssembly (Wasm)",
        description: "Near-native client-side binary execution, linear memory architectures, bytecode generation, and host-guest ABI bridging.",
        associatedTopics: ["Web Runtimes", "Systems Programming", "Zero-Cost Abstractions", "Bytecode Generation", "Linear Memory"]
      },
      {
        name: "Shell & POSIX Scripting",
        description: "Reproducible automated build pipelines, toolchain automation, process orchestration, and POSIX text-stream filtering.",
        associatedTopics: ["Toolchain Automation", "Reproducibility", "Pipeline Scripting", "Process Management", "POSIX Streams"]
      },
      {
        name: "SQL & Relational Engines",
        description: "Relational algebra, structured query optimization, B-Tree and LSM indexing, transactional ACID invariants, and local database engines.",
        associatedTopics: ["Relational Algebra", "ACID Invariants", "B-Tree Indexing", "Query Planning", "Storage Engines"]
      }
    ]
  },
  {
    categoryName: "Formal Verification & Compiler Architecture",
    proficiencyLevel: "Intermediate",
    skills: [
      {
        name: "Lean 4",
        description: "Interactive theorem proving, dependent type theory, mechanized operational semantics, and formal verification of mathematical invariants.",
        associatedTopics: ["Dependent Types", "Formal Verification", "Equational Reasoning", "Tactics & Metaprogramming", "Operational Semantics"]
      },
      {
        name: "SSA IR Construction",
        description: "Static single assignment intermediate representation, dominator tree computation, iterated dominance frontiers, and phi-node placement.",
        associatedTopics: ["SSA Form", "Control Flow Graphs", "Dominance Frontiers", "IR Optimization", "Phi Placement"]
      },
      {
        name: "LLVM",
        description: "Compiler optimization pipelines, target-independent intermediate code, dead code elimination, and machine code emission.",
        associatedTopics: ["Compiler Backends", "Control Flow Graphs", "Machine Codegen", "IR Optimization", "Instruction Selection"]
      },
      {
        name: "Cranelift",
        description: "Low-latency code generator for JIT compilation, WebAssembly execution backends, and fast instruction selection.",
        associatedTopics: ["JIT Compilation", "SSA Form", "Machine Codegen", "Instruction Selection", "Register Allocation"]
      },
      {
        name: "Algorithmic Supercompilation",
        description: "Whole-program specialization via homeomorphic embedding, term folding, driving transitions, and inductive generalization.",
        associatedTopics: ["Supercompilation", "Operational Semantics", "Homeomorphic Embedding", "Term Rewriting", "Equational Reasoning"]
      },
      {
        name: "Polyhedral Analysis",
        description: "Exact loop nest restructuring, affine iteration spaces, Farkas lemma constraint solving, and polyhedral recurrence optimization.",
        associatedTopics: ["Polyhedral Model", "Loop Restructuring", "IR Optimization", "Affine Spaces", "Recurrence Extraction"]
      },
      {
        name: "Term Rewriting & Invariants",
        description: "Equational term rewriting systems, Knuth-Bendix completion, confluence verification, and inductive invariant extraction.",
        associatedTopics: ["Term Rewriting", "Equational Reasoning", "Formal Verification", "Confluence & Termination", "Pattern Matching"]
      },
      {
        name: "Abstract Syntax Trees",
        description: "Lexical analysis, parser combinators, recursive descent parsing, AST transformation passes, and semantic symbol table resolution.",
        associatedTopics: ["AST Lowering", "Static Analysis", "Pattern Matching", "Syntax Traversal", "Visitor Patterns"]
      }
    ]
  },
  {
    categoryName: "Topological & Mathematical Formalisms",
    proficiencyLevel: "Intermediate",
    skills: [
      {
        name: "Persistent Homology",
        description: "Computation of topological invariants across filtered spaces, persistence diagrams, persistence barcodes, and bottleneck stability.",
        associatedTopics: ["Persistent Homology", "Chain Complexes", "Topological Invariants", "Filtration Metrics", "Stability Bounds"]
      },
      {
        name: "Simplicial Complexes",
        description: "Abstract simplicial complexes, Vietoris-Rips and Čech filtrations, chain complexes, boundary operators, and homology groups.",
        associatedTopics: ["Simplicial Complexes", "Chain Complexes", "Triangulations", "Topological Invariants", "Boundary Operators"]
      },
      {
        name: "Path-Crossing Functors",
        description: "Functorial constructions on time-varying hypergraphs, path-crossing invariants, and categorical stability over dynamic networks.",
        associatedTopics: ["Category Theory", "Functorial Invariants", "Persistent Homology", "Hypergraph Filtrations", "Topological Invariants"]
      },
      {
        name: "Extremal Combinatorics",
        description: "Investigating sunflower-free set systems, Erdős-Rado bounds, fractional spreadness lemmas, and uniform hypergraph partitions.",
        associatedTopics: ["Sunflower Conjecture", "Combinatorial Bounds", "Hypergraph Filtrations", "Spreadness Lemmas", "Set Systems"]
      },
      {
        name: "Dynamical Systems & ODEs",
        description: "Nonlinear dynamical systems, numerical Runge-Kutta integration, phase space attractor analysis, and stability bifurcation detection.",
        associatedTopics: ["Runge-Kutta ODEs", "Phase Space", "Bifurcation Analysis", "Critical Slowing Down", "Attractor Dynamics"]
      },
      {
        name: "Lagrangian Dual Relaxation",
        description: "Dual decomposition, adaptive Lagrange multipliers, subgradient optimization, and lower convex hull pruning for constrained NP-hard problems.",
        associatedTopics: ["Lagrangian Relaxation", "Subgradient Methods", "Dual Decomposition", "Combinatorial Bounds", "Convex Hull Pruning"]
      },
      {
        name: "Stochastic Dynamics & Entropy",
        description: "Stochastic differential equations, permutation entropy, spectral covariance drift, and early-warning signals in complex systems.",
        associatedTopics: ["Permutation Entropy", "Stochastic SDEs", "Spectral Drift", "Early-Warning Signals", "Critical Slowing Down"]
      },
      {
        name: "Recurrence Sequences & OEIS",
        description: "Exact mathematical sequence discovery, Berlekamp-Massey algorithm over ℚ, holonomic P-finite sequences, and quasipolynomial multisections.",
        associatedTopics: ["Berlekamp-Massey", "Holonomic Sequences", "Generating Functions", "Combinatorial Bounds", "Exact Rational Arithmetic"]
      }
    ]
  },
  {
    categoryName: "Scientific Computing & Systems Engineering",
    proficiencyLevel: "Intermediate",
    skills: [
      {
        name: "Numerical Fluid & Hydraulics",
        description: "Particle-based hydraulic erosion, discrete fluid integration, sediment transport kinetics, and strict conservation laws.",
        associatedTopics: ["Hydraulic Modeling", "Sediment Kinetics", "Numerical Integration", "Conservation Laws", "Discretized Grids"]
      },
      {
        name: "Procedural Heightfields",
        description: "Discrete surface heightfields, thermal talus weathering, slope stabilization mechanics, and terrain morphological dynamics.",
        associatedTopics: ["Heightfield Dynamics", "Thermal Talus", "Discretized Grids", "Terrain Modeling", "Discrete Differential Geometry"]
      },
      {
        name: "WebGL & Canvas Graphics",
        description: "Procedural shader programming, discrete differential geometry curvature coloring, Bayer matrix dithering, and real-time visualization.",
        associatedTopics: ["Shader Programming", "Discrete Differential Geometry", "Bayer Dithering", "Real-Time Rendering", "Interactive Canvas"]
      },
      {
        name: "Property-Based Verification",
        description: "Deterministic testing harnesses, property-based invariant fuzzing, boundary state stress audits, and branch coverage instrumentation.",
        associatedTopics: ["Invariant Fuzzing", "Branch Coverage", "Boundary Stress", "Deterministic Harness", "Security Auditing"]
      },
      {
        name: "Hypergraph Algorithms",
        description: "Weighted temporal hypergraph representations, non-pairwise incidence matrices, dual hypergraphs, and combinatorial clique covers.",
        associatedTopics: ["Temporal Hypergraphs", "Incidence Matrices", "Combinatorial Lattices", "Graph Traversal", "Boundary Stress"]
      },
      {
        name: "Computational Geometry & Packing",
        description: "Separating Axis Theorem (SAT), exact rational coordinate verification, FIRE augmented-Lagrangian optimization, and spatial hashing.",
        associatedTopics: ["Separating Axis Theorem", "Spatial Partitioning", "Augmented Lagrangian", "Discrete Differential Geometry", "Combinatorial Lattices"]
      },
      {
        name: "Cybersecurity & Security Auditing",
        description: "Web application security audits, input sanitization inspection, penetration testing methodologies, and defensive threat modeling.",
        associatedTopics: ["Threat Modeling", "Input Sanitization", "Vulnerability Analysis", "Security Auditing", "Invariant Fuzzing"]
      }
    ]
  }
];
