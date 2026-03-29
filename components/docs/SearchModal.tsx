'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { SearchEntry } from '@/lib/content/content-fetcher';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  index: SearchEntry[];
}

export function SearchModal({ isOpen, onClose, index }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Simple search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = index
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.headings.some((h) => h.toLowerCase().includes(q))
        );
      })
      .slice(0, 8); // Limit results

    setResults(filtered);
  }, [query, index]);

  if (!isOpen || !mounted) return null;

  const modal = (
    <div className="docs-search-overlay" onClick={onClose}>
      <div className="docs-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="docs-search-modal-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="docs-search-modal-input"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="docs-search-modal-close" onClick={onClose}>
            Esc
          </button>
        </div>

        <div className="docs-search-modal-body">
          {query && results.length === 0 && (
            <div className="docs-search-no-results">
              No results for "<strong>{query}</strong>"
            </div>
          )}

          {results.length > 0 && (
            <ul className="docs-search-results">
              {results.map((result) => (
                <li key={result.slug}>
                  <Link
                    href={result.slug === '' ? '/' : `/${result.slug}`}
                    className="docs-search-item"
                    onClick={onClose}
                  >
                    <span className="docs-search-item-title">{result.title}</span>
                    <span className="docs-search-item-path">
                      {result.slug.split('/').map((s, i, a) => (
                        <span key={s}>
                          {s || 'Home'}
                          {i < a.length - 1 && ' / '}
                        </span>
                      ))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!query && (
            <div className="docs-search-placeholder">
              Try searching for "Introduction", "Installation", or "API".
            </div>
          )}
        </div>

        <div className="docs-search-modal-footer">
          <div className="docs-search-shortcut">
            <kbd>Enter</kbd> to select
          </div>
          <div className="docs-search-shortcut">
            <kbd>↑↓</kbd> to navigate
          </div>
          <div className="docs-search-shortcut">
            <kbd>Esc</kbd> to close
          </div>
        </div>
      </div>

      <style jsx>{`
        .docs-search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 10vh;
        }

        .docs-search-modal {
          width: 100%;
          max-width: 600px;
          background: var(--docs-color-bg);
          border: 1px solid var(--docs-color-border);
          border-radius: 14px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          animation: modal-appear 0.2s ease-out;
        }

        @keyframes modal-appear {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .docs-search-modal-header {
          display: flex;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--docs-color-border);
          gap: 1rem;
          color: var(--docs-color-fg-muted);
        }

        .docs-search-modal-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-family: var(--docs-font-body);
          font-size: 1.125rem;
          color: var(--docs-color-fg);
        }

        .docs-search-modal-close {
          background: var(--docs-color-bg-subtle);
          border: 1px solid var(--docs-color-border);
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          font-size: 0.7rem;
          color: var(--docs-color-fg-muted);
          cursor: pointer;
        }

        .docs-search-modal-body {
          max-height: 400px;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .docs-search-no-results,
        .docs-search-placeholder {
          padding: 2rem;
          text-align: center;
          color: var(--docs-color-fg-muted);
          font-size: 0.95rem;
        }

        .docs-search-results {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .docs-search-item {
          display: flex;
          flex-direction: column;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          color: var(--docs-color-fg);
          transition: all 0.15s ease;
        }

        .docs-search-item:hover {
          background: var(--docs-color-bg-muted);
        }

        .docs-search-item-title {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .docs-search-item-path {
          font-size: 0.75rem;
          color: var(--docs-color-fg-muted);
          margin-top: 0.2rem;
          margin-left: 0.5rem;
          text-transform: capitalize;
        }

        .docs-search-modal-footer {
          padding: 0.75rem 1.25rem;
          background: var(--docs-color-bg-subtle);
          border-top: 1px solid var(--docs-color-border);
          display: flex;
          gap: 1.5rem;
        }

        .docs-search-shortcut {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--docs-color-fg-muted);
        }

        .docs-search-shortcut kbd {
          background: var(--docs-color-bg);
          border: 1px solid var(--docs-color-border);
          border-radius: 4px;
          padding: 0.1rem 0.3rem;
          font-family: inherit;
        }
      `}</style>
    </div>
  );

  return createPortal(modal, document.body);
}
