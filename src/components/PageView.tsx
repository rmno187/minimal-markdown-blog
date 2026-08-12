import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Page } from '../types';
import { Check, Copy } from 'lucide-react';

interface PageViewProps {
  page: Page;
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

export const PageView: React.FC<PageViewProps> = ({ page, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Page Header */}
      <header className="mb-10 border-b border-[var(--border-color)] pb-8">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.9] text-[var(--text-primary)] mb-6 uppercase">
          {page.title}
        </h1>
        
        {page.description && (
          <p className="mt-2 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
            {page.description}
          </p>
        )}
      </header>

      {/* Rendered Markdown Body */}
      <main className="article-prose text-[var(--text-primary)] leading-relaxed">
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
          {page.content}
        </ReactMarkdown>
      </main>

      {/* Page Footer Source Reference */}
      <footer className="mt-16 pt-6 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
      </footer>
    </div>
  );
};
