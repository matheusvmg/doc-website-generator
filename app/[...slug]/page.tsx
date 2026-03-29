import type { Metadata } from 'next';
import { fetchAllDocs, getPageBySlug } from '@/lib/content/content-fetcher';
import { getPrevNext, getBreadcrumbs } from '@/lib/navigation/navigation-builder';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { MarkdownContent } from '@/components/docs/MarkdownContent';
import docsConfig from '@/docs.config';
import { resolveConfig } from '@/lib/config/docs-config';
import { notFound } from 'next/navigation';

const config = resolveConfig(docsConfig);

// Generate all static paths at build time
export async function generateStaticParams() {
  const content = await fetchAllDocs(docsConfig);
  // Only generate paths for non-root pages, as the root is handled by app/page.tsx
  return content.pages
    .filter((page) => page.slug !== '')
    .map((page) => ({
      slug: page.slug.split('/'),
    }));
}

// Generate metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = slugParts?.join('/') ?? '';
  const page = await getPageBySlug(docsConfig, slug);

  if (!page) {
    return { title: 'Not Found' };
  }

  const projectName = config.theme?.name ?? 'Docs';

  return {
    title: `${page.frontmatter.title} — ${projectName}`,
    description: page.frontmatter.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug: slugParts } = await params;
  const slug = slugParts?.join('/') ?? '';
  const content = await fetchAllDocs(docsConfig);
  const page = content.pages.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  const prevNext = getPrevNext(content.sidebar, slug);
  const breadcrumbs = getBreadcrumbs(content.sidebar, slug);

  return (
    <DocsLayout
      headings={page.headings}
      sidebar={content.sidebar}
      breadcrumbs={breadcrumbs}
      prevNext={prevNext}
      theme={config.theme!}
      nav={config.nav}
      searchIndex={content.searchIndex}
    >
      <MarkdownContent 
        source={page.rawContent} 
        format={page.filePath.endsWith('.mdx') ? 'mdx' : 'md'}
      />
    </DocsLayout>
  );
}
