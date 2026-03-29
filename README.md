# 🚀 SSG Documentation Website

A premium, Stripe-inspired static documentation site generator built with **Next.js 16**, designed to turn your Markdown files into a beautiful, high-performance documentation experience.

### ✨ Key Features
- **💎 Premium Design**: Stripe-inspired aesthetic with a focus on typography, spacing, and user experience.
- **📁 Multi-Source Support**: Fetch documentation from local files, GitHub repositories, or GitLab.
- **📝 MDX Powered**: Full support for GitHub Flavored Markdown (GFM) and advanced MDX components via `next-mdx-remote`.
- **⚡ Performance & SEO**: Blazing fast static site generation with built-in search engine optimization.
- **🎨 Deep Customization**: Flexible theming system to match your brand's colors and fonts via `docs.config.ts`.
- **🖍️ Syntax Highlighting**: Stunning code blocks powered by **Shiki** with support for multiple themes.
- **📂 Auto-Navigation**: Sidebar and navigation are automatically generated from your file structure and frontmatter.

---

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/ssg-doc-website.git
cd ssg-doc-website
npm install
```

### 2. Configure Your Source
Edit `docs.config.ts` to point to your documentation source. By default, it looks for markdown files in the `/docs` folder:
```typescript
// docs.config.ts example for Local Docs
import { defineConfig } from './lib/config/docs-config';

export default defineConfig({
  source: {
    type: 'local',
    docsPath: './docs',
  },
  theme: {
    name: 'My Docs',
    colors: {
      primary: '#6366f1',
    },
  },
});
```

### 3. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to see your documentation in action!

---

## ⚙️ Configuration

The `docs.config.ts` file is the heart of your project. It controls where your content comes from and how your site looks.

### Source Types
You can fetch documentation from several types of sources using these environment variables or direct configuration:

- **Local**: `type: 'local'` (Recommended for development)
- **GitHub**: Fetch from a remote repository.
- **GitLab**: Fetch from a GitLab repository.

### Environment Variables
For remote sources, you can use `.env.local`:
```env
DOCS_SOURCE_TYPE=github
DOCS_SOURCE_URL=https://github.com/facebook/react
DOCS_SOURCE_PATH=docs
DOCS_GIT_TOKEN=your_personal_access_token
```

---

## 🎨 Theming

Easily customize the visual identity of your docs:
```typescript
theme: {
  name: 'Brand Docs',
  colors: {
    primary: '#6366f1',
    accent: '#8b5cf6',
  },
  font: {
    heading: 'Inter',
    body: 'Inter',
    code: 'JetBrains Mono',
  },
}
```

---

## 🛠️ Built With

- **[Next.js 16](https://nextjs.org/)** - React Framework
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Styling
- **[Unified](https://unifiedjs.com/)** / **[Remark](https://remark.js.org/)** / **[Rehype](https://rehype.js.org/)** - Markdown processing
- **[Shiki](https://shiki.matsu.io/)** - Syntax highlighting
- **[MDX-Remote](https://github.com/hashicorp/next-mdx-remote)** - MDX rendering

---

## 📖 License

This project is licensed under the MIT License.
