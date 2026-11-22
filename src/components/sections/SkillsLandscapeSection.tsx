import React, { useState, useMemo, useEffect } from 'react';
import { skillsData } from '../../data';
import type { SkillEntry } from '../../types/content';
import { useIntersectionObserver } from '../../utils/intersectionObserver';

export const SkillsLandscapeSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);
  const [activeSkillName, setActiveSkillName] = useState<string | null>(null);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const currentCategory = skillsData[selectedCategory] || skillsData[0];
  const skills = currentCategory.skills;

  // Polar coordinate layout for constellation nodes with ample margin for wide labels
  const nodes = useMemo(() => {
    const width = 720;
    const height = 340;
    const cx = width / 2;
    const cy = height / 2;
    const total = skills.length;
    const rx = width * 0.32;
    const ry = height * 0.30;

    return skills.map((skill, idx) => {
      // Angular spacing with alternating radius offset for natural constellation pacing
      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2 + (idx % 2 === 1 ? 0.15 : -0.1);
      const rMult = total <= 3 ? 0.85 : idx % 2 === 0 ? 0.95 : 0.78;
      const x = Math.round(cx + rx * rMult * Math.cos(angle));
      const y = Math.round(cy + ry * rMult * Math.sin(angle));
      return {
        ...skill,
        x,
        y,
        idx,
      };
    });
  }, [skills]);

  // Determine connections between related skills using associatedTopics and structural neighbors
  const edges = useMemo(() => {
    const edgeList: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[] = [];
    const total = nodes.length;

    for (let i = 0; i < total; i++) {
      for (let j = i + 1; j < total; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const sharedTopic = a.associatedTopics.some((t) => b.associatedTopics.includes(t));
        // Connect if shared topic, or form a ring/spanning structure in the constellation
        const isNeighbor = Math.abs(i - j) === 1 || (i === 0 && j === total - 1) || total <= 3;

        if (sharedTopic || isNeighbor) {
          edgeList.push({
            from: a.name,
            to: b.name,
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
          });
        }
      }
    }
    return edgeList;
  }, [nodes]);

  // Selected or hovered skill takes precedence for highlighting
  const highlightedSkillName = hoveredSkillName || activeSkillName;

  // Find which skills are connected to the highlighted skill
  const connectedSkillNames = useMemo(() => {
    if (!highlightedSkillName) return new Set<string>();
    const set = new Set<string>([highlightedSkillName]);
    edges.forEach((edge) => {
      if (edge.from === highlightedSkillName) set.add(edge.to);
      if (edge.to === highlightedSkillName) set.add(edge.from);
    });
    return set;
  }, [highlightedSkillName, edges]);

  // The active skill to display in the detailed panel
  const inspectionSkill: SkillEntry =
    skills.find((s) => s.name === activeSkillName) ||
    skills.find((s) => s.name === hoveredSkillName) ||
    skills[0];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/30 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            § 6
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            § 6. Methodological Repertoire &amp; Mathematical Tools
          </h2>
          <p className="font-serif italic text-ink-muted text-sm sm:text-base">
            Interactive Competency Clusters — Rigorous Toolchains for Formal Proofs &amp; Computational Synthesis
          </p>
        </div>

        {/* Introduction note */}
        <p className="font-serif text-sm text-ink-secondary leading-relaxed max-w-3xl">
          Rather than arbitrary numerical progress percentages, this constellation maps mathematical and engineering capabilities as an interconnected topological graph. Hover or tap any node to inspect domain connections and technical specializations.
        </p>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Cluster Tabs (active state in academic-amber) */}
        <div className="flex flex-wrap gap-2 border-b border-paper-border-subtle pb-3">
          {skillsData.map((cat, idx) => (
            <button
              key={cat.categoryName}
              onClick={() => {
                setSelectedCategory(idx);
                setActiveSkillName(null);
                setHoveredSkillName(null);
              }}
              className={`px-4 py-2 rounded-xs font-mono text-xs transition-colors cursor-pointer ${
                selectedCategory === idx
                  ? 'border border-academic-amber bg-paper-bg-base text-academic-amber font-bold shadow-xs'
                  : 'border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted hover:text-ink-primary hover:bg-paper-bg-elevated'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* SVG Skill Constellation Layout */}
        <div className="rounded border border-paper-border-strong bg-paper-bg-base p-4 sm:p-8 space-y-6 shadow-sm">
          <div
            className="relative w-full select-none"
            onClick={() => {
              setActiveSkillName(null);
              setHoveredSkillName(null);
            }}
          >
            <svg
              viewBox="0 0 720 340"
              className="w-full h-auto max-h-[380px] mx-auto block overflow-visible"
              role="img"
              aria-label={`Skill constellation graph for ${currentCategory.categoryName}`}
            >
              {/* Constellation Edge Lines */}
              <g className="edges">
                {edges.map((edge, idx) => {
                  const isHighlighted =
                    highlightedSkillName !== null &&
                    (edge.from === highlightedSkillName || edge.to === highlightedSkillName);
                  const isDimmed = highlightedSkillName !== null && !isHighlighted;

                  return (
                    <line
                      key={`${edge.from}-${edge.to}-${idx}`}
                      x1={edge.x1}
                      y1={edge.y1}
                      x2={edge.x2}
                      y2={edge.y2}
                      stroke={isHighlighted ? '#d97706' : 'currentColor'}
                      strokeWidth={isHighlighted ? 1.5 : 0.6}
                      strokeDasharray={isHighlighted ? undefined : '2 2'}
                      className={`${prefersReducedMotion ? '' : 'transition-opacity duration-200'} text-paper-border-strong ${
                        isHighlighted ? 'opacity-90' : isDimmed ? 'opacity-15' : 'opacity-40'
                      }`}
                    />
                  );
                })}
              </g>

              {/* Constellation Nodes */}
              <g className="nodes">
                {nodes.map((node) => {
                  const isSelected = activeSkillName === node.name;
                  const isHovered = hoveredSkillName === node.name;
                  const isPrimary = isSelected || isHovered;
                  const isConnected = connectedSkillNames.has(node.name);
                  const isDimmed = highlightedSkillName !== null && !isConnected;

                  return (
                    <g
                      key={node.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSkillName(isSelected ? null : node.name);
                      }}
                      onPointerEnter={() => setHoveredSkillName(node.name)}
                      onPointerLeave={() => setHoveredSkillName(null)}
                      className={`cursor-pointer ${prefersReducedMotion ? '' : 'transition-opacity duration-200'} ${
                        isDimmed ? 'opacity-20' : 'opacity-100'
                      }`}
                    >
                      {/* Outer pulse/focus ring */}
                      {isPrimary && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={12}
                          fill="none"
                          stroke="#d97706"
                          strokeWidth={1}
                          strokeOpacity={0.4}
                          className={prefersReducedMotion ? '' : 'animate-pulse'}
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isPrimary ? 6 : 5}
                        fill={isPrimary ? '#d97706' : isConnected ? '#bab2a4' : '#5c5449'}
                        stroke="#121110"
                        strokeWidth={1.5}
                      />

                      {/* Monospace Node Label */}
                      <text
                        x={node.x}
                        y={node.y + (node.y > 170 ? 18 : -12)}
                        textAnchor="middle"
                        fill={isPrimary ? '#d97706' : 'currentColor'}
                        className="font-mono text-[11px] font-semibold text-ink-primary select-none pointer-events-none"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Interactive Inspection Tooltip / Panel Below Constellation */}
          <div className="pt-4 border-t border-paper-border-subtle space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-academic-amber" />
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  {inspectionSkill.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted">
                  Intermediate
                </span>
              </div>
              <span className="text-xs font-mono text-ink-muted">
                {currentCategory.categoryName}
              </span>
            </div>

            <p className="font-serif text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {inspectionSkill.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {inspectionSkill.associatedTopics.map((topic: string) => (
                <span
                  key={topic}
                  className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
