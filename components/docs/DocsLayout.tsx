'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';
import { Breadcrumbs } from './Breadcrumbs';
import { MarkdownContent } from './MarkdownContent';
import { PrevNextNav } from './PrevNextNav';
import type { SidebarNode, PrevNextLinks, BreadcrumbItem } from '@/lib/navigation/navigation-builder';
import type { ThemeConfig, NavConfig } from '@/lib/config/docs-config';
import type { TableOfContentsEntry } from '@/lib/content/markdown-processor';
import type { SearchEntry } from '@/lib/content/content-fetcher';
import type { ReactNode } from 'react';

interface DocsLayoutProps {
  children: ReactNode;
  headings: TableOfContentsEntry[];
  sidebar: SidebarNode[];
  breadcrumbs: BreadcrumbItem[];
  prevNext: PrevNextLinks;
  theme: ThemeConfig;
  nav?: NavConfig;
  searchIndex: SearchEntry[];
}

export function DocsLayout({
  children,
  headings,
  sidebar,
  breadcrumbs,
  prevNext,
  theme,
  nav,
  searchIndex,
}: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="docs-layout">
      <Header
        projectName={theme.name}
        logo={theme.logo}
        links={nav?.links}
        searchIndex={searchIndex}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar
        nodes={sidebar}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="docs-main">
        <article className="docs-article">
          <Breadcrumbs items={breadcrumbs} />
          {children}
          <PrevNextNav links={prevNext} />
        </article>

        <aside className="docs-toc-aside">
          <TableOfContents headings={headings} />
        </aside>
      </main>

      <style jsx>{`
        .docs-layout {
          min-height: 100vh;
        }

        .docs-main {
          display: flex;
          margin-left: var(--docs-sidebar-width);
          margin-top: var(--docs-header-height);
          min-height: calc(100vh - var(--docs-header-height));
        }

        .docs-article {
          flex: 1;
          min-width: 0;
          max-width: var(--docs-content-max-width);
          padding: 2.5rem 3rem 4rem;
          margin: 0 auto;
        }

        .docs-toc-aside {
          width: var(--docs-toc-width);
          flex-shrink: 0;
          padding: 2.5rem 0;
        }

        @media (max-width: 1280px) {
          .docs-toc-aside {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .docs-main {
            margin-left: 0;
          }

          .docs-article {
            padding: 1.5rem 1.25rem 3rem;
          }
        }
      `}</style>
    </div>
  );
}
