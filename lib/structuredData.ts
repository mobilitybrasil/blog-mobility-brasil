import { stripHtml } from "@/lib/format";
import { SITE_URL } from "@/lib/wordpress";
import { STORE_URL } from "@/lib/site";
import type { CategoryNode, Post, PostListItem } from "@/types/wordpress";

/**
 * Builders de JSON-LD (schema.org) seguindo as recomendações do Google Search
 * Central: Article/BlogPosting, Blog, BreadcrumbList.
 */

type JsonLdObject = Record<string, unknown>;

const BLOG_NAME = "Blog Mobility Brasil";
const BLOG_DESCRIPTION =
  "Conteúdo sobre cadeiras de rodas, acessibilidade e tecnologia assistiva para apoiar escolhas de mobilidade no dia a dia.";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BLOG_ID = `${SITE_URL}/#blog`;

const organization: JsonLdObject = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Mobility Brasil",
  url: STORE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo-mobility-black.png`,
  },
};

function postUrl(post: Pick<PostListItem, "slug" | "categories">): string {
  const category = post.categories?.nodes[0]?.slug;
  return category
    ? `${SITE_URL}/${category}/${post.slug}`
    : `${SITE_URL}/${post.slug}`;
}

function buildAuthorJsonLd(author: Post["author"]): JsonLdObject {
  const name = author?.node?.name?.trim();
  const normalizedName = name?.toLocaleLowerCase("pt-BR");

  // O perfil editorial do WordPress pode representar a própria marca. Nesse
  // caso, use a entidade Organization da Mobility Brasil, não uma Person.
  if (
    !name ||
    name.includes("@") ||
    normalizedName === "mobility brasil"
  ) {
    return organization;
  }

  return { "@type": "Person", name };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      // O último item pode omitir `item` (Google usa a URL da página).
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/** Home do blog: WebSite + Blog + Organization (+ posts recentes). */
export function buildBlogHomeJsonLd(posts: PostListItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: BLOG_NAME,
        description: BLOG_DESCRIPTION,
        inLanguage: "pt-BR",
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "Blog",
        "@id": BLOG_ID,
        url: SITE_URL,
        name: BLOG_NAME,
        description: BLOG_DESCRIPTION,
        inLanguage: "pt-BR",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: postUrl(post),
            name: stripHtml(post.title),
          })),
        },
      },
    ],
  };
}

/** Categoria: CollectionPage + BreadcrumbList. */
export function buildCategoryJsonLd(
  category: Pick<CategoryNode, "name" | "slug" | "description">,
  posts: PostListItem[],
): JsonLdObject[] {
  const url = `${SITE_URL}/${category.slug}`;

  const collectionPage: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: category.name,
    description:
      category.description ||
      `Posts da categoria ${category.name} no ${BLOG_NAME}.`,
    inLanguage: "pt-BR",
    isPartOf: { "@id": BLOG_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: postUrl(post),
        name: stripHtml(post.title),
      })),
    },
  };

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Blog", url: SITE_URL },
    { name: category.name },
  ]);

  return [collectionPage, breadcrumb];
}

/** Post: BlogPosting + BreadcrumbList. */
export function buildPostJsonLd(post: Post): JsonLdObject[] {
  const url = postUrl(post);
  const category = post.categories?.nodes[0];
  const image = post.featuredImage?.node?.sourceUrl;
  const description =
    post.seo?.metaDesc ||
    stripHtml(post.excerpt) ||
    stripHtml(post.content).slice(0, 160);

  const blogPosting: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: stripHtml(post.title).slice(0, 110),
    description,
    inLanguage: "pt-BR",
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    ...(image ? { image: [image] } : {}),
    ...(category ? { articleSection: category.name } : {}),
    ...(post.tags?.nodes.length
      ? { keywords: post.tags.nodes.map((t) => t.name).join(", ") }
      : {}),
    author: buildAuthorJsonLd(post.author),
    publisher: organization,
    isPartOf: { "@id": BLOG_ID },
  };

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Blog", url: SITE_URL },
    ...(category
      ? [{ name: category.name, url: `${SITE_URL}/${category.slug}` }]
      : []),
    { name: stripHtml(post.title) },
  ]);

  return [blogPosting, breadcrumb];
}
