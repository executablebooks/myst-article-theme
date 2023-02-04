import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import type { PageLoader } from '@myst-theme/site';
import { Bibliography, ContentBlocks } from '@myst-theme/site';
import {
  getMetaTagsForArticle,
  KatexCSS,
  useNavigationHeight,
  DocumentOutline,
  DEFAULT_NAV_HEIGHT,
  Navigation,
  TopNav,
  ArticlePageCatchBoundary,
} from '@myst-theme/site';
import { FrontmatterBlock } from '@myst-theme/frontmatter';
import { getPage } from '~/utils/loaders.server';
import { useLoaderData } from '@remix-run/react';
import type { SiteManifest } from 'myst-config';
import { ReferencesProvider, TabStateProvider, UiStateProvider } from '@myst-theme/providers';
import { extractPart, copyNode } from 'myst-common';
import classNames from 'classnames';
import { MadeWithMyst } from '@myst-theme/icons';

export const meta: MetaFunction = (args) => {
  const config = args.parentsData?.root?.config as SiteManifest | undefined;
  const data = args.data as PageLoader | undefined;
  if (!config || !data || !data.frontmatter) return {};
  return getMetaTagsForArticle({
    origin: '',
    url: args.location.pathname,
    title: `${data.frontmatter.title} - ${config?.title}`,
    description: data.frontmatter.description,
    image: (data.frontmatter.thumbnailOptimized || data.frontmatter.thumbnail) ?? undefined,
  });
};

export const links: LinksFunction = () => [KatexCSS];

export const loader: LoaderFunction = async ({ params, request }) => {
  const { project, slug } = params;
  return getPage(request, { project, slug, redirect: true });
};

export function ArticlePageAndNavigation({
  children,
  hide_toc,
  top = DEFAULT_NAV_HEIGHT,
}: {
  top?: number;
  hide_toc?: boolean;
  children: React.ReactNode;
}) {
  const { ref, height } = useNavigationHeight();
  return (
    <UiStateProvider>
      <TabStateProvider>
        <article ref={ref} className="content">
          {children}
        </article>
      </TabStateProvider>
    </UiStateProvider>
  );
}

export function Article({ article }: { article: PageLoader }) {
  const keywords = article.frontmatter?.keywords ?? [];
  const tree = copyNode(article.mdast);
  const abstract = extractPart(tree, 'abstract');
  return (
    <ReferencesProvider
      references={{ ...article.references, article: article.mdast }}
      frontmatter={article.frontmatter}
    >
      {abstract && (
        <>
          <span className="font-semibold">Abstract</span>
          <div className="bg-slate-50 dark:bg-slate-800 px-6 py-1 rounded-sm m-3">
            <ContentBlocks mdast={abstract} />
          </div>
        </>
      )}
      {keywords.length > 0 && (
        <div className="mb-10">
          <span className="font-semibold mr-2">Keywords:</span>
          {keywords.map((k, i) => (
            <span
              key={k}
              className={classNames({
                "after:content-[','] after:mr-1": i < keywords.length - 1,
              })}
            >
              {k}
            </span>
          ))}
        </div>
      )}
      <ContentBlocks mdast={tree} />
      <Bibliography />
    </ReferencesProvider>
  );
}

export function ArticlePage({ article }: { article: PageLoader }) {
  return (
    <ReferencesProvider
      references={{ ...article.references, article: article.mdast }}
      frontmatter={article.frontmatter}
    >
      <section className="article column-page">
        <FrontmatterBlock frontmatter={article.frontmatter} />
        {/* <Actions /> */}
      </section>
      <main className="article column-body">
        <Article article={article} />
      </main>
      {/* {!hide_footer_links && <FooterLinksBlock links={article.footer} />} */}
    </ReferencesProvider>
  );
}

export default function Page({ top = DEFAULT_NAV_HEIGHT }: { top?: number }) {
  const { ref, height } = useNavigationHeight();
  const article = useLoaderData<PageLoader>() as PageLoader;
  const { hide_outline, hide_toc } = (article.frontmatter as any)?.design ?? {};
  return (
    <ArticlePageAndNavigation hide_toc={hide_toc}>
      <ArticlePage article={article} />
      {/* {!hide_outline && <DocumentOutline top={top} height={height} />} */}
    </ArticlePageAndNavigation>
  );
}

export function CatchBoundary() {
  return (
    <ArticlePageAndNavigation>
      <main className="article-content">
        <ArticlePageCatchBoundary />
      </main>
    </ArticlePageAndNavigation>
  );
}
