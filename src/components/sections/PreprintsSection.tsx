import React, { useState } from 'react';
import { publicationsData } from '../../data';
import type { PublicationEntry } from '../../types/content';
import { copyTextToClipboard } from '../../utils/clipboard';
import { FileText, ExternalLink, Copy, Check, ShieldAlert, Code } from 'lucide-react';

export const PreprintsSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);

  const getBibtex = (pub: PublicationEntry) => `@article{pardeshi_${pub.id},
  author    = {${pub.authors.join(' and ')}},
  title     = {${pub.title}},
  journal   = {Zenodo Preprint},
  year      = {2026},
  note      = {Independently authored research preprint},
  url       = {${pub.recordUrl}}
}`;

  const copyBibtex = async (pub: PublicationEntry) => {
    const bibtex = getBibtex(pub);
    const success = await copyTextToClipboard(bibtex);
    if (success) {
      setCopiedId(pub.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section id="preprints" className="py-20 border-t border-paper-border-subtle relative bg-paper-bg-base">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-academic-seal font-semibold">
              Bibliotheca Mathematica • Section IV
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
              § 4. Archival Manuscripts &amp; Preprints
            </h2>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Research &amp; Preprints — Independently Authored Manuscripts Deposited on Zenodo
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-ink-secondary font-mono text-xs flex items-center space-x-1.5 self-start md:self-auto font-semibold">
            <span>Zenodo Archival Deposits</span>
          </div>
        </div>

        {/* Strict Honesty / Academic Notice */}
        <div className="p-4 rounded border-l-4 border-academic-seal bg-paper-bg-subtle border border-paper-border-subtle flex items-start space-x-3 text-xs font-mono text-ink-secondary">
          <ShieldAlert className="w-4 h-4 text-academic-seal mt-0.5 flex-shrink-0" />
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
            const mscCode = pub.id === 'zenodo-22273633'
              ? 'MSC2020: 55N31 (Persistent Homology), 05C65 (Hypergraphs), 68W05'
              : 'MSC2020: 90C27 (Combinatorial Optimization), 90C06 (Large-Scale Mathematical Programming), 68Q25';

            return (
              <article
                key={pub.id}
                className="p-6 sm:p-8 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-6 shadow-sm"
              >
                {/* Catalog Rubric & Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-border-subtle pb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-academic-seal uppercase tracking-wider">
                      Article IV.{idx + 1}
                    </span>
                    <span className="text-paper-border-strong">•</span>
                    <span className="px-2 py-0.5 rounded border border-academic-amber/40 bg-academic-amber/10 text-academic-amber font-semibold">
                      Status: {pub.status}
                    </span>
                    <span className="text-paper-border-strong">•</span>
                    <span className="text-ink-muted">
                      Independently Authored
                    </span>
                  </div>

                  <div className="text-xs font-mono text-ink-muted">
                    Accession: <span className="text-ink-primary font-medium">{pub.id}</span>
                  </div>
                </div>

                {/* Article Title & Byline */}
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary leading-tight">
                    {pub.title}
                  </h3>
                  <div className="font-serif text-sm text-ink-secondary">
                    By <span className="font-semibold text-ink-primary">{pub.authors.join(', ')}</span>
                    <span className="text-academic-seal font-semibold ml-0.5">¹</span>
                  </div>
                  <div className="text-xs font-serif italic text-ink-muted">
                    ¹ Independent Mathematical Researcher, Satara, Maharashtra, India
                  </div>
                </div>

                {/* Subject Classification */}
                <div className="text-xs font-mono text-ink-muted space-y-1">
                  <div>
                    <span className="text-ink-secondary font-semibold">Mathematical Domain:</span> {pub.researchArea}
                  </div>
                  <div className="text-academic-cobalt font-medium">
                    {mscCode}
                  </div>
                </div>

                {/* Formatted Scholarly Abstract */}
                <div className="p-5 rounded border-l-3 border-academic-amber bg-paper-bg-base border border-paper-border-subtle font-serif text-sm sm:text-base leading-relaxed text-ink-secondary">
                  <span className="font-serif font-bold text-xs uppercase tracking-widest text-ink-primary mr-2">
                    ABSTRACT.
                  </span>
                  {pub.shortAbstract}
                </div>

                {/* Accession Links & Citation Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
                  <div className="flex items-center space-x-3">
                    <a
                      href={pub.recordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded border border-academic-seal bg-academic-seal/10 hover:bg-academic-seal text-academic-seal hover:text-white transition-colors flex items-center space-x-1.5 font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Zenodo Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => setExpandedBibtexId(isBibtexOpen ? null : pub.id)}
                      className="px-3 py-1.5 rounded border border-paper-border-subtle hover:border-paper-border-strong bg-paper-bg-elevated text-ink-secondary hover:text-ink-primary transition-colors flex items-center space-x-1"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>{isBibtexOpen ? 'Hide BibTeX' : 'View BibTeX'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => copyBibtex(pub)}
                    className="px-3.5 py-1.5 rounded border border-paper-border-strong hover:border-academic-amber bg-paper-bg-base text-ink-primary hover:text-academic-amber flex items-center space-x-1.5 transition-colors font-medium"
                  >
                    {copiedId === pub.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-academic-seal" />
                        <span className="text-academic-seal font-bold">BibTeX Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Citation (BibTeX)</span>
                      </>
                    )}
                  </button>
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
      </div>
    </section>
  );
};
