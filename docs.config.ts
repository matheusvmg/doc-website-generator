import { defineConfig } from './lib/config/docs-config';

export default defineConfig({
  source: {
    type: (process.env.DOCS_SOURCE_TYPE as 'github' | 'gitlab' | 'local') || 'local',
    url: process.env.DOCS_SOURCE_URL,
    branch: process.env.DOCS_SOURCE_BRANCH || 'main',
    docsPath: process.env.DOCS_SOURCE_PATH || (process.env.DOCS_SOURCE_TYPE === 'local' ? './docs' : 'docs'),
    token: process.env.DOCS_GIT_TOKEN,
  },
  theme: {
    name: process.env.DOCS_THEME_NAME || 'SSG Docs',
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
      {
        label: 'GitHub',
        url: process.env.DOCS_SOURCE_URL || 'https://github.com',
        icon: 'github'
      },
    ],
  },
});
