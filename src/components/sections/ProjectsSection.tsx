import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { projectsData } from '../../data';
import type { ProjectEntry } from '../../types/content';
import { ProjectVisualDemo } from '../visuals/ProjectVisualDemo';
import { NumLangLoweringWalkthrough } from '../visuals/NumLangLoweringWalkthrough';
import { NumLangReplEvaluator } from '../visuals/NumLangReplEvaluator';
import { TiltCard } from '../common/TiltCard';
import { MaskedReveal } from '../common/MaskedReveal';
import { AcademicPopover } from '../common/AcademicPopover';
import { AsciiFrame } from '../common/AsciiFrame';
import { AsciiDecodeText } from '../common/AsciiDecodeText';
import { copyTextToClipboard } from '../../utils/clipboard';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { usePreferences } from '../../context';
import {
  Layers,
  ChevronRight,
  X,
  Info,
  Link as LinkIcon,
  Check,
  BookOpen,
  ShieldCheck,
  ArrowUpRight,
  Code2,
  Cpu
} from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'walkthrough'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [sheetTranslateY, setSheetTranslateY] = useState(0);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();
  const { playClick } = usePreferences();

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      setSheetTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (sheetTranslateY > 80) {
      handleCloseModal();
    }
    setSheetTranslateY(0);
    touchStartYRef.current = null;
  };

  const categories = ['All', 'Compiler & Verification', 'Optimization & Graphs', 'Simulation & Systems'];

  // Hash synchronization for deep linking and direct project page routing
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        const projId = hash.replace('#project-', '');
        const target = projectsData.find((p) => p.id === projId);
        if (target) {
          setSelectedProject(target);
          setModalTab('overview');
        } else {
          setSelectedProject(null);
        }
      } else {
        setSelectedProject((prev) => (prev ? null : null));
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleCloseModal = useCallback(() => {
    playClick(440);
    setSelectedProject(null);
    try {
      if (window.location.hash.startsWith('#project-')) {
        window.history.replaceState(null, '', '#projects');
      }
    } catch {}
    if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
    }
  }, [playClick]);

  const handleOpenProject = (project: ProjectEntry, initialTab: 'overview' | 'walkthrough' = 'overview') => {
    playClick(620);
    lastActiveElementRef.current = document.activeElement as HTMLElement;
    setSelectedProject(project);
    setModalTab(initialTab);
    try {
      window.history.replaceState(null, '', `#project-${project.id}`);
    } catch {}
  };

  // Lock body scroll when project modal is open & handle ESC key & auto-focus
  useEffect(() => {
    if (selectedProject) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const focusTimer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedProject, handleCloseModal]);

  const handleCopyProjectLink = async (project: ProjectEntry) => {
    playClick(920);
    const url = `${window.location.origin}${window.location.pathname}#project-${project.id}`;
    const success = await copyTextToClipboard(url);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filterByCategory = (project: ProjectEntry) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Compiler & Verification') {
      return (
        project.category.includes('Compiler') ||
        project.category.includes('Verification') ||
        project.category.includes('Combinatorics')
      );
    }
    if (activeCategory === 'Optimization & Graphs') {
      return (
        project.category.includes('Optimization') ||
        project.category.includes('Lattice') ||
        project.category.includes('Topology')
      );
    }
    if (activeCategory === 'Simulation & Systems') {
      return (
        project.category.includes('Simulation') ||
        project.category.includes('Systems') ||
        project.category.includes('Dynamical') ||
        project.category.includes('Art')
      );
    }
    return true;
  };

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  const featuredProjects = projectsData.filter((p) => p.isFeatured && filterByCategory(p));
  const additionalProjects = projectsData.filter((p) => !p.isFeatured && filterByCategory(p));

  const numlangProject = featuredProjects.find((p) => p.id === 'numlang');
  const otherFeatured = featuredProjects.filter((p) => p.id !== 'numlang');

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
        >
          03
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              § 3
            </div>
            <MaskedReveal>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
                § 3. Computational Treatises &amp; Verified Algorithms
              </h2>
            </MaskedReveal>
            <MaskedReveal delayMs={150}>
              <p className="font-serif italic text-ink-muted text-sm sm:text-base">
                Projects &amp; Research Repositories — Mechanized Compilers, Algorithmic Lattices, and Discrete Physical Simulations
              </p>
            </MaskedReveal>
          </div>

          {/* Filter Catalog Ribbon */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded border border-paper-border-strong bg-paper-bg-subtle self-start md:self-auto shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClick(800);
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-academic-amber text-paper-bg-base font-bold shadow-xs'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-bg-elevated'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ASYMMETRIC BENTO GRID WITH NUMLANG AS PRIMARY ANCHOR */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-ink-muted uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-academic-amber" />
            <span className="font-semibold">Core Research Monographs — Asymmetric Bento Architecture</span>
          </div>

          {/* NUMLANG: Signature Hero Anchor (Top Full-Width Bento Anchor) */}
          {numlangProject && (
            <TiltCard
              key={numlangProject.id}
              id={`project-${numlangProject.id}`}
              maxTilt={4}
              spotlightColor="rgba(245, 158, 11, 0.16)"
              role="button"
              tabIndex={0}
              aria-label={`View specifications for ${numlangProject.name}`}
              onClick={() => handleOpenProject(numlangProject)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenProject(numlangProject);
                }
              }}
              className="w-full rounded border-2 border-academic-amber/60 bg-paper-bg-subtle hover:border-academic-amber transition-all flex flex-col justify-between overflow-visible group shadow-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-academic-amber"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded border border-academic-amber bg-academic-amber/15 text-academic-amber font-bold">
                        PRIMARY RESEARCH ANCHOR • MONOGRAPH I
                      </span>
                      <span className="text-[10px] font-mono text-ink-muted">
                        #1 Verified Compiler
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-strong bg-paper-bg-base text-ink-secondary">
                        Lean 4 Formal Semantics
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary group-hover:text-academic-amber transition-colors">
                      {numlangProject.name}
                    </h3>
                    <span className="text-xs text-ink-muted font-mono block mt-1">
                      {numlangProject.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {numlangProject.githubUrl && (
                      <a
                        href={numlangProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick(900);
                        }}
                        aria-label={`View ${numlangProject.name} source on GitHub`}
                        className="p-2 rounded border border-paper-border-strong bg-paper-bg-base text-ink-secondary hover:text-academic-amber hover:border-academic-amber transition-colors cursor-pointer"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-ink-secondary font-serif leading-relaxed max-w-4xl">
                  {numlangProject.conciseDescription}
                </p>

                {/* Clean Left Accent Bar (Removed Nested Border Box) */}
                <div className="border-l-2 border-academic-amber pl-3.5 bg-transparent font-mono text-xs space-y-2.5">
                  <span className="text-academic-amber font-semibold uppercase tracking-wider text-[10px] block font-serif">
                    Formal Specification &amp; Inductive Invariant:
                  </span>
                  <p className="leading-relaxed text-ink-secondary font-serif text-xs sm:text-sm">
                    {numlangProject.motivation}
                  </p>
                  <div className="pt-1 flex items-center">
                    <AcademicPopover type="theorem" id="thm-supercompilation" align="left">
                      [Supercompilation Contract]
                    </AcademicPopover>
                  </div>
                </div>

                {/* Lowering Pipeline Launch Teaser */}
                <div className="p-3 bg-paper-bg-elevated rounded border border-paper-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-ink-primary">
                    <Code2 className="w-4 h-4 text-academic-amber" />
                    <span>Interactive Step-by-Step Lowering Walkthrough Available</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProject(numlangProject, 'walkthrough');
                    }}
                    className="px-3 py-1.5 rounded bg-academic-amber text-paper-bg-base font-mono text-xs font-bold flex items-center space-x-1.5 hover:opacity-95 transition-opacity cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span><AsciiDecodeText text="Launch Lowering Walkthrough" /></span>
                  </button>
                </div>

                {/* Interactive In-Browser NumLang Compiler REPL / Evaluator Directly in Hero Bento Card */}
                <div
                  className="pt-2 cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NumLangReplEvaluator />
                </div>

                {/* Technology Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {numlangProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2.5 py-1 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-muted font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 sm:px-8 py-3.5 border-t border-paper-border-subtle bg-paper-bg-base flex items-center justify-between rounded-b">
                <div className="flex items-center space-x-1.5 text-xs font-mono text-ink-muted">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{numlangProject.status}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProject(numlangProject);
                  }}
                  className="text-xs font-mono text-academic-amber hover:text-ink-primary flex items-center space-x-1 font-semibold group/btn transition-colors cursor-pointer"
                >
                  <span><AsciiDecodeText text="View Specifications" /></span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </TiltCard>
          )}

          {/* Secondary Featured Projects in Asymmetric Bento Grid Beneath NumLang */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {otherFeatured.map((project) => (
              <TiltCard
                key={project.id}
                id={`project-${project.id}`}
                maxTilt={6}
                spotlightColor="rgba(245, 158, 11, 0.12)"
                role="button"
                tabIndex={0}
                aria-label={`View specifications for ${project.name}`}
                onClick={() => handleOpenProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenProject(project);
                  }
                }}
                className="col-span-1 rounded bg-paper-bg-subtle hover:border-academic-amber transition-all flex flex-col justify-between overflow-hidden group shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-academic-amber"
              >
                <AsciiFrame
                  titleLeft={`ID: ${project.id.toUpperCase()}`}
                  titleRight={project.category.includes('Compiler') ? 'ℝ⁴ • SSA' : 'Ω • ALGO'}
                  footerLeft={project.status}
                  footerRight="▼ 48ms"
                  className="h-full flex flex-col justify-between"
                >
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-strong bg-paper-bg-base text-academic-amber font-bold">
                            Monograph {romanNumerals[project.priority - 1] || project.priority}
                          </span>
                          <span className="text-[10px] font-mono text-ink-muted">
                            #{project.priority}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-ink-primary group-hover:text-academic-amber transition-colors">
                          {project.name}
                        </h3>
                        <span className="text-xs text-ink-muted font-mono block mt-1">
                          {project.category}
                        </span>
                      </div>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick(900);
                          }}
                          aria-label={`View ${project.name} source on GitHub`}
                          className="p-1.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-secondary hover:text-academic-amber hover:border-academic-amber transition-colors cursor-pointer"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-ink-secondary font-serif leading-relaxed line-clamp-3">
                      {project.conciseDescription}
                    </p>

                    <div className="border-l-2 border-academic-amber pl-3.5 bg-transparent font-mono text-[11px] text-ink-muted space-y-1">
                      <span className="text-academic-amber font-semibold uppercase tracking-wider text-[9px] block font-serif">
                        Theoretical Invariant:
                      </span>
                      <p className="line-clamp-2 leading-relaxed text-ink-secondary">{project.motivation}</p>
                    </div>

                    {project.metricsAuditNote && (
                      <div className="text-[10px] font-mono text-ink-muted flex items-center space-x-1.5 bg-paper-bg-elevated p-2 rounded border border-paper-border-subtle">
                        <Info className="w-3.5 h-3.5 text-ink-muted flex-shrink-0" />
                        <span className="line-clamp-1">{project.metricsAuditNote}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 py-3 border-t border-paper-border-subtle bg-paper-bg-base flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono text-ink-muted">
                      <ShieldCheck className="w-3.5 h-3.5 text-ink-muted" />
                      <span>{project.status}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project);
                      }}
                      className="text-xs font-mono text-academic-amber hover:text-ink-primary flex items-center space-x-1 font-semibold group/btn transition-colors cursor-pointer"
                    >
                      <span><AsciiDecodeText text="View Specifications" /></span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </AsciiFrame>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Additional Algorithmic Treatises */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-ink-muted uppercase tracking-wider">
            <Layers className="w-4 h-4 text-academic-amber" />
            <span className="font-semibold">Additional Research &amp; Algorithmic Repositories</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalProjects.map((project, idx) => (
              <TiltCard
                key={project.id}
                id={`project-${project.id}`}
                maxTilt={4}
                role="button"
                tabIndex={0}
                aria-label={`View specifications for ${project.name}`}
                onClick={() => handleOpenProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenProject(project);
                  }
                }}
                className="p-5 rounded border border-paper-border-subtle bg-paper-bg-subtle hover:border-academic-amber transition-all flex flex-col justify-between space-y-3 shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-academic-amber"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-mono text-ink-muted font-semibold">
                        Treatise {romanNumerals[5 + idx] || `${idx + 6}`}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-ink-primary hover:text-academic-amber transition-colors">
                      {project.name}
                    </h4>
                    <span className="text-xs text-ink-muted font-mono">{project.category}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick(900);
                        }}
                        className="p-1.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-muted hover:text-academic-amber transition-colors cursor-pointer"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project);
                      }}
                      className="px-2.5 py-1 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-academic-amber text-xs font-mono flex items-center space-x-1 transition-colors font-semibold cursor-pointer"
                      title="View Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-ink-secondary font-serif leading-relaxed">
                  {project.conciseDescription}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-paper-border-subtle">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProject(project);
                    }}
                    className="text-[11px] font-mono text-academic-amber hover:text-ink-primary font-semibold flex items-center space-x-0.5 transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Project Detail Modal — Treatise Specification & Structural Proof Viewer */}
        {selectedProject &&
          (typeof document !== 'undefined'
            ? createPortal(
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Project details for ${selectedProject.name}`}
                  className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto overscroll-contain bg-black/85 sm:bg-black/75 sm:backdrop-blur-xs transition-colors"
                  onClick={handleCloseModal}
                >
                  <div
                    style={sheetTranslateY > 0 ? { transform: `translateY(${sheetTranslateY}px)`, transition: 'none' } : undefined}
                    className="w-full sm:max-w-4xl my-0 sm:my-auto max-h-[85dvh] sm:max-h-[90dvh] flex flex-col overflow-hidden bg-paper-bg-subtle border-t-2 sm:border-2 border-paper-border-strong rounded-t-xl sm:rounded shadow-2xl transition-transform"
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Mobile Grab Handle for Bottom-Sheet */}
                    <div className="w-12 h-1.5 bg-ink-muted/40 rounded-full mx-auto my-2 sm:hidden shrink-0 cursor-grab active:cursor-grabbing" aria-hidden="true" />

                    {/* Modal Header */}
                    <div className="px-4 sm:px-6 py-4 border-b-2 border-paper-border-strong bg-paper-bg-base flex items-center justify-between shrink-0">
                      <div className="min-w-0 pr-3">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <span className="text-[10px] sm:text-xs font-mono text-academic-amber font-bold tracking-wider">
                            [PROJECT SPECIFICATION RECORD]
                          </span>
                          <span className="text-[10px] sm:text-xs text-ink-muted font-mono">
                            Status: {selectedProject.status}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold font-serif text-ink-primary truncate">
                          <span>{selectedProject.name}</span>
                        </h3>
                        <p className="text-xs text-ink-muted font-mono truncate">
                          {selectedProject.category}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {/* NumLang Lowering Walkthrough Toggle Tab */}
                        {selectedProject.id === 'numlang' && (
                          <div className="flex items-center space-x-1 bg-paper-bg-subtle p-1 rounded border border-paper-border-subtle mr-1">
                            <button
                              onClick={() => {
                                playClick(1050);
                                setModalTab('overview');
                              }}
                              className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                                modalTab === 'overview'
                                  ? 'bg-academic-amber text-paper-bg-base font-bold shadow-xs'
                                  : 'text-ink-secondary hover:text-ink-primary'
                              }`}
                            >
                              Overview
                            </button>
                            <button
                              onClick={() => {
                                playClick(1050);
                                setModalTab('walkthrough');
                              }}
                              className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                                modalTab === 'walkthrough'
                                  ? 'bg-academic-amber text-paper-bg-base font-bold shadow-xs'
                                  : 'text-ink-secondary hover:text-ink-primary'
                              }`}
                            >
                              Lowering Walkthrough
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handleCopyProjectLink(selectedProject)}
                          className="p-2 rounded border border-paper-border-subtle bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-muted hover:text-academic-amber transition-colors cursor-pointer"
                          title="Copy direct share link to this project page"
                          aria-label="Copy share link"
                        >
                          {copiedLink ? <Check className="w-4 h-4 text-academic-amber" /> : <LinkIcon className="w-4 h-4" />}
                        </button>

                        <button
                          ref={closeButtonRef}
                          onClick={handleCloseModal}
                          className="p-2 rounded border border-paper-border-subtle bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
                          aria-label="Close details dialog"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
                      {selectedProject.id === 'numlang' && modalTab === 'walkthrough' ? (
                        /* NumLang Lowering Walkthrough interactive component */
                        <div>
                          <NumLangLoweringWalkthrough />
                        </div>
                      ) : (
                        <>
                          {/* Visual Demonstration / Architecture Flow */}
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider text-academic-amber mb-2 font-semibold">
                              Visual Demonstration &amp; Technical Architecture
                            </h4>
                            <ProjectVisualDemo project={selectedProject} />
                          </div>

                          <div>
                            <h4 className="text-xs font-serif uppercase tracking-wider text-ink-primary mb-1.5 font-bold">
                              Description &amp; Research Scope
                            </h4>
                            <p className="text-sm text-ink-secondary leading-relaxed font-serif">
                              {selectedProject.conciseDescription}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-serif uppercase tracking-wider text-ink-primary mb-1.5 font-bold">
                              Research &amp; Engineering Motivation
                            </h4>
                            <p className="text-xs text-ink-secondary leading-relaxed font-mono bg-paper-bg-base p-3.5 rounded border border-paper-border-subtle">
                              {selectedProject.motivation}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-serif uppercase tracking-wider text-ink-primary mb-1.5 font-bold">
                              Key Technical Ideas &amp; Structural Principles
                            </h4>
                            <ul className="space-y-2">
                              {selectedProject.keyIdeas.map((idea, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-ink-secondary flex items-start space-x-2 font-mono"
                                >
                                  <span className="text-academic-amber font-bold">[{idx + 1}]</span>
                                  <span className="leading-relaxed">{idea}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {selectedProject.metricsAuditNote && (
                            <div className="p-3.5 rounded border-l-2 border-academic-amber bg-paper-bg-base border border-paper-border-subtle text-xs text-ink-secondary font-mono">
                              <span className="font-bold text-academic-amber">Metric Transparency: </span>
                              {selectedProject.metricsAuditNote}
                            </div>
                          )}

                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-2 font-semibold">
                              Technologies &amp; Proof Assistants
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedProject.technologies.map((t) => (
                                <span
                                  key={t}
                                  className="text-xs font-mono px-2.5 py-1 rounded border border-paper-border-strong bg-paper-bg-base text-ink-primary"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="px-4 sm:px-6 py-4 border-t-2 border-paper-border-strong bg-paper-bg-base flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                      {selectedProject.githubUrl ? (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playClick(900)}
                          className="px-4 py-2 rounded border border-paper-border-strong bg-academic-amber text-paper-bg-base font-mono text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs hover:opacity-90 transition-opacity"
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span>Open GitHub Repository</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-ink-muted font-mono text-center sm:text-left">
                          Private / Internal Research Prototype
                        </span>
                      )}

                      <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 rounded border border-paper-border-strong bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-secondary hover:text-ink-primary text-xs font-mono transition-colors cursor-pointer text-center"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )
            : null)}
      </div>
    </section>
  );
};
