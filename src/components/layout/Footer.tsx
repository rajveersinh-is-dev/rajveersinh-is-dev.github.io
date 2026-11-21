import React from 'react';
import { profileData, contactData } from '../../data';
import { ArrowUp, ExternalLink, ShieldCheck, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border-subtle bg-bg-surface/60 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-border-subtle">
          {/* Identity & Scope */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded border border-border-medium bg-bg-base flex items-center justify-center font-mono text-xs text-amber-500 font-bold">
                ∇
              </div>
              <span className="font-mono text-sm font-semibold tracking-wider text-text-primary uppercase">
                {profileData.fullName}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md font-mono">
              Independent Mathematical Researcher — {profileData.location} (Age: {profileData.age}). Dedicated to theoretical mathematics, algorithm design, formal verification, and computational structures.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-amber-400/90 pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Offline-First Architecture • Zero External Runtime Dependencies</span>
            </div>
          </div>

          {/* Core Navigation */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold text-text-primary uppercase tracking-wider">
              Sections
            </div>
            <ul className="space-y-1.5 text-xs font-mono text-text-muted">
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  01 // About & Philosophy
                </a>
              </li>
              <li>
                <a href="#research-interests" className="hover:text-amber-400 transition-colors">
                  02 // Research Interests
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-amber-400 transition-colors">
                  03 // Computational Projects
                </a>
              </li>
              <li>
                <a href="#preprints" className="hover:text-amber-400 transition-colors">
                  04 // Research Preprints
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-amber-400 transition-colors">
                  05 // Technical Landscape
                </a>
              </li>
              <li>
                <a href="#playground" className="hover:text-amber-400 transition-colors">
                  06 // Mathematical Playground
                </a>
              </li>
            </ul>
          </div>

          {/* Verified Profiles */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold text-text-primary uppercase tracking-wider">
              Verified Profiles
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href={contactData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-amber-400 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-text-dim" />
                </a>
              </li>
              <li>
                <a
                  href={contactData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-amber-400 transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-text-dim" />
                </a>
              </li>
              <li>
                <a
                  href={contactData.orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-amber-400 transition-colors"
                >
                  <span className="text-[10px] px-1 bg-amber-500/20 text-amber-400 rounded">iD</span>
                  <span>ORCID</span>
                  <ExternalLink className="w-3 h-3 text-text-dim" />
                </a>
              </li>
              <li>
                <a
                  href={contactData.kaggleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-amber-400 transition-colors"
                >
                  <span className="text-[10px] font-bold text-amber-500">K</span>
                  <span>Kaggle (7th Ranked)</span>
                  <ExternalLink className="w-3 h-3 text-text-dim" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactData.email}`}
                  className="flex items-center space-x-2 text-text-secondary hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{contactData.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-dim font-mono space-y-4 sm:space-y-0">
          <div>
            © 2026 {profileData.fullName}. All rights reserved. Built offline-first.
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Return to top of page"
            className="flex items-center space-x-2 px-3 py-1.5 rounded bg-bg-elevated hover:bg-bg-card border border-border-subtle text-text-secondary hover:text-amber-400 transition-colors"
          >
            <span>Return to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>
      </div>
    </footer>
  );
};
