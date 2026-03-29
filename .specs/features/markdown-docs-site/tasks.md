# Markdown Docs Site — Tasks

**Design**: `.specs/features/markdown-docs-site/design.md`
**Status**: In Progress

---

## Execution Plan

### Phase 1: Foundation (Sequential)
```
T1 → T2 → T3 → T4
```

### Phase 2: Core Backend (Parallel OK)
```
T4 complete, then:
  ├── T5 [P] (GitHub Provider)
  ├── T6 [P] (GitLab Provider)
  ├── T7 [P] (Local Provider)
  └── T8 [P] (Markdown Processor)
```

### Phase 3: Navigation + Content (Sequential)
```
T5,T6,T7,T8 complete, then:
  T9 → T10
```

### Phase 4: UI Components (Parallel OK)
```
T10 complete, then:
  ├── T11 [P] (Theme System + Globals CSS)
  ├── T12 [P] (Header)
  ├── T13 [P] (Sidebar)
  ├── T14 [P] (MarkdownContent + CodeBlock + Callout)
  ├── T15 [P] (TableOfContents)
  ├── T16 [P] (Breadcrumbs)
  ├── T17 [P] (PrevNextNav)
  └── T18 [P] (SearchBar)
```

### Phase 5: Integration (Sequential)
```
T11-T18 complete, then:
  T19 → T20 → T21
```

### Phase 6: P2 Features (Sequential)
```
T21 complete, then:
  T22 → T23
```

---

## Task Breakdown

### T1: Create Example Docs

**What**: Create a local `docs/` folder with example markdown files covering all GFM features
**Where**: `docs/` (project root)
**Depends on**: None
**Requirement**: DOCS-03, DOCS-04

**Done when**:
- [x] `docs/` folder exists with 8+ markdown files across 3+ subfolders
- [x] Files cover: headings, code blocks, tables, checkboxes, callouts, images, links
- [x] Files have frontmatter with title, description, order
- [x] Hierarchical structure for testing sidebar navigation

---

### T2: Install Dependencies

**What**: Install all required npm packages for markdown processing
**Where**: `package.json`
**Depends on**: T1
**Requirement**: DOCS-03

**Done when**:
- [x] All unified ecosystem packages installed
- [x] gray-matter installed
- [x] No version conflicts
- [x] `npm run build` still works (even if empty)

---

### T3: Create Configuration System

**What**: Create `docs.config.ts` and config loader with TypeScript types
**Where**: `docs.config.ts`, `lib/config/docs-config.ts`
**Depends on**: T2
**Requirement**: DOCS-01

**Done when**:
- [x] `DocsConfig` interface defined with source, theme, nav
- [x] Config loader reads and validates the config file
- [x] Default values applied for optional fields
- [x] Example `docs.config.ts` created pointing to local docs

---

### T4: Create Git Provider Adapter

**What**: Create provider factory with GitProvider interface
**Where**: `lib/git/provider-adapter.ts`
**Depends on**: T3
**Requirement**: DOCS-02

**Done when**:
- [x] `GitProvider` interface defined (fetchTree, fetchFileContent)
- [x] `createProvider()` factory detects provider from URL
- [x] Types exported: FileTreeEntry, SourceConfig

---

### T5: Implement GitHub Provider [P]

**What**: Implement GitProvider for GitHub REST API
**Where**: `lib/git/providers/github.ts`
**Depends on**: T4
**Requirement**: DOCS-02

**Done when**:
- [x] fetchTree uses `/repos/{owner}/{repo}/git/trees/{branch}?recursive=1`
- [x] fetchFileContent uses raw.githubusercontent.com
- [x] Auth header sent when token configured
- [x] Filters only .md files from docsPath

---

### T6: Implement GitLab Provider [P]

**What**: Implement GitProvider for GitLab REST API
**Where**: `lib/git/providers/gitlab.ts`
**Depends on**: T4
**Requirement**: DOCS-02

**Done when**:
- [x] fetchTree uses `/projects/{id}/repository/tree?recursive=true`
- [x] fetchFileContent uses `/projects/{id}/repository/files/{path}/raw`
- [x] Auth header sent when token configured
- [x] URL-encodes file paths correctly

---

### T7: Implement Local Provider [P]

