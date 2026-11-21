import type { SkillCategory } from '../types/content';

export const skillsData: SkillCategory[] = [
  {
    categoryName: "Core Languages",
    proficiencyLevel: "Intermediate",
    skills: [
      {
        name: "Rust",
        description: "Memory-safe systems programming, compiler engineering, algebraic data types, and high-performance graph processing.",
        associatedTopics: ["Memory Safety", "Zero-Cost Abstractions", "Iterators", "Pattern Matching"]
      },
      {
        name: "Python",
        description: "Scientific computing, numerical algorithms, dynamical system simulation, and algebraic topology workflows.",
        associatedTopics: ["NumPy", "SciPy", "Mathematical Modeling", "Scripting"]
      },
      {
        name: "TypeScript",
        description: "Strictly typed computational engines, procedural simulations, interactive WebGL/Canvas graphics, and modern frontend architecture.",
        associatedTopics: ["Type Safety", "Numerical Canvas", "Modular Systems", "Async Pipelines"]
      }
    ]
  },
  {
    categoryName: "Specialized Mathematical & Compiler Tooling",
    proficiencyLevel: "Intermediate",
    skills: [
      {
        name: "Lean 4",
        description: "Theorem proving, interactive formal verification, dependent type theory, and mechanized operational semantics.",
        associatedTopics: ["Formal Verification", "Dependent Types", "Equational Reasoning", "Proof Tactics"]
      },
      {
        name: "LLVM",
        description: "Compiler backend optimization, intermediate representations, target emission, and machine code transformation.",
        associatedTopics: ["SSA Form", "Optimization Passes", "Target Machine Lowering"]
      },
      {
        name: "Cranelift",
        description: "Fast code generator for JIT compilation, WebAssembly execution, and low-latency instruction selection.",
        associatedTopics: ["Fast JIT", "Instruction Selection", "Register Allocation"]
      },
      {
        name: "Git & GitHub",
        description: "Distributed version control, branch management, collaborative code review, and CI automation.",
        associatedTopics: ["Version Control", "Rebasing", "Repository Architecture"]
      }
    ]
  },
  {
    categoryName: "Computational & Systems Competencies",
    proficiencyLevel: "Intermediate",
    skills: [
      {
        name: "GPU & Parallel Computing",
        description: "Data-parallel execution models, thread hierarchy scheduling, and parallel matrix operations.",
        associatedTopics: ["SIMD", "Thread Scheduling", "Memory Coalescing"]
      },
      {
        name: "Distributed Systems",
        description: "Consensus primitives, asynchronous message-passing, state machine replication, and partitioning.",
        associatedTopics: ["Message Passing", "State Machines", "Network Invariants"]
      },
      {
        name: "Neural Networks & Deep Learning",
        description: "Mathematical foundations of deep neural architectures, backpropagation, and constrained decoding algorithms.",
        associatedTopics: ["Gradient Descent", "Lattice Pruning", "Tensor Operations"]
      },
      {
        name: "Cybersecurity & Penetration Testing",
        description: "Vulnerability analysis, web application security auditing, input sanitization, and defensive architecture.",
        associatedTopics: ["Threat Modeling", "Input Validation", "Defensive Systems"]
      },
      {
        name: "Databases & Storage Engines",
        description: "Relational query execution, B-tree and LSM storage structures, ACID invariants, and indexing strategies.",
        associatedTopics: ["Relational Models", "Index Structures", "Query Semantics"]
      }
    ]
  }
];
