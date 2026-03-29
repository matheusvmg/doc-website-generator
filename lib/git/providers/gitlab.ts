// --------------------------------------------------------------------------
// GitLab Provider – fetch docs via GitLab REST API
// --------------------------------------------------------------------------

import type { SourceConfig } from '../../config/docs-config';
import type { FileTreeEntry, GitProvider } from '../provider-adapter';

interface GitLabTreeItem {
  id: string;
  name: string;
  type: 'blob' | 'tree';
  path: string;
  mode: string;
}

/** Parse project ID (URL-encoded path) and base URL from a GitLab URL */
function parseGitLabUrl(url: string): { baseUrl: string; projectPath: string } {
  // Handle: https://gitlab.com/owner/repo or https://gitlab.example.com/group/subgroup/repo
  const match = url.match(/^(https?:\/\/[^/]+)\/(.+?)(?:\.git)?$/);
  if (!match) {
    throw new Error(
      `Cannot parse GitLab URL: ${url}. Expected format: https://gitlab.com/owner/repo`
    );
  }
  return {
    baseUrl: match[1],
    projectPath: encodeURIComponent(match[2]),
  };
}

export class GitLabProvider implements GitProvider {
  private headers(token?: string): Record<string, string> {
    const h: Record<string, string> = {};
    if (token) {
      h['PRIVATE-TOKEN'] = token;
    }
    return h;
  }

  async fetchTree(config: SourceConfig): Promise<FileTreeEntry[]> {
    if (!config.url) throw new Error('source.url is required for GitLab provider');

    const { baseUrl, projectPath } = parseGitLabUrl(config.url);
    const branch = config.branch ?? 'main';
    const docsPath = config.docsPath ?? 'docs';

    // GitLab pageinates – collect all pages
    const allItems: GitLabTreeItem[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const url =
        `${baseUrl}/api/v4/projects/${projectPath}/repository/tree` +
        `?path=${encodeURIComponent(docsPath)}` +
        `&ref=${encodeURIComponent(branch)}` +
        `&recursive=true` +
        `&per_page=${perPage}` +
        `&page=${page}`;

      const res = await fetch(url, { headers: this.headers(config.token) });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `GitLab API error (${res.status}): ${body}\n` +
          `URL: ${url}\n` +
          (res.status === 401 || res.status === 403
            ? 'Check your DOCS_GIT_TOKEN environment variable.'
            : '')
        );
      }

      const items: GitLabTreeItem[] = await res.json();
      allItems.push(...items);

      // Check if there are more pages
      const totalPages = parseInt(res.headers.get('x-total-pages') ?? '1', 10);
      if (page >= totalPages) break;
      page++;
    }

    return allItems
      .filter((item) => {
        if (item.type !== 'blob') return false;
        return item.path.endsWith('.md') || item.path.endsWith('.mdx');
      })
      .map((item) => ({
        path: item.path.replace(new RegExp(`^${docsPath}/`), ''),
        type: 'blob' as const,
      }));
  }

  async fetchFileContent(config: SourceConfig, filePath: string): Promise<string> {
    if (!config.url) throw new Error('source.url is required for GitLab provider');

    const { baseUrl, projectPath } = parseGitLabUrl(config.url);
    const branch = config.branch ?? 'main';
    const docsPath = config.docsPath ?? 'docs';

    const fullPath = `${docsPath}/${filePath}`;
    const encodedPath = encodeURIComponent(fullPath);

    const url =
      `${baseUrl}/api/v4/projects/${projectPath}/repository/files/${encodedPath}/raw` +
      `?ref=${encodeURIComponent(branch)}`;

    const res = await fetch(url, { headers: this.headers(config.token) });

    if (!res.ok) {
      throw new Error(
        `GitLab file content error (${res.status}) for ${filePath}\nURL: ${url}`
      );
    }

    return res.text();
  }
}
