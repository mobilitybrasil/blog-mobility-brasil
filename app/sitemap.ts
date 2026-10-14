import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/graphql/queries/categories";
import { getAllPostSlugs } from "@/lib/graphql/queries/posts";
import { SITE_URL } from "@/lib/wordpress";
import type { Category, CategoryNode } from "@/types/wordpress";

export const revalidate = 3600;

function flattenCategories(categories: Category[]): CategoryNode[] {
  return categories.flatMap((category) => [
    category,
    ...(category.children?.nodes ?? []),
  ]);
}

function latestRelevantDate(
  published: string,
  modified: string | null,
): Date | undefined {
  const dates = [published, modified]
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()));

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
    lastModified: latestRelevantDate(post.date, post.modified),
  }));

  const entries = [{ url: SITE_URL }, ...categoryEntries, ...postEntries];
  const uniqueEntries = new Map(entries.map((entry) => [entry.url, entry]));

  return [...uniqueEntries.values()];
}
