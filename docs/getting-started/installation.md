---
title: Installation
description: How to install and set up the project in your environment
order: 1
---

# Installation

Follow these steps to install the project in your development environment.

## Using npm

```bash
npm install @acme/docs-generator --save-dev
```

## Using yarn

```bash
yarn add @acme/docs-generator --dev
```

## Using pnpm

```bash
pnpm add @acme/docs-generator -D
```

## Verify Installation

After installing, verify that the package is available:

```bash
npx docs-generator --version
```

You should see output like:

```
@acme/docs-generator v1.0.0
```

> [!TIP]
> If you encounter permission issues on macOS or Linux, try running with `sudo` or fix your npm permissions.

## Project Structure

After installation, your project structure should look like this:

```
my-project/
├── docs/
│   ├── index.md
│   └── getting-started/
│       └── installation.md
├── docs.config.ts
├── package.json
└── node_modules/
```

## System Requirements

| Requirement | Minimum Version | Recommended |
|-------------|----------------|-------------|
| Node.js     | 18.0           | 20.x LTS   |
| npm         | 9.0            | 10.x       |
| Memory      | 512 MB         | 2 GB       |
| Disk Space  | 100 MB         | 500 MB     |

## Next Steps

Now that you have the project installed, proceed to the [Quick Start](/docs/getting-started/quick-start) guide to create your first documentation site.
