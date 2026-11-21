import React from 'react';
import { profileData, educationData, experienceData } from '../../data';
import { GraduationCap, Briefcase, Quote, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 border-t border-border-subtle relative bg-bg-base/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <span>01 // Foundational Profile</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
            About & Research Philosophy
          </h2>
        </div>

        {/* 2-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: First-Person Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed font-sans text-base space-y-4">
              <p className="text-lg text-text-primary font-medium leading-relaxed">
                "I am an independent researcher focused on mathematical discoveries, algorithm design, and computational approaches to understanding complex structures. My interests span theoretical mathematics and computation, with a particular emphasis on developing original ideas through rigorous reasoning."
              </p>
              <p>
                "My interest in mathematics began early, and I earned multiple medals in SOF IMO Olympiads during my school years. I now pursue independent research while exploring the connections between mathematical theory, algorithms, scientific computing, and formal verification."
              </p>
              <p>
                "I believe in approaching difficult problems with curiosity, persistence, and intellectual honesty."
              </p>
            </div>

            {/* Research Philosophy Highlight Box */}
            <div className="p-6 rounded-lg bg-bg-surface border-l-4 border-amber-500 border-y border-r border-border-subtle relative">
              <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
              <div className="text-xs font-mono text-amber-500 uppercase tracking-wider mb-2 font-semibold">
                Research Philosophy
              </div>
              <blockquote className="text-text-primary font-serif italic text-base leading-relaxed">
                "{profileData.researchPhilosophy}"
              </blockquote>
            </div>

            {/* Aspirations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle space-y-2">
                <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Long-Term Ambition
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-mono">
                  "{profileData.longTermAmbition}"
                </p>
              </div>

              <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle space-y-2">
                <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Five-Year Aspiration
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-mono">
                  "{profileData.fiveYearAspiration}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Education & Professional Experience */}
          <div className="lg:col-span-5 space-y-8">
            {/* Education Box */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-text-primary uppercase tracking-wider pb-2 border-b border-border-subtle">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">Academic Education</span>
              </div>

              <div className="space-y-4">
                {educationData.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-lg bg-bg-surface border border-border-subtle hover:border-border-medium transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-mono text-sm font-bold text-text-primary">
                        {edu.institution}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex-shrink-0">
                        {edu.status}
                      </span>
                    </div>

                    <div className="text-xs text-amber-500/90 font-mono">
                      {edu.programmeOrStage}
                    </div>

                    {edu.notes && (
                      <p className="text-[11px] text-text-muted leading-relaxed font-sans pt-1">
                        {edu.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Experience Box */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-text-primary uppercase tracking-wider pb-2 border-b border-border-subtle">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">Practical Technical Experience</span>
              </div>

              <div className="space-y-4">
                {experienceData.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-lg bg-bg-surface border border-border-subtle hover:border-border-medium transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-mono text-sm font-bold text-text-primary">
                        {exp.organization}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-elevated text-text-secondary border border-border-subtle">
                        {exp.role}
                      </span>
                    </div>

                    <div className="text-xs text-text-muted font-mono">
                      Family Enterprise: {exp.subsidiaryOrFamilyBusiness}
                    </div>

                    <ul className="text-xs text-text-secondary space-y-1.5 pt-2">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500/80 mt-0.5 flex-shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
