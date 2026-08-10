import React from 'react';
import { Terminal, Shield, Feather, GitBranch, Server, Zap } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Header */}
      <header className="mb-12 border-b border-[var(--border-color)] pb-8">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] block mb-2">
          MANIFESTO & PHILOSOPHY
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-[var(--text-primary)]">
          ABOUT NYK.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
          A minimalist publishing system built on pure Markdown, clean typography, and quiet web design.
        </p>
      </header>

      {/* Main Content */}
      <div className="space-y-12 text-[var(--text-primary)]">
        {/* Core Principles */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
            <Feather className="w-5 h-5 text-[var(--text-primary)]" />
            <span>Core Philosophy</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            NYK was built for writers and developers who value simplicity above all else. Modern blogging platforms have become cluttered with popups, tracking pixels, heavy JavaScript frameworks, artificial intelligence bloat, and paywalls.
          </p>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            NYK rejects the noise. There are no databases to maintain, no user authentication passwords to reset, no subscription forms, and strictly zero AI generation layers. Just plain `.md` files versioned in Git and rendered with crisp typography.
          </p>
        </section>

        {/* Technical Architecture */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[var(--text-primary)]" />
            <span>Technical Architecture</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[var(--text-primary)]">
                <GitBranch className="w-4 h-4" />
                <span>File-Based Publishing</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Every article is stored as a plain Markdown file inside <code className="px-1 py-0.5 rounded bg-[var(--bg-secondary)]">src/articles/article_title.md</code> with standard YAML frontmatter headers.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[var(--text-primary)]">
                <Server className="w-4 h-4" />
                <span>GitHub & Vercel Native</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Connect your GitHub repository to Vercel. Every <code className="px-1 py-0.5 rounded bg-[var(--bg-secondary)]">git push</code> triggers an instantaneous global deployment in under 20 seconds.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[var(--text-primary)]">
                <Shield className="w-4 h-4" />
                <span>Zero Server Complexity</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                No SQL databases, no server maintenance, and no security vulnerability vectors. Completely static and secure by design.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[var(--text-primary)]">
                <Zap className="w-4 h-4" />
                <span>Lightning Fast Performance</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Sub-100ms page loads powered by Vite client-side bundle rendering and static asset distribution via Vercel Edge Network.
              </p>
            </div>
          </div>
        </section>

        {/* How to add posts */}
        <section className="p-6 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
          <h3 className="font-mono text-sm font-bold text-[var(--text-primary)]">
            How to publish a new article:
          </h3>
          <ol className="list-decimal list-inside text-xs sm:text-sm text-[var(--text-secondary)] space-y-2 font-mono">
            <li>Create a new file in <code className="text-[var(--text-primary)] font-bold">src/articles/your-post-name.md</code></li>
            <li>Add YAML frontmatter (title, date, description, tags)</li>
            <li>Write your post content in standard Markdown</li>
            <li>Commit to GitHub: <code className="text-[var(--text-primary)]">git add . && git commit -m "Add post" && git push</code></li>
            <li>Vercel builds and publishes your new article automatically!</li>
          </ol>
        </section>
      </div>
    </div>
  );
};
