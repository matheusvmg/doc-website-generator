// --------------------------------------------------------------------------
// GitHub Provider – fetch docs via GitHub REST API
// --------------------------------------------------------------------------

import type { SourceConfig } from '../../config/docs-config';
import type { FileTreeEntry, GitProvider } from '../provider-adapter';

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

/** Parse owner and repo from a GitHub URL */
function parseGitHubUrl(url: string): { owner: string; repo: string } {
  // Handle: https://github.com/owner/repo or https://github.com/owner/repo.git
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  if (!match) {
    throw new Error(`Cannot parse GitHub URL: ${url}. Expected format: https://github.com/owner/repo`);
  }
  return { owner: match[1], repo: match[2] };
}

export class GitHubProvider implements GitProvider {
  private baseUrl = 'https://api.github.com';

  private headers(token?: string): Record<string, string> {
    const h: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ssg-doc-website',
    };
    if (token) {
      h['Authorization'] = `Bearer ${token}`;
    }
    return h;
  }

  async fetchTree(config: SourceConfig): Promise<FileTreeEntry[]> {
    if (!config.url) throw new Error('source.url is required for GitHub provider');

    const { owner, repo } = parseGitHubUrl(config.url);
    const branch = config.branch ?? 'main';
    const docsPath = config.docsPath ?? 'docs';

    const url = `${this.baseUrl}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

    const res = await fetch(url, { headers: this.headers(config.token) });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `GitHub API error (${res.status}): ${body}\n` +
        `URL: ${url}\n` +
        (res.status === 401 || res.status === 403
          ? 'Check your DOCS_GIT_TOKEN environment variable.'
          : '')
      );
    }

    const data: GitHubTreeResponse = await res.json();

    if (data.truncated) {
      console.warn(
        '[docs] GitHub tree response was truncated. Some files may be missing.'
      );
    }

    // Filter to only .md files under docsPath
    return data.tree
      .filter((item) => {
        if (item.type !== 'blob') return false;
        const subPath = item.path.startsWith(docsPath + '/') || item.path === docsPath;
        if (!subPath) return false;
        return item.path.endsWith('.md') || item.path.endsWith('.mdx');
      })
      .map((item) => ({
        path: item.path.replace(new RegExp(`^${docsPath}/`), ''),
        type: item.type,
      }));
  }

  async fetchFileContent(config: SourceConfig, filePath: string): Promise<string> {
    if (!config.url) throw new Error('source.url is required for GitHub provider');

    const { owner, repo } = parseGitHubUrl(config.url);
    const branch = config.branch ?? 'main';
    const docsPath = config.docsPath ?? 'docs';

    // Use raw.githubusercontent.com for raw file content (no API rate limit impact)
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${docsPath}/${filePath}`;

    const res = await fetch(url, {
      headers: config.token
        ? { Authorization: `Bearer ${config.token}` }
        : {},
    });

    if (!res.ok) {
      throw new Error(
        `GitHub raw content error (${res.status}) for ${filePath}\nURL: ${url}`
      );
    }

    return res.text();
  }
}
