import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from './MDXComponents';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';

interface MarkdownContentProps {
  source: string;
  format?: 'md' | 'mdx';
}

export async function MarkdownContent({ source, format = 'mdx' }: MarkdownContentProps) {
  return (
    <div className="docs-prose">
      <MDXRemote 
        source={source} 
        components={mdxComponents as any}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: { className: ['heading-anchor'] },
                },
              ],
              [
                rehypeShiki,
                {
                  themes: {
                    light: 'github-light',
                    dark: 'github-dark',
                  },
                },
              ],
            ],
            format,
          }
        }}
      />
    </div>
  );
}
