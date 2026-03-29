import { fetchAllDocs } from '@/lib/content/content-fetcher';
import { getPrevNext, getBreadcrumbs } from '@/lib/navigation/navigation-builder';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { MarkdownContent } from '@/components/docs/MarkdownContent';
import docsConfig from '@/docs.config';
import { resolveConfig } from '@/lib/config/docs-config';
import { notFound, redirect } from 'next/navigation';

const config = resolveConfig(docsConfig);

export async function generateMetadata() {
  const content = await fetchAllDocs(docsConfig);
  let page = content.pages.find((p) => p.slug === '');
  const projectName = config.theme?.name ?? 'Docs';

  if (!page && content.pages.length > 0) {
    page = content.pages[0];
  }

  if (!page) {
    return { title: projectName };
  }

  return {
    title: `${page.frontmatter.title} — ${projectName}`,
    description: page.frontmatter.description ?? 'Project documentation',
  };
}

export default async function IndexPage() {
  const content = await fetchAllDocs(docsConfig);
  let page = content.pages.find((p) => p.slug === '');

  // If no root index page exists, fallback to the first available page
  if (!page && content.pages.length > 0) {
    page = content.pages[0];
  }

  if (!page) {
    notFound();
  }

  const prevNext = getPrevNext(content.sidebar, page.slug);
  const breadcrumbs = getBreadcrumbs(content.sidebar, page.slug);

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
