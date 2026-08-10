# NYK — Minimalist Static Markdown Blog

A lightweight, distraction-free blog template built with React, Vite, TypeScript, and Tailwind CSS. Articles are stored as plain Markdown (`.md`) files inside `src/articles/`, requiring **zero databases, zero user logins, and zero AI dependencies**.

Designed for writers and developers who value simplicity, high-contrast typography, and instant deployments.

---

## Features

- **File-Based Publishing**: Simply drop `.md` files into `src/articles/your-post.md` with YAML frontmatter.
- **Pure Markdown & GFM**: Full support for code blocks, tables, task lists, blockquotes, inline formatting, and custom callouts via `react-markdown` and `remark-gfm`.
- **Bold Typography Theme**: High-contrast, stark typographic hierarchy with seamless Dark / Light mode toggle.
- **Zero Backend Required**: Static module loading powered by Vite (`import.meta.glob`).
- **Interactive Reading Utilities**: Scroll progress bar, copyable code blocks, adjustable font sizes, search bar, and tag filtering.
- **In-Browser Draft Utility**: Draft, preview, and download `.md` files directly from the UI.
- **Vercel & GitHub Ready**: Ready for instant static deployments upon `git push`.

---

## Project Structure

```text
├── src/
│   ├── articles/              # Place your .md blog posts here
│   │   └── markdown_guide.md  # Comprehensive syntax showcase post
│   ├── components/            # React UI components
│   │   ├── Navbar.tsx         # Top navigation header
│   │   ├── Footer.tsx         # Footer with RSS / social links
│   │   ├── ArticleCard.tsx    # Article preview card
│   │   ├── ArticleView.tsx    # Full article renderer
│   │   ├── AboutView.tsx      # About page
│   │   ├── ContactView.tsx    # Contact page
│   │   └── MarkdownEditorModal.tsx # In-browser .md draft modal
│   ├── lib/
│   │   └── articles.ts        # Markdown parser & loader engine
│   ├── types.ts               # Shared TypeScript interfaces
│   ├── App.tsx                # Main application entry
│   └── index.css              # Global styles & typography
├── package.json
└── vite.config.ts
```

---

## How to Write & Publish Articles

1. Create a new `.md` file in `src/articles/` (e.g. `src/articles/my-first-post.md`).
2. Add YAML frontmatter at the top of the file:

```markdown
---
title: My First Article
date: October 24, 2026
description: A short one-line summary of what this article covers.
readTime: 4 min read
author: NYK
tags: [Philosophy, Web, Minimal]
featured: true
---

# My First Article

Write your post content here in standard Markdown syntax.

## Subheading

You can write **bold text**, *italics*, `inline code`, or code blocks:

```typescript
const hello = "World";
```
```

3. Commit and push to GitHub:
```bash
git add src/articles/my-first-post.md
git commit -m "Add new article"
git push
```

Vercel will automatically build and publish your new post!

---

## Local Development

### Prerequisites

- Node.js 18+
- npm, pnpm, or bun

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/nyk-blog.git
cd nyk-blog

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

---

## Security Audit

This repository contains **zero secret keys, environment credentials, or private tokens**. It operates entirely client-side as a static site.

---

## License

[MIT License](LICENSE) — Feel free to customize and publish your own blog with NYK!
# minimal-markdown-blog
