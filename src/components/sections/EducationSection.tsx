import React from 'react';
import { educationData } from '../../data';
import { Check } from 'lucide-react';
import { useIntersectionObserver } from '../../utils/intersectionObserver';

export const EducationSection: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="education"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/30 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
              § 7
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              § 7. Academic Enrolment &amp; Institutional Credentials
            </h2>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Education &amp; Institutional Credentials — Official Academic Registry &amp; Verified Matriculation
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded border border-paper-border-strong bg-paper-bg-subtle text-ink-secondary font-mono text-xs flex items-center space-x-2 self-start md:self-auto font-semibold">
            <span>Verified Enrolment Data</span>
          </div>
        </div>

        {/* Institutional Integrity Notice */}
        <p className="font-serif text-sm text-ink-secondary leading-relaxed max-w-3xl">
          Academic credentials are strictly bounded by confirmed institutional enrolment records. Consistent with research portfolio integrity standards, no unverified graduation dates, admission years, or synthetic grades are claimed.
        </p>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        {/* Formal Academic Dossier Table */}
        <div className="overflow-x-auto border border-paper-border-strong rounded bg-paper-bg-base shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-paper-border-strong bg-paper-bg-subtle font-mono text-xs text-ink-primary uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 font-bold">Academic Institution</th>
                <th className="py-3.5 px-4 sm:px-6 font-bold">Degree / Programme Stage</th>
                <th className="py-3.5 px-4 sm:px-6 font-bold">Status</th>
                <th className="py-3.5 px-4 sm:px-6 font-bold hidden sm:table-cell">Institutional Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-border-subtle font-serif text-sm text-ink-secondary">
              {educationData.map((edu) => (
                <tr key={edu.id} className="hover:bg-paper-bg-subtle/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 align-top">
                    <div className="font-bold text-ink-primary text-base">
                      {edu.institution}
                    </div>
                    <div className="text-xs font-mono text-ink-muted pt-1">
                      {edu.type === 'higher-education' ? 'Higher Education Institution' : 'Secondary School Education'}
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 align-top">
                    <div className="font-serif text-ink-primary font-medium">
                      {edu.programmeOrStage}
                    </div>
                    {edu.notes && (
                      <div className="text-xs font-serif italic text-ink-muted pt-1">
                        {edu.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 sm:px-6 align-top">
                    <span className="inline-block px-2.5 py-1 rounded border border-academic-amber/40 bg-academic-amber/10 font-mono text-xs text-academic-amber font-semibold whitespace-nowrap">
                      {edu.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 align-top hidden sm:table-cell">
                    <div className="flex items-center space-x-1.5 text-xs font-mono text-ink-secondary">
                      <Check className="w-3.5 h-3.5 text-academic-amber flex-shrink-0" />
                      <span>Confirmed Enrolment Record</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verification Footnote */}
        <div className="p-4 rounded border border-paper-border-subtle bg-paper-bg-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-ink-muted">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-muted" />
            <span>Archive Classification: Certified Institutional Matriculation Record</span>
          </div>
          <span className="text-ink-secondary font-semibold">IIT Madras BS Aerospace &amp; Eon Gyanankur Class XII</span>
        </div>
      </div>
    </section>
  );
};
