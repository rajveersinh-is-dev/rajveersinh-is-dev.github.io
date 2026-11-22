import React, { useState } from 'react';
import { skillsData } from '../../data';
import { Layers, ShieldCheck } from 'lucide-react';

export const SkillsLandscapeSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [activeSkillName, setActiveSkillName] = useState<string | null>(null);

  const currentCategory = skillsData[selectedCategory] || skillsData[0];

  return (
    <section id="skills" className="py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-academic-seal font-semibold">
              Organon Mathematicum • Section VI
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
              § 6. Methodological Repertoire &amp; Mathematical Tools
            </h2>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Interactive Competency Clusters — Rigorous Toolchains for Formal Proofs &amp; Computational Synthesis
            </p>
          </div>

          {/* Proficiency Honesty Badge */}
          <div className="px-3.5 py-1.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-ink-secondary font-mono text-xs flex items-center space-x-2 self-start md:self-auto font-semibold">
            <ShieldCheck className="w-4 h-4 text-academic-seal" />
            <span>Reported Proficiency: Intermediate Across All Domains</span>
          </div>
        </div>

        {/* Introduction note */}
        <p className="font-serif text-sm text-ink-secondary leading-relaxed max-w-3xl">
          In contrast to arbitrary numerical percentage meters, this landscape maps computational capabilities as structured clusters and connected toolchains. (Note: No cloud infrastructure experience reported or claimed).
        </p>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Cluster Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-paper-border-subtle pb-3">
          {skillsData.map((cat, idx) => (
            <button
              key={cat.categoryName}
              onClick={() => {
                setSelectedCategory(idx);
                setActiveSkillName(null);
              }}
              className={`px-4 py-2 rounded font-mono text-xs transition-colors ${
                selectedCategory === idx
                  ? 'border-2 border-academic-seal bg-paper-bg-base text-academic-seal font-bold shadow-xs'
                  : 'border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted hover:text-ink-primary hover:bg-paper-bg-elevated'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Interactive Capability Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Skills Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentCategory.skills.map((skill) => {
              const isActive = activeSkillName === skill.name;
              return (
                <div
                  key={skill.name}
                  onClick={() => setActiveSkillName(isActive ? null : skill.name)}
                  className={`p-5 rounded border transition-all cursor-pointer ${
                    isActive
                      ? 'border-2 border-academic-seal bg-paper-bg-base shadow-sm'
                      : 'border border-paper-border-subtle bg-paper-bg-base hover:border-paper-border-strong hover:bg-paper-bg-subtle/50'
                  }`}
                >
                  <div className="flex items-start justify-between border-b border-paper-border-subtle pb-2">
                    <h3 className="font-serif text-base font-bold text-ink-primary">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-elevated text-ink-muted">
                      Intermediate
                    </span>
                  </div>

                  <p className="font-serif text-xs text-ink-secondary leading-relaxed pt-2">
                    {skill.description}
                  </p>

                  <div className="pt-3 flex flex-wrap gap-1">
                    {skill.associatedTopics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Architectural Invariants */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-3 shadow-sm">
              <div className="text-xs font-mono uppercase tracking-wider text-academic-seal font-bold flex items-center space-x-1.5 border-b border-paper-border-subtle pb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Cluster Invariants</span>
              </div>

              <div className="text-base font-serif font-bold text-ink-primary">
                {currentCategory.categoryName}
              </div>

              <p className="text-xs font-serif text-ink-secondary leading-relaxed">
                {selectedCategory === 0 &&
                  'Core programming languages utilized for verified compiler frontends, high-performance optimization, and interactive scientific engines.'}
                {selectedCategory === 1 &&
                  'Interactive theorem proving with Lean 4 dependent types, intermediate representation lowering via LLVM/Cranelift, and formal mathematical contracts.'}
                {selectedCategory === 2 &&
                  'Cross-discipline computational competencies across parallel architectures, neural decoding lattices, and defensive application security testing.'}
              </p>

              <div className="pt-3 border-t border-paper-border-subtle text-xs font-mono text-ink-muted space-y-1">
                <div>• Zero artificial percentage meters</div>
                <div>• Strictly intermediate self-reported depth</div>
                <div>• Algorithmic and structural focus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
