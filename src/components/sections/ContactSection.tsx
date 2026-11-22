import React, { useState } from 'react';
import { contactData } from '../../data';
import { copyTextToClipboard } from '../../utils/clipboard';
import { MaskedReveal } from '../common/MaskedReveal';
import {
  Copy,
  Check,
  ExternalLink,
  Send,
  AlertCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { useIntersectionObserver } from '../../utils/intersectionObserver';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  // Form states
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [preparedPayload, setPreparedPayload] = useState<string | null>(null);

  const handleCopyEmail = async () => {
    const success = await copyTextToClipboard(contactData.email);
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validation
    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!senderEmail.trim() || !senderEmail.includes('@') || !senderEmail.includes('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setFormError('Message must contain at least 10 characters.');
      return;
    }

    const compiledSubject = encodeURIComponent(
      subject.trim() || `Inquiry from ${name} via Research Archive`
    );
    const bodyContent = `Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`;
    const compiledBody = encodeURIComponent(bodyContent);

    // Save formatted payload for copy or mailto
    setPreparedPayload(bodyContent);

    // Trigger local default email client via mailto
    window.location.href = `mailto:${contactData.email}?subject=${compiledSubject}&body=${compiledBody}`;
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/30 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Oversized Low-Contrast Display Numeral */}
        <div
          aria-hidden="true"
          className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black text-ink-primary/[0.04] dark:text-ink-primary/[0.06] select-none pointer-events-none absolute -top-12 sm:-top-16 right-4 sm:right-12 leading-none"
        >
          12
        </div>

        {/* Section Header */}
        <div className="space-y-3 relative z-10">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
            § 12
          </div>
          <MaskedReveal>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              § 12. Academic Correspondence &amp; Epistolary Exchange
            </h2>
          </MaskedReveal>
          <MaskedReveal delayMs={150}>
            <p className="font-serif italic text-ink-muted text-sm sm:text-base">
              Contact &amp; Academic Inquiries — Direct Communication for Mathematical Research &amp; Scholarly Preprints
            </p>
          </MaskedReveal>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Purely Typographic Address & Profiles */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-mono text-ink-muted uppercase tracking-wider block font-semibold">
                Direct Inquiries
              </span>

              <a
                href={`mailto:${contactData.email}`}
                className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary hover:text-academic-amber transition-colors block break-all leading-tight"
              >
                {contactData.email}
              </a>

              <p className="font-serif text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Official correspondence channel for mathematical research exchanges, preprint discussions, and algorithmic collaboration.
              </p>

              <div>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-ink-muted hover:text-academic-amber transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-academic-amber" />
                      <span className="text-academic-amber font-semibold">Email Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="underline">Copy email address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verified Academic & Code Profiles: Plain text links with underline on hover, no border boxes */}
            <div className="space-y-3 pt-4 border-t border-paper-border-subtle">
              <span className="text-ink-muted uppercase tracking-wider text-[11px] font-mono font-semibold block">
                Verified Profiles &amp; Registries
              </span>

              <div className="space-y-2.5 font-mono text-xs">
                <div>
                  <a
                    href={contactData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-ink-secondary hover:text-ink-primary hover:underline transition-colors"
                  >
                    <GithubIcon className="w-4 h-4 text-ink-muted" />
                    <span>GitHub: rajveersinh-is-dev</span>
                    <ExternalLink className="w-3 h-3 text-ink-muted" />
                  </a>
                </div>

                <div>
                  <a
                    href={contactData.kaggleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-ink-secondary hover:text-ink-primary hover:underline transition-colors"
                  >
                    <span className="font-bold text-academic-amber font-serif w-4 text-center">K</span>
                    <span>Kaggle: rajveerpardeshi (7th Ranked)</span>
                    <ExternalLink className="w-3 h-3 text-ink-muted" />
                  </a>
                </div>

                <div>
                  <a
                    href={contactData.orcidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-ink-secondary hover:text-ink-primary hover:underline transition-colors"
                  >
                    <span className="text-[10px] px-1 bg-paper-bg-elevated text-ink-secondary rounded font-bold">iD</span>
                    <span>ORCID: 0009-0004-7838-4064</span>
                    <ExternalLink className="w-3 h-3 text-ink-muted" />
                  </a>
                </div>

                <div>
                  <a
                    href={contactData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-ink-secondary hover:text-ink-primary hover:underline transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4 text-ink-muted" />
                    <span>LinkedIn: rajveer-pardeshi</span>
                    <ExternalLink className="w-3 h-3 text-ink-muted" />
                  </a>
                </div>
              </div>
            </div>

            {/* Cryptographic & Academic Integrity Note */}
            <div className="pt-2 text-xs font-mono text-ink-muted">
              <p className="font-serif text-[11px] text-ink-muted leading-relaxed">
                All preprints and research releases are cryptographically deposited on Zenodo with immutable DOIs.
              </p>
            </div>
          </div>

          {/* Right Column: Functional Form Area (Retains border container) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded border border-paper-border-strong bg-paper-bg-base space-y-6 shadow-sm">
              <div className="space-y-2 border-b border-paper-border-subtle pb-4">
                <h3 className="font-serif text-xl font-bold text-ink-primary">
                  Compose Academic Inquiry
                </h3>
                <p className="text-xs font-mono text-ink-muted">
                  Client-side dispatch: Prepares your message locally and opens your native email client via mailto, with copyable text as a fallback.
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded border border-academic-amber/50 bg-academic-amber/10 text-academic-amber text-xs font-mono flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 font-serif text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-ink-secondary font-medium block">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 rounded border border-paper-border-subtle bg-paper-bg-subtle focus:border-paper-border-strong focus:outline-none text-ink-primary font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ink-secondary font-medium block">Your Email Address *</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 rounded border border-paper-border-subtle bg-paper-bg-subtle focus:border-paper-border-strong focus:outline-none text-ink-primary font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-ink-secondary font-medium block">Subject / Research Topic</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Research collaboration, questions, feedback..."
                    className="w-full px-3 py-2 rounded border border-paper-border-subtle bg-paper-bg-subtle focus:border-paper-border-strong focus:outline-none text-ink-primary font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-ink-secondary font-medium block">Message *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full px-3 py-2 rounded border border-paper-border-subtle bg-paper-bg-subtle focus:border-paper-border-strong focus:outline-none text-ink-primary font-mono text-xs leading-relaxed"
                  />
                </div>

                {/* Form submit button: academic-seal reserved here */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded border border-academic-seal bg-academic-seal hover:bg-academic-seal/90 text-white font-mono font-bold flex items-center justify-center space-x-2 transition-colors uppercase tracking-wider text-xs cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Prepare &amp; Open Native Mail Client</span>
                </button>
              </form>

              {preparedPayload && (
                <div className="p-4 rounded border border-paper-border-subtle bg-paper-bg-elevated space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-ink-primary font-semibold">
                    <span>Generated Message Body:</span>
                    <button
                      onClick={async () => {
                        const ok = await copyTextToClipboard(preparedPayload);
                        if (ok) {
                          setCopiedPayload(true);
                          setTimeout(() => setCopiedPayload(false), 2000);
                        }
                      }}
                      className="text-ink-muted hover:text-academic-amber text-[11px] underline flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedPayload ? (
                        <>
                          <Check className="w-3 h-3 text-academic-amber" />
                          <span className="text-academic-amber">Copied!</span>
                        </>
                      ) : (
                        <span>Copy message text</span>
                      )}
                    </button>
                  </div>
                  <pre className="p-2.5 rounded border border-paper-border-subtle bg-paper-bg-base text-ink-secondary whitespace-pre-wrap text-[11px]">
                    {preparedPayload}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
