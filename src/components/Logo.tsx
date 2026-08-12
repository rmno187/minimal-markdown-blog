import React from 'react';
import { siteConfig } from '../site.config';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 26 }) => {
  const logoConfig = siteConfig.logo;

  // 1. If custom inline SVG markup is provided in site.config.ts
  if (logoConfig?.svgMarkup) {
    return (
      <div
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: logoConfig.svgMarkup }}
      />
    );
  }

  // 2. If a custom external/internal image URL is specified (and not the default /logo.svg)
  if (logoConfig?.url && logoConfig.url !== '/logo.svg') {
    return (
      <img
        src={logoConfig.url}
        alt={logoConfig.alt || siteConfig.siteName}
        className={`object-contain shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // 3. Default Minimalist Black & White Geometric Emblem
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      aria-label={logoConfig?.alt || `${siteConfig.siteName} Logo`}
    >
      <rect
        width="32"
        height="32"
        rx="7"
        className="fill-[var(--text-primary)] transition-colors duration-200"
      />
      <path
        d="M9.5 22V10L19.5 22V10"
        stroke="var(--bg-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-200"
      />
    </svg>
  );
};
