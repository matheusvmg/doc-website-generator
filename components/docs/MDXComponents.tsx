import Link from 'next/link';
import type { ReactNode } from 'react';

// --------------------------------------------------------------------------
// Components
// --------------------------------------------------------------------------

export function Callout({
  children,
  type = 'note',
}: {
  children: ReactNode;
  type?: 'note' | 'tip' | 'important' | 'warning' | 'caution';
}) {
  return (
    <div className={`callout callout-${type}`} data-callout={type}>
      <p className="callout-title">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
      <div className="callout-content">{children}</div>
    </div>
  );
}

export function Card({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon?: string;
}) {
  return (
    <Link 
      href={href} 
      className="docs-card block p-5 bg-[var(--docs-color-bg)] border border-[var(--docs-color-border)] rounded-xl no-underline text-current transition-all hover:border-[var(--docs-color-primary)] hover:bg-[var(--docs-color-bg-subtle)] hover:-translate-y-0.5 hover:shadow-sm mb-6"
    >
      <div className="docs-card-header flex items-center gap-3 mb-2">
        {icon && <span className="docs-card-icon">{icon}</span>}
        <h3 className="docs-card-title m-0 text-[1.05rem] font-semibold">{title}</h3>
      </div>
      <p className="docs-card-description m-0 text-[0.9rem] text-[var(--docs-color-fg-muted)] leading-relaxed">
        {description}
      </p>
    </Link>
  );
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  const gridCols = cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  
  return (
    <div className={`docs-grid grid ${gridCols} gap-4 my-6`}>
      {children}
    </div>
  );
}

// --------------------------------------------------------------------------
// Registry
// --------------------------------------------------------------------------

export const mdxComponents = {
  Callout,
  Card,
  Grid,
  // Custom link handling
  a: ({ href, children, ...props }: any) => {
    if (href?.startsWith('http')) {
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
    }
    return <Link href={href || '#'} {...props}>{children}</Link>;
  },
  // Prevent script tags from causing React warnings
  // React 19+ recommends using <template> for non-executable scripts in components
  script: (props: any) => <template {...props} />,
};
