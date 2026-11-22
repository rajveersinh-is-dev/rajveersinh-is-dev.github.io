import React, { useState } from 'react';
import { contactData } from '../../data';
import { copyTextToClipboard } from '../../utils/clipboard';
import {
  Copy,
  Check,
  ExternalLink,
  Send,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Mail
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

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
    <section id="contact" className="py-20 border-t border-paper-border-subtle relative bg-paper-bg-subtle/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-academic-seal font-semibold">
            Epistolae et Communicatio • Section X
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
            § 10. Academic Correspondence &amp; Epistolary Exchange
          </h2>
          <p className="font-serif italic text-ink-muted text-sm sm:text-base">
            Contact &amp; Academic Inquiries — Direct Communication for Mathematical Research &amp; Scholarly Preprints
          </p>
        </div>

        {/* Oxford Rule Divider */}
        <hr className="oxford-rule" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Address & Profiles */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded border border-paper-border-strong bg-paper-bg-base space-y-4 shadow-sm">
              <div className="text-xs font-mono text-academic-seal uppercase tracking-wider font-semibold flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Direct Scholarly Dispatch</span>
              </div>

              <div className="space-y-2">
                <a
                  href={`mailto:${contactData.email}`}
                  className="font-serif text-lg font-bold text-ink-primary hover:text-academic-seal transition-colors block break-all"
                >
                  {contactData.email}
                </a>
                <p className="font-serif text-xs text-ink-secondary leading-relaxed">
                  Official correspondence channel for mathematical research exchanges, preprint reviews, and algorithmic collaboration.
                </p>
              </div>

              <button
                onClick={handleCopyEmail}
                className="w-full py-2.5 px-4 rounded border border-paper-border-strong hover:border-academic-seal bg-paper-bg-subtle text-xs font-mono text-ink-primary flex items-center justify-center space-x-2 transition-colors font-medium"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-academic-seal" />
                    <span className="text-academic-seal font-bold">Email Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-academic-amber" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Cryptographic Communication & Integrity Note */}
            <div className="p-4 rounded border border-paper-border-subtle bg-paper-bg-base space-y-2 text-xs font-mono text-ink-muted">
              <div className="flex items-center space-x-1.5 text-academic-seal font-semibold">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Cryptographic &amp; Academic Integrity Note</span>
              </div>
              <p className="font-serif text-[11px] text-ink-secondary leading-relaxed">
                All preprints and research releases are cryptographically deposited on Zenodo with immutable DOIs. For sensitive discussions, secure correspondence is welcomed via direct institutional channels.
              </p>
            </div>

            {/* Verified Academic & Code Profiles */}
            <div className="space-y-3 font-mono text-xs">
              <div className="text-ink-muted uppercase tracking-wider text-[11px] font-semibold">
                Verified Archival &amp; Code Profiles
              </div>

              <div className="grid grid-cols-1 gap-2">
                <a
                  href={contactData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded border border-paper-border-subtle hover:border-academic-seal bg-paper-bg-base flex items-center justify-between text-ink-secondary hover:text-ink-primary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <GithubIcon className="w-4 h-4 text-academic-seal" />
                    <span>GitHub: rajveersinh-is-dev</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
                </a>

                <a
                  href={contactData.kaggleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded border border-paper-border-subtle hover:border-academic-seal bg-paper-bg-base flex items-center justify-between text-ink-secondary hover:text-ink-primary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-academic-amber font-serif">K</span>
                    <span>Kaggle: rajveerpardeshi (7th Ranked)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
                </a>

                <a
                  href={contactData.orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded border border-paper-border-subtle hover:border-academic-seal bg-paper-bg-base flex items-center justify-between text-ink-secondary hover:text-ink-primary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] px-1 bg-academic-seal/10 text-academic-seal rounded font-bold">iD</span>
                    <span>ORCID: 0009-0004-7838-4064</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
                </a>

                <a
                  href={contactData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded border border-paper-border-subtle hover:border-academic-seal bg-paper-bg-base flex items-center justify-between text-ink-secondary hover:text-ink-primary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <LinkedinIcon className="w-4 h-4 text-academic-seal" />
                    <span>LinkedIn: rajveer-pardeshi</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Offline-Honest Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded border border-paper-border-strong bg-paper-bg-base space-y-6 shadow-sm">
              <div className="space-y-2 border-b border-paper-border-subtle pb-4">
                <h3 className="font-serif text-xl font-bold text-ink-primary">
                  Compose Academic Inquiry
                </h3>
                <div className="p-3 rounded border border-paper-border-subtle bg-paper-bg-subtle flex items-start space-x-2 text-xs font-mono text-ink-muted">
                  <ShieldCheck className="w-4 h-4 text-academic-seal mt-0.5 flex-shrink-0" />
                  <span>
                    Offline Architecture Notice: This archive operates strictly client-side without third-party tracking servers. Submitting this form prepares your message locally and opens your native email client via mailto, with copyable text as a fallback.
                  </span>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded border border-academic-seal/50 bg-academic-seal/10 text-academic-seal text-xs font-mono flex items-center space-x-2">
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
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full px-3 py-2 rounded border border-paper-border-subtle bg-paper-bg-subtle focus:border-academic-seal focus:outline-none text-ink-primary font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ink-secondary font-medium block">Your Email Address *</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. jdoe@institution.edu"
                      className="w-full px-3 py-2 rounded border border-paper-border-subtle bg-paper-bg-subtle focus:border-academic-seal focus:outline-none text-ink-primary font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-ink-secondary font-medium block">Subject / Research Topic</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiries regarding Hypergraph Homology or NumLang SSA"
                    className="w-full px-3 py-2 rounded border border-paper-border-subtle bg-paper-bg-subtle focus:border-academic-seal focus:outline-none text-ink-primary font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-ink-secondary font-medium block">Message *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="State your scholarly inquiry, feedback, or proposed collaborative direction..."
                    className="w-full px-3 py-2 rounded border border-paper-border-subtle bg-paper-bg-subtle focus:border-academic-seal focus:outline-none text-ink-primary font-mono text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded border border-academic-seal bg-academic-seal hover:bg-academic-seal/90 text-white font-mono font-bold flex items-center justify-center space-x-2 transition-colors uppercase tracking-wider text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Prepare &amp; Open Native Mail Client</span>
                </button>
              </form>

              {preparedPayload && (
                <div className="p-4 rounded border border-paper-border-subtle bg-paper-bg-elevated space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-academic-seal font-semibold">
                    <span>Generated Message Body:</span>
                    <button
                      onClick={async () => {
                        const ok = await copyTextToClipboard(preparedPayload);
                        if (ok) {
                          setCopiedPayload(true);
                          setTimeout(() => setCopiedPayload(false), 2000);
                        }
                      }}
                      className="text-ink-muted hover:text-academic-seal text-[11px] underline flex items-center space-x-1"
                    >
                      {copiedPayload ? (
                        <>
                          <Check className="w-3 h-3 text-academic-seal" />
                          <span className="text-academic-seal">Copied!</span>
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
