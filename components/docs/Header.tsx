'use client';

import Link from 'next/link';
import { useTheme } from '@/lib/theme/theme-provider';
import type { NavLink } from '@/lib/config/docs-config';
import { SearchBar } from './SearchBar';
import type { SearchEntry } from '@/lib/content/content-fetcher';

interface HeaderProps {
  projectName: string;
  logo?: string;
  links?: NavLink[];
  searchIndex: SearchEntry[];
  onToggleSidebar: () => void;
}

export function Header({ projectName, logo, links = [], searchIndex, onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="docs-header">
      <div className="docs-header-inner">
        {/* Left: hamburger + logo */}
        <div className="docs-header-left">
          <button
            className="docs-hamburger"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/" className="docs-header-brand">
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={projectName} className="docs-header-logo" />
            )}
            <span className="docs-header-title">{projectName}</span>
            <span className="docs-header-badge">Docs</span>
          </Link>
        </div>

        {/* Center: search */}
        <div className="docs-header-center">
          <SearchBar placeholder="Search documentation..." index={searchIndex} />
        </div>

        {/* Right: theme toggle + links */}
        <div className="docs-header-right">
          <button
            className="docs-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="docs-header-link"
            >
              {link.icon === 'github' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              )}
              {link.icon !== 'github' && <span>{link.label}</span>}
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .docs-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--docs-header-height);
          background: var(--docs-color-bg);
          border-bottom: 1px solid var(--docs-color-border);
          z-index: 50;
          backdrop-filter: blur(12px);
          background: color-mix(in srgb, var(--docs-color-bg) 85%, transparent);
        }

        .docs-header-inner {
          max-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          gap: 1rem;
        }

        .docs-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .docs-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--docs-color-fg-muted);
          border-radius: 8px;
          transition: all var(--docs-transition);
        }

        .docs-hamburger:hover {
          background: var(--docs-color-bg-muted);
          color: var(--docs-color-fg);
        }

        @media (max-width: 768px) {
          .docs-hamburger {
            display: flex;
          }
        }

        .docs-header-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--docs-color-fg);
        }

        .docs-header-brand:hover {
          text-decoration: none;
        }

        .docs-header-logo {
          height: 24px;
          width: auto;
        }

        .docs-header-title {
          font-weight: 650;
          font-size: 1.05rem;
          letter-spacing: -0.02em;
        }

        .docs-header-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--docs-color-primary);
          background: color-mix(in srgb, var(--docs-color-primary) 10%, transparent);
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
        }

        .docs-header-center {
          flex: 1;
          max-width: 420px;
          margin: 0 1rem;
        }

        @media (max-width: 640px) {
          .docs-header-center {
            display: none;
          }
        }

        .docs-header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .docs-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--docs-color-border);
          background: var(--docs-color-bg);
          cursor: pointer;
          color: var(--docs-color-fg-muted);
          border-radius: 8px;
          transition: all var(--docs-transition);
        }

        .docs-theme-toggle:hover {
          background: var(--docs-color-bg-muted);
          color: var(--docs-color-fg);
          border-color: var(--docs-color-fg-subtle);
        }

        .docs-header-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          color: var(--docs-color-fg-muted);
          border-radius: 8px;
          transition: all var(--docs-transition);
        }

        .docs-header-link:hover {
          background: var(--docs-color-bg-muted);
          color: var(--docs-color-fg);
          text-decoration: none;
        }
      `}</style>
    </header>
  );
}
