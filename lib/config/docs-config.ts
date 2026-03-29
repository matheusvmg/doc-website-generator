// --------------------------------------------------------------------------
// DocsConfig – Configuration types and loader
// --------------------------------------------------------------------------

export interface SourceConfig {
  /** Provider type: detected automatically from URL if not specified */
  type: 'github' | 'gitlab' | 'local';
  /** Repository URL (required for github/gitlab) */
  url?: string;
  /** Branch to fetch from (default: "main") */
  branch?: string;
  /** Path to docs folder within the repo (default: "docs") */
  docsPath?: string;
  /** Authentication token for private repos (use process.env) */
  token?: string;
}

export interface ThemeColors {
  primary?: string;
  accent?: string;
  background?: string;
  foreground?: string;
  sidebar?: string;
}

export interface ThemeFonts {
  heading?: string;
  body?: string;
  code?: string;
}

export interface NavLink {
  label: string;
  url: string;
  icon?: string;
}

export interface ThemeConfig {
  /** Project name displayed in header */
  name: string;
  /** Path or URL to logo image */
  logo?: string;
  /** Path to favicon */
  favicon?: string;
  /** Color palette */
  colors?: ThemeColors;
  /** Font families (Google Fonts names) */
  font?: ThemeFonts;
}

export interface NavConfig {
  /** External links shown in the header */
  links?: NavLink[];
}

export interface DocsConfig {
  /** Source configuration – where to fetch docs from */
  source: SourceConfig;
  /** Theme customization */
  theme?: ThemeConfig;
  /** Navigation configuration */
  nav?: NavConfig;
}

// --------------------------------------------------------------------------
// Defaults
// --------------------------------------------------------------------------

const DEFAULT_THEME: Required<ThemeConfig> = {
  name: 'Documentation',
  logo: '',
  favicon: '',
  colors: {
    primary: '#6366f1',
    accent: '#8b5cf6',
    background: '#ffffff',
    foreground: '#0f172a',
    sidebar: '#f8fafc',
  },
  font: {
    heading: 'Inter',
    body: 'Inter',
    code: 'JetBrains Mono',
  },
};

const DEFAULT_SOURCE: Partial<SourceConfig> = {
  branch: 'main',
  docsPath: 'docs',
};

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/** Sugar function for type-safe config authoring in docs.config.ts */
export function defineConfig(config: DocsConfig): DocsConfig {
  return config;
}

/** Resolve a DocsConfig by merging user values with defaults */
export function resolveConfig(raw: DocsConfig): DocsConfig {
  const source: SourceConfig = {
    ...DEFAULT_SOURCE,
    ...raw.source,
  };

  const theme: ThemeConfig = {
    ...DEFAULT_THEME,
    ...raw.theme,
    colors: { ...DEFAULT_THEME.colors, ...raw.theme?.colors },
    font: { ...DEFAULT_THEME.font, ...raw.theme?.font },
  };

  return {
    source,
    theme,
    nav: raw.nav ?? { links: [] },
  };
}

/** Detect provider type from repository URL */
export function detectProviderType(url: string): 'github' | 'gitlab' {
  if (url.includes('github.com') || url.includes('github.')) {
    return 'github';
  }
  if (url.includes('gitlab.com') || url.includes('gitlab.')) {
    return 'gitlab';
  }
  // Default to github for unknown providers
  return 'github';
}

/** Validate config and return errors if any */
export function validateConfig(config: DocsConfig): string[] {
  const errors: string[] = [];

  if (!config.source) {
    errors.push('source is required in docs.config.ts');
    return errors;
  }

  if (config.source.type !== 'local') {
    if (!config.source.url) {
      errors.push(
        `source.url is required for type "${config.source.type}". ` +
        'Provide the full repository URL (e.g. https://github.com/org/repo).'
      );
    }
  }

  return errors;
}
