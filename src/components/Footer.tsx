import React from 'react';
import { Github, Twitter, Facebook, Instagram, Youtube, Linkedin, ArrowUp, Rss, Mail } from 'lucide-react';
import { siteConfig } from '../site.config';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getEmailUrl = (rawEmail?: string) => {
    if (!rawEmail || !rawEmail.trim()) return '';
    const trimmed = rawEmail.trim();
    return /^mailto:/i.test(trimmed) ? trimmed : `mailto:${trimmed}`;
  };

  const socialItems = [
    {
      key: 'email',
      label: 'Email',
      url: getEmailUrl(siteConfig.social.email || siteConfig.email),
      icon: <Mail className="w-3.5 h-3.5" />,
    },
    {
      key: 'github',
      label: 'GitHub',
      url: siteConfig.social.github,
      icon: <Github className="w-3.5 h-3.5" />,
    },
    {
      key: 'twitter',
      label: 'Twitter',
      url: siteConfig.social.twitter,
      icon: <Twitter className="w-3.5 h-3.5" />,
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      url: siteConfig.social.tiktok,
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 1 1-2.896-2.896c.244 0 .482.03.71.087V9.381a6.32 6.32 0 0 0-.71-.04 6.34 6.34 0 1 0 6.34 6.34V8.34a8.212 8.212 0 0 0 4.887 1.583V6.478a4.83 4.83 0 0 1-1.116.208z" />
        </svg>
      ),
    },
    {
      key: 'facebook',
      label: 'Facebook',
      url: siteConfig.social.facebook,
      icon: <Facebook className="w-3.5 h-3.5" />,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      url: siteConfig.social.instagram,
      icon: <Instagram className="w-3.5 h-3.5" />,
    },
    {
      key: 'youtube',
      label: 'YouTube',
      url: siteConfig.social.youtube,
      icon: <Youtube className="w-3.5 h-3.5" />,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      url: siteConfig.social.linkedin,
      icon: <Linkedin className="w-3.5 h-3.5" />,
    },
    {
      key: 'bluesky',
      label: 'Bluesky',
      url: siteConfig.social.bluesky,
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 566 500">
          <path d="M121.17 38.204c62.476 46.88 129.8 141.24 161.83 194.88 32.031-53.642 99.354-148 161.83-194.88 45.05-33.77 114.73-60.151 114.73 23.957 0 16.8-9.61 141.26-15.26 161.42-19.64 70.12-91.2 88.03-154.78 77.24 111.02 18.91 139.38 81.36 78.29 144.15-116.08 119.34-173.34-29.93-182.26-66.07-2.89-11.71-3.69-14.88-2.55-10.22 1.14-4.66.34-1.49-2.55 10.22-8.92 36.14-66.18 185.41-182.26 66.07-61.09-62.79-32.73-125.24 78.29-144.15-63.58 10.79-135.14-7.12-154.78-77.24C28.84 203.42 19.23 78.961 19.23 62.161c0-84.108 69.68-57.727 114.73-23.957z" />
        </svg>
      ),
    },
  ].filter((item) => Boolean(item.url && item.url.trim()));

  return (
    <footer className="border-t border-[var(--border-color)] mt-24 py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[var(--text-secondary)]">
        <div className="flex flex-col space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <Logo size={20} />
            <p className="font-semibold text-[var(--text-primary)]">{siteConfig.siteName}</p>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Open Source .md Blog Engine
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs">
          {socialItems.map((social) => (
            <a
              key={social.key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-[var(--text-primary)] transition-colors"
            >
              {social.icon}
              <span>{social.label}</span>
            </a>
          ))}
          
          <button
            onClick={() => {
              if (siteConfig.social.rss) {
                window.open(siteConfig.social.rss, '_blank');
              } else {
                alert('RSS Feed: /rss.xml static feed URL ready.');
              }
            }}
            className="flex items-center space-x-1.5 hover:text-[var(--text-primary)] transition-colors"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>RSS</span>
          </button>

          <button
            onClick={scrollToTop}
            className="p-1.5 rounded border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            title="Back to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

