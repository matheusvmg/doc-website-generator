'use client';

import { useState, useEffect } from 'react';
import { SearchModal } from './SearchModal';
import type { SearchEntry } from '@/lib/content/content-fetcher';

interface SearchBarProps {
  placeholder?: string;
  index: SearchEntry[];
}

export function SearchBar({ placeholder = 'Search documentation...', index }: SearchBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keyboard shortcut '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isModalOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      <div className="docs-search" onClick={() => setIsModalOpen(true)}>
        <svg className="docs-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <div className="docs-search-input-fake">
          {placeholder}
        </div>
        <kbd className="docs-search-kbd">/</kbd>

        <style jsx>{`
          .docs-search {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            cursor: pointer;
          }

          .docs-search-icon {
            position: absolute;
            left: 0.875rem;
            color: var(--docs-color-fg-subtle);
            pointer-events: none;
            z-index: 10;
          }

          .docs-search-input-fake {
            width: 100%;
            height: 38px;
            padding: 0 2.5rem 0 2.5rem;
            font-family: var(--docs-font-body);
            font-size: 0.875rem;
            background: var(--docs-color-bg-subtle);
            border: 1px solid var(--docs-color-border);
            border-radius: 10px;
            color: var(--docs-color-fg-muted);
            line-height: 36px;
            transition: all var(--docs-transition);
          }

          .docs-search:hover .docs-search-input-fake {
            border-color: var(--docs-color-fg-subtle);
          }

          .docs-search-kbd {
            position: absolute;
            right: 0.75rem;
            font-family: var(--docs-font-code);
            font-size: 0.7rem;
            color: var(--docs-color-fg-subtle);
            background: var(--docs-color-bg);
            border: 1px solid var(--docs-color-border);
            border-radius: 4px;
            padding: 0.1rem 0.4rem;
            pointer-events: none;
          }
        `}</style>
      </div>

      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        index={index}
      />
    </>
  );
}
