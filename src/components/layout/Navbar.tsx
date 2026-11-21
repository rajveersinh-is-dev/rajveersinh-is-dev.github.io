import React, { useState, useEffect } from 'react';
import { usePreferences } from '../../context';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import {
  Menu,
  X,
  FileDown,
  BookOpen,
  Sparkles,
  Command,
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
    { label: 'About', href: '#about' },
    { label: 'Research', href: '#research-interests' },
    { label: 'Projects', href: '#projects' },
    { label: 'Preprints', href: '#preprints' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'CV', href: '#cv' },
    { label: 'Graph', href: '#connections-graph' },
    { label: 'Playground', href: '#playground' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-bg-void/90 backdrop-blur-md border-b border-border-subtle py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand identity */}
          <a
            href="#hero"
            className="flex items-center space-x-2 text-text-primary hover:text-amber-400 transition-colors group"
          >
            <div className="w-8 h-8 rounded border border-border-medium bg-bg-surface flex items-center justify-center font-mono text-xs text-amber-500 font-bold group-hover:border-amber-500/50">
              ∇
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-semibold tracking-wider text-text-primary group-hover:text-amber-400 uppercase">
                R. V. Pardeshi
              </span>
              <span className="text-[10px] text-text-muted font-mono tracking-tight hidden sm:inline">
                Mathematical Research
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 py-1 text-xs font-mono text-text-secondary hover:text-amber-400 transition-colors rounded hover:bg-bg-surface/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="hidden sm:flex items-center space-x-2">
            {/* Command Palette Trigger */}
            <button
              onClick={toggleCommandPalette}
              aria-label="Open Command Palette"
              className="px-2.5 py-1 rounded bg-bg-surface border border-border-subtle hover:border-border-highlight text-xs font-mono text-text-secondary hover:text-text-primary flex items-center space-x-1.5 transition-colors"
              title="Search and Navigation (Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5 text-amber-500" />
              <span>Palette</span>
              <kbd className="text-[10px] bg-bg-base px-1.5 py-0.5 rounded border border-border-subtle text-text-muted">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>

            {/* Reading Mode Toggle */}
            <button
              onClick={toggleReadingMode}
              aria-label={readingMode ? 'Exit Reading Mode' : 'Enable Reading Mode'}
              className={`p-1.5 rounded border text-xs transition-colors ${
                readingMode
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-bg-surface border-border-subtle hover:border-border-highlight text-text-secondary hover:text-text-primary'
              }`}
              title={readingMode ? 'Disable Reading Mode' : 'Enable Reading Mode (distraction-free)'}
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Visual Effects Toggle */}
            <button
              onClick={toggleVisualEffects}
              aria-label={visualEffectsEnabled ? 'Disable Visual Effects' : 'Enable Visual Effects'}
              className={`p-1.5 rounded border text-xs transition-colors ${
                visualEffectsEnabled
                  ? 'bg-bg-surface border-border-subtle hover:border-border-highlight text-amber-500'
                  : 'bg-bg-elevated border-border-subtle text-text-muted'
              }`}
              title={visualEffectsEnabled ? 'Pause Canvas Visuals' : 'Resume Canvas Visuals'}
            >
              {visualEffectsEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* CV Download button */}
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
              className="px-3 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:border-amber-500/60 text-xs font-mono flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              title="Download locally generated official Curriculum Vitae PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>CV (PDF)</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleCommandPalette}
              aria-label="Open Command Palette"
              className="p-1.5 rounded bg-bg-surface border border-border-subtle text-text-secondary hover:text-amber-400 sm:hidden"
            >
              <Command className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border-subtle bg-bg-surface/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3">
          <nav className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-mono rounded bg-bg-elevated text-text-secondary hover:text-amber-400 hover:bg-bg-card transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-border-subtle flex flex-col space-y-2">
            <a
              href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
              download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
              onClick={() => {
                setMobileMenuOpen(false);
                try {
                  downloadPdfCv();
                } catch {}
              }}
              className="w-full py-2 px-3 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono flex items-center justify-center space-x-2"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Official CV (PDF)</span>
            </a>

            <div className="flex items-center justify-between px-1 pt-1 text-xs font-mono text-text-muted">
              <button
                onClick={toggleReadingMode}
                className="flex items-center space-x-1.5 py-1 px-2 rounded bg-bg-elevated"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Reading Mode</span>
              </button>

              <button
                onClick={toggleVisualEffects}
                className="flex items-center space-x-1.5 py-1 px-2 rounded bg-bg-elevated"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{visualEffectsEnabled ? 'Visuals ON' : 'Visuals OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
