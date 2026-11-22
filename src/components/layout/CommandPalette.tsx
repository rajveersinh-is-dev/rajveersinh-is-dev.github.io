import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePreferences } from '../../context';
import { projectsData, publicationsData, contactData } from '../../data';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import { copyTextToClipboard } from '../../utils/clipboard';
import {
  Search,
  BookOpen,
  FolderGit2,
  FileText,
  Mail,
  Eye,
  Sliders,
  ExternalLink,
  GraduationCap,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    visualEffectsEnabled,
    toggleVisualEffects,
    readingMode,
    toggleReadingMode
  } = usePreferences();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navigateToSection = useCallback((sectionId: string) => {
    setCommandPaletteOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [setCommandPaletteOpen]);

  const commandItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [
      // Sections — Formal Journal Landmarks
      {
        id: 'sec-hero',
        category: 'Index',
        title: 'Title Plate & Frontispiece',
        subtitle: 'Annals volume, issue metadata, and research abstract',
        icon: <Compass className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('hero'),
      },
      {
        id: 'sec-about',
        category: 'Index',
        title: 'About & Research Philosophy',
        subtitle: 'Scholarly manifesto, intellectual trajectory, and methodology',
        icon: <BookOpen className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('about'),
      },
      {
        id: 'sec-research',
        category: 'Index',
        title: 'Research Program & Axiomatic Areas',
        subtitle: 'Persistent homology, combinatorial lattices, and mechanized proofs',
        icon: <BookOpen className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('research-interests'),
      },
      {
        id: 'sec-projects',
        category: 'Index',
        title: 'Computational Treatises & Verified Algorithms',
        subtitle: 'NumLang compiler, Omni toolkit, hydraulic modeling, and audit suites',
        icon: <FolderGit2 className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('projects'),
      },
      {
        id: 'sec-preprints',
        category: 'Index',
        title: 'Archival Manuscripts & Preprints',
        subtitle: 'Zenodo deposited independent manuscripts with MSC2020 codes',
        icon: <FileText className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('preprints'),
      },
      {
        id: 'sec-achievements',
        category: 'Index',
        title: 'Honors & Verified Milestones',
        subtitle: 'Kaggle Squares in Squares (7th ongoing) and SOF IMO medals',
        icon: <ShieldCheck className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('achievements'),
      },
      {
        id: 'sec-skills',
        category: 'Index',
        title: 'Technical Landscape & Mathematical Tools',
        subtitle: 'Verified intermediate competencies across Lean 4, Rust, Python, etc.',
        icon: <Sliders className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('skills'),
      },
      {
        id: 'sec-education',
        category: 'Index',
        title: 'Education & Institutional Credentials',
        subtitle: 'IIT Madras (BSc Aerospace Enrolled) & Eon Gyanankur (Class XII)',
        icon: <GraduationCap className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('education'),
      },
      {
        id: 'sec-cv',
        category: 'Index',
        title: 'Curriculum Vitae & Academic Dossier',
        subtitle: 'Download official vector PDF or inspect Markdown source',
        icon: <FileText className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('cv'),
      },
      {
        id: 'sec-timeline',
        category: 'Index',
        title: 'Scholarly Chronology',
        subtitle: 'Chronological timeline of academic milestones and research discoveries',
        icon: <ArrowRight className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('timeline'),
      },
      {
        id: 'sec-connections',
        category: 'Index',
        title: 'Harmonic Topological Lattice',
        subtitle: 'Interactive network mapping mathematical areas, treatises, and concepts',
        icon: <Compass className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('connections-graph'),
      },
      {
        id: 'sec-playground',
        category: 'Index',
        title: 'The Computational Workbench / Laboratorium Mathematicum',
        subtitle: 'Plates I–IV: Lorenz attractor, cellular automata, Julia dynamics, simplicial homology',
        icon: <Compass className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('playground'),
      },
      {
        id: 'sec-contact',
        category: 'Index',
        title: 'Academic Correspondence & Contact',
        subtitle: 'Direct email channel and verified academic repositories',
        icon: <Mail className="w-4 h-4 text-academic-amber" />,
        action: () => navigateToSection('contact'),
      },

      // Actions & Study Preferences
      {
        id: 'act-download-cv',
        category: 'Dossier',
        title: 'Download Curriculum Vitae (PDF)',
        subtitle: 'Locally generated vector PDF document without remote dependencies',
        icon: <FileText className="w-4 h-4 text-academic-amber" />,
        action: () => {
          setCommandPaletteOpen(false);
          downloadPdfCv();
        },
      },
      {
        id: 'act-toggle-visuals',
        category: 'Action',
        title: visualEffectsEnabled ? 'Disable Visual Effects' : 'Enable Visual Effects',
        subtitle: `Currently: ${visualEffectsEnabled ? 'Active' : 'Disabled'}`,
        icon: <Eye className="w-4 h-4 text-academic-amber" />,
        action: () => {
          toggleVisualEffects();
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'act-toggle-reading-mode',
        category: 'Action',
        title: readingMode ? 'Exit Reading Mode' : 'Enter Reading Mode',
        subtitle: `Currently: ${readingMode ? 'Active (Minimal Animations)' : 'Normal Mode'}`,
        icon: <BookOpen className="w-4 h-4 text-academic-amber" />,
        action: () => {
          toggleReadingMode();
          setCommandPaletteOpen(false);
        },
      },
    ];

    // Add Treatises / Projects
    projectsData.forEach((proj) => {
      items.push({
        id: `proj-${proj.id}`,
        category: 'Treatise',
        title: proj.name,
        subtitle: `${proj.category} — ${proj.technologies.slice(0, 3).join(', ')}`,
        icon: <FolderGit2 className="w-4 h-4 text-academic-amber" />,
        action: () => {
          setCommandPaletteOpen(false);
          window.location.hash = `#project-${proj.id}`;
          const el = document.getElementById('projects');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        },
      });
    });

    // Add Preprints
    publicationsData.forEach((pub) => {
      items.push({
        id: `pub-${pub.id}`,
        category: 'Preprint',
        title: pub.title,
        subtitle: `Zenodo Accession — ${pub.researchArea}`,
        icon: <ExternalLink className="w-4 h-4 text-academic-amber" />,
        action: () => {
          setCommandPaletteOpen(false);
          const el = document.getElementById('preprints');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        },
      });
    });

    // Add Epistolary / Contact Action
    items.push({
      id: 'contact-email',
      category: 'Epistolary',
      title: `Copy Email: ${contactData.email}`,
      subtitle: 'Copy institutional correspondence address to clipboard',
      icon: <Mail className="w-4 h-4 text-ink-muted" />,
      action: async () => {
        await copyTextToClipboard(contactData.email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
        setCommandPaletteOpen(false);
      },
    });

    return items;
  }, [
    visualEffectsEnabled,
    readingMode,
    setCommandPaletteOpen,
    toggleVisualEffects,
    toggleReadingMode,
    navigateToSection
  ]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return commandItems;
    const q = query.toLowerCase();
    return commandItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, commandItems]);

  // Safe clamped index during render
  const safeSelectedIndex = selectedIndex >= filteredItems.length ? 0 : selectedIndex;

  // Keep selected item visible in scroll container
  useEffect(() => {
    if (commandPaletteOpen && itemRefs.current[safeSelectedIndex]) {
      const el = itemRefs.current[safeSelectedIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [safeSelectedIndex, commandPaletteOpen]);

  // Keyboard navigation listener (ArrowDown, ArrowUp, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[safeSelectedIndex];
      if (current) {
        current.action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setCommandPaletteOpen(false);
    }
  };

  // Lock body scroll when command palette is open
  useEffect(() => {
    if (commandPaletteOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const paletteModal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 p-4 overflow-y-auto overscroll-contain bg-black/75 backdrop-blur-xs"
      onClick={() => setCommandPaletteOpen(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-2xl my-auto sm:my-0 bg-paper-bg-subtle border-2 border-paper-border-strong rounded shadow-2xl overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[75vh] max-h-[80dvh] sm:max-h-[75dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Masthead Concordance Title Strip */}
        <div className="px-4 py-2 border-b border-paper-border-subtle bg-paper-bg-base flex items-center justify-between text-[11px] font-mono text-ink-muted">
          <span className="font-serif italic font-semibold text-academic-amber uppercase tracking-wider text-[10px]">
            Bibliographic Concordance &amp; Research Index
          </span>
          <span className="text-[10px]">
            Pardeshi Research Archive
          </span>
        </div>

        {/* Classical Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b-2 border-paper-border-strong bg-paper-bg-subtle">
          <Search className="w-5 h-5 text-academic-amber mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Type a command, treatise, research monograph, or section..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent text-ink-primary placeholder:text-ink-muted placeholder:font-serif focus:outline-none text-sm font-serif"
            aria-autocomplete="list"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            aria-label="Close command palette"
            className="p-1 text-ink-muted hover:text-ink-primary rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List — Academic Concordance Entries */}
        <div className="overflow-y-auto divide-y divide-paper-border-subtle p-2 flex-1 min-h-0">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-ink-muted text-sm font-serif italic">
              No matching treatises, manuscripts, or sections found in concordance.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = safeSelectedIndex === idx;
              return (
                <button
                  key={item.id}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-paper-bg-elevated border-l-3 border-academic-amber text-ink-primary font-semibold shadow-xs'
                      : 'hover:bg-paper-bg-base text-ink-secondary'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-3">
                    <div className={`p-1.5 rounded border ${
                      isSelected
                        ? 'border-academic-amber bg-paper-bg-base text-academic-amber'
                        : 'border-paper-border-subtle bg-paper-bg-subtle text-ink-muted group-hover:border-paper-border-strong'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm truncate font-serif ${
                        isSelected ? 'text-ink-primary font-bold' : 'group-hover:text-ink-primary'
                      }`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-ink-muted truncate font-serif italic">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border flex-shrink-0 ${
                    item.category === 'Treatise'
                      ? 'bg-paper-bg-base border-academic-amber text-academic-amber font-semibold'
                      : item.category === 'Preprint'
                      ? 'bg-paper-bg-base border-academic-amber text-academic-amber font-semibold'
                      : 'bg-paper-bg-base border-paper-border-strong text-ink-muted'
                  }`}>
                    [{item.category}]
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper — Oxford Frame Footer */}
        <div className="px-4 py-2.5 border-t border-paper-border-strong bg-paper-bg-base flex items-center justify-between text-[11px] text-ink-muted font-mono">
          <div className="flex items-center space-x-3">
            <span><kbd className="px-1 py-0.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-[10px]">ESC</kbd> Dismiss</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline"><kbd className="px-1 py-0.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-[10px]">↑ / ↓</kbd> Traverse Index</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline"><kbd className="px-1 py-0.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-[10px]">↵</kbd> Inspect Record</span>
          </div>
          {copiedEmail && (
            <span className="text-academic-amber font-semibold flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>Email Copied!</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(paletteModal, document.body) : paletteModal;
};
