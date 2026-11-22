import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { projectsData } from '../../data';
import type { ProjectEntry } from '../../types/content';
import { ProjectVisualDemo } from '../visuals/ProjectVisualDemo';
import { copyTextToClipboard } from '../../utils/clipboard';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import {
  Layers,
  ChevronRight,
  X,
  Info,
  Link as LinkIcon,
  Check,
  BookOpen,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

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
        } else {
          setSelectedProject(null);
        }
      } else {
        // If hash navigated away from project detail, dismiss the modal
        setSelectedProject((prev) => (prev ? null : null));
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleCloseModal = () => {
    setSelectedProject(null);
    try {
      if (window.location.hash.startsWith('#project-')) {
        window.history.replaceState(null, '', '#projects');
      }
    } catch {}
    if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
    }
  };

  const handleOpenProject = (project: ProjectEntry) => {
    lastActiveElementRef.current = document.activeElement as HTMLElement;
    setSelectedProject(project);
    try {
      window.history.replaceState(null, '', `#project-${project.id}`);
    } catch {}
  };

  // Lock body scroll when project modal is open & handle ESC key & auto-focus
  useEffect(() => {
    if (selectedProject) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus close button on dialog appearance for accessibility
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
  }, [selectedProject]);

  const handleCopyProjectLink = async (project: ProjectEntry) => {
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

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              § 3
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              § 3. Computational Treatises &amp; Verified Algorithms
            </h2>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Projects &amp; Research Repositories — Mechanized Compilers, Algorithmic Lattices, and Discrete Physical Simulations
            </p>
          </div>

          {/* Filter Catalog Ribbon */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded border border-paper-border-strong bg-paper-bg-subtle self-start md:self-auto shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
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

        {/* Core Mathematical Treatises (Monographs I-V) */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-ink-muted uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-academic-amber" />
            <span className="font-semibold">Core Research Monographs (Monographs I–V)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-${project.id}`}
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
                className="rounded border border-paper-border-strong bg-paper-bg-subtle hover:border-academic-amber transition-all flex flex-col justify-between overflow-hidden group shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-academic-amber"
              >
                {/* Header Card Strip */}
                <div className="p-6 space-y-4">
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
                      <h3
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProject(project);
                        }}
                        className="font-serif text-xl font-bold text-ink-primary group-hover:text-academic-amber transition-colors cursor-pointer"
                      >
                        <span>{project.name}</span>
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
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View ${project.name} source on GitHub`}
                        className="p-1.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-secondary hover:text-academic-amber hover:border-academic-amber transition-colors cursor-pointer"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-ink-secondary font-serif leading-relaxed">
                    {project.conciseDescription}
                  </p>

                  {/* Mathematical Motivation Block */}
                  <div className="p-3.5 rounded border-l-2 border-academic-amber bg-paper-bg-base border border-paper-border-subtle font-mono text-[11px] text-ink-muted space-y-1">
                    <span className="text-academic-amber font-semibold uppercase tracking-wider text-[9px] block font-serif">
                      Theoretical Invariant &amp; Motivation:
                    </span>
                    <p className="line-clamp-2 leading-relaxed text-ink-secondary">{project.motivation}</p>
                  </div>

                  {/* Audit / Simulation Honesty Note */}
                  {project.metricsAuditNote && (
                    <div className="text-[10px] font-mono text-ink-muted flex items-center space-x-1.5 bg-paper-bg-elevated p-2 rounded border border-paper-border-subtle">
                      <Info className="w-3.5 h-3.5 text-ink-muted flex-shrink-0" />
                      <span>{project.metricsAuditNote}</span>
                    </div>
                  )}

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Strip */}
                <div className="px-6 py-3.5 border-t border-paper-border-subtle bg-paper-bg-base flex items-center justify-between">
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
                    <span>View Specifications</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
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
              <div
                key={project.id}
                id={`project-${project.id}`}
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
                    <h4
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project);
                      }}
                      className="font-serif text-lg font-bold text-ink-primary hover:text-academic-amber transition-colors cursor-pointer"
                    >
                      <span>{project.name}</span>
                    </h4>
                    <span className="text-xs text-ink-muted font-mono">{project.category}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
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
              </div>
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
                  className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain bg-black/75 backdrop-blur-xs"
                  onClick={handleCloseModal}
                >
                  <div
                    className="max-w-4xl w-full my-auto max-h-[85vh] sm:max-h-[90vh] max-h-[85dvh] sm:max-h-[90dvh] flex flex-col overflow-hidden bg-paper-bg-subtle border-2 border-paper-border-strong rounded shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header — Archival Folio Header */}
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

                    {/* Modal Body — Scholarly Specification Monograph */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
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
                    </div>

                    {/* Modal Footer */}
                    <div className="px-4 sm:px-6 py-4 border-t-2 border-paper-border-strong bg-paper-bg-base flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                      {selectedProject.githubUrl ? (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
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
