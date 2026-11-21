import React, { useState } from 'react';
import { projectsData } from '../../data';
import type { ProjectEntry } from '../../types/content';
import {
  Layers,
  ChevronRight,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);

  const categories = ['All', 'Compiler & Verification', 'Optimization & Graphs', 'Simulation & Systems'];

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

  const featuredProjects = projectsData.filter((p) => p.isFeatured && filterByCategory(p));
  const additionalProjects = projectsData.filter((p) => !p.isFeatured && filterByCategory(p));

  return (
    <section id="projects" className="py-20 border-t border-border-subtle relative bg-bg-base/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
              <span>03 // Computational Systems</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
              Projects & Research Repositories
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-bg-surface border border-border-subtle self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-bg-void font-bold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Top Projects (Priority 1-5) */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-text-muted uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Featured Core Implementations (Priority 1–5)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-${project.id}`}
                className="rounded-lg bg-bg-surface border border-border-medium hover:border-amber-500/60 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                {/* Header Card Strip */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-amber-500 font-bold">
                          #{project.priority}
                        </span>
                        <h3 className="font-mono text-lg font-bold text-text-primary group-hover:text-amber-400 transition-colors">
                          {project.name}
                        </h3>
                      </div>
                      <span className="text-xs text-text-muted font-mono block mt-1">
                        {project.category}
                      </span>
                    </div>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.name} source on GitHub`}
                        className="p-1.5 rounded bg-bg-elevated text-text-secondary hover:text-amber-400 hover:bg-bg-card transition-colors"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    {project.conciseDescription}
                  </p>

                  {/* Mathematical / Technical Motivation Snapshot */}
                  <div className="p-3 rounded bg-bg-base/70 border border-border-subtle font-mono text-[11px] text-text-muted space-y-1">
                    <span className="text-amber-400/90 font-semibold uppercase tracking-wider text-[9px] block">
                      Core Motivation:
                    </span>
                    <p className="line-clamp-2">{project.motivation}</p>
                  </div>

                  {/* Audit / Simulation honesty note if present */}
                  {project.metricsAuditNote && (
                    <div className="text-[10px] font-mono text-text-dim flex items-center space-x-1.5 bg-bg-elevated/50 p-2 rounded border border-border-subtle">
                      <Info className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span>{project.metricsAuditNote}</span>
                    </div>
                  )}

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-3 border-t border-border-subtle bg-bg-elevated/40 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-text-muted">
                    {project.status}
                  </span>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-mono text-amber-500 hover:text-amber-400 flex items-center space-x-1 font-semibold group/btn"
                  >
                    <span>View Specifications</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Research Repositories */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-text-muted uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Additional Research & Algorithmic Repositories</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalProjects.map((project) => (
              <div
                key={project.id}
                id={`project-${project.id}`}
                className="p-5 rounded-lg bg-bg-surface border border-border-subtle hover:border-border-medium transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-mono text-base font-bold text-text-primary hover:text-amber-400 transition-colors">
                      {project.name}
                    </h4>
                    <span className="text-xs text-text-muted font-mono">{project.category}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-text-muted hover:text-amber-400 transition-colors"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
                      title="View Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-text-secondary font-sans leading-relaxed">
                  {project.conciseDescription}
                </p>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-dim"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Project details for ${selectedProject.name}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="w-full max-w-3xl bg-bg-surface border border-border-medium rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-border-subtle bg-bg-elevated flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-amber-500 font-bold">
                      [SPECIFICATION RECORD]
                    </span>
                    <span className="text-xs text-text-muted font-mono">
                      Status: {selectedProject.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-mono text-text-primary mt-1">
                    {selectedProject.name}
                  </h3>
                  <p className="text-xs text-text-muted font-mono">
                    {selectedProject.category}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded hover:bg-bg-card text-text-muted hover:text-text-primary"
                  aria-label="Close details dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-500 mb-2 font-semibold">
                    Description & Scope
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed font-sans">
                    {selectedProject.conciseDescription}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-500 mb-2 font-semibold">
                    Research & Engineering Motivation
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-mono bg-bg-base p-3.5 rounded border border-border-subtle">
                    {selectedProject.motivation}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-500 mb-2 font-semibold">
                    Key Technical Ideas & Structural Principles
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.keyIdeas.map((idea, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-text-secondary flex items-start space-x-2 font-mono"
                      >
                        <span className="text-amber-500 font-bold">[{idx + 1}]</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedProject.metricsAuditNote && (
                  <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 font-mono">
                    <span className="font-bold">Metric Transparency: </span>
                    {selectedProject.metricsAuditNote}
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2 font-semibold">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-bg-elevated border border-border-medium text-text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-border-subtle bg-bg-elevated flex items-center justify-between">
                {selectedProject.githubUrl ? (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 text-bg-void font-mono text-xs font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>Open GitHub Repository</span>
                  </a>
                ) : (
                  <span className="text-xs text-text-muted font-mono">
                    Private / Internal Research Prototype
                  </span>
                )}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded bg-bg-surface border border-border-subtle hover:border-border-highlight text-text-secondary hover:text-text-primary text-xs font-mono"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
