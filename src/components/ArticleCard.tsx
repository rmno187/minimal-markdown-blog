import React from 'react';
import { Article } from '../types';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (slug: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  return (
    <article
      onClick={() => onSelect(article.slug)}
      className="group cursor-pointer p-6 sm:p-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all duration-200"
    >
      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
        <span>{article.date}</span>
        <span>—</span>
        <span>{article.readTime}</span>
        {article.featured && (
          <>
            <span>—</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-[var(--text-primary)] text-[var(--bg-primary)]">
              FEATURED
            </span>
          </>
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-[var(--text-primary)] group-hover:underline decoration-2 underline-offset-4 mb-3">
        {article.title}
      </h2>

      <p className="text-sm sm:text-base text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-6">
        {article.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]/60 text-xs">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[var(--text-muted)]">
          {article.tags.map((tag, idx) => (
            <React.Fragment key={tag}>
              {idx > 0 && <span className="opacity-40 select-none">·</span>}
              <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                {tag}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center space-x-1 font-semibold text-[var(--text-primary)] group-hover:translate-x-1 transition-transform">
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
};
