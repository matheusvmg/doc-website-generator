---
title: Deployment
description: Deploy your documentation site to production
order: 3
---

# Deployment

Your documentation site is a static export — it can be deployed anywhere that serves HTML files.

## Build for Production

```bash
npm run build
```

This generates a static site in the `out/` directory.

## Vercel

The easiest deployment option:

1. Push your project to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js and configures the build

> [!TIP]
> Set environment variables in Vercel's dashboard for private repository tokens.

## Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --dir=out --prod
```

## GitHub Pages

Add this to your `.github/workflows/deploy.yml`:

```yaml
name: Deploy Docs
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Custom Server

Serve the `out/` directory with any static file server:

```bash
# Using serve
npx serve out

# Using Python
cd out && python -m http.server 8000

# Using Caddy
caddy file-server --root out --listen :8080
```

> [!NOTE]
> Make sure your hosting supports client-side routing or configure URL rewrites for clean URLs.
