import React from 'react';
import { profileData, contactData } from '../../data';
import { ArrowUp, ExternalLink, ShieldCheck, Mail, BookOpen } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t-2 border-paper-border-strong bg-paper-bg-subtle pt-16 pb-12 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-paper-border-subtle">
          {/* Identity & Scope / Journal Colophon */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded border border-academic-seal/40 bg-academic-seal/10 flex items-center justify-center font-serif text-sm text-academic-seal font-bold">
                ∇
              </div>
              <div>
                <span className="font-serif text-base font-bold tracking-tight text-ink-primary uppercase block">
                  Acta Mathematica &amp; Computatoria
                </span>
                <span className="text-[10px] font-mono tracking-widest text-academic-seal uppercase font-semibold">
                  Vol. I, Fasc. 2026 • Research Archive
                </span>
              </div>
            </div>

            <p className="font-serif text-xs text-ink-secondary leading-relaxed max-w-md">
              Research archive of <span className="text-ink-primary font-semibold">{profileData.fullName}</span>, Independent Mathematical Researcher based in {profileData.location} (Age: {profileData.age}). Dedicated to theoretical mathematics, algorithm design, formal verification in Lean 4, and computational structures.
            </p>

            <div className="flex items-center space-x-2 text-xs font-mono text-academic-seal pt-1 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Offline-First Archive • Zero External CDNs or Runtime Trackers</span>
            </div>
          </div>

          {/* Core Navigation / Journal Index */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold text-ink-primary uppercase tracking-wider flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-academic-seal" />
              <span>Archival Sections</span>
            </div>
            <ul className="space-y-1 text-xs font-serif text-ink-secondary">
              <li>
                <a href="#about" className="hover:text-academic-seal transition-colors">
                  § 1. Foundational Profile &amp; Philosophy
                </a>
              </li>
              <li>
                <a href="#research-interests" className="hover:text-academic-seal transition-colors">
                  § 2. Theoretical Program &amp; Axiomatic Classification
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-academic-seal transition-colors">
                  § 3. Computational Treatises &amp; Repositories
                </a>
              </li>
              <li>
                <a href="#preprints" className="hover:text-academic-seal transition-colors">
                  § 4. Archival Manuscripts &amp; Preprints
                </a>
              </li>
              <li>
                <a href="#achievements" className="hover:text-academic-seal transition-colors">
                  § 5. Verified Academic Milestones &amp; Honors
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-academic-seal transition-colors">
                  § 6. Methodological Repertoire &amp; Tools
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-academic-seal transition-colors">
                  § 7. Academic Enrolment &amp; Credentials
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-academic-seal transition-colors">
                  § 8. Scholarly Chronology
                </a>
              </li>
              <li>
                <a href="#connections-graph" className="hover:text-academic-seal transition-colors">
                  § 9. Harmonic Topological Lattice
                </a>
              </li>
              <li>
                <a href="#playground" className="hover:text-academic-seal transition-colors">
                  § The Computational Workbench (Laboratorium)
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-academic-seal transition-colors">
                  § 10. Academic Correspondence
                </a>
              </li>
            </ul>
          </div>

          {/* Verified Profiles */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-bold text-ink-primary uppercase tracking-wider">
              Archival Profiles
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href={contactData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-ink-secondary hover:text-academic-seal transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-academic-seal" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-ink-muted" />
                </a>
              </li>
              <li>
                <a
                  href={contactData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-ink-secondary hover:text-academic-seal transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-academic-seal" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-ink-muted" />
                </a>
              </li>
              <li>
                <a
                  href={contactData.orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-ink-secondary hover:text-academic-seal transition-colors"
                >
                  <span className="text-[10px] px-1 bg-academic-seal/10 text-academic-seal rounded font-bold">iD</span>
                  <span>ORCID Registry</span>
                  <ExternalLink className="w-3 h-3 text-ink-muted" />
                </a>
              </li>
              <li>
                <a
                  href={contactData.kaggleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-ink-secondary hover:text-academic-seal transition-colors"
                >
                  <span className="text-[10px] font-bold text-academic-amber font-serif">K</span>
                  <span>Kaggle (7th Ranked)</span>
                  <ExternalLink className="w-3 h-3 text-ink-muted" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactData.email}`}
                  className="flex items-center space-x-2 text-ink-secondary hover:text-academic-seal transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-academic-seal" />
                  <span className="truncate">{contactData.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon & Bottom bar */}
        <div className="space-y-4">
          <p className="font-serif italic text-xs text-ink-muted leading-relaxed max-w-3xl">
            Colophon: Typeset in classical cascading book serif and mathematical symbol systems without external remote font CDNs, trackers, or commercial cookies. All manuscripts are independently authored and deposited under immutable Zenodo accessions.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted font-mono space-y-4 sm:space-y-0 border-t border-paper-border-subtle">
            <div>
              © 2026 {profileData.fullName}. All rights reserved.
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Return to top of page"
              className="flex items-center space-x-2 px-3 py-1.5 rounded border border-paper-border-strong hover:border-academic-seal bg-paper-bg-base text-ink-secondary hover:text-academic-seal transition-colors font-medium"
            >
              <span>Return to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-academic-seal" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
