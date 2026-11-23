import React, { useState, useEffect } from 'react';
import { usePreferences } from '../../context';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import {
  Menu,
  X,
  FileDown,
  Command,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Terminal as TerminalIcon
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about', section: '§ 1' },
  { label: 'Research', href: '#research-interests', section: '§ 2' },
  { label: 'Projects', href: '#projects', section: '§ 3' },
  { label: 'Preprints', href: '#preprints', section: '§ 4' },
  { label: 'Achievements', href: '#achievements', section: '§ 5' },
  { label: 'Skills', href: '#skills', section: '§ 6' },
  { label: 'Curriculum', href: '#education', section: '§ 7' },
  { label: 'Graph', href: '#connections-graph', section: '§ 10' },
  { label: 'Playground', href: '#playground', section: '§ 11' },
  { label: 'Contact', href: '#contact', section: '§ 12' },
];

export const Navbar: React.FC = () => {
  const {
    toggleCommandPalette,
    visualEffectsEnabled,
    toggleVisualEffects,
    theme,
    cycleTheme,
    soundEnabled,
    toggleSound,
    toggleTerminal,
    playClick
  } = usePreferences();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const navLinks = NAV_LINKS;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionElements = NAV_LINKS
        .map((l) => ({ id: l.href.slice(1), el: document.getElementById(l.href.slice(1)) }))
        .filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

      const scrollPosition = window.scrollY + 140;
      let currentSection = sectionElements[0]?.id || 'about';

      for (const { id, el } of sectionElements) {
        if (el.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-paper-bg-base/95 border-b border-paper-border-strong py-2 shadow-xs'
          : 'bg-paper-bg-base/90 border-b border-paper-border-subtle py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Scholarly Monogram & Masthead Identity */}
          <a
            href="#hero"
            onClick={() => playClick(800)}
            className="flex items-center space-x-2.5 text-ink-primary hover:text-ink-primary transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xs border border-paper-border-strong bg-paper-bg-subtle flex items-center justify-center font-serif text-sm text-academic-seal font-bold shadow-xs transition-colors">
              ∇
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-xs sm:text-sm font-bold tracking-wider text-ink-primary uppercase">
                  Pardeshi Archive
                </span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded-xs border border-paper-border-subtle text-ink-muted hidden md:inline">
                  VOL. I
                </span>
              </div>
              <span className="text-[10px] text-ink-muted font-serif tracking-normal hidden sm:inline">
                R. V. Pardeshi • Mathematical Research
              </span>
            </div>
          </a>

          {/* Editorial Section Index Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1" aria-label="Journal Sections Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => playClick(850)}
                  className={`px-2 py-1 text-xs font-serif transition-colors rounded-xs relative cursor-pointer ${
                    isActive
                      ? 'text-ink-primary font-bold'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-bg-subtle'
                  }`}
                  title={`${link.section} ${link.label}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-academic-seal rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Masthead Instrument Controls & Actions */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {/* Mathematical Terminal (REPL) Launcher */}
            <button
              onClick={toggleTerminal}
              aria-label="Open Mathematical Terminal"
              className="px-2 py-1 rounded-xs bg-paper-bg-subtle border border-paper-border-subtle hover:border-academic-amber text-xs font-mono text-ink-secondary hover:text-ink-primary flex items-center space-x-1 transition-colors cursor-pointer"
              title="Mathematical Terminal / REPL (` or Ctrl+\)"
            >
              <TerminalIcon className="w-3.5 h-3.5 text-academic-amber" />
              <span className="hidden xl:inline">REPL</span>
              <kbd className="text-[9px] font-mono bg-paper-bg-elevated px-1 rounded-xs border border-paper-border-subtle text-ink-muted">
                `
              </kbd>
            </button>

            {/* Bibliographic Concordance Launcher (Ctrl+K) */}
            <button
              onClick={toggleCommandPalette}
              aria-label="Open Command Palette"
              className="px-2 py-1 rounded-xs bg-paper-bg-subtle border border-paper-border-subtle hover:border-paper-border-strong text-xs font-serif text-ink-secondary hover:text-ink-primary flex items-center space-x-1 transition-colors cursor-pointer"
              title="Search Index & Concordance (Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5 text-ink-muted" />
              <span className="font-serif hidden xl:inline">Index</span>
              <kbd className="text-[10px] font-mono bg-paper-bg-elevated px-1 py-0.2 rounded-xs border border-paper-border-subtle text-ink-muted">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>

            {/* Subtle Web Audio Feedback Mute Toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute Audio Click Feedback' : 'Enable Audio Click Feedback'}
              className={`p-1.5 rounded-xs border text-xs transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-paper-bg-subtle border-paper-border-subtle hover:border-paper-border-strong text-ink-primary'
                  : 'bg-paper-bg-elevated border-paper-border-subtle text-ink-muted'
              }`}
              title={soundEnabled ? 'Web Audio Feedback Active (Click to Mute)' : 'Web Audio Feedback Muted (Click to Unmute)'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-academic-amber" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Aesthetic Mode Toggle: Night Study -> Archival Paper -> Amber CRT -> Night Study */}
            <button
              onClick={cycleTheme}
              aria-label={
                theme === 'night'
                  ? 'Switch to Warm Archival Paper Mode'
                  : theme === 'paper'
                  ? 'Exit Reading Mode (Switch to Amber Phosphor CRT Mode)'
                  : 'Switch to Deep Espresso Night Mode'
              }
              className={`p-1.5 px-2 rounded-xs border text-xs font-serif flex items-center space-x-1 transition-colors cursor-pointer ${
                theme === 'paper'
                  ? 'bg-paper-bg-elevated border-paper-border-strong text-ink-primary'
                  : theme === 'amber-crt'
                  ? 'bg-[#1a1408] border-[#805800] text-[#ffd24d]'
                  : 'bg-paper-bg-subtle border-paper-border-subtle hover:border-paper-border-strong text-ink-secondary hover:text-ink-primary'
              }`}
              title={
                theme === 'night'
                  ? 'Current: Night Study (Click to switch to Archival Paper)'
                  : theme === 'paper'
                  ? 'Current: Archival Paper (Click to switch to Amber Phosphor CRT)'
                  : 'Current: DEC VT220 Amber CRT (Click to switch to Night Study)'
              }
            >
              {theme === 'paper' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-academic-amber" />
                  <span className="hidden xl:inline text-[11px] font-serif">Paper</span>
                </>
              ) : theme === 'amber-crt' ? (
                <>
                  <TerminalIcon className="w-3.5 h-3.5 text-academic-amber" />
                  <span className="hidden xl:inline text-[11px] font-serif">Amber CRT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-academic-amber" />
                  <span className="hidden xl:inline text-[11px] font-serif">Study</span>
                </>
              )}
            </button>

            {/* Visual Dynamics Toggle */}
            <button
              onClick={toggleVisualEffects}
              aria-label={visualEffectsEnabled ? 'Disable Visual Effects' : 'Enable Visual Effects'}
              className={`p-1.5 rounded-xs border text-xs transition-colors cursor-pointer ${
                visualEffectsEnabled
                  ? 'bg-paper-bg-subtle border-paper-border-subtle hover:border-paper-border-strong text-ink-primary'
                  : 'bg-paper-bg-elevated border-paper-border-subtle text-ink-muted'
              }`}
              title={visualEffectsEnabled ? 'Pause Mathematical Canvas Dynamics' : 'Resume Mathematical Canvas Dynamics'}
            >
              {visualEffectsEnabled ? <Eye className="w-4 h-4 text-ink-secondary" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Academic Dossier / CV Vector PDF Download */}
            <a
              href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
              download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
              onClick={(e) => {
                playClick(900);
                try {
                  downloadPdfCv();
                  e.preventDefault();
                } catch {
                  // Fall back to native download of bundled PDF
                }
              }}
              className="px-2.5 py-1 rounded-xs bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-primary border border-paper-border-strong text-xs font-serif flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
              title="Download official Academic Dossier & Curriculum Vitae (Vector PDF)"
            >
              <FileDown className="w-3.5 h-3.5 text-ink-muted" />
              <span>Dossier</span>
            </a>
          </div>

          {/* Mobile Menu & Quick Controls */}
          <div className="flex items-center space-x-1.5 lg:hidden">
            <button
              onClick={toggleTerminal}
              aria-label="Open Mathematical Terminal"
              className="p-1.5 rounded-xs bg-paper-bg-subtle border border-paper-border-subtle text-academic-amber hover:text-ink-primary"
              title="Mathematical Terminal"
            >
              <TerminalIcon className="w-4 h-4" />
            </button>

            <button
              onClick={toggleSound}
              aria-label="Toggle Mute"
              className="p-1.5 rounded-xs bg-paper-bg-subtle border border-paper-border-subtle text-ink-secondary hover:text-ink-primary"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-academic-amber" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleCommandPalette}
              aria-label="Open Command Palette"
              className="p-1.5 rounded-xs bg-paper-bg-subtle border border-paper-border-subtle text-ink-secondary hover:text-ink-primary sm:hidden"
            >
              <Command className="w-4 h-4 text-ink-muted" />
            </button>

            <button
              onClick={() => {
                playClick(750);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Toggle menu"
              className="p-2 rounded-xs bg-paper-bg-subtle border border-paper-border-subtle text-ink-secondary hover:text-ink-primary cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Journal Index Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-paper-border-strong bg-paper-bg-base/95 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile Journal Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    playClick(850);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-xs font-serif rounded-xs transition-colors border cursor-pointer ${
                    isActive
                      ? 'bg-paper-bg-elevated text-ink-primary border-l-2 border-l-academic-seal border-paper-border-strong font-bold'
                      : 'bg-paper-bg-subtle text-ink-secondary hover:text-ink-primary hover:bg-paper-bg-elevated border-paper-border-subtle'
                  }`}
                >
                  <span className="text-[10px] text-ink-muted mr-1.5 font-mono">{link.section}</span>
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-paper-border-subtle flex flex-col space-y-2">
            <a
              href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
              download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
              onClick={() => {
                playClick(900);
                setMobileMenuOpen(false);
                try {
                  downloadPdfCv();
                } catch {}
              }}
              className="w-full py-2 px-3 rounded-xs bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-primary border border-paper-border-strong text-xs font-serif flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-ink-muted" />
              <span>Download Official CV (PDF)</span>
            </a>

            <div className="flex items-center justify-between px-1 pt-1 text-xs font-serif text-ink-muted">
              <button
                onClick={cycleTheme}
                aria-label={
                  theme === 'night'
                    ? 'Switch to Warm Archival Paper Mode'
                    : theme === 'paper'
                    ? 'Exit Reading Mode (Switch to Amber Phosphor CRT Mode)'
                    : 'Switch to Deep Espresso Night Mode'
                }
                className="flex items-center space-x-1.5 py-1 px-2 rounded-xs bg-paper-bg-subtle border border-paper-border-subtle cursor-pointer"
              >
                {theme === 'paper' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-academic-amber" />
                    <span>Archival Paper</span>
                  </>
                ) : theme === 'amber-crt' ? (
                  <>
                    <TerminalIcon className="w-3.5 h-3.5 text-academic-amber" />
                    <span>Amber CRT</span>
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
                className="flex items-center space-x-1.5 py-1 px-2 rounded-xs bg-paper-bg-subtle border border-paper-border-subtle cursor-pointer"
              >
                {visualEffectsEnabled ? <Eye className="w-3.5 h-3.5 text-academic-amber" /> : <EyeOff className="w-3.5 h-3.5 text-ink-muted" />}
                <span>{visualEffectsEnabled ? 'Dynamics Active' : 'Dynamics Paused'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
