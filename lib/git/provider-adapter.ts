// --------------------------------------------------------------------------
// Git Provider – Adapter / Factory
// --------------------------------------------------------------------------

import type { SourceConfig } from '../config/docs-config';
import { detectProviderType } from '../config/docs-config';
import { GitHubProvider } from './providers/github';
import { GitLabProvider } from './providers/gitlab';
import { LocalProvider } from './providers/local';

/** A single entry in the repository file tree */
export interface FileTreeEntry {
  /** Relative path from the docs root, e.g. "getting-started/installation.md" */
  path: string;
  /** blob = file, tree = directory */
  type: 'blob' | 'tree';
}

/** Contract every Git provider must implement */
export interface GitProvider {
  /** Return the flat list of files/dirs under the configured docsPath */
  fetchTree(config: SourceConfig): Promise<FileTreeEntry[]>;
  /** Return the raw text content of a single file */
  fetchFileContent(config: SourceConfig, filePath: string): Promise<string>;
}

/** Create the right provider based on the source config */
export function createProvider(config: SourceConfig): GitProvider {
  switch (config.type) {
    case 'github':
      return new GitHubProvider();
    case 'gitlab':
      return new GitLabProvider();
    case 'local':
      return new LocalProvider();
    default: {
      // Auto-detect from URL
      if (config.url) {
        const detected = detectProviderType(config.url);
        return createProvider({ ...config, type: detected });
      }
      throw new Error(
        `Unknown provider type "${config.type}". Supported: github, gitlab, local.`
      );
    }
  }
}
