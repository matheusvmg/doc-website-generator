'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { SidebarNode } from '@/lib/navigation/navigation-builder';

interface SidebarProps {
  nodes: SidebarNode[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ nodes, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[39] backdrop-blur-[4px] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-[var(--docs-header-height)] left-0 bottom-0 
        w-[var(--docs-sidebar-width)] 
        bg-[var(--docs-color-sidebar)] 
        border-r border-[var(--docs-color-border)] 
        overflow-y-auto z-40 py-8 px-6
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <nav className="flex flex-col gap-2">
          {nodes.map((node) => (
            <SidebarItem key={node.slug || node.title} node={node} pathname={pathname} depth={0} />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ node, pathname, depth }: { node: SidebarNode; pathname: string; depth: number }) {
  const docPath = node.slug === '' ? '/' : `/${node.slug}`;
  const isActive = pathname === docPath;
  const hasChildren = node.isGroup && node.children && node.children.length > 0;

  // Auto-expand if current page is in this group
  const isInGroup = pathname.startsWith(docPath + '/') || isActive;
  const [isExpanded, setIsExpanded] = useState(isInGroup);

  useEffect(() => {
    if (isInGroup) setIsExpanded(true);
  }, [isInGroup]);

  if (hasChildren) {
    return (
      <div className="flex flex-col">
        <button
          className={`
            flex items-center gap-2.5 w-full py-1.5 rounded-md text-[0.9375rem] text-left transition-all
            ${depth === 0 ? 'mt-4 first:mt-0 font-bold uppercase text-[0.8rem] tracking-wider text-[var(--docs-color-fg)]' : 'text-[var(--docs-color-fg)] hover:text-[var(--docs-color-primary)]'}
            ${isActive ? 'text-[var(--docs-color-primary)] font-medium bg-[var(--docs-color-primary-alpha)]' : ''}
          `}
          style={{ paddingLeft: `${depth * 1}rem` }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : '-rotate-90'}`}
            viewBox="0 0 12 12" fill="none"
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="truncate">{node.title}</span>
        </button>

        {isExpanded && (
          <div className="flex flex-col">
            {node.children!.map((child) => (
              <SidebarItem key={child.slug || child.title} node={child} pathname={pathname} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Leaf node
  return (
    <div className="flex flex-col">
      <Link
        href={docPath}
        className={`
          block py-1.5 rounded-md text-[0.9rem] transition-all
          ${isActive 
            ? 'text-[var(--docs-color-primary)] bg-[var(--docs-color-primary-alpha)] font-medium' 
            : 'text-[var(--docs-color-fg-muted)] hover:text-[var(--docs-color-fg)]'}
        `}
        style={{ paddingLeft: `${(depth + 1) * 1}rem` }}
      >
        <span className="truncate">{node.title}</span>
      </Link>
    </div>
  );
}
