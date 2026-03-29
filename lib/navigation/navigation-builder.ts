// --------------------------------------------------------------------------
// Navigation Builder – constructs sidebar tree from file paths
// --------------------------------------------------------------------------

import type { ProcessedDocument } from '../content/markdown-processor';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface SidebarNode {
  /** Display name (from frontmatter.title or file name) */
  title: string;
  /** URL slug for linking */
  slug: string;
  /** Sort order (from frontmatter.order, fallback alphabetical: 999) */
  order: number;
  /** Child nodes (for directories) */
  children?: SidebarNode[];
  /** true if this is a directory/group, false if a leaf page */
  isGroup: boolean;
}

export interface PrevNextLinks {
  prev?: { title: string; slug: string };
  next?: { title: string; slug: string };
}

// --------------------------------------------------------------------------
// Build sidebar tree
// --------------------------------------------------------------------------

export function buildSidebar(docs: ProcessedDocument[]): SidebarNode[] {
  // Create a map of path segments → node
  const root: SidebarNode[] = [];

  for (const doc of docs) {
    const parts = doc.slug.split('/').filter(Boolean);

    if (parts.length === 0) {
      // Root index.md → becomes first item
      root.push({
        title: doc.frontmatter.title ?? 'Home',
        slug: '',
        order: doc.frontmatter.order ?? 0,
        isGroup: false,
      });
      continue;
    }

    insertNode(root, parts, doc);
  }

  // Sort recursively
  sortNodes(root);

  return root;
}

function insertNode(
  nodes: SidebarNode[],
  pathParts: string[],
  doc: ProcessedDocument
): void {
  const segment = pathParts[0];
  const isLast = pathParts.length === 1;

  if (isLast) {
    // Check if this segment already exists as a group (created by its children)
    const existingGroup = nodes.find((n) => n.isGroup && slugSegment(n.slug) === segment);
    if (existingGroup) {
      existingGroup.title = doc.frontmatter.title ?? existingGroup.title;
      existingGroup.order = doc.frontmatter.order ?? existingGroup.order;
      existingGroup.slug = doc.slug;
      return;
    }

    // Check if this segment already exists as a leaf (shouldn't happen with unique slugs, but for safety)
    const existingLeaf = nodes.find((n) => !n.isGroup && n.slug === doc.slug);
    if (existingLeaf) return;

    nodes.push({
      title: doc.frontmatter.title ?? formatTitle(segment),
      slug: doc.slug,
      order: doc.frontmatter.order ?? 999,
      isGroup: false,
    });
    return;
  }

  // Not last: we are looking for a group to descend into
  let group = nodes.find((n) => n.isGroup && slugSegment(n.slug) === segment);

  if (!group) {
    // Check if a leaf exists with this name (the index was processed first)
    const leafIndex = nodes.findIndex((n) => !n.isGroup && n.slug === segment);
    if (leafIndex !== -1) {
      const leaf = nodes[leafIndex];
      group = {
        title: leaf.title,
        slug: leaf.slug,
        order: leaf.order,
        children: [],
        isGroup: true,
      };
      nodes[leafIndex] = group; // Upgrade leaf to group
    } else {
      group = {
        title: formatTitle(segment),
        slug: segment, // temporary slug until index is found
        order: 999,
        children: [],
        isGroup: true,
      };
      nodes.push(group);
    }
  }

  const remaining = pathParts.slice(1);
  insertNode(group.children!, remaining, doc);
}

function slugSegment(slug: string): string {
  const parts = slug.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? slug;
}

function sortNodes(nodes: SidebarNode[]): void {
  nodes.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      sortNodes(node.children);
    }
  }
}

/** Convert "getting-started" → "Getting Started" */
function formatTitle(slug: string): string {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// --------------------------------------------------------------------------
// Flatten sidebar for prev/next navigation
// --------------------------------------------------------------------------

function flattenSidebar(nodes: SidebarNode[]): SidebarNode[] {
  const flat: SidebarNode[] = [];

  for (const node of nodes) {
    // Add the group itself if it has a slug (meaning it has an index page)
    if (node.isGroup && node.slug) {
      flat.push(node);
    }
    if (!node.isGroup) {
      flat.push(node);
    }
    if (node.children) {
      flat.push(...flattenSidebar(node.children));
    }
  }

  return flat;
}

export function getPrevNext(
  sidebar: SidebarNode[],
  currentSlug: string
): PrevNextLinks {
  const flat = flattenSidebar(sidebar);
  const idx = flat.findIndex((n) => n.slug === currentSlug);

  if (idx === -1) return {};

  return {
    prev:
      idx > 0
        ? { title: flat[idx - 1].title, slug: flat[idx - 1].slug }
        : undefined,
    next:
      idx < flat.length - 1
        ? { title: flat[idx + 1].title, slug: flat[idx + 1].slug }
        : undefined,
  };
}

// --------------------------------------------------------------------------
// Get breadcrumbs for a given slug
// --------------------------------------------------------------------------

export interface BreadcrumbItem {
  title: string;
  slug: string;
}

export function getBreadcrumbs(
  sidebar: SidebarNode[],
  currentSlug: string
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ title: 'Home', slug: '' }];

  function search(nodes: SidebarNode[], trail: BreadcrumbItem[]): boolean {
    for (const node of nodes) {
      if (node.slug === currentSlug) {
        crumbs.push(...trail, { title: node.title, slug: node.slug });
        return true;
      }
      if (node.children) {
        const found = search(node.children, [
          ...trail,
          { title: node.title, slug: node.slug },
        ]);
        if (found) return true;
      }
    }
    return false;
  }

  search(sidebar, []);
  return crumbs;
}
