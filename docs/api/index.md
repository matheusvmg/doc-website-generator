---
title: API Reference
description: Complete API documentation
order: 3
---

# API Reference

This section provides complete API documentation for the documentation generator.

## Overview

The documentation generator exposes a TypeScript API that can be used programmatically.

```typescript
import { generateDocs, defineConfig } from '@acme/docs-generator';

const config = defineConfig({
  source: { type: 'local', docsPath: './docs' },
  theme: { name: 'My API Docs' },
});

await generateDocs(config);
```

## Modules

| Module | Description |
|--------|-------------|
| [Configuration](/docs/api/configuration-api) | Config types and helpers |
| [Content](/docs/api/content-api) | Content fetching and processing |

> [!NOTE]
> The API is designed for advanced use cases. Most users won't need to interact with the API directly.
