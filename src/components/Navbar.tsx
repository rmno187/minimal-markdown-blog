import React, { useRef, useEffect } from 'react';
import { NavigationPage, Page } from '../types';
import { Sun, Moon, Search, X } from 'lucide-react';
import { siteConfig } from '../site.config';
import { Logo } from './Logo';

interface NavbarProps {
  currentPage: NavigationPage;
  pages?: Page[];
  onNavigate: (page: NavigationPage, articleSlug?: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  allTags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  pages = [],
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  onToggleSearch,
  allTags,
  selectedTag,
  onSelectTag,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Default fallback pages if none discovered yet
  const navPages = (pages.length > 0 ? pages : [
    { slug: 'about', title: 'About' }
  ]).filter((page) => !page.hideFromMenu);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-color)] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('articles')}
          className="group flex items-center space-x-2.5 text-left focus:outline-none"
        >
          <Logo size={24} />
          <span className="text-2xl font-black tracking-tighter text-[var(--text-primary)] group-hover:opacity-80 transition-opacity">
            {siteConfig.siteName}
          </span>
        </button>

        {/* Navigation Links (Discovered Pages) */}
        <nav className="flex items-center space-x-1 sm:space-x-8 text-xs font-semibold uppercase tracking-widest">
          {navPages.map((page) => (
            <button
              key={page.slug}
              onClick={() => onNavigate(page.slug)}
              className={`px-2 py-1 transition-colors border-b-2 ${
                currentPage === page.slug
                  ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {page.title}
            </button>
          ))}
        </nav>


        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onToggleSearch}
            title="Search articles & tags"
            className={`p-2 rounded-md transition-colors ${
              isSearchOpen || searchQuery || selectedTag
                ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Search className="w-4 h-4" />
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

      {/* Understated Slide-Down Search & Tag Bar */}
      {isSearchOpen && (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-4 sm:px-6 py-4 animate-fade-in shadow-sm">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center space-x-3 border-b border-[var(--text-primary)] pb-2">
              <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-transparent text-sm sm:text-base font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm p-1 transition-colors"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onToggleSearch}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm p-1 transition-colors"
                  title="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tags displayed under search bar */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1 text-xs font-mono text-[var(--text-muted)]">
                
                <button
                  onClick={() => onSelectTag(null)}
                  className={`transition-colors ${
                    selectedTag === null
                      ? 'font-bold text-[var(--text-primary)] underline underline-offset-4 decoration-2'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  All
                </button>

                {allTags.map((tag) => (
                  <React.Fragment key={tag}>
                    <span className="text-[var(--text-muted)] opacity-40 select-none">·</span>
                    <button
                      onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
                      className={`transition-colors ${
                        selectedTag === tag
                          ? 'font-bold text-[var(--text-primary)] underline underline-offset-4 decoration-2'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {tag}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

