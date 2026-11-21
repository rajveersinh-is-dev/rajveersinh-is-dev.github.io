import React, { useState } from 'react';
import { contactData } from '../../data';
import { copyTextToClipboard } from '../../utils/clipboard';
import {
  Copy,
  Check,
  ExternalLink,
  Send,
  ShieldCheck,
  AlertCircle
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
      subject.trim() || `Inquiry from ${name} via Research Portfolio`
    );
    const bodyContent = `Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`;
    const compiledBody = encodeURIComponent(bodyContent);

    // Save formatted payload for copy or mailto
    setPreparedPayload(bodyContent);

    // Trigger local default email client via mailto
    window.location.href = `mailto:${contactData.email}?subject=${compiledSubject}&body=${compiledBody}`;
  };

  return (
    <section id="contact" className="py-20 border-t border-border-subtle relative bg-bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <span>10 // Communication</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-text-primary uppercase tracking-tight">
            Contact & Academic Inquiries
          </h2>
          <p className="text-xs text-text-muted font-mono max-w-2xl">
            Direct channels for mathematical research discussions, preprint correspondence, and collaborative algorithmic inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Links & Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-lg bg-bg-surface border border-border-medium space-y-4">
              <div className="text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
                Direct Email Dispatch
              </div>

              <div className="space-y-2">
                <a
                  href={`mailto:${contactData.email}`}
                  className="font-mono text-lg font-bold text-text-primary hover:text-amber-400 transition-colors block break-all"
                >
                  {contactData.email}
                </a>
                <p className="text-xs text-text-secondary font-sans leading-relaxed">
                  The researcher has approved public display of this address for scientific collaboration and research exchanges.
                </p>
              </div>

              <button
                onClick={handleCopyEmail}
                className="w-full py-2.5 px-4 rounded bg-bg-elevated hover:bg-bg-card border border-border-subtle hover:border-amber-500/50 text-xs font-mono text-text-primary flex items-center justify-center space-x-2 transition-colors"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold">Email Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-500" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Social & Academic Verified Records */}
            <div className="space-y-3 font-mono text-xs">
              <div className="text-text-dim uppercase tracking-wider text-[11px] font-semibold">
                Verified Research Profiles
              </div>

              <div className="grid grid-cols-1 gap-2">
                <a
                  href={contactData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-bg-surface border border-border-subtle hover:border-amber-500/50 flex items-center justify-between text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <GithubIcon className="w-4 h-4 text-amber-500" />
                    <span>GitHub: rajveersinh-is-dev</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-dim" />
                </a>

                <a
                  href={contactData.kaggleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-bg-surface border border-border-subtle hover:border-amber-500/50 flex items-center justify-between text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-amber-500">K</span>
                    <span>Kaggle: rajveerpardeshi (7th Ranked)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-dim" />
                </a>

                <a
                  href={contactData.orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-bg-surface border border-border-subtle hover:border-amber-500/50 flex items-center justify-between text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] px-1 bg-amber-500/20 text-amber-400 rounded">iD</span>
                    <span>ORCID: 0009-0004-7838-4064</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-dim" />
                </a>

                <a
                  href={contactData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-bg-surface border border-border-subtle hover:border-amber-500/50 flex items-center justify-between text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <LinkedinIcon className="w-4 h-4 text-amber-500" />
                    <span>LinkedIn: rajveer-pardeshi</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-dim" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Offline-Honest Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-lg bg-bg-surface border border-border-medium space-y-6">
              <div className="space-y-2">
                <h3 className="font-mono text-lg font-bold text-text-primary">
                  Compose Inquiry
                </h3>
                {/* Honest offline architecture explanation */}
                <div className="p-3 rounded bg-bg-base border border-border-subtle flex items-start space-x-2 text-xs font-mono text-text-muted">
                  <ShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Offline Architecture Notice: This portfolio operates strictly client-side without third-party tracking servers. Submitting this form prepares your message locally and opens your native email client via mailto, with copyable text as a fallback.
                  </span>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-mono flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-text-muted block">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full px-3 py-2 rounded bg-bg-base border border-border-subtle focus:border-amber-500 focus:outline-none text-text-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-muted block">Your Email Address *</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. jdoe@institution.edu"
                      className="w-full px-3 py-2 rounded bg-bg-base border border-border-subtle focus:border-amber-500 focus:outline-none text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-muted block">Subject / Research Topic</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Question on Hypergraph Homology / NumLang"
                    className="w-full px-3 py-2 rounded bg-bg-base border border-border-subtle focus:border-amber-500 focus:outline-none text-text-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-muted block">Message *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your research inquiry, comment, or proposed topic..."
                    className="w-full px-3 py-2 rounded bg-bg-base border border-border-subtle focus:border-amber-500 focus:outline-none text-text-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded bg-amber-500 hover:bg-amber-600 text-bg-void font-bold flex items-center justify-center space-x-2 transition-colors uppercase tracking-wider text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Prepare & Open Email Client</span>
                </button>
              </form>

              {preparedPayload && (
                <div className="p-4 rounded bg-bg-elevated border border-border-subtle space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-amber-400 font-semibold">
                    <span>Generated Message Body:</span>
                    <button
                      onClick={async () => {
                        const ok = await copyTextToClipboard(preparedPayload);
                        if (ok) {
                          setCopiedPayload(true);
                          setTimeout(() => setCopiedPayload(false), 2000);
                        }
                      }}
                      className="text-text-muted hover:text-amber-400 text-[11px] underline flex items-center space-x-1"
                    >
                      {copiedPayload ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <span>Copy message text</span>
                      )}
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-bg-base border border-border-subtle text-text-secondary whitespace-pre-wrap text-[11px]">
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
