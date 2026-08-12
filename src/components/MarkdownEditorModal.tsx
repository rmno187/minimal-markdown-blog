import React, { useState, useRef, useEffect } from 'react';
import TurndownService from 'turndown';
import { marked } from 'marked';
import {
  X,
  Download,
  Copy,
  Check,
  Eye,
  FileText,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Upload,
  FolderOpen,
  Calendar,
  Tag,
  User,
  Layout,
  Pencil,
  FileCode2,
  Sparkles,
  Clock,
  Star,
  EyeOff,
} from 'lucide-react';
import { siteConfig } from '../site.config';

// Initialize Turndown HTML -> Markdown converter
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
});

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Helper to convert Markdown to HTML string synchronously
const renderMarkdownToHtml = (md: string): string => {
  try {
    return marked.parse(md, { async: false }) as string;
  } catch (err) {
    return md;
  }
};

// Automatically detect images placed in /content/images/ and /public/images/ directories
const contentImagesGlob = import.meta.glob('/content/images/*.{png,jpg,jpeg,svg,webp,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const publicImagesGlob = import.meta.glob('/public/images/*.{png,jpg,jpeg,svg,webp,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

interface PublicImageItem {
  name: string;
  path: string;
  url: string;
  folder: string;
}

const getPublicImages = (): PublicImageItem[] => {
  const list: PublicImageItem[] = [];
  const seenNames = new Set<string>();

  for (const globPath in contentImagesGlob) {
    const fileName = globPath.split('/').pop() || globPath;
    const cleanPath = `/content/images/${fileName}`;
    const resolvedUrl = (contentImagesGlob[globPath] as string) || cleanPath;
    seenNames.add(fileName);
    list.push({
      name: fileName,
      path: cleanPath,
      url: resolvedUrl,
      folder: 'content/images',
    });
  }

  for (const globPath in publicImagesGlob) {
    const fileName = globPath.split('/').pop() || globPath;
    const cleanPath = `/images/${fileName}`;
    const resolvedUrl = (publicImagesGlob[globPath] as string) || cleanPath;
    if (!seenNames.has(fileName)) {
      list.push({
        name: fileName,
        path: cleanPath,
        url: resolvedUrl,
        folder: 'public/images',
      });
    }
  }

  return list;
};

interface MarkdownEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getFormattedToday = (): string => {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const DEFAULT_TITLE = 'My Next Philosophy Essay';
const DEFAULT_DESCRIPTION = 'Brief summary of what this piece is about.';
const DEFAULT_BODY = `Start typing directly on this live rendered article. Click anywhere on the text and a flashing cursor will appear so you can edit text in real-time.

## Key Takeaways

- Edit live on this rendered page
- Switch to Raw Editor mode to see full markdown with frontmatter
- Changes stay perfectly in sync

> "In wisdom gathered over time, simplicity remains the ultimate sophistication."

### Code Snippet Example

\`\`\`typescript
console.log("Hello from NYK!");
\`\`\`
`;

const generateFullMarkdown = (
  titleVal: string,
  dateVal: string,
  descVal: string,
  authorVal: string,
  tagsVal: string,
  featuredVal: boolean,
  hideFromMenuVal: boolean,
  typeVal: 'post' | 'page',
  bodyVal: string
): string => {
  if (typeVal === 'page') {
    const yamlLines = [
      '---',
      `title: "${titleVal.replace(/"/g, '\\"')}"`,
      `description: "${descVal.replace(/"/g, '\\"')}"`,
      hideFromMenuVal ? `hideFromMenu: true` : null,
      `type: page`,
      '---',
      '',
      bodyVal.trim(),
    ].filter((line) => line !== null);

    return yamlLines.join('\n');
  }

  const formattedTags = tagsVal
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const yamlLines = [
    '---',
    `title: "${titleVal.replace(/"/g, '\\"')}"`,
    dateVal ? `date: "${dateVal}"` : null,
    `description: "${descVal.replace(/"/g, '\\"')}"`,
    `author: "${authorVal.replace(/"/g, '\\"')}"`,
    `tags: [${formattedTags.map((t) => `"${t}"`).join(', ')}]`,
    `featured: ${featuredVal}`,
    `type: post`,
    '---',
    '',
    bodyVal.trim(),
  ].filter((line) => line !== null);

  return yamlLines.join('\n');
};

interface ParsedMarkdown {
  title: string;
  date: string;
  description: string;
  author: string;
  tags: string;
  featured: boolean;
  hideFromMenu: boolean;
  contentType: 'post' | 'page';
  body: string;
}

const parseFullMarkdown = (raw: string): ParsedMarkdown => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return {
      title: DEFAULT_TITLE,
      date: getFormattedToday(),
      description: DEFAULT_DESCRIPTION,
      author: siteConfig.author || 'NYK',
      tags: 'Essay, Philosophy, Thoughts',
      featured: false,
      hideFromMenu: false,
      contentType: 'post',
      body: raw,
    };
  }

  const yamlBlock = match[1];
  const bodyContent = match[2];

  let title = DEFAULT_TITLE;
  let date = getFormattedToday();
  let description = DEFAULT_DESCRIPTION;
  let author = siteConfig.author || 'NYK';
  let tags = 'Essay, Philosophy, Thoughts';
  let featured = false;
  let hideFromMenu = false;
  let contentType: 'post' | 'page' = 'post';

  yamlBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }

    if (key === 'title') title = value;
    else if (key === 'date') date = value;
    else if (key === 'description') description = value;
    else if (key === 'author') author = value;
    else if (key === 'tags') {
      if (value.startsWith('[') && value.endsWith(']')) {
        const inner = value.substring(1, value.length - 1);
        tags = inner
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
          .join(', ');
      } else {
        tags = value;
      }
    } else if (key === 'featured') {
      featured = value === 'true';
    } else if (key === 'hideFromMenu' || key === 'hidden' || key === 'hideFromNav') {
      hideFromMenu = value === 'true';
    } else if (key === 'type') {
      if (value === 'page' || value === 'post') contentType = value;
    }
  });

  return {
    title,
    date,
    description,
    author,
    tags,
    featured,
    hideFromMenu,
    contentType,
    body: bodyContent,
  };
};

export const MarkdownEditorModal: React.FC<MarkdownEditorModalProps> = ({ isOpen, onClose }) => {
  // Metadata States
  const [contentType, setContentType] = useState<'post' | 'page'>('post');
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [date, setDate] = useState(getFormattedToday());
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [author, setAuthor] = useState(siteConfig.author || 'NYK');
  const [tags, setTags] = useState('Essay, Philosophy, Thoughts');
  const [featured, setFeatured] = useState(false);
  const [hideFromMenu, setHideFromMenu] = useState(false);
  const [filename, setFilename] = useState('my-next-philosophy-essay');
  const [isManualFilename, setIsManualFilename] = useState(false);
  const [body, setBody] = useState(DEFAULT_BODY);

  // Full raw markdown string state for Raw Editor
  const [rawMarkdown, setRawMarkdown] = useState<string>(() =>
    generateFullMarkdown(
      DEFAULT_TITLE,
      getFormattedToday(),
      DEFAULT_DESCRIPTION,
      siteConfig.author || 'NYK',
      'Essay, Philosophy, Thoughts',
      false,
      false,
      'post',
      DEFAULT_BODY
    )
  );

  // View Mode & Editing States
  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'split'>('preview');
  const [copied, setCopied] = useState(false);

  const rawTextareaRef = useRef<HTMLTextAreaElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Image Selector Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageSourceTab, setImageSourceTab] = useState<'folder' | 'upload' | 'url'>('folder');
  const [selectedImagePath, setSelectedImagePath] = useState('');
  const [imageAltText, setImageAltText] = useState('');
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('https://');
  const [linkTextInput, setLinkTextInput] = useState('');
  const savedLiveRangeRef = useRef<Range | null>(null);
  const savedRawSelectionRef = useRef<{ start: number; end: number; selectedText: string } | null>(null);

  const publicImages = getPublicImages();

  // Flag to avoid recursive state updates when Raw Editor changes rawMarkdown
  const isUpdatingFromRawRef = useRef(false);

  // Whenever title, metadata or body changes from Live Render view, keep rawMarkdown updated
  useEffect(() => {
    if (isUpdatingFromRawRef.current) return;
    const newRaw = generateFullMarkdown(title, date, description, author, tags, featured, hideFromMenu, contentType, body);
    setRawMarkdown(newRaw);
  }, [title, date, description, author, tags, featured, hideFromMenu, contentType, body]);

  // Sync Markdown body into contentEditable innerHTML when activeTab or body changes
  useEffect(() => {
    if (contentEditableRef.current && document.activeElement !== contentEditableRef.current) {
      contentEditableRef.current.innerHTML = renderMarkdownToHtml(body);
    }
  }, [body, activeTab]);

  // Handler when Raw Editor text changes directly
  const handleRawMarkdownChange = (newRawText: string) => {
    setRawMarkdown(newRawText);
    isUpdatingFromRawRef.current = true;

    const parsed = parseFullMarkdown(newRawText);
    setTitle(parsed.title);
    setDate(parsed.date);
    setDescription(parsed.description);
    setAuthor(parsed.author);
    setTags(parsed.tags);
    setFeatured(parsed.featured);
    setHideFromMenu(parsed.hideFromMenu);
    setContentType(parsed.contentType);
    setBody(parsed.body);

    if (!isManualFilename) {
      const newSlug = slugify(parsed.title);
      if (newSlug) setFilename(newSlug);
    }

    setTimeout(() => {
      isUpdatingFromRawRef.current = false;
    }, 0);
  };

  // Title change on Live Render view
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isManualFilename) {
      const newSlug = slugify(newTitle);
      if (newSlug) setFilename(newSlug);
    }
  };

  // Keep filename in sync if user edits slug manually
  const handleFilenameChange = (val: string) => {
    setIsManualFilename(true);
    setFilename(val.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
  };

  if (!isOpen) return null;

  // Handle direct input typing inside the Live Render contentEditable div
  const handleLiveRenderInput = () => {
    if (contentEditableRef.current) {
      const currentHtml = contentEditableRef.current.innerHTML;
      const convertedMarkdown = turndownService.turndown(currentHtml);
      setBody(convertedMarkdown);
    }
  };

  // Execute rich formatting commands directly on Live Render
  const execRichCommand = (command: string, arg?: string) => {
    if (activeTab === 'editor' && rawTextareaRef.current) {
      applyRawFormatting(command);
      return;
    }

    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
      document.execCommand(command, false, arg);
      handleLiveRenderInput();
    }
  };

  const handleInsertLink = () => {
    if (activeTab === 'editor' && rawTextareaRef.current) {
      const start = rawTextareaRef.current.selectionStart;
      const end = rawTextareaRef.current.selectionEnd;
      const selectedText = rawMarkdown.substring(start, end);
      savedRawSelectionRef.current = { start, end, selectedText };
      setLinkTextInput(selectedText || '');
      setLinkUrlInput('https://');
      setIsLinkModalOpen(true);
      return;
    }

    if (contentEditableRef.current) {
      const selection = window.getSelection();
      let selectedText = '';
      savedLiveRangeRef.current = null;

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (contentEditableRef.current.contains(range.commonAncestorContainer)) {
          savedLiveRangeRef.current = range.cloneRange();
          selectedText = selection.toString().trim();
        }
      }

      setLinkTextInput(selectedText || '');
      setLinkUrlInput('https://');
      setIsLinkModalOpen(true);
    }
  };

  const confirmInsertLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let url = linkUrlInput.trim();
    if (!url || url === 'https://' || url === 'http://') {
      setIsLinkModalOpen(false);
      return;
    }

    if (!/^https?:\/\//i.test(url) && !/^\//.test(url) && !/^#/.test(url) && !/^mailto:/i.test(url)) {
      url = 'https://' + url;
    }

    const textToDisplay = linkTextInput.trim() || url.replace(/^https?:\/\//i, '').replace(/\/$/, '') || 'Link text';

    if (activeTab === 'editor' && rawTextareaRef.current && savedRawSelectionRef.current) {
      const { start, end } = savedRawSelectionRef.current;
      const rawVal = rawTextareaRef.current.value;
      const replacement = `[${textToDisplay}](${url})`;
      const updated = rawVal.substring(0, start) + replacement + rawVal.substring(end);
      handleRawMarkdownChange(updated);
    } else if (contentEditableRef.current) {
      contentEditableRef.current.focus();

      const selection = window.getSelection();
      if (selection && savedLiveRangeRef.current) {
        selection.removeAllRanges();
        selection.addRange(savedLiveRangeRef.current);
      }

      const anchorHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${textToDisplay}</a>&nbsp;`;
      document.execCommand('insertHTML', false, anchorHtml);

      handleLiveRenderInput();
    }

    setIsLinkModalOpen(false);
  };

  const applyRawFormatting = (type: string) => {
    if (type === 'link') {
      handleInsertLink();
      return;
    }

    const activeTextarea = rawTextareaRef.current;
    if (!activeTextarea) return;

    const start = activeTextarea.selectionStart;
    const end = activeTextarea.selectionEnd;
    const selectedText = rawMarkdown.substring(start, end);
    const before = rawMarkdown.substring(0, start);
    const after = rawMarkdown.substring(end);

    let replacement = '';
    let newStart = start;
    let newEnd = end;

    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        newStart = start + 2;
        newEnd = newStart + (selectedText || 'bold text').length;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        newStart = start + 1;
        newEnd = newStart + (selectedText || 'italic text').length;
        break;
      case 'strikethrough':
        replacement = `~~${selectedText || 'strikethrough'}~~`;
        newStart = start + 2;
        newEnd = newStart + (selectedText || 'strikethrough').length;
        break;
      case 'h1':
        replacement = `# ${selectedText || 'Heading 1'}`;
        newStart = start + 2;
        newEnd = newStart + (selectedText || 'Heading 1').length;
        break;
      case 'h2':
        replacement = `## ${selectedText || 'Heading 2'}`;
        newStart = start + 3;
        newEnd = newStart + (selectedText || 'Heading 2').length;
        break;
      case 'h3':
        replacement = `### ${selectedText || 'Heading 3'}`;
        newStart = start + 4;
        newEnd = newStart + (selectedText || 'Heading 3').length;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Quote text'}`;
        newStart = start + 2;
        newEnd = newStart + (selectedText || 'Quote text').length;
        break;
      case 'code':
        replacement = selectedText ? `\`${selectedText}\`` : '`code`';
        newStart = start + 1;
        newEnd = selectedText ? end + 1 : start + 5;
        break;
      case 'ul':
        replacement = selectedText
          ? selectedText.split('\n').map((l) => `- ${l}`).join('\n')
          : '- List item';
        newEnd = start + replacement.length;
        break;
      case 'ol':
        replacement = selectedText
          ? selectedText.split('\n').map((l, idx) => `${idx + 1}. ${l}`).join('\n')
          : '1. First item';
        newEnd = start + replacement.length;
        break;

      default:
        return;
    }

    const updatedRaw = before + replacement + after;
    handleRawMarkdownChange(updatedRaw);

    setTimeout(() => {
      activeTextarea.focus();
      activeTextarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const handleDownload = () => {
    const cleanFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    const blob = new Blob([rawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setUploadedImageDataUrl(dataUrl);
        if (!imageAltText) {
          const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          setImageAltText(nameWithoutExt.replace(/[-_]/g, ' '));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const insertImage = (src: string, altText: string = '') => {
    if (activeTab === 'editor' && rawTextareaRef.current) {
      const finalAlt = altText.trim() || 'Image description';
      const markdownImage = `\n![${finalAlt}](${src})\n`;
      const start = rawTextareaRef.current.selectionStart;
      const end = rawTextareaRef.current.selectionEnd;
      const before = rawMarkdown.substring(0, start);
      const after = rawMarkdown.substring(end);
      handleRawMarkdownChange(before + markdownImage + after);
    } else {
      if (contentEditableRef.current) {
        contentEditableRef.current.focus();
        const imgHtml = `<p><img src="${src}" alt="${altText.replace(/"/g, '&quot;')}" style="max-width:100%; border-radius:0.75rem; margin:1rem 0;" /></p>`;
        document.execCommand('insertHTML', false, imgHtml);
        handleLiveRenderInput();
      }
    }

    setIsImageModalOpen(false);
    setSelectedImagePath('');
    setImageAltText('');
    setUploadedImageDataUrl('');
    setUploadedFilename('');
    setCustomUrlInput('');
  };

  const targetPathDisplay = contentType === 'post' ? `content/posts/${filename}.md` : `content/${filename}.md`;
  const estimatedReadTime = `${Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200))} min read`;

  return (
    <>
      {/* Full screen editor container - lifted out of the box with dark backdrop */}
      <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col h-screen w-screen overflow-hidden animate-fade-in">
        
        {/* Top Full-Width Header Bar */}
        <header className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <FileCode2 className="w-5 h-5 text-[var(--text-primary)] shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-mono truncate">
                  {title || 'Untitled Article'}
                </h2>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                  {contentType}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)] truncate">
                Save path: <code className="text-[var(--text-primary)] font-semibold">{targetPathDisplay}</code>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors min-h-[36px]"
              title="Copy full markdown with frontmatter"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Full MD'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity min-h-[36px]"
              title="Download .md file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .md</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Close Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Navigation & Controls Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs font-mono">
          
          {/* View Modes */}
          <div className="flex items-center space-x-1 bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'editor'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>

          </div>

          {/* Quick Page Settings (Type, Featured, Slug) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Post vs Page Switch */}
            <div className="flex items-center space-x-1 bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-color)] text-[11px]">
              <button
                type="button"
                onClick={() => setContentType('post')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-all ${
                  contentType === 'post'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Post</span>
              </button>
              <button
                type="button"
                onClick={() => setContentType('page')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-all ${
                  contentType === 'page'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Layout className="w-3 h-3" />
                <span>Page</span>
              </button>
            </div>

            {/* Featured toggle button for Posts or Hide from Menu button for Pages */}
            {contentType === 'post' ? (
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                  featured
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold'
                    : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{featured ? 'Featured Item' : 'Mark Featured'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setHideFromMenu(!hideFromMenu)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                  hideFromMenu
                    ? 'bg-red-500/10 border-red-500/30 text-red-500 font-bold'
                    : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <EyeOff className={`w-3.5 h-3.5 ${hideFromMenu ? 'text-red-500' : ''}`} />
                <span>{hideFromMenu ? 'Hidden from Menu' : 'Hide from Menu'}</span>
              </button>
            )}

          </div>
        </div>

        {/* Main View Area - Full Page Width for Live Render & Raw Editor */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* Split Mode or Full Width Mode Container */}
          <div
            className={`h-full w-full grid overflow-hidden ${
              activeTab === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]' : 'grid-cols-1'
            }`}
          >
            {/* Raw Editor Pane - Shows full markdown with frontmatter */}
            {(activeTab === 'editor' || activeTab === 'split') && (
              <div className="flex flex-col h-full bg-[var(--bg-primary)] overflow-hidden">
                
                {/* Raw Editor Formatting Bar */}
                <div className="px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0">
                  

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => applyRawFormatting('bold')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRawFormatting('italic')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRawFormatting('strikethrough')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Strikethrough"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-[1px] bg-[var(--border-color)] mx-1" />
                    <button
                      type="button"
                      onClick={() => applyRawFormatting('h1')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="H1"
                    >
                      <Heading1 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRawFormatting('h2')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="H2"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRawFormatting('h3')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="H3"
                    >
                      <Heading3 className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-[1px] bg-[var(--border-color)] mx-1" />
                    <button
                      type="button"
                      onClick={() => applyRawFormatting('quote')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Quote"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRawFormatting('ul')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Bullet List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertLink()}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Insert Link"
                    >
                      <Link className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-emerald-500 hover:text-emerald-400"
                      title="Insert Image"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Textarea holding entire raw markdown (frontmatter + body) */}
                <textarea
                  ref={rawTextareaRef}
                  value={rawMarkdown}
                  onChange={(e) => handleRawMarkdownChange(e.target.value)}
                  placeholder="Full markdown with YAML frontmatter..."
                  className="w-full flex-1 p-6 font-mono text-sm leading-relaxed bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none resize-none overflow-y-auto"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Live Render View - Pages exactly as it will appear on the live website */}
            {(activeTab === 'preview' || activeTab === 'split') && (
              <div className="flex flex-col h-full bg-[var(--bg-primary)] overflow-hidden relative">
                
                {/* Live Page WYSIWYG Formatting Bar - Displayed identically to Code view toolbar */}
                <div className="px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0">
                  
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => execRichCommand('bold')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execRichCommand('italic')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execRichCommand('strikeThrough')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Strikethrough"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-[1px] bg-[var(--border-color)] mx-1" />
                    <button
                      type="button"
                      onClick={() => execRichCommand('formatBlock', '<h1>')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-[11px]"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => execRichCommand('formatBlock', '<h2>')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-[11px]"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => execRichCommand('formatBlock', '<h3>')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-[11px]"
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => execRichCommand('formatBlock', '<p>')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-[11px]"
                      title="Paragraph"
                    >
                      P
                    </button>
                    <div className="h-4 w-[1px] bg-[var(--border-color)] mx-1" />
                    <button
                      type="button"
                      onClick={() => execRichCommand('formatBlock', '<blockquote>')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Quote Block"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execRichCommand('insertUnorderedList')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Bullet List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execRichCommand('insertOrderedList')}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleInsertLink}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Insert Link"
                    >
                      <Link className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-[1px] bg-[var(--border-color)] mx-1" />
                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="p-1.5 rounded hover:bg-[var(--bg-card)] text-emerald-500 hover:text-emerald-400"
                      title="Insert Image"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Article Area */}
                <div className="flex-1 overflow-y-auto">
                  <article className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 flex flex-col">

                  {/* Article Header (Positioned exactly as on live page) */}
                  <header className="mb-10 group">
                    
                    {/* Date — Read Time Meta Row (Editable inline - Posts only) */}
                    {contentType === 'post' && (
                      <div className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 flex flex-wrap items-center gap-2 font-mono">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                          <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="Publish date..."
                            style={{ width: `${Math.max(16, (date?.length || 10) + 4)}ch` }}
                            className="bg-transparent hover:bg-[var(--bg-secondary)] focus:bg-[var(--bg-card)] text-[var(--text-muted)] font-mono focus:text-[var(--text-primary)] outline-none rounded px-1.5 py-0.5 transition-colors border border-transparent hover:border-[var(--border-color)] tracking-normal min-w-[220px]"
                          />
                        </div>

                        <span>—</span>

                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                          <span>{estimatedReadTime}</span>
                        </div>
                      </div>
                    )}

                    {/* Article Title (Inline Editable Heading sitting on live page) */}
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder={contentType === 'page' ? 'PAGE TITLE...' : 'ARTICLE TITLE...'}
                      className="w-full text-3xl sm:text-5xl font-black tracking-tighter leading-tight text-[var(--text-primary)] mb-6 uppercase bg-transparent border-b border-transparent hover:border-[var(--border-color)] focus:border-[var(--text-primary)] outline-none transition-all py-1"
                    />

                    {/* Brief Summary / Description (Inline Editable Quote Block sitting on live page) */}
                    <div className="relative mb-6">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={contentType === 'page' ? 'Type a brief summary / description of this page here...' : 'Type a brief summary / description of this article here...'}
                        rows={2}
                        className="w-full text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-normal border-l-4 border-[var(--text-primary)] pl-5 py-1 bg-transparent focus:bg-[var(--bg-secondary)]/50 outline-none resize-none rounded-r transition-all"
                      />
                    </div>

                    {/* Tags List (Inline Editable on live page - Posts only) */}
                    {contentType === 'post' && (
                      <div className="flex items-center space-x-2 font-mono text-xs text-[var(--text-muted)] pt-1">
                        <Tag className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="Tags comma separated (e.g. Essay, Thoughts)..."
                          className="w-full bg-transparent hover:bg-[var(--bg-secondary)] focus:bg-[var(--bg-card)] text-[var(--text-muted)] focus:text-[var(--text-primary)] font-mono text-xs outline-none rounded px-2 py-1 border border-transparent hover:border-[var(--border-color)] transition-colors"
                        />
                      </div>
                    )}
                  </header>

                  {/* Divider line before article body */}
                  <div className="w-full h-[1px] bg-[var(--border-color)] mb-8" />

                  {/* Main Article Body (True WYSIWYG Live Render Editable Canvas) */}
                  <div className="flex-1 space-y-2">
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 mb-2">
                      <span>✓ Live Content Canvas:</span>
                      <span className="font-normal text-[var(--text-muted)]">Click anywhere below to start typing directly on the rendered article.</span>
                    </p>

                    <div
                      ref={contentEditableRef}
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onInput={handleLiveRenderInput}
                      className="article-prose outline-none border border-transparent focus:border-emerald-500/30 rounded-xl p-2 transition-all min-h-[500px]"
                    />
                  </div>
                </article>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Image Selector Sub-Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl flex flex-col overflow-hidden text-xs font-mono">
            
            {/* Header */}
            <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-[var(--text-primary)]">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>Insert Image</span>
              </div>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Source Selector Tabs */}
            <div className="flex items-center border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4">
              <button
                type="button"
                onClick={() => setImageSourceTab('folder')}
                className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-semibold transition-colors ${
                  imageSourceTab === 'folder'
                    ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Images Folder ({publicImages.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setImageSourceTab('upload')}
                className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-semibold transition-colors ${
                  imageSourceTab === 'upload'
                    ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Local Image</span>
              </button>
              <button
                type="button"
                onClick={() => setImageSourceTab('url')}
                className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-semibold transition-colors ${
                  imageSourceTab === 'url'
                    ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Custom URL / Path</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {imageSourceTab === 'folder' && (
                <div className="space-y-4">
                  <div className="p-3 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] leading-relaxed">
                    <p className="font-semibold text-[var(--text-primary)] mb-1">
                      📁 Searching <code className="px-1 py-0.5 rounded bg-[var(--bg-card)]">/content/images/</code> & <code className="px-1 py-0.5 rounded bg-[var(--bg-card)]">/public/images/</code>
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Select any image from your repository folder to embed directly.
                    </p>
                  </div>

                  {publicImages.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-[var(--border-color)] rounded-xl text-[var(--text-muted)]">
                      No images found in your images folders yet. Try uploading one or entering a custom URL!
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {publicImages.map((img) => (
                        <button
                          type="button"
                          key={img.path}
                          onClick={() => {
                            setSelectedImagePath(img.path);
                            if (!imageAltText) {
                              const nameWithoutExt = img.name.substring(0, img.name.lastIndexOf('.')) || img.name;
                              setImageAltText(nameWithoutExt.replace(/[-_]/g, ' '));
                            }
                          }}
                          className={`group relative p-2 rounded-xl border text-left transition-all flex flex-col ${
                            selectedImagePath === img.path
                              ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20'
                              : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--text-primary)]'
                          }`}
                        >
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/10 relative mb-2 flex items-center justify-center">
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {selectedImagePath === img.path && (
                              <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-500 text-white shadow">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-[var(--text-primary)] truncate text-[11px]">
                            {img.name}
                          </span>
                          <span className="text-[9px] text-[var(--text-muted)] font-mono">
                            {img.path}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {imageSourceTab === 'upload' && (
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border-color)] hover:border-[var(--text-primary)] rounded-xl cursor-pointer bg-[var(--bg-secondary)] transition-colors">
                    <Upload className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                    <span className="font-bold text-[var(--text-primary)]">Click or Drag Image File Here</span>
                    <span className="text-[11px] text-[var(--text-muted)] mt-1">Supports PNG, JPG, SVG, WebP, GIF</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {uploadedImageDataUrl && (
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center space-x-3">
                      <img src={uploadedImageDataUrl} alt="Uploaded preview" className="w-14 h-14 object-cover rounded-lg shrink-0 border" />
                      <div className="min-w-0">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">{uploadedFilename}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Image parsed as Data URL</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {imageSourceTab === 'url' && (
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-[var(--text-primary)]">
                    External Image URL or Path
                  </label>
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /images/photo.jpg"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--text-primary)]"
                  />
                  {customUrlInput && (
                    <div className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center space-x-3">
                      <img
                        src={customUrlInput}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded border shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[11px] text-[var(--text-muted)] truncate">{customUrlInput}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Alt Text Input */}
              <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1">
                    Alt Text / Description
                  </label>
                  <input
                    type="text"
                    value={imageAltText}
                    onChange={(e) => setImageAltText(e.target.value)}
                    placeholder="e.g. A serene mountain landscape"
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  let finalSrc = '';
                  if (imageSourceTab === 'folder') finalSrc = selectedImagePath;
                  else if (imageSourceTab === 'upload') finalSrc = uploadedImageDataUrl;
                  else if (imageSourceTab === 'url') finalSrc = customUrlInput;

                  if (finalSrc) {
                    insertImage(finalSrc, imageAltText);
                  }
                }}
                disabled={
                  (imageSourceTab === 'folder' && !selectedImagePath) ||
                  (imageSourceTab === 'upload' && !uploadedImageDataUrl) ||
                  (imageSourceTab === 'url' && !customUrlInput)
                }
                className="px-4 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Insertion Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link className="w-4 h-4 text-[var(--text-primary)]" />
                <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)]">Insert Link</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={confirmInsertLink} className="p-5 space-y-4">
              {/* Link Text */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--text-secondary)] mb-1.5">
                  Link Display Text
                </label>
                <input
                  type="text"
                  value={linkTextInput}
                  onChange={(e) => setLinkTextInput(e.target.value)}
                  placeholder="e.g. Read full documentation"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--text-primary)]"
                  autoFocus
                />
              </div>

              {/* Link URL / Path */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--text-secondary)] mb-1.5">
                  URL or Internal Path
                </label>
                <input
                  type="text"
                  value={linkUrlInput}
                  onChange={(e) => setLinkUrlInput(e.target.value)}
                  placeholder="https://example.com or /about"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--text-primary)]"
                  required
                />
              </div>

              {/* Quick Shortcuts */}
              <div className="pt-1">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1 font-mono">Quick Shortcuts:</span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setLinkUrlInput('/about')}
                    className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] font-mono"
                  >
                    /about
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrlInput('/contact')}
                    className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] font-mono"
                  >
                    /contact
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrlInput('https://')}
                    className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] font-mono"
                  >
                    https://
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