**What**: Implement GitProvider for local filesystem
**Where**: `lib/git/providers/local.ts`
**Depends on**: T4
**Requirement**: DOCS-11

**Done when**:
- [x] Reads docs/ folder recursively
- [x] Returns FileTreeEntry[] matching interface
- [x] Reads file content via fs/promises
- [x] Works with example docs from T1

---

### T8: Create Markdown Processor [P]

**What**: Build unified pipeline: parse → GFM → frontmatter → rehype → syntax highlight → HTML
**Where**: `lib/content/markdown-processor.ts`
**Depends on**: T2
**Requirement**: DOCS-03

**Done when**:
- [x] Pipeline: remark-parse → remark-gfm → remark-frontmatter → remark-rehype → rehype-shiki → rehype-slug → rehype-autolink-headings → rehype-stringify
- [x] Extracts frontmatter via gray-matter
- [x] Extracts headings for TOC
- [x] Returns ProcessedDocument with content, frontmatter, headings

---

### T9: Create Navigation Builder

**What**: Build sidebar tree from file paths and frontmatter
**Where**: `lib/navigation/navigation-builder.ts`
**Depends on**: T8
**Requirement**: DOCS-04

**Done when**:
- [x] Converts flat file paths into nested SidebarNode tree
- [x] Respects frontmatter `order` for sorting
- [x] Falls back to alphabetical order
- [x] Handles index.md as group landing pages
- [x] getPrevNext() returns correct prev/next links

---

### T10: Create Content Fetcher

**What**: Orchestrator that fetches all docs and builds complete content
**Where**: `lib/content/content-fetcher.ts`
**Depends on**: T5, T6, T7, T8, T9
**Requirement**: DOCS-02, DOCS-03, DOCS-04

**Done when**:
- [x] fetchAllDocs() returns DocsContent with pages, sidebar, searchIndex
- [x] Uses provider to fetch tree → fetch each file → process markdown → build nav
- [x] Error handling for failed fetches
- [x] Exports cached content for static generation

---

### T11: Create Theme System + Global CSS [P]

**What**: ThemeProvider + CSS custom properties + prose styles + dark mode
**Where**: `lib/theme/theme-provider.tsx`, `app/globals.css`
**Depends on**: T3
**Requirement**: DOCS-05, DOCS-08

**Done when**:
- [x] CSS custom properties generated from config theme
- [x] Dark mode variables defined
- [x] Prose styles for all markdown elements
- [x] Google Fonts setup (Inter, JetBrains Mono)
- [x] Premium typography with generous spacing

---

### T12: Create Header Component [P]

**What**: Top navigation bar with logo, project name, search, theme toggle, links
**Where**: `components/docs/Header.tsx`
**Depends on**: T11
**Requirement**: DOCS-05

**Done when**:
- [x] Displays project name and logo from config
- [x] Search bar (visual only)
- [x] Theme toggle button
- [x] External links from config
- [x] Mobile hamburger button
- [x] Fixed position, backdrop blur

---

### T13: Create Sidebar Component [P]

**What**: Left sidebar with collapsible navigation tree
**Where**: `components/docs/Sidebar.tsx`
**Depends on**: T11
**Requirement**: DOCS-04

**Done when**:
- [x] Renders SidebarNode[] as hierarchical tree
- [x] Groups are collapsible (click to expand/collapse)
- [x] Active page highlighted
- [x] Section labels uppercase
- [x] Mobile: slide-in overlay with backdrop
- [x] Smooth transitions

---

### T14: Create Content Components [P]

**What**: MarkdownContent wrapper + CodeBlock + Callout
**Where**: `components/docs/MarkdownContent.tsx`, `components/docs/CodeBlock.tsx`, `components/docs/Callout.tsx`
**Depends on**: T11
**Requirement**: DOCS-03

**Done when**:
- [x] MarkdownContent renders HTML with prose styles (via dangerouslySetInnerHTML)
- [x] Code blocks have copy button with feedback
- [x] GitHub-style callouts styled (Note, Warning, Tip, Important, Caution)
- [x] Tables are responsive (horizontal scroll)
- [x] Images are responsive

---

### T15: Create TableOfContents Component [P]

