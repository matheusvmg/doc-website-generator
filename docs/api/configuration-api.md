---
title: Configuration API
description: API reference for configuration options
order: 1
---

# Configuration API

## `defineConfig()`

Creates a type-safe configuration object.

```typescript
function defineConfig(config: DocsConfig): DocsConfig;
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `DocsConfig` | Yes | Configuration object |

### Returns

Returns the validated `DocsConfig` object.

### Example

```typescript
import { defineConfig } from '@acme/docs-generator';

export default defineConfig({
  source: {
    type: 'github',
    url: 'https://github.com/acme/repo',
    branch: 'main',
    docsPath: 'docs',
  },
  theme: {
    name: 'Acme Docs',
    colors: {
      primary: '#6366f1',
    },
  },
});
```

## `DocsConfig`

The main configuration interface.

```typescript
interface DocsConfig {
  source: SourceConfig;
  theme?: ThemeConfig;
  nav?: NavConfig;
}
```

## `SourceConfig`

Defines where to fetch documentation from.

```typescript
interface SourceConfig {
  type: 'github' | 'gitlab' | 'local';
  url?: string;
  branch?: string;      // default: 'main'
  docsPath?: string;     // default: 'docs'
  token?: string;
}
```

> [!IMPORTANT]
> When using `type: 'github'` or `type: 'gitlab'`, the `url` field is required.

## `ThemeConfig`

Customize the visual appearance.

```typescript
interface ThemeConfig {
  name: string;
  logo?: string;
  favicon?: string;
  colors?: {
    primary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    sidebar?: string;
  };
  font?: {
    heading?: string;
    body?: string;
    code?: string;
  };
}
```

## `NavConfig`

Configure header navigation links.

```typescript
interface NavConfig {
  links?: Array<{
    label: string;
    url: string;
    icon?: string;
  }>;
}
```

> [!TIP]
> The `icon` field supports values like `'github'`, `'external'`, `'discord'`, and `'twitter'`.
