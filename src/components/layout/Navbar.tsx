import React, { useState, useEffect } from 'react';
import { usePreferences } from '../../context';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import {
  Menu,
  X,
  FileDown,
  BookOpen,
  Command,
  Sun,
  Moon,
  Eye,
  EyeOff
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    toggleCommandPalette,
    visualEffectsEnabled,
    toggleVisualEffects,
    readingMode,
    toggleReadingMode
  } = usePreferences();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  const navLinks = [
    { label: 'About', href: '#about', section: '§ 1' },
    { label: 'Research', href: '#research-interests', section: '§ 2' },
    { label: 'Projects', href: '#projects', section: '§ 3' },
    { label: 'Preprints', href: '#preprints', section: '§ 4' },
    { label: 'Achievements', href: '#achievements', section: '§ 5' },
    { label: 'Skills', href: '#skills', section: '§ 6' },
    { label: 'Education', href: '#education', section: '§ 7' },
    { label: 'CV', href: '#cv', section: '§ 8' },
    { label: 'Graph', href: '#connections-graph', section: '§ 9' },
    { label: 'Playground', href: '#playground', section: '§ 10' },
    { label: 'Contact', href: '#contact', section: '§ 11' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-paper-bg-base/95 dark:bg-night-bg-base/95 border-b border-paper-border-strong dark:border-night-border-strong py-2.5 shadow-xs'
          : 'bg-paper-bg-base/90 dark:bg-night-bg-base/90 border-b border-paper-border-subtle dark:border-night-border-subtle py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* ACTA MATHEMATICA Scholarly Monogram & Masthead Identity */}
          <a
            href="#hero"
            className="flex items-center space-x-2.5 text-ink-primary dark:text-night-ink-primary hover:text-academic-seal dark:hover:text-night-seal transition-colors group"
          >
            <div className="w-8 h-8 rounded-xs border border-paper-border-strong dark:border-night-border-strong bg-paper-bg-subtle dark:bg-night-bg-subtle flex items-center justify-center font-serif text-sm text-academic-seal dark:text-night-seal font-bold shadow-xs group-hover:border-academic-seal dark:group-hover:border-night-seal transition-colors">
              ∇
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-xs sm:text-sm font-bold tracking-wider text-ink-primary dark:text-night-ink-primary group-hover:text-academic-seal dark:group-hover:text-night-seal uppercase">
                  Acta Mathematica
                </span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded-xs border border-paper-border-subtle dark:border-night-border-subtle text-ink-muted dark:text-night-ink-muted hidden md:inline">
                  VOL. I
                </span>
              </div>
              <span className="text-[10px] text-ink-muted dark:text-night-ink-muted font-serif tracking-normal hidden sm:inline">
                R. V. Pardeshi • Fasciculus 2026
              </span>
            </div>
          </a>

          {/* Editorial Section Index Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Journal Sections Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2 py-1 text-xs font-serif text-ink-secondary dark:text-night-ink-secondary hover:text-academic-seal dark:hover:text-night-seal transition-colors rounded-xs hover:bg-paper-bg-subtle dark:hover:bg-night-bg-subtle"
                title={`${link.section} ${link.label}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Masthead Instrument Controls & Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            {/* Bibliographic Concordance Launcher (Ctrl+K) */}
            <button
              onClick={toggleCommandPalette}
              aria-label="Open Command Palette"
              className="px-2.5 py-1 rounded-xs bg-paper-bg-subtle dark:bg-night-bg-subtle border border-paper-border-subtle dark:border-night-border-subtle hover:border-paper-border-strong dark:hover:border-night-border-strong text-xs font-serif text-ink-secondary dark:text-night-ink-secondary hover:text-ink-primary dark:hover:text-night-ink-primary flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Search Index & Concordance (Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5 text-academic-seal dark:text-night-seal" />
              <span className="font-serif">Concordance</span>
              <kbd className="text-[10px] font-mono bg-paper-bg-elevated dark:bg-night-bg-elevated px-1.5 py-0.5 rounded-xs border border-paper-border-subtle dark:border-night-border-subtle text-ink-muted dark:text-night-ink-muted">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>

            {/* Reading Mode Toggle (Warm Archival Paper vs Deep Espresso Night Study) */}
            <button
              onClick={toggleReadingMode}
              aria-label={readingMode ? 'Exit Reading Mode' : 'Enable Reading Mode'}
              className={`p-1.5 px-2.5 rounded-xs border text-xs font-serif flex items-center space-x-1.5 transition-colors cursor-pointer ${
                readingMode
                  ? 'bg-paper-bg-elevated border-paper-border-strong text-academic-seal'
                  : 'bg-paper-bg-subtle dark:bg-night-bg-subtle border-paper-border-subtle dark:border-night-border-subtle hover:border-paper-border-strong dark:hover:border-night-border-strong text-ink-secondary dark:text-night-ink-secondary hover:text-ink-primary dark:hover:text-night-ink-primary'
              }`}
              title={
                readingMode
                  ? 'Exit Reading Mode (Return to Night Study)'
                  : 'Enable Reading Mode (Warm Archival Paper)'
              }
            >
              {readingMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-academic-seal" />
                  <span className="hidden xl:inline text-[11px] font-serif">Archival Paper</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-academic-amber dark:text-academic-amber-night" />
                  <span className="hidden xl:inline text-[11px] font-serif">Night Study</span>
                </>
              )}
            </button>

            {/* Visual Dynamics Toggle */}
            <button
              onClick={toggleVisualEffects}
              aria-label={visualEffectsEnabled ? 'Disable Visual Effects' : 'Enable Visual Effects'}
              className={`p-1.5 rounded-xs border text-xs transition-colors cursor-pointer ${
                visualEffectsEnabled
                  ? 'bg-paper-bg-subtle dark:bg-night-bg-subtle border-paper-border-subtle dark:border-night-border-subtle hover:border-paper-border-strong dark:hover:border-night-border-strong text-academic-seal dark:text-night-seal'
                  : 'bg-paper-bg-elevated dark:bg-night-bg-elevated border-paper-border-subtle dark:border-night-border-subtle text-ink-muted dark:text-night-ink-muted'
              }`}
              title={visualEffectsEnabled ? 'Pause Mathematical Canvas Dynamics' : 'Resume Mathematical Canvas Dynamics'}
            >
              {visualEffectsEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Academic Dossier / CV Vector PDF Download */}
            <a
              href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
              download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
              onClick={(e) => {
                try {
                  downloadPdfCv();
                  e.preventDefault();
                } catch {
                  // Fall back to native download of bundled PDF
                }
              }}
              className="px-2.5 py-1 rounded-xs bg-academic-seal/10 dark:bg-night-seal/10 hover:bg-academic-seal/20 dark:hover:bg-night-seal/20 text-academic-seal dark:text-night-seal border border-academic-seal/30 dark:border-night-seal/40 text-xs font-serif flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              title="Download official Academic Dossier & Curriculum Vitae (Vector PDF)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Dossier (PDF)</span>
            </a>
          </div>

          {/* Mobile Menu & Quick Concordance Launcher */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleCommandPalette}
              aria-label="Open Command Palette"
              className="p-1.5 rounded-xs bg-paper-bg-subtle dark:bg-night-bg-subtle border border-paper-border-subtle dark:border-night-border-subtle text-ink-secondary dark:text-night-ink-secondary hover:text-academic-seal sm:hidden"
            >
              <Command className="w-4 h-4 text-academic-seal dark:text-night-seal" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-xs bg-paper-bg-subtle dark:bg-night-bg-subtle border border-paper-border-subtle dark:border-night-border-subtle text-ink-secondary dark:text-night-ink-secondary hover:text-ink-primary"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Journal Index Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-paper-border-strong dark:border-night-border-strong bg-paper-bg-base/95 dark:bg-night-bg-base/95 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile Journal Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-serif rounded-xs bg-paper-bg-subtle dark:bg-night-bg-subtle text-ink-secondary dark:text-night-ink-secondary hover:text-academic-seal dark:hover:text-night-seal hover:bg-paper-bg-elevated dark:hover:bg-night-bg-elevated transition-colors border border-paper-border-subtle dark:border-night-border-subtle"
              >
                <span className="text-[10px] text-ink-muted dark:text-night-ink-muted mr-1.5 font-mono">{link.section}</span>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-paper-border-subtle dark:border-night-border-subtle flex flex-col space-y-2">
            <a
              href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
              download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
              onClick={() => {
                setMobileMenuOpen(false);
                try {
                  downloadPdfCv();
                } catch {}
              }}
              className="w-full py-2 px-3 rounded-xs bg-academic-seal/10 dark:bg-night-seal/10 text-academic-seal dark:text-night-seal border border-academic-seal/30 dark:border-night-seal/40 text-xs font-serif flex items-center justify-center space-x-2"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Official CV (PDF)</span>
            </a>

            <div className="flex items-center justify-between px-1 pt-1 text-xs font-serif text-ink-muted dark:text-night-ink-muted">
              <button
                onClick={toggleReadingMode}
                aria-label={readingMode ? 'Exit Reading Mode' : 'Enable Reading Mode'}
                className="flex items-center space-x-1.5 py-1 px-2 rounded-xs bg-paper-bg-subtle dark:bg-night-bg-subtle border border-paper-border-subtle dark:border-night-border-subtle cursor-pointer"
              >
                {readingMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-academic-seal" />
                    <span>Archival Paper</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-academic-amber" />
                    <span>Night Study</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleVisualEffects}
                aria-label={visualEffectsEnabled ? 'Disable Visual Effects' : 'Enable Visual Effects'}
                className="flex items-center space-x-1.5 py-1 px-2 rounded-xs bg-paper-bg-subtle dark:bg-night-bg-subtle border border-paper-border-subtle dark:border-night-border-subtle cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-academic-seal dark:text-night-seal" />
                <span>{visualEffectsEnabled ? 'Dynamics Active' : 'Dynamics Paused'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
