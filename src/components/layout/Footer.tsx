import React from 'react';
import { profileData, contactData } from '../../data';
import { usePreferences } from '../../context';
import { ExternalLink, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';

export const Footer: React.FC = () => {
  const { theme, setTheme, playClick } = usePreferences();

  const navQuickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Research', href: '#research-interests' },
    { label: 'Projects', href: '#projects' },
    { label: 'Preprints', href: '#preprints' },
    { label: 'Honors', href: '#achievements' },
    { label: 'Skills', href: '#skills' },
    { label: 'Curriculum', href: '#education' },
    { label: 'CV', href: '#cv' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Graph', href: '#connections-graph' },
    { label: 'Workbench', href: '#playground' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToTop = () => {
    playClick(950);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-paper-bg-base text-ink-secondary py-12 mt-20 border-t border-paper-border-strong select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Masthead Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-paper-border-subtle">
          {/* Identity & Mission */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-base text-ink-primary">
                {profileData.fullName}
              </span>
              <span className="text-xs font-mono text-ink-muted px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-subtle">
                Age {profileData.age} • Pune, India
              </span>
            </div>
            <p className="font-serif italic text-xs text-ink-secondary max-w-xl">
              "{profileData.tagline}"
            </p>
          </div>

          {/* Theme Indicator & Quick Selector */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-ink-muted text-[11px] uppercase tracking-wider font-semibold">Themes:</span>
            <div className="inline-flex rounded border border-paper-border-strong bg-paper-bg-subtle p-0.5">
              <button
                onClick={() => {
                  playClick(800);
                  setTheme('night');
                }}
                className={`px-2.5 py-1 rounded-xs transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  theme === 'night'
                    ? 'bg-paper-bg-elevated text-ink-primary font-bold shadow-xs'
                    : 'text-ink-muted hover:text-ink-secondary'
                }`}
                title="Switch to Night Study Mode"
              >
                <span>{theme === 'night' ? '◉' : '○'}</span>
                <span>Night Study</span>
              </button>

              <button
                onClick={() => {
                  playClick(820);
                  setTheme('paper');
                }}
                className={`px-2.5 py-1 rounded-xs transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  theme === 'paper'
                    ? 'bg-paper-bg-elevated text-ink-primary font-bold shadow-xs'
                    : 'text-ink-muted hover:text-ink-secondary'
                }`}
                title="Switch to Archival Paper Mode"
              >
                <span>{theme === 'paper' ? '◉' : '○'}</span>
                <span>Archival Paper</span>
              </button>

              <button
                onClick={() => {
                  playClick(840);
                  setTheme('amber-crt');
                }}
                className={`px-2.5 py-1 rounded-xs transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  theme === 'amber-crt'
                    ? 'bg-[#1a1408] text-[#ffd24d] border border-[#805800] font-bold shadow-xs'
                    : 'text-ink-muted hover:text-[#ffd24d]'
                }`}
                title="Switch to DEC VT220 Amber Phosphor CRT Mode"
              >
                <span>{theme === 'amber-crt' ? '◉' : '○'}</span>
                <span>Amber CRT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Grid & Socials */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Section Quick-Links */}
          <nav
            aria-label="Footer quick links"
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-ink-muted"
          >
            {navQuickLinks.map((link, idx) => (
              <React.Fragment key={link.href}>
                <a
                  href={link.href}
                  onClick={() => playClick(750)}
                  className="hover:text-academic-amber transition-colors"
                >
                  {link.label}
                </a>
                {idx < navQuickLinks.length - 1 && (
                  <span className="text-paper-border-strong select-none">•</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Social Links & Back To Top */}
          <div className="flex items-center space-x-4 shrink-0">
            <a
              href={contactData.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted hover:text-academic-amber hover:border-academic-amber transition-colors"
              title="GitHub Profile (rajveersinh-is-dev)"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href={contactData.orcidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted hover:text-academic-amber hover:border-academic-amber transition-colors flex items-center"
              title="ORCID Archival Record"
              aria-label="ORCID Archival Record"
            >
              <span className="text-[10px] font-mono px-0.5 font-bold">iD</span>
            </a>

            <a
              href={contactData.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded border border-paper-border-subtle bg-paper-bg-subtle text-ink-muted hover:text-academic-amber hover:border-academic-amber transition-colors"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="px-2.5 py-1 rounded border border-paper-border-strong bg-paper-bg-subtle hover:border-academic-amber hover:text-academic-amber text-ink-primary font-mono text-xs flex items-center space-x-1 transition-colors cursor-pointer"
              title="Scroll back to top of monograph"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-4 border-t border-paper-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-ink-muted">
          <div>
            © 2026 {profileData.fullName} • Pune, Maharashtra, India • All rights reserved.
          </div>
          <div className="flex items-center space-x-3">
            <span>React 19 • TypeScript • Vite • Tailwind CSS</span>
            <span>•</span>
            <a
              href="https://github.com/rajveersinh-is-dev/rajveersinh-is-dev.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-amber hover:underline flex items-center space-x-1"
            >
              <span>Source on GitHub</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
