export interface ArticleFrontmatter {
  id?: string;
  title: string;
  date: string;
  description: string;
  readTime?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  readTime: string;
  author: string;
  tags: string[];
  featured: boolean;
  content: string;
  raw: string;
}

export type NavigationPage = 'articles' | 'article-detail' | 'about' | 'contact';
