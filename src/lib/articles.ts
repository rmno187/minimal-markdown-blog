import { ContentItem, ArticleFrontmatter } from '../types';

/**
 * Custom YAML frontmatter parser for browser & static builds
 */
function parseFrontmatter(rawContent: string): { frontmatter: ArticleFrontmatter; content: string } {
  const cleanContent = rawContent.trimStart();

  let yamlBlock = '';
  let markdownBody = cleanContent;
  let hasFrontmatter = false;

  // Standard case: Starts with ---
  const standardRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const standardMatch = cleanContent.match(standardRegex);

  if (standardMatch) {
    yamlBlock = standardMatch[1];
    markdownBody = standardMatch[2];
    hasFrontmatter = true;
  } else {
    // Fallback case: Starts directly with frontmatter fields
    const fallbackRegex = /^((?:title|date|description|author|tags|featured|readTime|type|slug):[\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/i;
    const fallbackMatch = cleanContent.match(fallbackRegex);
    if (fallbackMatch) {
      yamlBlock = fallbackMatch[1];
      markdownBody = fallbackMatch[2];
      hasFrontmatter = true;
    }
  }

  if (!hasFrontmatter) {
    return {
      frontmatter: {
        title: 'Untitled',
        date: '',
        description: '',
      },
      content: rawContent,
    };
  }

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
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date || '',
      description: frontmatter.description || '',
      readTime: frontmatter.readTime,
      author: frontmatter.author || 'NYK',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      featured: Boolean(frontmatter.featured),
      type: frontmatter.type === 'page' ? 'page' : frontmatter.type === 'post' ? 'post' : undefined,
      slug: frontmatter.slug,
      hideFromMenu: Boolean(frontmatter.hideFromMenu || frontmatter.hidden || frontmatter.hideFromNav),
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
function createSlug(filePath: string, title: string, explicitSlug?: string): string {
  if (explicitSlug) return explicitSlug.toLowerCase();

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
 * Discover all markdown files from /content and /src/content
 */
export function getAllContent(): ContentItem[] {
  const contentGlob = import.meta.glob('/content/**/*.md', { query: '?raw', eager: true }) as Record<
    string,
    { default: string } | string
  >;
  const srcContentGlob = import.meta.glob('/src/content/**/*.md', { query: '?raw', eager: true }) as Record<
    string,
    { default: string } | string
  >;

  const markdownFiles = { ...contentGlob, ...srcContentGlob };

  const items: ContentItem[] = [];
  const seenSlugs = new Set<string>();

  for (const path in markdownFiles) {
    const rawModule = markdownFiles[path];
    const rawContent = typeof rawModule === 'string' ? rawModule : rawModule.default || '';

    const { frontmatter, content } = parseFrontmatter(rawContent);
    const slug = createSlug(path, frontmatter.title, frontmatter.slug);

    // Deduplicate if same file is imported in multiple matched paths
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    // Determine content type (post vs page)
    let type: 'post' | 'page' = 'post';
    if (frontmatter.type) {
      type = frontmatter.type;
    } else if (
      path.includes('/pages/') ||
      path.endsWith('/about.md') ||
      path.endsWith('/contact.md') ||
      ['about', 'contact', 'uses', 'now'].includes(slug)
    ) {
      type = 'page';
    }

    const readTime = frontmatter.readTime || calculateReadTime(content);

    items.push({
      slug,
      type,
      title: frontmatter.title,
      date: frontmatter.date || '',
      description: frontmatter.description || '',
      readTime,
      author: frontmatter.author || 'NYK',
      tags: frontmatter.tags || [],
      featured: frontmatter.featured || false,
      hideFromMenu: frontmatter.hideFromMenu || false,
      content,
      raw: rawContent,
    });
  }

  return items;
}

export function getAllArticles(): ContentItem[] {
  return getAllContent()
    .filter((item) => item.type === 'post')
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export function getArticleBySlug(slug: string): ContentItem | undefined {
  return getAllArticles().find((art) => art.slug === slug);
}

export function getAllPages(): ContentItem[] {
  return getAllContent().filter((item) => item.type === 'page');
}

export function getPageBySlug(slug: string): ContentItem | undefined {
  return getAllPages().find((page) => page.slug === slug);
}

