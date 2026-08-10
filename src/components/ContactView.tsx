import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Github, Twitter, MapPin } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Header */}
      <header className="mb-12 border-b border-[var(--border-color)] pb-8">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] block mb-2">
          GET IN TOUCH
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-[var(--text-primary)] uppercase">
          CONTACT.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
          Have a question, feedback on an article, or want to collaborate? Send a message directly.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Contact Information Column */}
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Direct Contact
            </h3>
            <a
              href="mailto:contact@nyk-blog.com"
              className="flex items-center space-x-2 text-[var(--text-primary)] hover:underline font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>contact@nyk-blog.com</span>
            </a>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Social & Code
            </h3>
            <div className="space-y-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter / X</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)]">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Location & Timezone
            </h3>
            <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
              <MapPin className="w-3.5 h-3.5" />
              <span>San Francisco, CA • UTC-7</span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2">
          {submitted ? (
            <div className="p-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Message Delivered</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Thank you for reaching out, <strong className="text-[var(--text-primary)]">{formData.name}</strong>. Your message has been received and you will get a reply at <span className="font-mono text-[var(--text-primary)]">{formData.email}</span> shortly.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Your Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Article Inquiry or Collaboration"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your note here..."
                  className="w-full px-3.5 py-2.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
