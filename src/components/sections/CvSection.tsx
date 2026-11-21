import React, { useState } from 'react';
import { profileData } from '../../data';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import { copyTextToClipboard } from '../../utils/clipboard';
import {
  FileDown,
  FileCode,
  ShieldCheck,
  Check,
  ExternalLink,
  Sparkles,
  FileText
} from 'lucide-react';

export const CvSection: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

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
    <section id="cv" className="py-20 border-t border-border-subtle relative bg-bg-surface/35">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
              <span>08 // Verified Academic Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
              Curriculum Vitae (CV)
            </h2>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-bg-surface border border-border-subtle text-text-muted font-mono text-xs flex items-center space-x-2 self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Locally Compiled • Authoritative Single Source</span>
          </div>
        </div>

        {/* CV Presentation Card */}
        <div className="p-6 sm:p-10 rounded-xl bg-bg-surface border border-border-medium shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-border-subtle">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                  VECTOR PDF & MARKDOWN SOURCE
                </span>
                <span className="text-xs font-mono text-text-muted">
                  Strictly Offline-Generated
                </span>
              </div>

              <h3 className="font-mono text-2xl sm:text-3xl font-bold text-text-primary">
                {profileData.fullName}
              </h3>

              <p className="text-xs text-text-secondary leading-relaxed font-mono">
                {profileData.professionalIdentity} (Age: {profileData.age}) • {profileData.location}
              </p>

              <p className="text-sm text-text-secondary font-sans leading-relaxed pt-1">
                A formal academic Curriculum Vitae generated directly from the single authoritative configuration source. Zero third-party cloud generators, zero external font downloads, and zero unverified achievements.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-bg-void font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <FileDown className="w-4 h-4" />
                <span>{downloading ? 'Compiling PDF...' : 'Download Official CV (PDF)'}</span>
              </button>

              <a
                href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
                download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
                className="px-5 py-2.5 rounded-lg bg-bg-elevated hover:bg-bg-card border border-border-subtle hover:border-border-highlight text-text-secondary hover:text-text-primary font-mono text-xs flex items-center justify-center space-x-2 transition-colors"
                title="Direct link to pre-built static PDF"
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Direct Static PDF Link</span>
                <ExternalLink className="w-3 h-3 text-text-dim" />
              </a>

              <button
                onClick={handleCopyMarkdown}
                className="px-5 py-2.5 rounded-lg bg-bg-base hover:bg-bg-elevated border border-border-subtle text-text-muted hover:text-amber-400 font-mono text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                {copiedMd ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Markdown Copied!</span>
                  </>
                ) : (
                  <>
                    <FileCode className="w-4 h-4 text-amber-500" />
                    <span>Copy Markdown Source</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CV Section Invariant Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Research Scope</span>
              </div>
              <div className="text-xs font-mono text-text-primary font-semibold">
                Pure & Computational Mathematics
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                Algorithm design, formal verification in Lean 4, dynamical systems.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Academic Record</span>
              </div>
              <div className="text-xs font-mono text-text-primary font-semibold">
                IIT Madras Enrolment
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                BSc Aerospace Enrolled & Eon Gyanankur Class XII.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Publications Status</span>
              </div>
              <div className="text-xs font-mono text-text-primary font-semibold">
                Zenodo Preprints (x2)
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                Independently authored; clearly distinguished from peer-reviewed works.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Code Repositories</span>
              </div>
              <div className="text-xs font-mono text-text-primary font-semibold">
                11 Repositories Cataloged
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                NumLang (#1), Omni Toolkit (#2), Terrain Erosion (#3), Umbra (#4), etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