**What**: Right sidebar with heading links and scroll spy
**Where**: `components/docs/TableOfContents.tsx`
**Depends on**: T11
**Requirement**: DOCS-03

**Done when**:
- [x] Renders headings as indented list
- [x] Scroll spy highlights current heading in viewport
- [x] Click scrolls to heading smoothly
- [x] Hidden on screens < 1280px
- [x] "On this page" title

---

### T16: Create Breadcrumbs Component [P]

**What**: Breadcrumb trail above page title
**Where**: `components/docs/Breadcrumbs.tsx`
**Depends on**: T11
**Requirement**: DOCS-05

**Done when**:
- [x] Trail from Home → Section → Page
- [x] Links navigable
- [x] Current page non-clickable
- [x] Separator between items

---

### T17: Create PrevNextNav Component [P]

**What**: Previous/Next navigation at bottom of each page
**Where**: `components/docs/PrevNextNav.tsx`
**Depends on**: T11
**Requirement**: DOCS-09

**Done when**:
- [x] Shows prev link (left) and next link (right)
- [x] Arrow icons for direction
- [x] Hides prev on first page, next on last page
- [x] Card-style with hover effect

---

### T18: Create SearchBar Component [P]

**What**: Search input with keyboard shortcut hint (visual only for P1)
**Where**: `components/docs/SearchBar.tsx`
**Depends on**: T11
**Requirement**: DOCS-05

**Done when**:
- [x] Input field with search icon
- [x] "/" keyboard shortcut badge
- [x] Placeholder text "Search documentation..."
- [x] Visual only (no search logic in P1)

---

### T19: Create DocsLayout Component

**What**: Assemble the 3-column layout (sidebar + content + TOC)
**Where**: `components/docs/DocsLayout.tsx`
**Depends on**: T12, T13, T14, T15, T16, T17, T18
**Requirement**: DOCS-05

**Done when**:
- [x] 3-column grid: 280px sidebar | flex content | 240px TOC
- [x] Responsive: single column on mobile
- [x] Sidebar state management (open/close)
- [x] Integrates all sub-components

---

### T20: Create App Router Pages

**What**: Set up catch-all route, root layout, and next.config
**Where**: `app/docs/[...slug]/page.tsx`, `app/layout.tsx`, `app/page.tsx`, `next.config.ts`
**Depends on**: T10, T19
**Requirement**: DOCS-06

**Done when**:
- [x] `generateStaticParams()` returns all doc slugs
- [x] `generateMetadata()` returns SEO metadata per page
- [x] Root layout wraps with ThemeProvider and fonts
- [x] Home page redirects to first doc
- [x] `next.config.ts` has `output: 'export'`
- [x] 404 page exists

---

### T21: Build and Verify

**What**: Run build, verify output, test locally
**Where**: Project root
**Depends on**: T20
**Requirement**: DOCS-06

**Done when**:
- [x] `npm run build` completes without errors
- [x] `/out` folder contains HTML files for all docs
- [x] Local serve shows working site
- [x] All navigation works (sidebar, TOC, breadcrumbs, prev/next)
- [x] Markdown rendering is correct for all GFM features
- [x] Dark mode toggle works
- [x] Mobile responsive layout works

---

### T22: Implement Client-side Search

**What**: Implement fuzzy search for documents using the pre-generated search index
**Where**: `components/docs/SearchBar.tsx`, `components/docs/SearchModal.tsx`, `app/docs/[...slug]/page.tsx`
**Depends on**: T21
**Requirement**: DOCS-07

**Done when**:
- [x] Keyboard shortcut `/` opens search modal
- [x] Users can type to filter documents by title and content
- [x] Results show title and matching snippets
- [x] Clicking a result navigates to the page
- [x] Modal is accessible and responsive

---

### T23: Implement MDX Support (P3)

**What**: Enable components within markdown via MDX
**Where**: `lib/content/markdown-processor.ts`, `components/docs/MDXComponents.tsx`
**Depends on**: T8
**Requirement**: DOCS-10

**Done when**:
- [x] `.mdx` files are processed correctly
- [x] Components like `<Grid>`, `<Card>`, `<Callout>` are supported
- [x] MDX provides interactivity (RSC model used)
- [x] Fallback for regular markdown remains stable (via `format: 'md'`)
