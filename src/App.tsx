import React, { useState, useEffect, useMemo } from 'react';
import { getAllArticles, getArticleBySlug, getAllPages, getPageBySlug } from './lib/articles';
import { NavigationPage, Article } from './types';
import { siteConfig } from './site.config';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { PageView } from './components/PageView';
import { MarkdownEditorModal } from './components/MarkdownEditorModal';
import { FileText, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('articles');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nyk_theme') === 'dark';
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Sync document favicon from siteConfig
  useEffect(() => {
    const faviconUrl = siteConfig.favicon?.url || '/favicon.svg';
    let link: HTMLLinkElement | null = document.querySelector("#site-favicon") || document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.id = 'site-favicon';
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, []);

  // Check URL route for secret admin /draft route & listen to shortcut
  useEffect(() => {
    const checkDraftRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (path === '/draft' || path.startsWith('/draft/') || hash === '#draft' || search.includes('draft')) {
        setIsEditorOpen(true);
      }
    };

    checkDraftRoute();
    window.addEventListener('popstate', checkDraftRoute);

    // Keyboard shortcut (Ctrl+Alt+D or Cmd+Shift+D) for discreet access
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') || (e.metaKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        setIsEditorOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkDraftRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    // Clean up /draft from address bar if opened via route
    if (window.location.pathname.toLowerCase() === '/draft' || window.location.hash.toLowerCase() === '#draft') {
      window.history.pushState({}, '', '/');
    }
  };

  // Apply dark mode class to root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nyk_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nyk_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const allArticles = useMemo(() => {
    return getAllArticles();
  }, []);

  const allPages = useMemo(() => {
    return getAllPages();
  }, []);

  // Collect all unique tags across articles
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allArticles.forEach((art) => art.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [allArticles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((art) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !selectedTag || art.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [allArticles, searchQuery, selectedTag]);

  const handleNavigate = (page: NavigationPage, articleSlug?: string) => {
    setCurrentPage(page);
    if (page === 'article-detail' && articleSlug) {
      setSelectedSlug(articleSlug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'articles') {
      setSelectedSlug(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectedArticle = useMemo(() => {
    if (!selectedSlug) return null;
    return getArticleBySlug(selectedSlug);
  }, [selectedSlug]);

  const activePage = useMemo(() => {
    if (currentPage === 'articles' || currentPage === 'article-detail') return null;
    return getPageBySlug(currentPage);
  }, [currentPage]);

  // Sync document title based on siteConfig.tabTitle or active page/article
  useEffect(() => {
    const baseTitle = siteConfig.tabTitle || siteConfig.siteName || 'NYK';
    if (currentPage === 'article-detail' && selectedArticle) {
      document.title = `${selectedArticle.title} — ${siteConfig.siteName}`;
    } else if (activePage) {
      document.title = `${activePage.title} — ${siteConfig.siteName}`;
    } else {
      document.title = baseTitle;
    }
  }, [currentPage, selectedArticle, activePage]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        pages={allPages}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() =>
          setIsSearchOpen((prev) => {
            const next = !prev;
            if (!next) {
              setSearchQuery('');
              setSelectedTag(null);
            }
            return next;
          })
        }
        allTags={allTags}
        selectedTag={selectedTag}
        onSelectTag={(tag) => {
          setSelectedTag(tag);
        }}
      />

      {/* Main Page Container */}
      <div className="flex-1">
        {currentPage === 'articles' && (
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Header / Hero (hidden when search box is open) */}
            {!isSearchOpen && (
              <div className="mb-12 border-b border-[var(--border-color)] pb-10">
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-[var(--text-primary)] mb-6">
                  {siteConfig.heroTitle}
                </h1>

                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl font-normal">
                  {siteConfig.heroTagline}
                </p>
              </div>
            )}

            {/* Articles List */}
            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    onSelect={(slug) => handleNavigate('article-detail', slug)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-[var(--border-color)] rounded-xl space-y-4">
                <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
                <h3 className="text-lg font-bold text-[var(--text-primary)]">No matching articles found</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                  Try adjusting your search query or clear your selected tags to view all articles.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                  }}
                  className="px-4 py-2 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono text-xs font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        )}

        {currentPage === 'article-detail' && selectedArticle && (
          <main className="py-8">
            <ArticleView article={selectedArticle} onBack={() => handleNavigate('articles')} />
          </main>
        )}

        {activePage && (
          <main>
            <PageView page={activePage} onBack={() => handleNavigate('articles')} />
          </main>
        )}
      </div>

      {/* Markdown Draft Utility Modal (Accessible via /draft or Ctrl+Alt+D) */}
      <MarkdownEditorModal isOpen={isEditorOpen} onClose={handleCloseEditor} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}


