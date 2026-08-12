# NYK Publishing Engine

A lightweight, distraction-free, open-source publishing engine built with **React, Vite, TypeScript, and Tailwind CSS**.

Content is authored and stored as plain Markdown (`.md`) files with frontmatter metadata — **zero databases, zero server-side infrastructure, zero platform lock-in, and zero tracking scripts**.

---

## 🌟 Key Features

* **File-First Content Architecture**: Your writing lives in local `.md` files under `/content`.
* **Automatic Route & Page Discovery**: Standalone pages (`/about`, `/contact`, `/uses`) and blog posts are auto-discovered from `/content` using Vite's glob import system.
* **Custom Logo & Favicon Support**: Configure brand identity easily in `src/site.config.ts` using external image URLs (`/logo.svg`) or raw inline SVG markup.
* **Built-in Visual & Raw Markdown Editor**:
  * Access via floating draft button, keyboard shortcut (`Ctrl+Shift+E` / `Cmd+Shift+E`), or navigating to `/draft`.
  * Live WYSIWYG canvas and split-screen Raw Markdown code view.
  * Image manager with local uploader and public image selector.
  * Custom link insertion modal with display text, URL shortcuts, and selection preservation.
* **Tag System & Real-Time Search**: Instant client-side search across article titles, descriptions, tags, and body content.
* **Light / Dark Mode Engine**: Adaptive monochromatic color tokens with toggle lock and configurable default mode.
* **Automatic Reading Time**: Calculates estimated reading time automatically if omitted from frontmatter.
* **RSS Feed Generator**: Built-in RSS generator for subscribers.

---

## 📁 Directory Structure

```text
.
├── content/                 # Your Markdown articles and standalone pages
│   ├── about.md             # Standalone page (type: page)
│   └── posts/               # Blog articles (type: post)
│       └── my-first-post.md
├── public/                  # Static assets
│   ├── favicon.svg          # Configurable site favicon
│   ├── logo.svg             # Default minimalist emblem logo
│   └── images/              # Uploaded & article inline images
├── src/
│   ├── components/          # Modular React UI components
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleView.tsx
│   │   ├── Footer.tsx
│   │   ├── Logo.tsx         # Configurable logo renderer
│   │   ├── MarkdownEditorModal.tsx # In-app Live + Raw Markdown editor
│   │   ├── Navbar.tsx
│   │   └── PageView.tsx
│   ├── lib/
│   │   └── articles.ts      # Markdown glob loader & YAML frontmatter parser
│   ├── site.config.ts       # Site metadata, branding & navigation configuration
│   ├── types.ts             # TypeScript interfaces for content & config
│   ├── App.tsx              # Router, theme manager & route state
│   └── index.css            # Tailwind styles & theme design tokens
├── index.html
└── package.json
```

---

## 📄 Frontmatter Specification

The engine supports two primary content types: **`post`** (Blog Articles) and **`page`** (Standalone Pages).

### 1. Blog Article (`type: post`)

Place article `.md` files inside `/content/posts/` or `/content/`:

```markdown
---
title: "A Simple Engine for Independent Publishing"
date: "August 12, 2026"
description: "Why keeping your writing in open Markdown files gives you full control."
readTime: "3 min read"
author: "NYK"
tags: ["Publishing", "Open Source", "Philosophy"]
featured: true
type: "post"
---

Write your article content in standard Markdown here.

Supports headers, lists, blockquotes, code blocks, and images:
![Image description](/images/example.jpg)
```

> **Note**: If `readTime` is omitted, the engine automatically calculates it based on word count.

### 2. Standalone Page (`type: page`)

Pages (`/about`, `/contact`, `/now`, etc.) live in `/content/about.md` or `/content/pages/`:

```markdown
---
title: "About"
description: "In a world where life seems to grow more complicated by the day..."
type: "page"
slug: "about"
hideFromMenu: false
---

# About NYK

Standalone page content written in standard Markdown.
```

---

## ⚙️ Site Configuration (`src/site.config.ts`)

Manage site name, hero section, branding logos, theme defaults, and social links in `src/site.config.ts`:

```typescript
export const siteConfig: SiteConfig = {
  siteName: 'NYK',
  heroTitle: 'SIMPLICITY.',
  heroTagline: 'In a world where life seems to grow more complicated by the day, I work to bring simplicity back.',
  author: 'NYK',
  description: 'A minimalist publishing system built on pure Markdown, clean typography, and quiet web design.',
  email: 'thenykblog@gmail.com',
  
  // Branding Logo (supports custom image URL or inline SVG markup)
  logo: {
    url: '/logo.svg',
    alt: 'NYK Minimalist Logo',
  },

  // Site Favicon
  favicon: {
    url: '/favicon.svg',
  },

  // Social Links
  social: {
    github: 'https://github.com/rmno18',
    twitter: 'https://twitter.com',
  },

  // Navigation Links
  navigation: {
    showAbout: true,
    showContact: true,
  },

  // Theme Settings
  theme: {
    defaultMode: 'light',
    allowToggle: true,
  },
};
```

---

## ✍️ In-App Markdown Draft Editor

You can draft, preview, and edit Markdown files directly inside the web interface without leaving your browser:

1. Press **`Ctrl + Shift + E`** (or **`Cmd + Shift + E`**), click the floating **Draft** button, or append **`#/draft`** to the URL.
2. Toggle between **Live Canvas** (rich editing) and **Raw Markdown Code**.
3. Use the toolbar to insert formatted text, lists, quotes, code, links via the Link Dialog, or images via the Image Browser.
4. Copy the raw output or download the generated `.md` file directly.

---

## 🛠️ Local Development & Build

```bash
# Clone the repository
git clone https://github.com/rmno18/blog-engine.git
cd blog-engine

# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript & linter checks
npm run lint

# Build static output for production
npm run build
```

The production output will be generated inside the `dist/` directory.

---

## 🚢 Deployment

Since the engine compiles into static files, it can be deployed on any static hosting provider:

* **Vercel**: Connect repository, framework preset `Vite`, build command `npm run build`, output directory `dist`.
* **Cloudflare Pages / GitHub Pages / Netlify**: Build command `npm run build`, output directory `dist`.

---

## 📄 License

[MIT License](LICENSE) — Feel free to use and customize this engine for your own independent publication.

