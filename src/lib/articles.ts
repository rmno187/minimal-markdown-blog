import { Article, ArticleFrontmatter } from '../types';

/**
 * Custom YAML frontmatter parser for browser & static builds
 */
function parseFrontmatter(rawContent: string): { frontmatter: ArticleFrontmatter; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {
        title: 'Untitled Article',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        description: '',
      },
      content: rawContent,
    };
  }

  const yamlBlock = match[1];
  const markdownBody = match[2];

  const frontmatter: Record<string, any> = {};
  const lines = yamlBlock.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Array parsing e.g. [Tag1, Tag2, Tag3]
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayItems = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      frontmatter[key] = arrayItems;
    } else if (value === 'true') {
      frontmatter[key] = true;
    } else if (value === 'false') {
      frontmatter[key] = false;
    } else {
      frontmatter[key] = value;
    }
  }

  return {
    frontmatter: {
      title: frontmatter.title || 'Untitled Article',
      date: frontmatter.date || 'Recent',
      description: frontmatter.description || '',
      readTime: frontmatter.readTime,
      author: frontmatter.author || 'NYK',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      featured: Boolean(frontmatter.featured),
    },
    content: markdownBody,
  };
}

/**
 * Calculates estimated read time from markdown text
 */
function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Generates a clean URL slug from article title or file path
 */
function createSlug(filePath: string, title: string): string {
  const fileName = filePath.split('/').pop()?.replace('.md', '') || '';
  if (fileName) {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Load all markdown files from /src/articles/*.md via Vite eager globbing
 */
export function getAllArticles(): Article[] {
  const markdownFiles = import.meta.glob('/src/articles/*.md', { query: '?raw', eager: true }) as Record<
    string,
    { default: string } | string
  >;

  const articles: Article[] = [];

  for (const path in markdownFiles) {
    const rawModule = markdownFiles[path];
    const rawContent = typeof rawModule === 'string' ? rawModule : rawModule.default || '';

    const { frontmatter, content } = parseFrontmatter(rawContent);
    const slug = createSlug(path, frontmatter.title);
    const readTime = frontmatter.readTime || calculateReadTime(content);

    articles.push({
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      description: frontmatter.description,
      readTime,
      author: frontmatter.author || 'NYK Editorial',
      tags: frontmatter.tags || [],
      featured: frontmatter.featured || false,
      content,
      raw: rawContent,
    });
  }

  // Sort articles chronologically or by featured state
  return articles.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getAllArticles();
  return articles.find((art) => art.slug === slug);
}
