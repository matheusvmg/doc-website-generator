'use client';

import { useEffect, useState, useRef } from 'react';
import type { TableOfContentsEntry } from '@/lib/content/markdown-processor';

interface TableOfContentsProps {
  headings: TableOfContentsEntry[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="docs-toc" aria-label="Table of contents">
      <p className="docs-toc-title">On this page</p>
      <ul className="docs-toc-list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`docs-toc-link ${activeId === heading.id ? 'docs-toc-link--active' : ''}`}
              style={{ paddingLeft: `${(heading.level - 2) * 0.75 + 0}rem` }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .docs-toc {
          position: sticky;
          top: calc(var(--docs-header-height) + 2rem);
          max-height: calc(100vh - var(--docs-header-height) - 4rem);
          overflow-y: auto;
          padding-right: 1rem;
        }

        .docs-toc-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--docs-color-fg);
          margin-bottom: 0.75rem;
        }

        .docs-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          border-left: 1px solid var(--docs-color-border);
        }

        .docs-toc-link {
          display: block;
          padding: 0.3rem 0 0.3rem 0.875rem;
          font-size: 0.8125rem;
          line-height: 1.4;
          color: var(--docs-color-fg-subtle);
          text-decoration: none;
          border-left: 2px solid transparent;
          margin-left: 2px;
          transition: all var(--docs-transition);
        }

        .docs-toc-link:hover {
          color: var(--docs-color-fg);
          text-decoration: none;
        }

        .docs-toc-link--active {
          color: var(--docs-color-primary);
          border-left-color: var(--docs-color-primary);
        }
      `}</style>
    </nav>
  );
}
