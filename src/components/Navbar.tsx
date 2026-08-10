import React from 'react';
import { NavigationPage } from '../types';
import { Sun, Moon, PenSquare, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage, articleSlug?: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenEditor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  onOpenEditor,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-color)] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('articles')}
          className="group flex items-center space-x-2 text-left focus:outline-none"
        >
          <span className="text-2xl font-black tracking-tighter text-[var(--text-primary)] group-hover:opacity-80 transition-opacity">
            NYK
          </span>
          <span className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded border border-[var(--border-color)] text-[var(--text-secondary)]">
            .md
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-8 text-xs font-semibold uppercase tracking-widest">
          <button
            onClick={() => onNavigate('articles')}
            className={`px-2 py-1 transition-colors border-b-2 ${
              currentPage === 'articles' || currentPage === 'article-detail'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Index
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`px-2 py-1 transition-colors border-b-2 ${
              currentPage === 'about'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`px-2 py-1 transition-colors border-b-2 ${
              currentPage === 'contact'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenEditor}
            title="Draft / Test Markdown Article"
            className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] transition-all"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Draft .md</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
