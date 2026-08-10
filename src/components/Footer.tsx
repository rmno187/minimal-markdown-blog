import React from 'react';
import { Github, ArrowUp, Rss } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--border-color)] mt-24 py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[var(--text-secondary)]">
        <div className="flex flex-col space-y-1 text-center md:text-left">
          <p className="font-semibold text-[var(--text-primary)]">NYK Minimalist Blog</p>
          <p className="text-xs text-[var(--text-muted)]">
            Static Markdown blog engine • Ready for GitHub & Vercel deployment
          </p>
        </div>

        <div className="flex items-center space-x-6 text-xs">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-[var(--text-primary)] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Vercel Ready
          </a>
          <button
            onClick={() => alert('RSS Feed: /rss.xml static feed URL ready for Vercel deployment.')}
            className="flex items-center space-x-1.5 hover:text-[var(--text-primary)] transition-colors"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>RSS</span>
          </button>
          <button
            onClick={scrollToTop}
            className="p-1.5 rounded border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            title="Back to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
