import React from 'react';
import { profileData, contactData } from '../../data';
import { ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';

export const Footer: React.FC = () => {
  const navQuickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Research', href: '#research-interests' },
    { label: 'Projects', href: '#projects' },
    { label: 'Preprints', href: '#preprints' },
    { label: 'Honors', href: '#achievements' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'CV', href: '#cv' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Graph', href: '#connections-graph' },
    { label: 'Workbench', href: '#playground' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="w-full bg-paper-bg-base text-ink-secondary py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* One thin oxford-rule above */}
        <hr className="oxford-rule-thin" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Name + Professional Identity in Serif (Small, Left) */}
          <div className="flex items-center space-x-2 text-left">
            <span className="font-serif font-bold text-sm text-ink-primary">
              {profileData.fullName}
            </span>
            <span className="text-xs font-serif text-ink-muted">
              — {profileData.professionalIdentity}
            </span>
          </div>

          {/* Section Quick-Links in One Line (Monospace, Center) */}
          <nav
            aria-label="Footer quick links"
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-mono text-ink-muted"
          >
            {navQuickLinks.map((link, idx) => (
              <React.Fragment key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-ink-primary transition-colors"
                >
                  {link.label}
                </a>
                {idx < navQuickLinks.length - 1 && (
                  <span className="text-paper-border-strong select-none">•</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Social Profile Icons (Right-Aligned) */}
          <div className="flex items-center space-x-4">
            <a
              href={contactData.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-ink-primary transition-colors"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href={contactData.orcidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-ink-primary transition-colors flex items-center"
              title="ORCID Profile"
              aria-label="ORCID Profile"
            >
              <span className="text-[10px] font-mono px-1 py-0.2 rounded border border-paper-border-subtle bg-paper-bg-subtle font-bold">
                iD
              </span>
            </a>

            <a
              href={contactData.kaggleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-ink-primary transition-colors flex items-center font-serif text-sm font-bold"
              title="Kaggle Profile"
              aria-label="Kaggle Profile"
            >
              <span className="text-academic-amber">K</span>
            </a>

            <a
              href={contactData.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-ink-primary transition-colors"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${contactData.email}`}
              className="text-ink-muted hover:text-ink-primary transition-colors"
              title="Email Contact"
              aria-label="Email Contact"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
