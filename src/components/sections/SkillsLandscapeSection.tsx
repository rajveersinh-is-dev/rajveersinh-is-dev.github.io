import React, { useState, useMemo, useEffect } from 'react';
import { skillsData } from '../../data';
import type { SkillEntry } from '../../types/content';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { MaskedReveal } from '../common/MaskedReveal';
import { usePreferences } from '../../context';

// Helper to format long constellation node labels into balanced lines
function splitSkillLabel(name: string): string[] {
  if (name.length <= 16) return [name];
  if (name.includes(' & ')) {
    const parts = name.split(' & ');
    return [parts[0], `& ${parts[1]}`];
  }
  if (name.includes(' / ')) {
    const parts = name.split(' / ');
    return [parts[0], `/ ${parts[1]}`];
  }
  const words = name.split(' ');
  if (words.length >= 2) {
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }
  return [name];
}

// Deterministic celestial background stars for astronomical map atmosphere
const CELESTIAL_STARS = [
  { x: 45, y: 38, r: 0.8, op: 0.2 },
  { x: 92, y: 75, r: 1.1, op: 0.25 },
  { x: 135, y: 32, r: 0.9, op: 0.18 },
  { x: 180, y: 60, r: 1.2, op: 0.28 },
  { x: 230, y: 28, r: 0.7, op: 0.15 },
  { x: 285, y: 52, r: 1.0, op: 0.22 },
  { x: 435, y: 42, r: 0.9, op: 0.2 },
  { x: 490, y: 26, r: 1.2, op: 0.3 },
  { x: 545, y: 62, r: 0.8, op: 0.18 },
  { x: 605, y: 40, r: 1.0, op: 0.24 },
  { x: 670, y: 72, r: 1.1, op: 0.25 },
  { x: 38, y: 145, r: 1.0, op: 0.2 },
  { x: 80, y: 190, r: 0.8, op: 0.18 },
  { x: 50, y: 260, r: 1.2, op: 0.26 },
  { x: 110, y: 310, r: 0.9, op: 0.22 },
  { x: 165, y: 280, r: 1.1, op: 0.25 },
  { x: 225, y: 315, r: 0.8, op: 0.18 },
  { x: 290, y: 295, r: 1.0, op: 0.22 },
  { x: 430, y: 305, r: 1.1, op: 0.24 },
  { x: 495, y: 320, r: 0.8, op: 0.18 },
  { x: 560, y: 285, r: 1.2, op: 0.28 },
  { x: 625, y: 310, r: 0.9, op: 0.2 },
  { x: 680, y: 260, r: 1.0, op: 0.22 },
  { x: 665, y: 185, r: 1.1, op: 0.25 },
  { x: 685, y: 130, r: 0.8, op: 0.18 },
  { x: 250, y: 120, r: 0.7, op: 0.15 },
  { x: 470, y: 115, r: 0.8, op: 0.18 },
  { x: 260, y: 220, r: 0.8, op: 0.16 },
  { x: 465, y: 225, r: 0.7, op: 0.15 },
  { x: 360, y: 65, r: 1.0, op: 0.2 },
  { x: 360, y: 275, r: 1.0, op: 0.2 }
];

