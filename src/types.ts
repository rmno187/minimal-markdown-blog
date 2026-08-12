export interface ArticleFrontmatter {
  id?: string;
  title: string;
  date?: string;
  description?: string;
  readTime?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  type?: 'post' | 'page';
  slug?: string;
  hideFromMenu?: boolean;
}

export interface ContentItem {
  slug: string;
  type: 'post' | 'page';
  title: string;
  date: string;
  description: string;
  readTime: string;
  author: string;
  tags: string[];
  featured: boolean;
  hideFromMenu?: boolean;
  content: string;
  raw: string;
}

export type Article = ContentItem;
export type Page = ContentItem;

export type NavigationPage = 'articles' | 'article-detail' | string;

