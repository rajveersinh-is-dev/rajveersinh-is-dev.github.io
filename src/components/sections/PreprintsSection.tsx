import React, { useState } from 'react';
import { publicationsData } from '../../data';
import type { PublicationEntry } from '../../types/content';
import { copyTextToClipboard } from '../../utils/clipboard';
import { MaskedReveal } from '../common/MaskedReveal';
import { AcademicPopover } from '../common/AcademicPopover';
import { PreprintInspectorModal } from '../visuals/PreprintInspectorModal';
import { usePreferences } from '../../context';
import { FileText, ExternalLink, Copy, Check, Code, Eye } from 'lucide-react';
import { useIntersectionObserver } from '../../utils/intersectionObserver';

export const PreprintsSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
  const [inspectingPub, setInspectingPub] = useState<PublicationEntry | null>(null);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();
  const { playClick } = usePreferences();

  const getBibtex = (pub: PublicationEntry) => `@article{pardeshi_${pub.id},
  author    = {${pub.authors.join(' and ')}},
  title     = {${pub.title}},
  journal   = {Zenodo Preprint},
  year      = {${pub.year ?? new Date().getFullYear()}},
  note      = {Independently authored research preprint},
  url       = {${pub.recordUrl}}
}`;

  const copyBibtex = async (pub: PublicationEntry) => {
    playClick(920);
    const bibtex = getBibtex(pub);
    const success = await copyTextToClipboard(bibtex);
    if (success) {
      setCopiedId(pub.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleOpenInspector = (pub: PublicationEntry) => {
    playClick(850);
    setInspectingPub(pub);
  };

  return (
    <section
      ref={sectionRef}
      id="preprints"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
        >
          04
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              § 4
            </div>
            <MaskedReveal>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
                § 4. Archival Manuscripts &amp; Preprints
              </h2>
            </MaskedReveal>
            <MaskedReveal delayMs={150}>
              <p className="font-serif italic text-ink-muted text-sm sm:text-base">
                Research &amp; Preprints — Independently Authored Manuscripts Deposited on Zenodo
              </p>
            </MaskedReveal>
          </div>

          <div className="px-3.5 py-1.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-ink-secondary font-mono text-xs flex items-center space-x-1.5 self-start md:self-auto font-semibold shadow-xs">
            <span>Zenodo Archival Deposits</span>
          </div>
        </div>

        {/* Strict Honesty / Academic Notice */}
        <div className="p-4 rounded border-l-3 border-paper-border-strong bg-paper-bg-subtle border border-paper-border-subtle text-xs font-mono text-ink-secondary">
          <div className="space-y-1">
            <span className="text-ink-primary font-bold">Scientific Integrity Notice:</span>
            <p>
              The manuscripts cataloged below are independently authored research preprints deposited on Zenodo. Consistent with strict academic honesty rules, these records are preprints and are not represented as peer-reviewed journal publications.
            </p>
          </div>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Annals of Mathematics Style Article Entries */}
        <div className="space-y-10">
          {publicationsData.map((pub, idx) => {
            const isBibtexOpen = expandedBibtexId === pub.id;
            const isTopologyPaper = pub.id === 'zenodo-22273633';

            return (
              <article
                key={pub.id}
                className="p-6 sm:p-8 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-6 shadow-sm hover:border-academic-amber/60 transition-colors"
              >
                {/* Catalog Rubric & Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-border-subtle pb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-academic-amber uppercase tracking-wider">
                      Article IV.{idx + 1}
                    </span>
                    <span className="text-paper-border-strong">•</span>
                    <span className="px-2 py-0.5 rounded border border-academic-amber/40 bg-academic-amber/10 text-academic-amber font-semibold text-[10px]">
                      [ZENODO • OPEN ACCESS • 2026]
                    </span>
                    <span className="text-paper-border-strong">•</span>
                    <span className="text-ink-muted text-[10px]">
                      Status: {pub.status}
                    </span>
                    <span className="text-paper-border-strong">•</span>
                    <span className="text-[10px] text-ink-muted px-2 py-0.5 rounded border border-paper-border-subtle bg-paper-bg-base">
                      0 Citations • Nov 2026 Archival Deposit
                    </span>
                  </div>

                  <div className="text-xs font-mono text-ink-muted flex items-center space-x-2">
                    <span>Accession:</span>
                    <AcademicPopover type="citation" id={pub.id}>
                      <span className="text-ink-primary font-medium">{pub.id}</span>
                    </AcademicPopover>
                  </div>
                </div>

                {/* Article Title & Byline */}
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary leading-tight">
                    {pub.title}
                  </h3>
                  <div className="font-serif text-sm text-ink-secondary">
                    By <span className="font-semibold text-ink-primary">{pub.authors.join(', ')}</span>
                    <span className="text-academic-amber font-semibold ml-0.5">¹</span>
                  </div>
                  <div className="text-xs font-serif italic text-ink-muted">
                    ¹ Independent Mathematical Researcher, Pune, Maharashtra, India
                  </div>
                </div>

                {/* Subject Classification with Popovers */}
                <div className="text-xs font-mono text-ink-muted space-y-1">
                  <div>
                    <span className="text-ink-secondary font-semibold">Mathematical Domain:</span> {pub.researchArea}
                  </div>
                  <div className="text-academic-cobalt font-medium flex flex-wrap items-center gap-2">
                    <span>MSC2020 Classification:</span>
                    {isTopologyPaper ? (
                      <>
                        <AcademicPopover type="msc" id="55N31">
                          55N31 (Persistent Homology)
                        </AcademicPopover>
                        <span>•</span>
                        <AcademicPopover type="msc" id="05C65">
                          05C65 (Hypergraphs)
                        </AcademicPopover>
                        <span>•</span>
                        <AcademicPopover type="msc" id="68W05">
                          68W05
                        </AcademicPopover>
                      </>
                    ) : (
                      <>
                        <AcademicPopover type="msc" id="90C27">
                          90C27 (Combinatorial Optimization)
                        </AcademicPopover>
                        <span>•</span>
                        <AcademicPopover type="msc" id="90C06">
                          90C06 (Large-Scale Math Prog)
                        </AcademicPopover>
                        <span>•</span>
                        <AcademicPopover type="msc" id="68Q25">
                          68Q25
                        </AcademicPopover>
                      </>
                    )}
                  </div>
                </div>

                {/* Formatted Scholarly Abstract */}
                <div className="p-5 rounded border-l-3 border-academic-amber bg-paper-bg-base border border-paper-border-subtle font-serif text-sm sm:text-base leading-relaxed text-ink-secondary">
                  <span className="font-serif font-bold text-xs uppercase tracking-widest text-ink-primary mr-2">
                    ABSTRACT.
                  </span>
                  {pub.shortAbstract}
                </div>

                {/* Accession Links & Scholarly Inspector Trigger */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Dedicated Dual-Pane Scholarly Inspector Button */}
                    <button
                      onClick={() => handleOpenInspector(pub)}
                      className="px-3.5 py-1.5 rounded border border-academic-amber bg-academic-amber text-paper-bg-base hover:opacity-90 font-bold flex items-center space-x-1.5 transition-opacity shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Scholarly Inspector &amp; Simulator</span>
                    </button>

                    <a
                      href={pub.recordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playClick(800)}
                      className="px-3 py-1.5 rounded border border-academic-seal bg-academic-seal/10 hover:bg-academic-seal text-academic-seal hover:text-white transition-colors flex items-center space-x-1.5 font-semibold cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Zenodo Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => {
                        playClick(750);
                        setExpandedBibtexId(isBibtexOpen ? null : pub.id);
                      }}
                      aria-expanded={isBibtexOpen}
                      aria-controls={`bibtex-${pub.id}`}
                      className="px-3 py-1.5 rounded border border-paper-border-subtle hover:border-paper-border-strong bg-paper-bg-elevated text-ink-secondary hover:text-ink-primary transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>{isBibtexOpen ? 'Hide BibTeX' : 'View BibTeX'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => copyBibtex(pub)}
                    className="px-3.5 py-1.5 rounded border border-paper-border-strong hover:border-academic-amber bg-paper-bg-base text-ink-primary hover:text-academic-amber flex items-center space-x-1.5 transition-colors font-medium cursor-pointer shadow-xs"
                  >
                    {copiedId === pub.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-academic-amber" />
                        <span className="text-academic-amber font-bold">BibTeX Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Citation (BibTeX)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Journal Archive Bottom Stamp & Permanent Identifier */}
                <div className="pt-3 border-t border-paper-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
                  <div className="flex items-center space-x-2">
                    <span className="text-academic-amber font-semibold">PERMANENT IDENTIFIER:</span>
                    <a
                      href={pub.recordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-secondary hover:text-academic-amber underline underline-offset-2"
                    >
                      {pub.recordUrl.replace('https://', '')}
                    </a>
                  </div>
                  <span className="text-[10px] text-ink-muted">
                    Archival Zenodo Deposit • Machine-Readable Metadata Preserved
                  </span>
                </div>

                {/* Expandable BibTeX Drawer */}
                {isBibtexOpen && (
                  <div className="mt-4 pt-3 border-t border-paper-border-subtle space-y-2">
                    <div className="text-[11px] font-mono text-ink-muted uppercase tracking-wider">
                      Bibliographic Entry (BibTeX format):
                    </div>
                    <pre className="p-4 rounded border border-paper-border-subtle bg-paper-bg-elevated text-xs font-mono text-ink-primary overflow-x-auto leading-relaxed">
                      {getBibtex(pub)}
                    </pre>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Dual-Pane Scholarly Preprint Inspector Modal */}
        {inspectingPub && (
          <PreprintInspectorModal
            publication={inspectingPub}
            onClose={() => setInspectingPub(null)}
          />
        )}
      </div>
    </section>
  );
};
