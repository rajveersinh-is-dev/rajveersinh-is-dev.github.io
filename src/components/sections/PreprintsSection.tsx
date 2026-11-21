import React, { useState } from 'react';
import { publicationsData } from '../../data';
import type { PublicationEntry } from '../../types/content';
import { copyTextToClipboard } from '../../utils/clipboard';
import { FileText, ExternalLink, Copy, Check, ShieldAlert } from 'lucide-react';

export const PreprintsSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyBibtex = async (pub: PublicationEntry) => {
    const bibtex = `@article{pardeshi_${pub.id},
  author    = {${pub.authors.join(' and ')}},
  title     = {${pub.title}},
  journal   = {Zenodo Preprint},
  note      = {Independently authored research preprint},
  url       = {${pub.recordUrl}}
}`;
    const success = await copyTextToClipboard(bibtex);
    if (success) {
      setCopiedId(pub.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section id="preprints" className="py-20 border-t border-border-subtle relative bg-bg-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
              <span>04 // Scientific Archival</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
              Research & Preprints
            </h2>
          </div>

          <div className="px-3 py-1 rounded bg-bg-surface border border-border-subtle text-text-muted font-mono text-xs flex items-center space-x-1.5 self-start md:self-auto">
            <span>Archived on Zenodo</span>
          </div>
        </div>

        {/* Strict Honesty / Academic Notice */}
        <div className="p-4 rounded-lg bg-bg-surface border-l-4 border-amber-500/80 border-y border-r border-border-subtle flex items-start space-x-3 text-xs font-mono text-text-secondary">
          <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="text-text-primary font-bold">Scientific Integrity Notice:</span>
            <p>
              The manuscripts cataloged below are independently authored research preprints deposited on Zenodo. Consistent with strict academic honesty rules, these records are preprints and are not represented as peer-reviewed journal publications.
            </p>
          </div>
        </div>

        {/* Preprints List */}
        <div className="space-y-6">
          {publicationsData.map((pub, idx) => (
            <div
              key={pub.id}
              className="p-6 sm:p-8 rounded-lg bg-bg-surface border border-border-medium hover:border-amber-500/50 transition-all space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-4xl">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
                      Status: {pub.status}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      Preprint #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-text-dim">
                      • Independently Authored
                    </span>
                  </div>

                  <h3 className="font-mono text-xl sm:text-2xl font-bold text-text-primary hover:text-amber-400 transition-colors">
                    {pub.title}
                  </h3>

                  <div className="text-xs font-mono text-amber-500">
                    Author: {pub.authors.join(', ')} (Independent Researcher)
                  </div>
                </div>

                {/* Zenodo Record Link */}
                <a
                  href={pub.recordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-bg-elevated hover:bg-bg-card border border-border-subtle hover:border-amber-500/50 text-text-primary font-mono text-xs flex items-center space-x-2 self-start transition-colors flex-shrink-0"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Zenodo Record</span>
                  <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
                </a>
              </div>

              {/* Research Area & Abstract */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <div className="text-xs font-mono text-text-dim uppercase tracking-wider">
                  Research Area: <span className="text-text-secondary font-semibold">{pub.researchArea}</span>
                </div>
                <p className="text-sm text-text-secondary font-sans leading-relaxed">
                  {pub.shortAbstract}
                </p>
              </div>

              {/* Action bar: Copy BibTeX */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="text-[11px] text-text-dim truncate">
                  Persistent Identifier: {pub.recordUrl}
                </div>

                <button
                  onClick={() => copyBibtex(pub)}
                  className="px-3 py-1.5 rounded bg-bg-base border border-border-subtle hover:border-border-highlight text-text-secondary hover:text-amber-400 flex items-center space-x-1.5 transition-colors"
                >
                  {copiedId === pub.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">BibTeX Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Citation (BibTeX)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
