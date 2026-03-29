// --------------------------------------------------------------------------
// Content Fetcher – orchestrates fetching + processing + navigation
// --------------------------------------------------------------------------

import type { DocsConfig } from '../config/docs-config';
import { resolveConfig, validateConfig } from '../config/docs-config';
import { createProvider } from '../git/provider-adapter';
import { processMarkdown } from './markdown-processor';
import type { ProcessedDocument } from './markdown-processor';
import { buildSidebar } from '../navigation/navigation-builder';
import type { SidebarNode } from '../navigation/navigation-builder';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface SearchEntry {
  slug: string;
  title: string;
  content: string;
  headings: string[];
}

export interface DocsContent {
  pages: ProcessedDocument[];
  sidebar: SidebarNode[];
  searchIndex: SearchEntry[];
}

// --------------------------------------------------------------------------
// Cache – content is fetched once per build
// --------------------------------------------------------------------------

let cachedContent: DocsContent | null = null;

export function clearCache(): void {
  cachedContent = null;
}

// --------------------------------------------------------------------------
// Main entry point
// --------------------------------------------------------------------------

export async function fetchAllDocs(rawConfig: DocsConfig): Promise<DocsContent> {
  // Return cached if available (same build)
  if (cachedContent) return cachedContent;

  // 1. Resolve config with defaults
  const config = resolveConfig(rawConfig);

  // 2. Validate
  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new Error(
      `Documentation config errors:\n${errors.map((e) => `  • ${e}`).join('\n')}`
    );
  }

  console.log(`[docs] Fetching documentation from ${config.source.type}...`);

  // 3. Create provider
  const provider = createProvider(config.source);

  // 4. Fetch file tree
  const tree = await provider.fetchTree(config.source);
  const mdFiles = tree.filter((f) => f.type === 'blob' && (f.path.endsWith('.md') || f.path.endsWith('.mdx')));

  if (mdFiles.length === 0) {
    console.warn('[docs] No markdown files found. Generating empty documentation.');
    const emptyContent: DocsContent = { pages: [], sidebar: [], searchIndex: [] };
    cachedContent = emptyContent;
    return emptyContent;
  }

  console.log(`[docs] Found ${mdFiles.length} markdown files. Processing...`);

  // 5. Fetch and process each file
  const pages: ProcessedDocument[] = [];

  for (const file of mdFiles) {
    try {
      const rawContent = await provider.fetchFileContent(config.source, file.path);
      const processed = await processMarkdown(rawContent, file.path);
      pages.push(processed);
    } catch (err) {
      console.error(`[docs] Error processing ${file.path}:`, err);
    }
  }

  console.log(`[docs] Processed ${pages.length}/${mdFiles.length} pages successfully.`);
  console.log(`[docs] Slugs: ${pages.map(p => `'${p.slug}'`).join(', ')}`);

  // 6. Build sidebar navigation
  const sidebar = buildSidebar(pages);

  // 7. Build search index (for future P2 search)
  const searchIndex: SearchEntry[] = pages.map((page) => ({
    slug: page.slug,
    title: page.frontmatter.title ?? '',
    content: page.rawContent
      .replace(/^---[\s\S]*?---\s*/m, '') // strip frontmatter
      .replace(/[#*`>\[\]()!|_~]/g, '') // strip markdown syntax
      .slice(0, 5000), // limit size
    headings: page.headings.map((h) => h.text),
  }));

  // 8. Cache
  const content: DocsContent = { pages, sidebar, searchIndex };
  cachedContent = content;

  return content;
}

// --------------------------------------------------------------------------
// Helpers for static generation
// --------------------------------------------------------------------------

/** Get all slugs for generateStaticParams */
export async function getAllSlugs(config: DocsConfig): Promise<string[][]> {
  const content = await fetchAllDocs(config);
  return content.pages.map((page) => {
    if (page.slug === '') return []; // root index
    return page.slug.split('/');
  });
}

/** Get a single page by slug */
export async function getPageBySlug(
  config: DocsConfig,
  slug: string
): Promise<ProcessedDocument | undefined> {
  const content = await fetchAllDocs(config);
  return content.pages.find((p) => p.slug === slug);
}
