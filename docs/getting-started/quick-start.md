---
title: Quick Start
description: Build your first documentation site in 5 minutes
order: 2
---

# Quick Start

In this guide, you'll create a documentation site from scratch in under 5 minutes.

## Step 1: Create Configuration

Create a `docs.config.ts` file in your project root:

```typescript
import { defineConfig } from '@acme/docs-generator';

export default defineConfig({
  source: {
    type: 'local',
    docsPath: './docs',
  },
  theme: {
    name: 'My Project',
    colors: {
      primary: '#6366f1',
    },
  },
});
```

## Step 2: Create Your First Document

Create a `docs/index.md` file:

```markdown
---
title: Welcome
description: My project documentation
---

# Welcome to My Project

This is the home page of your documentation.
```

## Step 3: Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your documentation site!

## Step 4: Add More Pages

Create additional markdown files in the `docs/` directory:

```
docs/
├── index.md              → /
├── getting-started/
│   ├── index.md          → /getting-started
│   ├── installation.md   → /getting-started/installation
│   └── quick-start.md    → /getting-started/quick-start
└── guides/
    ├── index.md          → /guides
    └── configuration.md  → /guides/configuration
```

Each `.md` file automatically becomes a page in your documentation site.

## What's Next?

- [ ] Read the [Configuration](/docs/guides/configuration) guide to customize your site
- [ ] Learn about [Markdown Features](/docs/guides/markdown-features) supported
- [ ] Explore the [API Reference](/docs/api/overview)
- [ ] Set up [deployment](/docs/guides/deployment) for production

> [!NOTE]
> The dev server supports hot reloading. Any changes to your markdown files will automatically update in the browser.