export const SkillsLandscapeSection: React.FC = () => {
  const { theme } = usePreferences();
  const bgSubtle =
    theme === 'amber-crt' ? '#120e04' : theme === 'night' ? '#1a1816' : '#f4f0e6';

  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);
  const [activeSkillName, setActiveSkillName] = useState<string | null>(
    () => skillsData[0]?.skills[0]?.name || null
  );
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

  const width = 720;
  const height = 340;
  const cx = width / 2; // 360
  const cy = height / 2; // 170

  // Staggered multi-orbit coordinate calculation ensuring clear spacing & zero label collision
  const nodes = useMemo(() => {
    const total = skills.length;
    // Outer and inner orbit radii calibrated for 720x340 canvas
    const rxOuter = 215;
    const ryOuter = 105;
    const rxInner = 125;
    const ryInner = 60;

    return skills.map((skill, idx) => {
      // Angular spacing starting at the zenith (-PI/2)
      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
      // Alternate between outer orbit and inner orbit for rich celestial depth
      const isOuter = idx % 2 === 0;
      const rx = isOuter ? rxOuter : rxInner;
      const ry = isOuter ? ryOuter : ryInner;

      const x = Math.round(cx + rx * Math.cos(angle));
      const y = Math.round(cy + ry * Math.sin(angle));

      const lines = splitSkillLabel(skill.name);
      const dx = x - cx;
      const dy = y - cy;

      let labelX = x;
      let labelY = y;
      let textAnchor: 'start' | 'middle' | 'end' = 'middle';

      if (Math.abs(dx) <= 25) {
        labelX = x;
        textAnchor = 'middle';
        if (dy < 0) {
          labelY = y - (lines.length > 1 ? 19 : 11);
        } else {
          labelY = y + 17;
        }
      } else if (dx > 25) {
        labelX = x + 10;
        labelY = y + (lines.length > 1 ? -2 : 3);
        textAnchor = 'start';
      } else {
        labelX = x - 10;
        labelY = y + (lines.length > 1 ? -2 : 3);
        textAnchor = 'end';
      }

      return {
        ...skill,
        x,
        y,
        labelX,
        labelY,
        labelLines: lines,
        textAnchor,
        isOuter,
        idx,
      };
    });
  }, [skills, cx, cy]);

  // Determine constellation connections: shared topics, structural perimeter ring, and cross chords
  const edges = useMemo(() => {
    const edgeList: {
      from: string;
      to: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      sharedTopics: string[];
      isStructural: boolean;
    }[] = [];

    const total = nodes.length;

    for (let i = 0; i < total; i++) {
      for (let j = i + 1; j < total; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const shared = a.associatedTopics.filter((t) => b.associatedTopics.includes(t));
        // Connect sequential nodes in perimeter ring, cross-ties, or shared topic nodes
        const isRingNeighbor = j === i + 1 || (i === 0 && j === total - 1);
        const isCrossChord = (j === i + 2 && total >= 6) || (i === 0 && j === total - 2 && total >= 6);

        if (shared.length > 0 || isRingNeighbor || isCrossChord) {
          edgeList.push({
            from: a.name,
            to: b.name,
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
            sharedTopics: shared,
            isStructural: isRingNeighbor || isCrossChord,
          });
        }
      }
    }
    return edgeList;
  }, [nodes]);

  // Active or hovered skill takes precedence for highlighting
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

  const isFocused = Boolean(activeSkillName || hoveredSkillName);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/30 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
        >
          06
        </div>

        {/* Section Header */}
        <div className="space-y-3 relative z-10">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            § 6
          </div>
          <MaskedReveal>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              § 6. Methodological Repertoire &amp; Mathematical Tools
            </h2>
          </MaskedReveal>
          <MaskedReveal delayMs={150}>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Interactive Competency Clusters — Rigorous Toolchains for Formal Proofs &amp; Computational Synthesis
            </p>
          </MaskedReveal>
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
                setActiveSkillName(skillsData[idx]?.skills[0]?.name || null);
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

        {/* Competency Node Chips for Fast Inspection & Mobile Access */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.map((skill) => {
            const isSelected = isFocused && inspectionSkill.name === skill.name;
            return (
              <button
                key={skill.name}
                onClick={() => {
                  setActiveSkillName(skill.name);
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-academic-amber bg-academic-amber/15 text-academic-amber font-semibold shadow-xs'
                    : 'border-paper-border-subtle bg-paper-bg-base text-ink-muted hover:text-ink-primary hover:border-paper-border-strong'
                }`}
              >
                {skill.name}
              </button>
            );
          })}
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
              data-reticle-cursor="true"
              className="w-full h-auto max-h-[420px] mx-auto block overflow-visible"
              role="img"
              aria-label={`Skill constellation graph for ${currentCategory.categoryName}`}
            >
              {/* Celestial Background Grid & Coordinate Ticks */}
              <g className="celestial-grid pointer-events-none">
                {/* Fixed Background Stars */}
                {CELESTIAL_STARS.map((star, i) => (
                  <circle
                    key={`star-${i}`}
                    cx={star.x}
                    cy={star.y}
                    r={star.r}
                    fill="currentColor"
                    className="text-ink-muted"
                    opacity={star.op}
                  />
                ))}

                {/* Concentric Orbital Ellipses */}
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={75}
                  ry={36}
                  fill="none"
                  stroke={theme === 'amber-crt' ? '#805800' : theme === 'night' ? '#5c5449' : '#7c6f5d'}
                  strokeWidth={0.9}
                  strokeDasharray="2 4"
                  opacity={theme === 'paper' ? 0.75 : 0.55}
                />
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={125}
                  ry={60}
                  fill="none"
                  stroke={theme === 'amber-crt' ? '#805800' : theme === 'night' ? '#5c5449' : '#7c6f5d'}
                  strokeWidth={1.1}
                  strokeDasharray="3 4"
                  opacity={theme === 'paper' ? 0.85 : 0.65}
                />
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={215}
                  ry={105}
                  fill="none"
                  stroke={theme === 'amber-crt' ? '#805800' : theme === 'night' ? '#5c5449' : '#7c6f5d'}
                  strokeWidth={1.3}
                  strokeDasharray="4 5"
                  opacity={theme === 'paper' ? 0.85 : 0.70}
                />

                {/* Polar Coordinate Crosshairs */}
                <line
                  x1={75}
                  y1={cy}
                  x2={645}
                  y2={cy}
                  stroke="currentColor"
                  strokeWidth={0.5}
                  strokeDasharray="2 6"
                  className="text-paper-border-strong opacity-20"
                />
                <line
                  x1={cx}
                  y1={30}
                  x2={cx}
                  y2={310}
                  stroke="currentColor"
                  strokeWidth={0.5}
                  strokeDasharray="2 6"
                  className="text-paper-border-strong opacity-20"
                />

                {/* Coordinate Markers */}
                <text
                  x={80}
                  y={cy - 4}
                  className="font-mono text-[8px] fill-ink-muted opacity-40 select-none"
                >
                  180°
                </text>
                <text
                  x={640}
                  y={cy - 4}
                  textAnchor="end"
                  className="font-mono text-[8px] fill-ink-muted opacity-40 select-none"
                >
                  0°
                </text>
                <text
                  x={cx + 6}
                  y={36}
                  className="font-mono text-[8px] fill-ink-muted opacity-40 select-none"
                >
                  90°
                </text>
                <text
                  x={cx + 6}
                  y={304}
                  className="font-mono text-[8px] fill-ink-muted opacity-40 select-none"
                >
                  270°
                </text>
              </g>

              {/* Radial Spokes to Center Hub */}
              <g className="hub-spokes pointer-events-none">
                {nodes.map((node) => {
                  const isNodeHighlighted = highlightedSkillName === node.name;
                  return (
                    <line
                      key={`hub-${node.name}`}
                      x1={cx}
                      y1={cy}
                      x2={node.x}
                      y2={node.y}
                      stroke={isNodeHighlighted ? '#d97706' : 'currentColor'}
                      strokeWidth={isNodeHighlighted ? 1.4 : 0.6}
                      strokeDasharray={isNodeHighlighted ? undefined : '2 4'}
                      className={`text-paper-border-strong ${
                        isNodeHighlighted ? 'opacity-85' : 'opacity-25'
                      }`}
                    />
                  );
                })}
              </g>

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
                      stroke={
                        isHighlighted
                          ? theme === 'amber-crt'
                            ? '#ffd24d'
                            : theme === 'night'
                            ? '#f59e0b'
                            : '#b45309'
                          : theme === 'amber-crt'
                          ? '#593e03'
                          : theme === 'night'
                          ? '#5a5043'
                          : '#6b5f4d'
                      }
                      strokeWidth={isHighlighted ? 2.2 : edge.sharedTopics.length > 0 ? 1.0 : 0.8}
                      strokeDasharray={isHighlighted ? undefined : edge.sharedTopics.length > 0 ? '4 2' : '2 3'}
                      strokeOpacity={isHighlighted ? 0.95 : isDimmed ? 0.45 : 0.65}
                      className={prefersReducedMotion ? '' : 'transition-all duration-200'}
                    />
                  );
                })}
              </g>

              {/* Central Category Hub Node */}
              <g className="hub-center select-none pointer-events-none">
                <circle
                  cx={cx}
                  cy={cy}
                  r={24}
                  fill="none"
                  stroke={theme === 'amber-crt' ? '#ffd24d' : theme === 'night' ? '#f59e0b' : '#b45309'}
                  strokeWidth={0.8}
                  strokeDasharray="2 3"
                  opacity={0.4}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={15}
                  fill={bgSubtle}
                  stroke={theme === 'amber-crt' ? '#ffd24d' : theme === 'night' ? '#f59e0b' : '#b45309'}
                  strokeWidth={1.5}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={theme === 'amber-crt' ? '#ffd24d' : theme === 'night' ? '#f59e0b' : '#b45309'}
                />
                <text
                  x={cx}
                  y={cy + 24}
                  textAnchor="middle"
                  className="font-mono text-[8px] font-bold tracking-[0.2em] uppercase fill-ink-muted select-none"
                >
                  CLUSTER CORE
                </text>
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
                      className={`cursor-pointer outline-none ${
                        prefersReducedMotion ? '' : 'transition-opacity duration-200'
                      } ${isDimmed ? 'opacity-80' : 'opacity-100'}`}
                    >
                      {/* Outer pulse/focus ring on selection/hover */}
                      {isPrimary && (
                        <>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={18}
                            fill="none"
                            stroke={theme === 'amber-crt' ? '#ffd24d' : theme === 'night' ? '#f59e0b' : '#b45309'}
                            strokeWidth={1}
                            strokeDasharray="3 3"
                            opacity={0.5}
                            className={prefersReducedMotion ? '' : 'animate-pulse'}
                          />
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={13}
                            fill={theme === 'amber-crt' ? '#ffd24d' : theme === 'night' ? '#f59e0b' : '#b45309'}
                            fillOpacity={0.15}
                            stroke={theme === 'amber-crt' ? '#ffd24d' : theme === 'night' ? '#f59e0b' : '#b45309'}
                            strokeWidth={1.2}
                          />
                        </>
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isPrimary ? 7 : node.isOuter ? 6 : 5}
                        fill={
                          isPrimary
                            ? theme === 'amber-crt'
                              ? '#ffd24d'
                              : theme === 'night'
                              ? '#d97706'
                              : '#b45309'
                            : isConnected
                            ? theme === 'amber-crt'
                              ? '#ffb000'
                              : theme === 'night'
                              ? '#38bdf8'
                              : '#1e3a5f'
                            : theme === 'amber-crt'
                            ? '#805800'
                            : theme === 'night'
                            ? '#a8a29e'
                            : '#44403c'
                        }
                        stroke={bgSubtle}
                        strokeWidth={1.8}
                      />

                      {/* Specular Highlight Dot */}
                      <circle
                        cx={node.x - 1.5}
                        cy={node.y - 1.5}
                        r={isPrimary ? 2 : 1.2}
                        fill={isPrimary ? '#fff7ed' : '#ffffff'}
                        opacity={0.8}
                        pointerEvents="none"
                      />

                      {/* Boundary-Safe Monospace Node Label with Multi-Line Support and Halo Contrast */}
                      <text
                        x={node.labelX}
                        y={node.labelY}
                        textAnchor={node.textAnchor}
                        fill={
                          isPrimary
                            ? theme === 'amber-crt'
                              ? '#ffd24d'
                              : theme === 'night'
                              ? '#f59e0b'
                              : '#b45309'
                            : 'currentColor'
                        }
                        stroke={bgSubtle}
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                        className={`font-mono text-[10px] select-none pointer-events-none transition-colors ${
                          isPrimary
                            ? 'font-bold'
                            : isConnected
                            ? 'font-bold text-ink-primary'
                            : 'font-semibold text-ink-primary'
                        }`}
                      >
                        {node.labelLines.map((line, lIdx) => (
                          <tspan
                            key={`${node.name}-line-${lIdx}`}
                            x={node.labelX}
                            dy={lIdx === 0 ? 0 : 11}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Interactive Inspection Tooltip / Panel Below Constellation */}
          <div className="pt-4 border-t border-paper-border-subtle space-y-4">
            {isFocused ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-academic-amber shadow-xs" />
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

                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                    Associated Specialization Areas:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
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

                {/* Direct Connected Skills in Constellation */}
                {connectedSkillNames.size > 1 && (
                  <div className="pt-2 border-t border-paper-border-subtle/50 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                      Graph Neighbors:
                    </span>
                    {Array.from(connectedSkillNames)
                      .filter((name) => name !== inspectionSkill.name)
                      .map((connectedName) => (
                        <button
                          key={connectedName}
                          onClick={() => setActiveSkillName(connectedName)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded border border-academic-amber/30 bg-academic-amber/5 text-academic-amber hover:bg-academic-amber/15 transition-colors cursor-pointer"
                        >
                          {connectedName} →
                        </button>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-paper-border-strong" />
                    <h3 className="font-serif text-lg font-bold text-ink-primary">
                      {currentCategory.categoryName} Overview
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted">
                      Intermediate Proficiency
                    </span>
                  </div>
                  <span className="text-xs font-mono text-ink-muted">
                    {skills.length} Competency Nodes
                  </span>
                </div>
                <p className="font-serif text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Topological graph view active. Click or hover any node in the constellation or select a chip above to inspect its formal invariants, algorithmic passes, and graph neighbor connections.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setActiveSkillName(s.name)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border border-academic-amber/30 bg-academic-amber/5 text-academic-amber hover:bg-academic-amber/15 transition-colors cursor-pointer"
                    >
                      Inspect {s.name} →
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
