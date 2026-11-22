import React from 'react';
import { profileData, experienceData } from '../../data';
import { Briefcase, CheckCircle2, Compass, Target } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 border-t border-paper-border-subtle relative bg-paper-bg-base">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-academic-seal font-semibold">
            Acta Mathematica et Computatoria • Section I
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
            § 1. Foundational Profile &amp; Research Philosophy
          </h2>
          <p className="font-serif italic text-ink-muted text-sm sm:text-base">
            About &amp; Research Philosophy — An Intellectual Manifesto &amp; Foundations
          </p>
        </div>

        {/* Classical Oxford Double Rule */}
        <hr className="oxford-rule" />

        {/* Wide-Margin Scholarly Narrative Layout */}
        <div className="space-y-8">
          {/* First-Person Intellectual Manifesto with Drop Cap */}
          <div className="space-y-5 font-serif text-ink-secondary text-base sm:text-lg leading-relaxed">
            <p className="drop-cap text-ink-primary">
              I am an independent researcher focused on mathematical discoveries, algorithm design, and computational approaches to understanding complex structures. My interests span theoretical mathematics and computation, with a particular emphasis on developing original ideas through rigorous reasoning.
            </p>
            <p>
              My interest in mathematics began early, and I earned multiple medals in SOF IMO Olympiads during my school years. I now pursue independent research while exploring the connections between mathematical theory, algorithms, scientific computing, and formal verification.
            </p>
            <p className="italic text-ink-primary font-medium">
              I believe in approaching difficult problems with curiosity, persistence, and intellectual honesty.
            </p>
          </div>

          {/* Research Philosophy Formal Theorem Box */}
          <div className="theorem-box my-8">
            <div className="theorem-label">
              Axiom I.1 — Research Philosophy
            </div>
            <blockquote className="theorem-statement text-base sm:text-lg">
              "{profileData.researchPhilosophy}"
            </blockquote>
            <div className="pt-2 flex justify-end">
              <span className="tombstone font-serif text-sm text-academic-amber font-bold">∎</span>
            </div>
          </div>

          {/* Academic Aspirations & Research Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-academic-seal font-semibold flex items-center space-x-2">
                <Target className="w-3.5 h-3.5" />
                <span>Long-Term Ambition</span>
              </div>
              <p className="font-serif text-sm text-ink-primary leading-relaxed italic">
                "{profileData.longTermAmbition}"
              </p>
            </div>

            <div className="p-6 rounded border border-paper-border-strong bg-paper-bg-subtle space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-academic-amber font-semibold flex items-center space-x-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Five-Year Aspiration</span>
              </div>
              <p className="font-serif text-sm text-ink-primary leading-relaxed italic">
                "{profileData.fiveYearAspiration}"
              </p>
            </div>
          </div>

          {/* Practical Technical Stewardship & Applied Systems */}
          <div className="pt-6 border-t border-paper-border-subtle space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-ink-primary uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-academic-seal" />
              <span className="font-bold">Applied Technical Stewardship &amp; Practical Systems Experience</span>
            </div>

            <div className="space-y-4">
              {experienceData.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 rounded border border-paper-border-subtle bg-paper-bg-subtle space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-paper-border-subtle pb-2">
                    <div className="font-serif text-base font-bold text-ink-primary">
                      {exp.organization}
                    </div>
                    <div className="text-xs font-mono px-2.5 py-0.5 rounded border border-paper-border-strong bg-paper-bg-elevated text-ink-primary font-semibold">
                      {exp.role}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-ink-muted">
                    Commercial Enterprise Affiliation: <span className="text-ink-secondary font-medium">{exp.subsidiaryOrFamilyBusiness}</span>
                  </div>

                  <ul className="text-xs sm:text-sm text-ink-secondary space-y-1.5 pt-1 font-serif">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-academic-seal mt-0.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Cross-Reference Link to Centralized Education Section */}
            <div className="pt-4 flex items-center justify-between text-xs font-mono text-ink-muted">
              <span>Verified Institutional Credentials &amp; Enrolment:</span>
              <a
                href="#education"
                className="text-academic-seal hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Inspect § 7. Academic Enrolment &amp; Institutional Credentials →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
