import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Article } from '../types';
import { ArrowLeft, Clock, Calendar, Share2, Check, Copy, Type, FileText } from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

// Custom CodeBlock component with copy functionality
const CodeBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--code-bg)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] bg-black/20 text-xs font-mono text-zinc-400">
        <span>{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-100 leading-relaxed">
        <code>{value}</code>
      </pre>
    </div>
  );
};

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedLink, setCopiedLink] = useState(false);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const fontSizeClasses = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-relaxed',
    xlarge: 'text-xl sm:text-2xl leading-relaxed',
  };

  return (
    <div className="relative pb-24">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
        <div
          className="h-full bg-[var(--text-primary)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top Controls */}
        <div className="flex items-center justify-between py-8 border-b border-[var(--border-color)] mb-10 text-xs font-mono">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="flex items-center space-x-4 text-[var(--text-secondary)]">
            {/* Font size toggle */}
            <div className="flex items-center space-x-1 border border-[var(--border-color)] rounded p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  fontSize === 'normal' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold' : ''
                }`}
                title="Standard Text Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-xs ${
                  fontSize === 'large' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold' : ''
                }`}
                title="Large Text Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded text-sm ${
                  fontSize === 'xlarge' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold' : ''
                }`}
                title="Extra Large Text Size"
              >
                A++
              </button>
            </div>

            {/* Share / Copy link */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-2.5 py-1 rounded border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
              title="Copy Article Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4">
            {article.date} — {article.readTime}
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.9] text-[var(--text-primary)] mb-6 uppercase">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-normal border-l-4 border-[var(--text-primary)] pl-5 py-1 mb-6">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Markdown Rendered Content */}
        <main className={`article-prose ${fontSizeClasses[fontSize]}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !String(children).includes('\n');

                if (!isInline) {
                  return (
                    <CodeBlock
                      language={match ? match[1] : ''}
                      value={String(children).replace(/\n$/, '')}
                    />
                  );
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </main>

        {/* Article Footer & File Path Reference */}
        <footer className="mt-16 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <div>
            <span>Article Source File: </span>
            <code className="px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              src/articles/{article.slug}.md
            </code>
          </div>

          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-[var(--text-primary)] font-semibold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to index</span>
          </button>
        </footer>
      </article>
    </div>
  );
};
