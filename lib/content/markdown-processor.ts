// --------------------------------------------------------------------------
// Markdown Processor – unified pipeline (remark → rehype → HTML)
// --------------------------------------------------------------------------

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface TableOfContentsEntry {
  id: string;
  text: string;
  level: number;
}

export interface DocumentFrontmatter {
  title?: string;
  description?: string;
  order?: number;
  [key: string]: unknown;
}

export interface ProcessedDocument {
  /** URL slug: "getting-started/installation" */
  slug: string;
  /** Original file path: "getting-started/installation.mdx" */
  filePath: string;
  /** Rendered HTML string (fallback for search/index) */
  content: string;
  /** Serialized MDX source */
  mdxSource: MDXRemoteSerializeResult;
  /** Parsed frontmatter */
  frontmatter: DocumentFrontmatter;
  /** Headings extracted for TOC */
  headings: TableOfContentsEntry[];
  /** Original markdown (for search index) */
  rawContent: string;
}

// --------------------------------------------------------------------------
// Heading extraction (from rendered HTML)
// --------------------------------------------------------------------------

function extractHeadings(html: string): TableOfContentsEntry[] {
  const headings: TableOfContentsEntry[] = [];
  const regex = /<h([2-4])\s+id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    // Strip HTML tags from heading text
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    headings.push({ id, text, level });
  }

  return headings;
}

// --------------------------------------------------------------------------
// GitHub-style alerts transform
// --------------------------------------------------------------------------

/** Convert GitHub-style alerts (> [!NOTE], etc.) to styled HTML */
function transformAlerts(html: string): string {
  // Match blockquotes that start with [!TYPE]
  const alertPattern =
    /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*<br\s*\/?>\s*/gi;

  // Also handle the case where it's on its own paragraph line
  const alertPattern2 =
    /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]<\/p>\s*<p>/gi;

  let result = html;

  // Pattern 1: alert type and content in same paragraph
  result = result.replace(alertPattern, (_match, type: string) => {
    const lower = type.toLowerCase();
    return `<div class="callout callout-${lower}" data-callout="${lower}"><p class="callout-title">${capitalize(lower)}</p><p>`;
  });

  // Close the callout div where blockquote ends
  // This is a simplified approach – close </blockquote> that follow a callout opener
  result = result.replace(
    /(<div class="callout[^"]*"[^>]*>[\s\S]*?)<\/blockquote>/g,
    '$1</div>'
  );

  // Pattern 2: alert type in its own paragraph
  result = result.replace(alertPattern2, (_match, type: string) => {
    const lower = type.toLowerCase();
    return `<div class="callout callout-${lower}" data-callout="${lower}"><p class="callout-title">${capitalize(lower)}</p><p>`;
  });

  return result;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// --------------------------------------------------------------------------
// Slug generation from file path
// --------------------------------------------------------------------------

export function pathToSlug(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/').replace(/\.mdx?$/, '');
  
  // Handle root-level index/readme
  if (/^(index|README)$/i.test(normalized)) {
    return '';
  }

  // Handle nested-level index/readme (e.g., getting-started/README)
  return normalized.replace(/\/(index|README)$/i, '');
}

// --------------------------------------------------------------------------
// Processor singleton (lazy init)
// --------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let processorInstance: any = null;

async function getProcessor() {
  if (processorInstance) return processorInstance;

  processorInstance = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['heading-anchor'] },
    })
    .use(rehypeShiki, {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true });

  return processorInstance;
}

// --------------------------------------------------------------------------
// Main entry point
// --------------------------------------------------------------------------

export async function processMarkdown(
  rawMarkdown: string,
  filePath: string
): Promise<ProcessedDocument> {
  // 1. Extract frontmatter
  const { content: markdownBody, data: frontmatter } = matter(rawMarkdown);

  // 2. Process for metadata (TOC, etc.) - keep the unified pipeline for this
  const processor = await getProcessor();
  const result = await processor.process(markdownBody);
  let html = String(result);

  // 3. Transform GitHub-style alerts (for the HTML fallback)
  html = transformAlerts(html);

  // 4. Extract headings from rendered HTML
  const headings = extractHeadings(html);

  // 5. Generate slug from file path
  const slug = pathToSlug(filePath);

  // 6. Derive title from frontmatter or first heading
  if (!frontmatter.title && headings.length > 0) {
    frontmatter.title = headings[0].text;
  }
  if (!frontmatter.title) {
    const baseName = filePath.replace(/\.mdx?$/, '').split('/').pop() ?? 'Untitled';
    frontmatter.title = baseName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // 7. Serialize for MDX
  const mdxSource = await serialize(markdownBody, {
    parseFrontmatter: false, // already done by gray-matter
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: { className: ['heading-anchor'] },
          },
        ],
        [
          rehypeShiki,
          {
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
          },
        ],
      ],
      format: filePath.endsWith('.mdx') ? 'mdx' : 'md',
    },
  });

  return {
    slug,
    filePath,
    content: html,
    mdxSource,
    frontmatter: frontmatter as DocumentFrontmatter,
    headings,
    rawContent: markdownBody,
  };
}
