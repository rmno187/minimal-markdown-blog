/// <reference types="vite/client" />

interface ImportMeta {
  readonly glob: (pattern: string, options?: { query?: string; eager?: boolean }) => Record<string, any>;
}
