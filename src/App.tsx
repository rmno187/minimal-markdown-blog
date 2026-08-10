import React, { useState, useEffect, useMemo } from 'react';
import { getAllArticles, getArticleBySlug } from './lib/articles';
import { NavigationPage, Article } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { MarkdownEditorModal } from './components/MarkdownEditorModal';
import { Search, X, Tag, FileText, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('articles');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nyk_theme') === 'dark';
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenEditor={() => setIsEditorOpen(true)}
      />

      {/* Main Page Container */}
      <div className="flex-1">
        {currentPage === 'articles' && (
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            {/* Header / Hero */}
            <div className="mb-12 border-b border-[var(--border-color)] pb-10">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">
                Minimalist Journal • Pure Markdown
              </div>

              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-[var(--text-primary)] mb-6">
                THE SYNTAX OF MINIMALISM.
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl font-normal">
                An intentional, distraction-free journal. Pure Markdown articles saved directly in Git and published on Vercel.
              </p>

              {/* Search & Filter Controls */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles by keyword or topic..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Tag Pills Filter */}
                {allTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`text-xs font-mono px-3 py-2 rounded-lg border transition-colors ${
                        selectedTag === null
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] font-bold'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-primary)]'
                      }`}
                    >
                      All Tags
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className={`text-xs font-mono px-3 py-2 rounded-lg border transition-colors ${
                          selectedTag === tag
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] font-bold'
                            : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-primary)]'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

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

        {currentPage === 'about' && (
          <main>
            <AboutView />
          </main>
        )}

        {currentPage === 'contact' && (
          <main>
            <ContactView />
          </main>
        )}
      </div>

      {/* Markdown Draft Utility Modal */}
      <MarkdownEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
