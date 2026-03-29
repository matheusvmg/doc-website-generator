// --------------------------------------------------------------------------
// Local Provider – read docs from the local filesystem
// --------------------------------------------------------------------------

import fs from 'fs/promises';
import path from 'path';
import type { SourceConfig } from '../../config/docs-config';
import type { FileTreeEntry, GitProvider } from '../provider-adapter';

export class LocalProvider implements GitProvider {
  /** Walk a directory recursively and collect all .md files */
  private async walk(dir: string, base: string): Promise<FileTreeEntry[]> {
    const entries: FileTreeEntry[] = [];

    let items: import('fs').Dirent[];
    try {
      items = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return entries;
    }

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.relative(base, fullPath);

      if (item.isDirectory()) {
        const children = await this.walk(fullPath, base);
        entries.push(...children);
      } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
        entries.push({
          path: relativePath.replace(/\\/g, '/'), // normalise Windows paths
          type: 'blob',
        });
      }
    }

    return entries;
  }

  async fetchTree(config: SourceConfig): Promise<FileTreeEntry[]> {
    const docsPath = config.docsPath ?? 'docs';
    const absPath = path.resolve(process.cwd(), docsPath);

    try {
      await fs.access(absPath);
    } catch {
      throw new Error(
        `Local docs directory not found: ${absPath}\n` +
        `Create a "${docsPath}/" folder with .md files, or configure a remote source.`
      );
    }

    return this.walk(absPath, absPath);
  }

  async fetchFileContent(config: SourceConfig, filePath: string): Promise<string> {
    const docsPath = config.docsPath ?? 'docs';
    const absPath = path.resolve(process.cwd(), docsPath, filePath);

    try {
      return await fs.readFile(absPath, 'utf-8');
    } catch {
      throw new Error(`Local file not found: ${absPath}`);
    }
  }
}
