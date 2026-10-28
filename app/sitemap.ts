import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/graphql/queries/categories";
import { getAllPostSlugs } from "@/lib/graphql/queries/posts";
import { SITE_URL } from "@/lib/wordpress";
import { wordpressLegacyLastModified } from "@/lib/wordpressLegacyLastModified";
import type { Category, CategoryNode } from "@/types/wordpress";

export const revalidate = 3600;

// The WordPress migration rewrote `modified` for imported posts on this day.
// Those timestamps describe the import batch, not edits to the article.
const WORDPRESS_MIGRATION_DATE = "2026-09-17";

function flattenCategories(categories: Category[]): CategoryNode[] {
  return categories.flatMap((category) => [
    category,
    ...(category.children?.nodes ?? []),
  ]);
}

function latestRelevantDate(
  slug: string,
  published: string,
  modified: string | null,
): Date | undefined {
  const publishedDate = new Date(published);
  const validPublishedDate = Number.isNaN(publishedDate.getTime())
    ? undefined
    : publishedDate;
  const modifiedDate = modified ? new Date(modified) : undefined;
  const validModifiedDate = modifiedDate && !Number.isNaN(modifiedDate.getTime())
    ? modifiedDate
    : undefined;

  if (
    validModifiedDate &&
    modified?.slice(0, 10) === WORDPRESS_MIGRATION_DATE
  ) {
    // Use the legacy WordPress record when the migration overwrote the current
    // modification date; omit lastmod for migrated posts without a match.
    const legacyDate = wordpressLegacyLastModified[slug];
    return legacyDate ? new Date(legacyDate) : undefined;
  }

  const dates = [validPublishedDate, validModifiedDate].filter(
    (date): date is Date => date instanceof Date,
  );

  if (dates.length === 0) return undefined;
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, posts] = await Promise.all([
    getCategories({ fallbackToMocks: false }),
    getAllPostSlugs({ fallbackToMocks: false }),
  ]);

  const categoryEntries = flattenCategories(categories)
    .filter((category) => category.slug && category.slug !== "uncategorized")
    .filter((category) => category.count !== 0)
    .map((category) => ({ url: `${SITE_URL}/${category.slug}` }));

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/${post.category}/${post.slug}`,
    lastModified: latestRelevantDate(post.slug, post.date, post.modified),
  }));

  const entries = [
    { url: SITE_URL },
    { url: `${SITE_URL}/categorias` },
    ...categoryEntries,
    ...postEntries,
  ];
  const uniqueEntries = new Map(entries.map((entry) => [entry.url, entry]));

  return [...uniqueEntries.values()];
}
