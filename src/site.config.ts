export interface SiteConfig {
  siteName: string;
  heroTitle: string;
  heroTagline: string;
  author: string;
  description: string;
  email?: string;
  logo?: {
    /** URL to custom logo image (e.g., '/my-logo.svg', '/logo.png', or external URL). Defaults to '/logo.svg' */
    url?: string;
    /** Raw SVG string if you prefer inline SVG markup */
    svgMarkup?: string;
    /** Alt text for logo */
    alt?: string;
  };
  favicon?: {
    /** Custom favicon URL (e.g., '/favicon.svg', '/favicon.ico', or SVG data URI). Defaults to '/favicon.svg' */
    url?: string;
  };
  social: {
    email?: string;
    github?: string;
    twitter?: string;
    tiktok?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    bluesky?: string;
    rss?: string;
  };
  navigation: {
    showAbout: boolean;
  };
  theme: {
    defaultMode: 'light' | 'dark';
    allowToggle: boolean;
  };
}

/**
 * Site Configuration
 * This file contains all site-specific branding, metadata, and social links.
 * When separating the public publishing engine from private content, override these values in your config.
 */
export const siteConfig: SiteConfig = {
  siteName: 'NYK.MD',
  heroTitle: 'SIMPLICITY.',
  heroTagline: 'A minimalist publishing system built on pure Markdown, clean typography, and quiet web design.',
  author: 'NYK',
  description: 'A minimalist publishing system built on pure Markdown, clean typography, and quiet web design.',
  logo: {
    url: '/logo.svg',
    alt: 'NYK Minimalist Logo',
  },
  favicon: {
    url: '/favicon.svg',
  },
  social: {
    email: 'sample@mail.com',
    github: 'https://github.com/rmno18',
    twitter: '',
    tiktok: '',
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    bluesky: '',
  },
  navigation: {
    showAbout: true,
  },
  theme: {
    defaultMode: 'light',
    allowToggle: true,
  },
};
