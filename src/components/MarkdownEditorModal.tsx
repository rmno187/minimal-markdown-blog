import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Download, Copy, Check, Eye, Code, FileText } from 'lucide-react';

interface MarkdownEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_DRAFT = `---
title: My Next Philosophy Essay
date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
description: Brief one-line summary of what this article is about.
author: NYK
tags: [Essay, Philosophy, Thoughts]
featured: false
---

# My Next Philosophy Essay

Start writing your article here in plain Markdown syntax...

## Key Takeaways

- Point number one
- Point number two

> "In wisdom gathered over time, simplicity remains the ultimate sophistication."

### Code Snippet Example

\`\`\`typescript
console.log("Hello from NYK!");
\`\`\`
`;

export const MarkdownEditorModal: React.FC<MarkdownEditorModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState(DEFAULT_DRAFT);
  const [filename, setFilename] = useState('my_new_article');
  const [activeTab, setActiveTab] = useState<'split' | 'editor' | 'preview'>('split');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const cleanFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-5xl h-[85vh] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-[var(--text-primary)]" />
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono">
                Draft New Markdown Article
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Save directly as <code className="text-[var(--text-primary)]">src/articles/{filename || 'article'}.md</code>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center space-x-1 border border-[var(--border-color)] rounded p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveTab('split')}
                className={`px-2 py-1 rounded ${activeTab === 'split' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}
              >
                Split View
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-2 py-1 rounded ${activeTab === 'editor' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2 py-1 rounded ${activeTab === 'preview' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-mono border border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-colors"
              title="Copy Raw Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-mono font-bold bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
              title="Download .md File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filename Bar */}
        <div className="px-6 py-2 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center space-x-2 text-xs font-mono">
          <span className="text-[var(--text-muted)]">Target File Name:</span>
          <span className="text-[var(--text-secondary)]">src/articles/</span>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            placeholder="my_article_slug"
            className="px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--text-primary)]"
          />
          <span className="text-[var(--text-secondary)]">.md</span>
        </div>

        {/* Editor & Preview Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
          {/* Editor Pane */}
          {(activeTab === 'split' || activeTab === 'editor') && (
            <div className="flex flex-col h-full bg-[var(--bg-primary)]">
              <div className="px-4 py-2 border-b border-[var(--border-color)] text-xs font-mono font-semibold text-[var(--text-muted)] flex items-center space-x-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Markdown Editor</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full flex-1 p-6 font-mono text-sm leading-relaxed bg-transparent text-[var(--text-primary)] focus:outline-none resize-none overflow-y-auto"
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview Pane */}
          {(activeTab === 'split' || activeTab === 'preview') && (
            <div className="flex flex-col h-full bg-[var(--bg-card)] overflow-hidden">
              <div className="px-4 py-2 border-b border-[var(--border-color)] text-xs font-mono font-semibold text-[var(--text-muted)] flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Article Render</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto article-prose text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
