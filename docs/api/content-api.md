---
title: Content API
description: API reference for content fetching and processing
order: 2
---

# Content API

The Content API provides programmatic access to fetch and process documentation content.

## `fetchAllDocs()`

Fetches all documentation from the configured source and processes it.

```typescript
async function fetchAllDocs(config: DocsConfig): Promise<DocsContent>;
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `DocsConfig` | The documentation configuration |

### Returns

```typescript
interface DocsContent {
  pages: ProcessedDocument[];
  sidebar: SidebarNode[];
  searchIndex: SearchEntry[];
}
```

### Example

```typescript
import { fetchAllDocs } from '@acme/docs-generator';
import config from './docs.config';

const content = await fetchAllDocs(config);

console.log(`Fetched ${content.pages.length} pages`);
console.log(`Sidebar has ${content.sidebar.length} top-level sections`);
```

## `ProcessedDocument`

Represents a single processed documentation page.

```typescript
interface ProcessedDocument {
  slug: string;           // URL path
  content: string;        // Rendered HTML
  frontmatter: {
    title?: string;
    description?: string;
    order?: number;
  };
  headings: TableOfContentsEntry[];
  rawContent: string;     // Original markdown
}
```

## `SidebarNode`

Represents a node in the sidebar navigation tree.

```typescript
interface SidebarNode {
  title: string;
  slug: string;
  order: number;
  children?: SidebarNode[];
  isGroup: boolean;
}
```

## `TableOfContentsEntry`

Represents a heading in the Table of Contents.

```typescript
interface TableOfContentsEntry {
  id: string;     // Anchor ID
  text: string;   // Heading text
  level: number;  // Heading level (1-6)
}
```

## Error Handling

The Content API throws specific errors for common failure scenarios:

```typescript
try {
  const docs = await fetchAllDocs(config);
} catch (error) {
  if (error instanceof ConfigError) {
    console.error('Invalid configuration:', error.message);
  } else if (error instanceof FetchError) {
    console.error('Failed to fetch docs:', error.message);
  } else if (error instanceof ProcessingError) {
    console.error('Failed to process markdown:', error.message);
  }
}
```

> [!WARNING]
> Network errors during fetch will cause the build to fail. Ensure your CI/CD environment has access to the configured Git provider.
