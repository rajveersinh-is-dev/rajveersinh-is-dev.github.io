import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  Sparkles,
  ArrowRight,
  GraduationCap,
  X
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
      // Sections
      {
        id: 'sec-hero',
        category: 'Navigation',
        title: 'Hero / Overview',
        subtitle: 'Go to beginning of portfolio',
        icon: <ArrowRight className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('hero'),
      },
      {
        id: 'sec-about',
        category: 'Navigation',
        title: 'About & Philosophy',
        subtitle: 'First-person background, vision, and aspirations',
        icon: <ArrowRight className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('about'),
      },
      {
        id: 'sec-research',
        category: 'Navigation',
        title: 'Research Interests',
        subtitle: 'Explore theoretical & computational mathematics domains',
        icon: <BookOpen className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('research-interests'),
      },
      {
        id: 'sec-projects',
        category: 'Navigation',
        title: 'Projects Directory',
        subtitle: 'NumLang, Omni Toolkit, Terrain Erosion Engine, Umbra, etc.',
        icon: <FolderGit2 className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('projects'),
      },
      {
        id: 'sec-preprints',
        category: 'Navigation',
        title: 'Research & Preprints',
        subtitle: 'Zenodo archived independent preprints',
        icon: <FileText className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('preprints'),
      },
      {
        id: 'sec-achievements',
        category: 'Navigation',
        title: 'Achievements',
        subtitle: 'Kaggle Squares in Squares (7th) & SOF IMO medals',
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('achievements'),
      },
      {
        id: 'sec-skills',
        category: 'Navigation',
        title: 'Technical Landscape',
        subtitle: 'Intermediate capabilities across Rust, Lean 4, Python, etc.',
        icon: <Sliders className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('skills'),
      },
      {
        id: 'sec-education',
        category: 'Navigation',
        title: 'Education & Enrolment',
        subtitle: 'IIT Madras (BSc Aerospace Enrolled) & Eon Gyanankur (Class XII)',
        icon: <GraduationCap className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('education'),
      },
      {
        id: 'sec-cv',
        category: 'Navigation',
        title: 'Curriculum Vitae',
        subtitle: 'Download official PDF or inspect Markdown source',
        icon: <FileText className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('cv'),
      },
      {
        id: 'sec-timeline',
        category: 'Navigation',
        title: 'Milestone Timeline',
        subtitle: 'Chronological research and academic milestones',
        icon: <ArrowRight className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('timeline'),
      },
      {
        id: 'sec-connections',
        category: 'Navigation',
        title: 'Research Connections Graph',
        subtitle: 'Interactive map of areas, projects, and concepts',
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('connections-graph'),
      },
      {
        id: 'sec-playground',
        category: 'Navigation',
        title: 'Mathematical Visual Playground',
        subtitle: 'Interactive simulations: Attractors, Cellular Automata, Fractals, Homology',
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('playground'),
      },
      {
        id: 'sec-contact',
        category: 'Navigation',
        title: 'Contact Information',
        subtitle: 'Reach out via email or verified profiles',
        icon: <Mail className="w-4 h-4 text-amber-500" />,
        action: () => navigateToSection('contact'),
      },

      // Actions
      {
        id: 'act-download-cv',
        category: 'Action',
        title: 'Download Curriculum Vitae (PDF)',
        subtitle: 'Locally generated vector PDF document',
        icon: <FileText className="w-4 h-4 text-amber-400" />,
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
        icon: <Eye className="w-4 h-4 text-amber-400" />,
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
        icon: <BookOpen className="w-4 h-4 text-amber-400" />,
        action: () => {
          toggleReadingMode();
          setCommandPaletteOpen(false);
        },
      },
    ];

    // Add Projects (Opens detailed specification view directly!)
    projectsData.forEach((proj) => {
      items.push({
        id: `proj-${proj.id}`,
        category: 'Project',
        title: proj.name,
        subtitle: `${proj.category} — ${proj.technologies.slice(0, 3).join(', ')}`,
        icon: <FolderGit2 className="w-4 h-4 text-slate-400" />,
        action: () => {
          setCommandPaletteOpen(false);
          window.location.hash = `#project-${proj.id}`;
          const el = document.getElementById('projects');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        },
      });
    });

    // Add Publications
    publicationsData.forEach((pub) => {
      items.push({
        id: `pub-${pub.id}`,
        category: 'Research Preprint',
        title: pub.title,
        subtitle: `Zenodo Preprint — ${pub.researchArea}`,
        icon: <ExternalLink className="w-4 h-4 text-amber-400" />,
        action: () => {
          setCommandPaletteOpen(false);
          const el = document.getElementById('preprints');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        },
      });
    });

    // Add Contact Actions
    items.push({
      id: 'contact-email',
      category: 'Contact',
      title: `Copy Email: ${contactData.email}`,
      subtitle: 'Copy address to clipboard',
      icon: <Mail className="w-4 h-4 text-slate-400" />,
      action: async () => {
        await copyTextToClipboard(contactData.email);
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

  if (!commandPaletteOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm"
      onClick={() => setCommandPaletteOpen(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-2xl bg-bg-surface border border-border-medium rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border-subtle bg-bg-elevated">
          <Search className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Type a command, project, research area, or section..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none text-sm font-mono"
            aria-autocomplete="list"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            aria-label="Close command palette"
            className="p-1 text-text-muted hover:text-text-primary rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-border-subtle p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-text-muted text-sm font-mono">
              No matching commands or projects found.
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
                  className={`w-full text-left px-3 py-2.5 rounded flex items-center justify-between group transition-colors ${
                    isSelected
                      ? 'bg-amber-500/15 border-l-2 border-amber-500 text-amber-400 font-semibold'
                      : 'hover:bg-bg-cardHover text-text-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div className={`p-1.5 rounded bg-bg-base border ${
                      isSelected ? 'border-amber-500/60' : 'border-border-subtle group-hover:border-amber-500/40'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm truncate ${
                        isSelected ? 'text-amber-400 font-bold' : 'group-hover:text-amber-400'
                      }`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-text-muted truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim px-2 py-0.5 rounded bg-bg-base border border-border-subtle flex-shrink-0">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-border-subtle bg-bg-elevated flex items-center justify-between text-[11px] text-text-muted font-mono">
          <span>Press ESC or click outside to exit</span>
          <span className="hidden sm:inline">Use ↑ ↓ to navigate, Enter to select</span>
        </div>
      </div>
    </div>
  );
};
