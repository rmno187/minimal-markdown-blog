---
id: markdown-syntax-guide
title: The Complete Markdown Syntax & Formatting Showcase
date: August 10, 2026
description: A comprehensive reference article demonstrating every Markdown formatting combination supported by the NYK minimalist blog engine.
readTime: 5 min read
author: NYK Editorial
tags: [Markdown, Guide, Typography, Reference, Syntax]
featured: true
---

Welcome to **NYK** — a minimalist, distraction-free publishing space. This sample article serves as a live visual index and test suite for every Markdown feature, formatting combination, and typographic element supported by our blog engine.

---

## 1. Headings & Hierarchy

Markdown supports six levels of headings. Use headings to construct a logical document outline.

# Heading Level 1 (H1)
## Heading Level 2 (H2)
### Heading Level 3 (H3)
#### Heading Level 4 (H4)
##### Heading Level 5 (H5)
###### Heading Level 6 (H6)

---

## 2. Text Formatting & Inline Styles

Express emphasis, technical terms, and annotations with inline formatting combinations:

* **Bold Text**: `**Bold Text**` or `__Bold Text__`
* *Italic Text*: `*Italic Text*` or `_Italic Text_`
* ***Bold and Italic***: `***Bold and Italic***`
* ~~Strikethrough~~: `~~Strikethrough~~`
* `Inline Code`: Wrap technical terms like `npm run build` or `const name = "NYK"` in backticks.
* Hyperlinks: [Visit NYK GitHub Repository](https://github.com) or inline auto-links like <https://example.com>.
* Subscript & Keyboard shortcuts: Press <kbd>⌘</kbd> + <kbd>K</kbd> or <kbd>Ctrl</kbd> + <kbd>P</kbd> to search.
* Highlighted text: Use HTML `<mark>` tags to <mark>highlight critical key phrases</mark> in text.

---

## 3. Blockquotes & Custom Callouts

Blockquotes are perfect for highlighting pull-quotes, references, or key principles.

> "Simplicity is about subtracting the obvious and adding the meaningful."  
> — **John Maeda**, *The Laws of Simplicity*

### Nested Blockquote
> Primary thought on minimalist software design.
> > Sub-level observation: Avoid unnecessary UI elements, excessive decorations, or heavy runtime scripts.
> > > Third-level deep perspective on digital signal vs. noise.

---

## 4. Code Blocks with Syntax Highlighting

Fenced code blocks start and end with three backticks (```). You can specify a language identifier for syntax-aware rendering.

### TypeScript / JavaScript
```typescript
interface ArticleMetaData {
  slug: string;
  title: string;
  date: string;
  published: boolean;
}

export function parseArticle(rawMarkdown: string): ArticleMetaData {
  const title = rawMarkdown.match(/title:\s*(.*)/)?.[1] || "Untitled";
  return {
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    title,
    date: new Date().toISOString().split("T")[0],
    published: true,
  };
}
```

### CSS / Styling
```css
/* Minimalist Container Rules */
.article-prose {
  max-width: 68ch;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.75;
  color: #171717;
}
```

### Bash Commands
```bash
# Clone the repository
git clone https://github.com/your-username/nyk-blog.git

# Install dependencies and start server
npm install
npm run dev
```

---

## 5. Lists & Structural Elements

### Unordered List
* Primary item A
  * Sub-item A.1
  * Sub-item A.2
* Primary item B
  * Deeply nested item B.1.a

### Ordered List
1. First step: Create `.md` files inside `src/articles/`
2. Second step: Add YAML frontmatter headers
3. Third step: Push changes to GitHub
4. Fourth step: Deploy instantly on Vercel

### Task Lists (GFM Checklist)
- [x] Design minimalist monochromatic color palette
- [x] Configure Vite markdown raw loader engine
- [x] Implement responsive editorial typography
- [ ] Write second blog post on philosophy
- [ ] Setup custom domain DNS on Vercel

---

## 6. Data Tables

GFM (GitHub Flavored Markdown) supports clean data tables with column alignment.

| Element | Syntax Pattern | Output Example | Usage Context |
| :--- | :---: | :---: | ---: |
| **Header 1** | `# Title` | H1 Headline | Document Title |
| **Bold** | `**text**` | **text** | Key concepts |
| **Code** | `` `code` `` | `code` | Variables & CLI |
| **Status** | `- [x]` | Completed | Task Tracking |

---

## 7. Images & Captions

Markdown supports responsive images with alternative text:

![NYK Minimalist Workspace Banner](https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80)
*Figure 1.1: A clean, quiet space designed for clear thinking and intentional writing.*

---

## 8. Interactive Collapsible Elements

You can embed native HTML `<details>` and `<summary>` tags inside Markdown for collapsible accordion blocks:

<details>
<summary>Click to reveal hidden architectural notes</summary>

### How NYK Loads Articles
In NYK, articles are loaded at build time directly from `src/articles/*.md` using Vite's static module loader `import.meta.glob`. No runtime database or external API calls are required!
</details>

---

## 9. Horizontal Dividers & Breaks

Use three or more hyphens (`---`), asterisks (`***`), or underscores (`___`) to create subtle thematic breaks.

***

## Conclusion

This concludes our comprehensive Markdown test post. With **NYK**, writing articles is as simple as creating a `.md` file, committing to Git, and hosting on Vercel. Happy writing!
