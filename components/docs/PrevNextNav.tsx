import Link from 'next/link';
import type { PrevNextLinks } from '@/lib/navigation/navigation-builder';

interface PrevNextNavProps {
  links: PrevNextLinks;
}

export function PrevNextNav({ links }: PrevNextNavProps) {
  if (!links.prev && !links.next) return null;

  return (
    <nav className="docs-prevnext" aria-label="Page navigation">
      {links.prev ? (
        <Link href={links.prev.slug === '' ? '/' : `/${links.prev.slug}`} className="docs-prevnext-card docs-prevnext-prev">
          <span className="docs-prevnext-label">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Previous
          </span>
          <span className="docs-prevnext-title">{links.prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {links.next ? (
        <Link href={links.next.slug === '' ? '/' : `/${links.next.slug}`} className="docs-prevnext-card docs-prevnext-next">
          <span className="docs-prevnext-label">
            Next
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="docs-prevnext-title">{links.next.title}</span>
        </Link>
      ) : (
        <div />
      )}

      <style jsx>{`
        .docs-prevnext {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--docs-color-border);
        }

        @media (max-width: 640px) {
          .docs-prevnext {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .docs-prevnext-card {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          padding: 1rem 1.25rem;
          border: 1px solid var(--docs-color-border);
          border-radius: 12px;
          text-decoration: none;
          transition: all var(--docs-transition);
        }

        .docs-prevnext-card:hover {
          border-color: var(--docs-color-primary);
          background: color-mix(in srgb, var(--docs-color-primary) 4%, transparent);
          text-decoration: none;
        }

        .docs-prevnext-next {
          text-align: right;
          align-items: flex-end;
        }

        .docs-prevnext-label {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--docs-color-fg-subtle);
        }

        .docs-prevnext-title {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--docs-color-primary);
        }
      `}</style>
    </nav>
  );
}
