---
title: Configuration
description: Complete guide to configuring your documentation site
order: 1
---

# Configuration

All configuration is done through the `docs.config.ts` file in your project root.

## Basic Configuration

```typescript
import { defineConfig } from '@acme/docs-generator';

export default defineConfig({
  source: {
    type: 'github',
    url: 'https://github.com/your-org/your-repo',
    branch: 'main',
    docsPath: 'docs',
  },
  theme: {
    name: 'My Project',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
    colors: {
      primary: '#6366f1',
      accent: '#8b5cf6',
    },
    font: {
      heading: 'Inter',
      body: 'Inter',
      code: 'JetBrains Mono',
    },
  },
  nav: {
    links: [
      { label: 'GitHub', url: 'https://github.com/your-org' },
      { label: 'Discord', url: 'https://discord.gg/your-server' },
    ],
  },
});
```

## Source Configuration

### GitHub

```typescript
source: {
  type: 'github',
  url: 'https://github.com/your-org/your-repo',
  branch: 'main',
  docsPath: 'docs',
  token: process.env.GITHUB_TOKEN, // optional, for private repos
}
```

### GitLab

```typescript
source: {
  type: 'gitlab',
  url: 'https://gitlab.com/your-org/your-repo',
  branch: 'main',
  docsPath: 'docs',
  token: process.env.GITLAB_TOKEN,
}
```

### Local Files

```typescript
source: {
  type: 'local',
  docsPath: './docs',
}
```

## Theme Configuration

### Colors

Customize the color palette:

| Property       | Default     | Description              |
|---------------|-------------|--------------------------|
| `primary`     | `#6366f1`   | Primary brand color      |
| `accent`      | `#8b5cf6`   | Accent/highlight color   |
| `background`  | `#ffffff`   | Page background          |
| `foreground`  | `#0f172a`   | Text color               |
| `sidebar`     | `#f8fafc`   | Sidebar background       |

### Fonts

Use any Google Font:

```typescript
font: {
  heading: 'Inter',       // Headings
  body: 'Inter',          // Body text
  code: 'JetBrains Mono', // Code blocks
}
```

> [!WARNING]
> Custom fonts increase page load time. Stick to 2-3 font families maximum.

## Navigation Links

Add external links to the header:

```typescript
nav: {
  links: [
    { label: 'GitHub', url: 'https://github.com/...', icon: 'github' },
    { label: 'API', url: 'https://api.example.com', icon: 'external' },
  ],
}
```

## Environment Variables

For private repositories, set the authentication token as an environment variable:

```bash
# .env.local
DOCS_GIT_TOKEN=ghp_your_github_personal_access_token
```

> [!CAUTION]
> Never commit tokens to your repository. Always use environment variables for sensitive data.

## Frontmatter Options

Each markdown file supports the following frontmatter:

```yaml
---
title: Page Title         # Used in sidebar and browser tab
description: Page desc    # Used in meta description
order: 1                  # Sort order in sidebar (lower = higher)
---
```
