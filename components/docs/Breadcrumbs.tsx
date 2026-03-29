import Link from 'next/link';
import type { BreadcrumbItem } from '@/lib/navigation/navigation-builder';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length <= 1) return null;

  return (
    <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
      <ol className="docs-breadcrumbs-list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const path = item.slug === '' ? '/' : `/${item.slug}`;

          return (
            <li key={item.slug + i} className="docs-breadcrumbs-item">
              {!isLast ? (
                <>
                  <Link href={path} className="docs-breadcrumbs-link">
                    {item.title}
                  </Link>
                  <svg className="docs-breadcrumbs-sep" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </>
              ) : (
                <span className="docs-breadcrumbs-current">{item.title}</span>
              )}
            </li>
          );
        })}
      </ol>

      <style jsx>{`
        .docs-breadcrumbs {
          margin-bottom: 1rem;
        }

        .docs-breadcrumbs-list {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          padding: 0;
          margin: 0;
          flex-wrap: wrap;
        }

        .docs-breadcrumbs-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .docs-breadcrumbs-link {
          font-size: 0.8125rem;
          color: var(--docs-color-fg-subtle);
          text-decoration: none;
          transition: color var(--docs-transition);
        }

        .docs-breadcrumbs-link:hover {
          color: var(--docs-color-primary);
          text-decoration: none;
        }

        .docs-breadcrumbs-sep {
          color: var(--docs-color-fg-subtle);
          flex-shrink: 0;
        }

        .docs-breadcrumbs-current {
          font-size: 0.8125rem;
          color: var(--docs-color-fg-muted);
        }
      `}</style>
    </nav>
  );
}
