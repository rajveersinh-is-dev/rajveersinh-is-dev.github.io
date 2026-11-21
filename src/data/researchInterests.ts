import type { ResearchInterestNode } from '../types/content';

export const researchInterestsData: ResearchInterestNode[] = [
  {
    id: "pure-math",
    title: "Pure & Theoretical Mathematics",
    summary: "Investigating fundamental structures across algebra, topology, and discrete mathematics with an emphasis on rigorous proof systems.",
    connections: ["combinatorics", "graph-theory", "formal-verification"]
  },
  {
    id: "computational-math",
    title: "Computational Mathematics",
    summary: "Developing discrete approximations and numerical algorithms to explore mathematical conjectures and complex topologies.",
    connections: ["scientific-computing", "pure-math", "algorithm-design"]
  },
  {
    id: "combinatorics",
    title: "Combinatorics & Extremal Set Systems",
    summary: "Analyzing structural properties of finite configurations, partition theory, and sunflower-type lemmas in extremal combinatorics.",
    connections: ["pure-math", "graph-theory", "optimization"]
  },
  {
    id: "graph-theory",
    title: "Graph Theory & Hypergraphs",
    summary: "Studying topological invariants, shortest path formulations, and persistent homology over dynamic and weighted hypergraphs.",
    connections: ["pure-math", "combinatorics", "optimization", "algorithm-design"]
  },
  {
    id: "dynamical-systems",
    title: "Dynamical Systems & Critical Transitions",
    summary: "Investigating stability bifurcations, spectral properties, and early-warning signals in deterministic and stochastic dynamics.",
    connections: ["computational-math", "scientific-computing"]
  },
  {
    id: "algorithm-design",
    title: "Algorithm Design & Discrete Optimization",
    summary: "Formulating polynomial-time heuristics, Lagrangian relaxations, and exact algorithms for NP-hard combinatorial challenges.",
    connections: ["optimization", "graph-theory", "compiler-theory"]
  },
  {
    id: "optimization",
    title: "Mathematical Optimization",
    summary: "Exploring convex relaxation, duality theory, and resource-constrained shortest path mechanics.",
    connections: ["algorithm-design", "graph-theory", "combinatorics"]
  },
  {
    id: "scientific-computing",
    title: "Scientific Computing & Physical Simulation",
    summary: "Numerical simulation of continuous systems, heightfields, and fluid/erosion physics with explicit conservation bounds.",
    connections: ["computational-math", "dynamical-systems"]
  },
  {
    id: "compiler-theory",
    title: "Compiler Theory & Program Semantics",
    summary: "Designing intermediate representations, supercompilation algorithms, and polyhedral analysis for recurrence optimization.",
    connections: ["formal-verification", "algorithm-design"]
  },
  {
    id: "formal-verification",
    title: "Formal Verification & Mechanized Proofs",
    summary: "Encoding algebraic and topological theorems in interactive proof assistants like Lean 4 to guarantee mathematical correctness.",
    connections: ["pure-math", "compiler-theory"]
  }
];
