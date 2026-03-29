---
title: Markdown Features
description: All supported markdown features and syntax
order: 2
---

# Markdown Features

This page demonstrates all the Markdown features supported by the documentation site. We support the full **GitHub Flavored Markdown (GFM)** specification.

## Headings

Headings from `h1` through `h6` are supported via `#` syntax. Each heading automatically gets an anchor link for easy sharing.

## Text Formatting

You can make text **bold**, *italic*, ~~strikethrough~~, or ***bold and italic***. You can also use `inline code` for short code references.

## Links

- [Internal link](/docs/getting-started/installation)
- [External link](https://github.com)
- Autolinks: https://example.com

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item
  - Another nested item
    - Deeply nested
- Third item

### Ordered Lists

1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B

### Task Lists

- [x] Create project structure
- [x] Set up configuration
- [ ] Write documentation
- [ ] Deploy to production

## Code Blocks

### JavaScript

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return {
    message: `Welcome, ${name}`,
    timestamp: new Date().toISOString(),
  };
}

// Usage
const result = greet('World');
console.log(result);
```

### TypeScript

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: Date;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`User not found: ${id}`);
  }
  return response.json();
}
```

### Python

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Document:
    title: str
    content: str
    created_at: datetime = datetime.now()

    def to_html(self) -> str:
        return f"<h1>{self.title}</h1><p>{self.content}</p>"

# Usage
doc = Document(title="Hello", content="World")
print(doc.to_html())
```

### Bash

```bash
#!/bin/bash

# Build the documentation site
echo "Building documentation..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "Output directory: ./out"
else
  echo "❌ Build failed!"
  exit 1
fi
```

### JSON

```json
{
  "name": "@acme/docs-generator",
  "version": "1.0.0",
  "description": "A static documentation site generator",
  "main": "dist/index.js",
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start"
  }
}
```

## Tables

| Feature           | Status | Priority |
|-------------------|--------|----------|
| Sidebar Navigation | ✅ Done | P1       |
| Dark Mode          | ✅ Done | P2       |
| Full-text Search   | 🔄 WIP | P2       |
| MDX Support        | 📋 Planned | P3   |
| i18n               | 📋 Planned | P3   |

### Aligned Columns

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Row 1        | Data           | 100           |
| Row 2        | Data           | 200           |
| Row 3        | Data           | 300           |

## Blockquotes

> This is a simple blockquote. It can span multiple lines and contain **formatted text**.

> This is a multi-paragraph blockquote.
>
> It has two paragraphs and supports *all* Markdown formatting.

## Callouts / Alerts

> [!NOTE]
> This is a note callout. Use it to provide additional context or background information.

> [!TIP]
> This is a tip callout. Use it to share best practices, shortcuts, or performance suggestions.

> [!IMPORTANT]
> This is an important callout. Use it for essential requirements or critical steps.

> [!WARNING]
> This is a warning callout. Use it for breaking changes, compatibility issues, or potential problems.

> [!CAUTION]
> This is a caution callout. Use it for high-risk actions that could cause data loss or security issues.

## Images

Images are rendered responsively and support alt text for accessibility:

![Placeholder image](https://via.placeholder.com/800x400/6366f1/ffffff?text=Documentation+Image)

## Horizontal Rules

Use three or more dashes to create a horizontal rule:

---

Content continues after the rule.

## Footnotes

Here's a sentence with a footnote[^1] and another one[^2].

[^1]: This is the first footnote with additional context.
[^2]: This is the second footnote with a [link](https://example.com).

## Emoji

You can use emoji in your documentation: 🚀 ✨ 📝 🎉 ⚡ 🔥

## HTML Inline

Some <mark>inline HTML</mark> is supported for special formatting needs like <kbd>Ctrl</kbd> + <kbd>C</kbd> keyboard shortcuts.

## Math (optional)

If enabled, you can use inline math $E = mc^2$ and block math:

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

---

This page serves as both documentation and a visual test of all supported Markdown features.
