import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PostBottomCTA } from "@/components/blog/PostBottomCTA";
import { PostCategoryBreadcrumb } from "@/components/blog/PostCategoryBreadcrumb";
import { PostCommentForm } from "@/components/blog/PostCommentForm";
import { PostContent } from "@/components/blog/PostContent";
import { PostCTA } from "@/components/blog/PostCTA";
import { PostHero } from "@/components/blog/PostHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostShareSection } from "@/components/blog/PostShareSection";
import { PostSidebar } from "@/components/blog/PostSidebar";
import { RelatedPostsCarousel } from "@/components/blog/RelatedPostsCarousel";
import { stripHtml, stripWrongSiteName } from "@/lib/format";
import { extractPostButtons } from "@/lib/postButtons";
import { getPostBySlug } from "@/lib/graphql/queries/post";
import { buildPostJsonLd } from "@/lib/structuredData";
import { SITE_URL, WORDPRESS_HOSTNAME } from "@/lib/wordpress";
import {
  getAllPostSlugs,
  getRecentPosts,
  getRelatedPosts,
  getTrendingPosts,
} from "@/lib/graphql/queries/posts";

export const revalidate = 3600;
export const dynamicParams = true;

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

// Redirect only when the legacy WordPress record and its current equivalent
// are both confirmed in the CMS archives. This published post was renamed to
// `__trashed` in the legacy WordPress site before it was migrated.
const legacyPostRedirects: Record<string, string> = {
  "cadeira-de-rodas-manual/__trashed":
    "/cadeira-de-rodas-manual/encosto-e-assento-digitalizados-como-funciona-a-personalizacao-em-3d",
};

export async function generateStaticParams(): Promise<
  Array<{ category: string; slug: string }>
> {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ category, slug }) => ({ category, slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado" };

  // WPGraphQL/Yoast can echo the site's global "discourage search engines"
  // setting into every post. The public WordPress query only returns published
  // posts, so the temporary-host protection must not make the official article
  // URL noindex. Keep local mock content out of search results.
  const isMockPost = post.id.startsWith("post-mock-");

  const seo = post.seo;
  const fallbackTitle = stripHtml(post.title);
  const fallbackDescription =
    stripHtml(post.excerpt ?? "") || stripHtml(post.content).slice(0, 160);
  const ogImage =
    seo?.opengraphImage?.sourceUrl ?? post.featuredImage?.node?.sourceUrl ?? null;
  const sourceSiteName = seo?.opengraphSiteName?.trim();
  const openGraphSiteName =
    sourceSiteName &&
    !sourceSiteName.toLowerCase().includes(WORDPRESS_HOSTNAME.toLowerCase())
      ? sourceSiteName
      : "Blog Mobility Brasil";

  // Canonical/OG URL sempre derivados da rota real do Next — o
  // `seo.canonical`/`seo.opengraphUrl` do Yoast apontam para o domínio e a
  // estrutura de URL do WordPress (`/slug/`), não para o blog público
  // (`/categoria/slug`).
  const canonicalCategory = post.categories?.nodes[0]?.slug ?? category;
  const canonicalUrl = `${SITE_URL}/${canonicalCategory}/${slug}`;

  return {
    title:
      stripWrongSiteName(seo?.title, WORDPRESS_HOSTNAME) || fallbackTitle,
    description:
      stripWrongSiteName(seo?.metaDesc, WORDPRESS_HOSTNAME) ||
      fallbackDescription,
    alternates: { canonical: canonicalUrl },
    keywords: seo?.metaKeywords ?? undefined,
    robots: { index: !isMockPost, follow: !isMockPost },
    openGraph: {
      title:
        stripWrongSiteName(seo?.opengraphTitle, WORDPRESS_HOSTNAME) ||
        fallbackTitle,
      description:
        stripWrongSiteName(seo?.opengraphDescription, WORDPRESS_HOSTNAME) ||
        fallbackDescription,
      type: "article",
      url: canonicalUrl,
      siteName: openGraphSiteName,
      publishedTime: post.date,
      modifiedTime: post.modified ?? post.date,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: seo?.opengraphImage?.mediaDetails?.width ?? undefined,
              height: seo?.opengraphImage?.mediaDetails?.height ?? undefined,
              alt: seo?.opengraphImage?.altText ?? fallbackTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: stripWrongSiteName(seo?.twitterTitle, WORDPRESS_HOSTNAME) || fallbackTitle,
      description:
        stripWrongSiteName(seo?.twitterDescription, WORDPRESS_HOSTNAME) ||
        fallbackDescription,
      images: seo?.twitterImage?.sourceUrl
        ? [seo.twitterImage.sourceUrl]
        : ogImage
          ? [ogImage]
          : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;

  const legacyDestination = legacyPostRedirects[`${category}/${slug}`];
  if (legacyDestination) permanentRedirect(legacyDestination);

  const [post, recentPosts, trendingPosts, relatedPosts] = await Promise.all([
    getPostBySlug(slug),
    getRecentPosts({ excludeSlug: slug, first: 5 }),
    getTrendingPosts({ excludeSlug: slug, first: 4 }),
    getRelatedPosts({ excludeSlug: slug, categorySlug: category, first: 9 }),
  ]);

  if (!post) notFound();

  // Slugs de categoria antigos continuam chegando de links e indexação do WP.
  // Só redireciona quando o CMS confirma o artigo e sua categoria canônica.
  const postPrimaryCategory = post.categories?.nodes[0]?.slug ?? null;
  if (postPrimaryCategory && postPrimaryCategory !== category) {
    const confirmedPost = await getPostBySlug(slug, { fallbackToMocks: false });
    const confirmedCategory = confirmedPost?.categories?.nodes[0]?.slug;

    if (confirmedPost && confirmedCategory) {
      permanentRedirect(`/${confirmedCategory}/${confirmedPost.slug}`);
    }

    notFound();
  }

  const featured = post.featuredImage?.node;
  const author = post.author?.node;
  const categories = post.categories?.nodes ?? [];
  const { buttons: ctaButtons, html: contentHtml } = extractPostButtons(
    post.content,
  );

  return (
    <article className="flex flex-col gap-10 pb-12 pt-6 sm:gap-12 sm:pt-0">
      <JsonLd data={buildPostJsonLd(post)} />
      <PostHero
        title={post.title}
        date={post.date}
        content={post.content}
        author={
          author
            ? { name: author.name, avatarUrl: author.avatar?.url ?? null }
            : null
        }
        featuredImage={
          featured?.sourceUrl
            ? {
                sourceUrl: featured.sourceUrl,
                altText: featured.altText,
                width: featured.mediaDetails?.width ?? null,
                height: featured.mediaDetails?.height ?? null,
              }
            : null
        }
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-[18px] sm:px-[54px] lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex min-w-0 flex-col gap-[38px] lg:w-[850px]">
          <PostCategoryBreadcrumb categories={categories} />
          <PostContent html={contentHtml} />
          <PostCTA
            url="/"
            label={post.postSettings?.postCtaLabel ?? undefined}
            themeColor={post.postSettings?.postThemeColor ?? null}
          />
          <PostBottomCTA buttons={ctaButtons} />
          <PostShareSection title={post.title} />
          <PostCommentForm postId={post.databaseId} />
        </div>

        <PostSidebar
          recentPosts={recentPosts}
          trendingPosts={trendingPosts}
        />
      </div>

      {relatedPosts.length > 0 && (
        <div className="mx-auto w-full max-w-[1440px] px-[18px] sm:px-[54px]">
          <RelatedPostsCarousel posts={relatedPosts} />
        </div>
      )}
    </article>
  );
}
