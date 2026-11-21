import React, { useState } from 'react';
import { skillsData } from '../../data';
import { Layers } from 'lucide-react';

export const SkillsLandscapeSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [activeSkillName, setActiveSkillName] = useState<string | null>(null);

  const currentCategory = skillsData[selectedCategory] || skillsData[0];

  return (
    <section id="skills" className="py-20 border-t border-border-subtle relative bg-bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
              <span>06 // Technical Landscape</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
              Interactive Competency Clusters
            </h2>
          </div>

          {/* Proficiency Honesty Badge */}
          <div className="px-3.5 py-1.5 rounded-lg bg-bg-surface border border-amber-500/30 text-amber-400 font-mono text-xs flex items-center space-x-2 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Reported Proficiency: Intermediate Across All Domains</span>
          </div>
        </div>

        {/* Introduction note */}
        <p className="text-xs text-text-secondary font-mono max-w-3xl leading-relaxed">
          In contrast to arbitrary numerical percentage meters, this landscape maps computational capabilities as structured clusters and connected toolchains. (Note: No cloud infrastructure experience reported or claimed).
        </p>

        {/* Cluster Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border-subtle pb-3">
          {skillsData.map((cat, idx) => (
            <button
              key={cat.categoryName}
              onClick={() => {
                setSelectedCategory(idx);
                setActiveSkillName(null);
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs transition-colors ${
                selectedCategory === idx
                  ? 'bg-amber-500 text-bg-void font-bold shadow-sm'
                  : 'bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Interactive Capability Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Skills Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentCategory.skills.map((skill) => {
              const isActive = activeSkillName === skill.name;
              return (
                <div
                  key={skill.name}
                  onClick={() => setActiveSkillName(isActive ? null : skill.name)}
                  className={`p-5 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-bg-card border-amber-500 ring-1 ring-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-bg-surface border-border-subtle hover:border-border-medium hover:bg-bg-elevated'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-mono text-sm font-bold text-text-primary group-hover:text-amber-400">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-elevated text-amber-500 border border-border-subtle">
                      Intermediate
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary font-sans leading-relaxed pt-2">
                    {skill.description}
                  </p>

                  <div className="pt-3 flex flex-wrap gap-1">
                    {skill.associatedTopics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-base border border-border-subtle text-text-muted"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Architectural Context & Invariants */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-lg bg-bg-surface border border-border-medium space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Cluster Details</span>
              </div>

              <div className="text-sm font-mono font-bold text-text-primary">
                {currentCategory.categoryName}
              </div>

              <p className="text-xs text-text-secondary leading-relaxed font-mono">
                {selectedCategory === 0 &&
                  'Core programming languages utilized for verified compiler frontends, high-performance optimization, and interactive scientific engines.'}
                {selectedCategory === 1 &&
                  'Interactive theorem proving with Lean 4 dependent types, intermediate representation lowering via LLVM/Cranelift, and formal mathematical contracts.'}
                {selectedCategory === 2 &&
                  'Cross-discipline computational competencies across parallel architectures, neural decoding lattices, and defensive application security testing.'}
              </p>

              <div className="pt-3 border-t border-border-subtle text-[11px] font-mono text-text-dim space-y-1">
                <div>• Zero artificial numerical percentages</div>
                <div>• Strictly intermediate self-reported depth</div>
                <div>• General mathematical & algorithmic focus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
