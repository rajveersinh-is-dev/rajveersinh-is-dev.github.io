import React, { useState } from 'react';
import { educationData, timelineData, profileData } from '../../data';
import { downloadPdfCv } from '../../utils/generatePdfCv';
import { copyTextToClipboard } from '../../utils/clipboard';
import { useIntersectionObserver } from '../../utils/intersectionObserver';
import { MaskedReveal } from '../common/MaskedReveal';
import {
  Check,
  FileDown,
  FileCode,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

/**
 * § 7. Academic Curriculum & Scholarly Milestones
 *
 * Consolidated landmark uniting verified academic enrolment credentials,
 * chronological milestones with monospace date columns, and the official
 * vector CV dossier with one-click PDF download and Markdown source viewer.
 */
export const EducationSection: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();
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
      await copyTextToClipboard(
        `# ${profileData.fullName} — Curriculum Vitae\n${profileData.professionalIdentity} (Age: ${profileData.age})`
      );
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="education"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/30 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative">
        {/* =========================================================================
            PART 1: § 7. ACADEMIC CURRICULUM & INSTITUTIONAL CREDENTIALS
            ========================================================================= */}
        <div className="space-y-10 relative">
          {/* Oversized Low-Contrast Display Numeral 07 */}
          <div
            aria-hidden="true"
            className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
          >
            07
          </div>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
            <div className="space-y-3">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
                § 7 • Formal Curriculum
              </div>
              <MaskedReveal>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
                  § 7. Academic Curriculum &amp; Scholarly Milestones
                </h2>
              </MaskedReveal>
              <MaskedReveal delayMs={150}>
                <p className="font-serif italic text-ink-muted text-sm sm:text-base">
                  Education &amp; Institutional Credentials — Official Academic Registry &amp; Confirmed Enrolment Records
                </p>
              </MaskedReveal>
            </div>

            <div className="px-3.5 py-1.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-ink-secondary font-mono text-xs flex items-center space-x-2 self-start md:self-auto font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Institutional Registry</span>
            </div>
          </div>

          {/* Institutional Integrity Notice */}
          <p className="font-serif text-sm text-ink-secondary leading-relaxed max-w-3xl">
            Academic credentials are strictly bounded by confirmed institutional enrolment records. Consistent with research portfolio integrity standards, no unverified graduation dates, admission years, or synthetic grades are claimed.
          </p>

          {/* Foundation Cards: IIT Madras & Eon Gyanankur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {educationData.map((edu) => (
              <div
                key={edu.id}
                className="p-6 rounded border-2 border-paper-border-strong bg-paper-bg-base space-y-4 shadow-sm hover:border-academic-amber transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-academic-amber font-bold block">
                      {edu.type === 'higher-education' ? 'Higher Education Institution' : 'Secondary School Education'}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-ink-primary">
                      {edu.institution}
                    </h3>
                  </div>
                  <div className="p-2 rounded bg-paper-bg-subtle border border-paper-border-subtle shrink-0">
                    <GraduationCap className="w-5 h-5 text-academic-amber" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif text-base text-ink-primary font-medium">
                    {edu.programmeOrStage}
                  </div>
                  {edu.notes && (
                    <div className="text-xs font-serif italic text-ink-muted">
                      {edu.notes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-paper-border-subtle flex items-center justify-between">
                  <span className="inline-block px-2.5 py-1 rounded border border-academic-amber/40 bg-academic-amber/10 font-mono text-xs text-academic-amber font-semibold">
                    {edu.status}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-ink-secondary">
                    <Check className="w-3.5 h-3.5 text-academic-amber flex-shrink-0" />
                    <span>Confirmed Record</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* =========================================================================
            PART 2: CHRONOLOGICAL MILESTONES (FLOWS DIRECTLY WITH DATE COLUMNS)
            ========================================================================= */}
        <div id="timeline" className="space-y-8 relative scroll-mt-24">
          {/* Oversized Low-Contrast Display Numeral 09 for Milestone Track */}
          <div
            aria-hidden="true"
            className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
          >
            09
          </div>

          <div className="space-y-2 relative z-10">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              Chronological Track
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary tracking-tight">
              Scholarly Chronology &amp; Intellectual Milestones
            </h3>
            <p className="font-serif italic text-ink-muted text-xs sm:text-sm">
              Progression of Academic Stages, Competitions, Preprints, &amp; Mechanized Compiler Engineering
            </p>
          </div>

          {/* Pure Monospace Typographic Milestones */}
          <div className="space-y-6 pl-1 relative z-10">
            {timelineData.map((milestone) => (
              <div key={milestone.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
                {/* Left Column: Fixed Monospace Year/Period */}
                <div className="sm:col-span-3 flex sm:justify-end items-center sm:items-start space-x-3 sm:space-x-0">
                  <span className="text-xs font-mono font-bold text-ink-primary tracking-wider px-2.5 py-1 rounded border border-paper-border-subtle bg-paper-bg-base sm:text-right shadow-xs">
                    {milestone.yearOrPeriod}
                  </span>
                  <span className="sm:hidden text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                    {milestone.category}
                  </span>
                </div>

                {/* Right Column: Thin vertical rule and milestone card */}
                <div className="sm:col-span-9 pl-4 sm:pl-6 border-l border-paper-border-strong relative space-y-1.5">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-paper-bg-base border border-paper-border-strong flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-academic-amber" />
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-ink-primary">
                      {milestone.title}
                    </h4>
                    <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                      [{milestone.category}]
                    </span>
                  </div>

                  <p className="font-serif text-xs sm:text-sm text-ink-secondary leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-paper-border-subtle text-xs font-mono text-ink-muted flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-academic-amber" />
            <span>Verified Chronological Progression • Confirmed against Institutional Records &amp; Zenodo Depositions</span>
          </div>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* =========================================================================
            PART 3: OFFICIAL CURRICULUM VITAE (CV) DOSSIER CONCLUSION
            ========================================================================= */}
        <div id="cv" className="relative scroll-mt-24 space-y-8">
          {/* Oversized Low-Contrast Display Numeral 08 for CV Dossier */}
          <div
            aria-hidden="true"
            className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-dim/10 dark:text-ink-dim/15 select-none pointer-events-none absolute -top-10 sm:-top-14 right-4 sm:right-8 z-0 leading-none"
          >
            08
          </div>

          <div className="space-y-2 relative z-10">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              Official Dossier
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary tracking-tight">
              Curriculum Vitae (CV) &amp; Academic Dossier
            </h3>
            <p className="font-serif italic text-ink-muted text-xs sm:text-sm">
              Verified Institutional Credentials, Authoritative Preprints &amp; Offline Vector Export
            </p>
          </div>

          {/* Official CV Summary Presentation Card */}
          <div className="p-6 sm:p-8 rounded border-2 border-paper-border-strong bg-paper-bg-base space-y-6 shadow-sm relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-paper-border-subtle">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-academic-amber font-bold tracking-wider uppercase">
                    Vector PDF &amp; Markdown Source
                  </span>
                  <span className="text-xs font-mono text-ink-muted">
                    Strictly Offline-Generated (Zero Remote CDNs)
                  </span>
                </div>

                <div className="font-serif text-2xl font-bold text-ink-primary">
                  {profileData.fullName}
                </div>

                <p className="text-xs text-ink-secondary leading-relaxed font-mono">
                  {profileData.professionalIdentity} (Age: {profileData.age}) • {profileData.location}
                </p>
                <p className="text-xs sm:text-sm text-ink-secondary font-serif leading-relaxed pt-1">
                  {profileData.tagline}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="px-4 py-2.5 rounded bg-academic-amber text-paper-bg-base font-serif font-bold text-xs flex items-center justify-center space-x-2 hover:opacity-95 cursor-pointer shadow-xs transition-opacity"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{downloading ? 'Compiling Vector PDF...' : 'Download Vector Dossier (PDF)'}</span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="px-4 py-2 rounded border border-paper-border-strong bg-paper-bg-subtle hover:bg-paper-bg-elevated text-ink-primary font-mono text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                >
                  {copiedMd ? <Check className="w-4 h-4 text-emerald-500" /> : <FileCode className="w-4 h-4 text-ink-muted" />}
                  <span>{copiedMd ? 'Markdown Source Copied' : 'Inspect / Copy Markdown'}</span>
                </button>

                <a
                  href="./Rajveersinh_Vishal_Pardeshi_CV.pdf"
                  download="Rajveersinh_Vishal_Pardeshi_CV.pdf"
                  className="text-[11px] font-mono text-center text-ink-muted hover:text-ink-primary underline underline-offset-2 pt-1"
                >
                  Static PDF Dossier Link
                </a>
              </div>
            </div>

            {/* Dossier Credentials Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded bg-paper-bg-subtle border border-paper-border-subtle space-y-1">
                <span className="text-[10px] text-ink-muted uppercase block font-semibold">Current Enrolment</span>
                <span className="text-ink-primary font-serif font-bold text-sm block">IIT Madras</span>
                <span className="text-[11px] text-ink-secondary">BS in Aerospace Engineering (Enrolled)</span>
              </div>

              <div className="p-3 rounded bg-paper-bg-subtle border border-paper-border-subtle space-y-1">
                <span className="text-[10px] text-ink-muted uppercase block font-semibold">Location / Base</span>
                <span className="text-ink-primary font-serif font-bold text-sm block">Pune &amp; Satara, India</span>
                <span className="text-[11px] text-ink-secondary">18.5204° N, 73.8567° E</span>
              </div>

              <div className="p-3 rounded bg-paper-bg-subtle border border-paper-border-subtle space-y-1">
                <span className="text-[10px] text-ink-muted uppercase block font-semibold">Primary Specialization</span>
                <span className="text-ink-primary font-serif font-bold text-sm block">Verified Compilers &amp; Topology</span>
                <span className="text-[11px] text-ink-secondary">NumLang, Lean 4, Computational Geometry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
