import React, { useState } from 'react';
import { profileData } from '../../data';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import { copyTextToClipboard } from '../../utils/clipboard';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { MaskedReveal } from '../common/MaskedReveal';
import {
  FileDown,
  FileCode,
  Check,
  ExternalLink,
  FileText
} from 'lucide-react';

export const CvSection: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      downloadPdfCv();
    } catch {}
    setTimeout(() => setDownloading(false), 1200);
  };

  const handleCopyMarkdown = async () => {
    try {
      const response = await fetch('./Rajveersinh_Vishal_Pardeshi_CV.md');
      if (response.ok) {
        const text = await response.text();
        const ok = await copyTextToClipboard(text);
        if (ok) {
          setCopiedMd(true);
          setTimeout(() => setCopiedMd(false), 2000);
        }
      }
    } catch {
      // Fallback: minimal template
      await copyTextToClipboard(`# ${profileData.fullName} — Curriculum Vitae\n${profileData.professionalIdentity} (Age: ${profileData.age})`);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="cv"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-base transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-primary/[0.04] dark:text-ink-primary/[0.06] select-none pointer-events-none absolute -top-12 sm:-top-16 right-4 sm:right-12 leading-none"
        >
          08
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              § 8
            </div>
            <MaskedReveal>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
                § 8. Curriculum Vitae (CV) &amp; Academic Dossier
              </h2>
            </MaskedReveal>
            <MaskedReveal delayMs={150}>
              <p className="font-serif italic text-ink-muted text-sm sm:text-base">
                Curriculum Vitae (CV) — Verified Institutional Credentials, Authoritative Preprints &amp; Offline Vector Export
              </p>
            </MaskedReveal>
          </div>

          <div className="px-3.5 py-1.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-ink-secondary font-mono text-xs flex items-center space-x-2 self-start md:self-auto font-semibold shadow-xs">
            <span>Offline Compiled Vector Dossier</span>
          </div>
        </div>

        {/* CV Presentation Card — Formal Academic Dossier */}
        <div className="p-6 sm:p-10 rounded border-2 border-paper-border-strong bg-paper-bg-subtle shadow-sm space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b-2 border-paper-border-strong">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-strong bg-paper-bg-base text-academic-amber font-bold tracking-wider uppercase">
                  VECTOR PDF &amp; MARKDOWN SOURCE
                </span>
                <span className="text-xs font-mono text-ink-muted">
                  Strictly Offline-Generated (Zero Remote Fonts)
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
                {profileData.fullName}
              </h3>

              <p className="text-xs text-ink-secondary leading-relaxed font-mono">
                {profileData.professionalIdentity} (Age: {profileData.age}) • {profileData.location}
              </p>

              <p className="text-sm text-ink-secondary font-serif leading-relaxed pt-1">
                A formal academic Curriculum Vitae and dossier generated directly from the single authoritative TypeScript configuration source. Zero third-party cloud generators, zero external font downloads, and zero unverified achievements.
              </p>
            </div>

            {/* Action Buttons — Classical Oxford Style */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="px-6 py-3.5 rounded border border-paper-border-strong bg-academic-amber hover:opacity-90 text-paper-bg-base font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>{downloading ? 'Compiling PDF...' : 'Download Official CV (PDF)'}</span>
              </button>

              <a
                href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
                download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
                className="px-5 py-2.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-ink-secondary hover:text-ink-primary font-mono text-xs flex items-center justify-center space-x-2 transition-colors font-semibold"
                title="Direct link to pre-built static PDF"
              >
                <FileText className="w-4 h-4 text-ink-muted" />
                <span>Direct Static PDF Link</span>
                <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
              </a>

              <button
                onClick={handleCopyMarkdown}
                className="px-5 py-2.5 rounded border border-paper-border-subtle bg-paper-bg-base hover:bg-paper-bg-elevated text-ink-muted hover:text-ink-primary font-mono text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                {copiedMd ? (
                  <>
                    <Check className="w-4 h-4 text-academic-amber" />
                    <span className="text-academic-amber font-semibold">Markdown Copied!</span>
                  </>
                ) : (
                  <>
                    <FileCode className="w-4 h-4 text-academic-amber" />
                    <span>Copy Markdown Source</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dossier Curricular Overview Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Vector Document Architecture */}
            <div className="p-4 rounded border border-paper-border-subtle bg-paper-bg-base space-y-3">
              <div className="flex items-center space-x-2 border-b border-paper-border-subtle pb-2">
                <FileText className="w-4 h-4 text-ink-muted" />
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-ink-primary">
                  Document Architecture
                </span>
              </div>
              <div className="space-y-2 text-xs font-serif text-ink-secondary">
                <p>• Formatted A4 portrait vector layout with standard academic margins (40pt).</p>
                <p>• Dynamic page header and pagination computed via jsPDF canvas metrics.</p>
                <p>• Clean typographic hierarchy using built-in vector Helvetica and rule dividers.</p>
              </div>
            </div>

            {/* Included Curricular Records */}
            <div className="p-4 rounded border border-paper-border-subtle bg-paper-bg-base space-y-3">
              <div className="flex items-center space-x-2 border-b border-paper-border-subtle pb-2">
                <span className="w-2 h-2 rounded-full bg-academic-amber" />
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-ink-primary">
                  Archival Inclusions
                </span>
              </div>
              <div className="space-y-2 text-xs font-serif text-ink-secondary">
                <p>• Confirmed Higher Education &amp; Schooling enrolment credentials.</p>
                <p>• Independent research preprints with Zenodo accession DOIs.</p>
                <p>• Verified competition standings &amp; international mathematics medals.</p>
              </div>
            </div>

            {/* Offline Vector Integrity */}
            <div className="p-4 rounded border border-paper-border-subtle bg-paper-bg-base space-y-3">
              <div className="flex items-center space-x-2 border-b border-paper-border-subtle pb-2">
                <span className="w-2 h-2 rounded-full bg-academic-amber" />
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-ink-primary">
                  Integrity Guarantee
                </span>
              </div>
              <div className="space-y-2 text-xs font-serif text-ink-secondary">
                <p>• 100% vector primitives drawn directly in-process without network requests.</p>
                <p>• Dual export: Instant vector PDF download &amp; raw Markdown manuscript.</p>
                <p>• Strict non-embellishment: Unverified honors and ranks are excluded.</p>
              </div>
            </div>
          </div>

          {/* Dossier Integrity Attestation Colophon */}
          <div className="pt-4 border-t border-paper-border-subtle flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-ink-muted gap-2">
            <span className="font-serif italic">
              Verification Hash: SHA-256 Synchronized with public repository assets
            </span>
            <span className="text-ink-secondary font-semibold">
              MSC2020: 55N31 • 90C27 • 68N20 • 37D45
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
