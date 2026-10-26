import { notFound, permanentRedirect } from "next/navigation";
import { getCategories } from "@/lib/graphql/queries/categories";
import type { Category, CategoryNode } from "@/types/wordpress";

function flattenCategories(categories: Category[]): CategoryNode[] {
  return categories.flatMap((category) => [
    category,
    ...(category.children?.nodes ?? []),
  ]);
}

/** Resolve legacy WordPress category archives to current category URLs. */
export default async function LegacyCategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<never> {
  const { slug } = await params;
  const legacySlug = slug.at(-1);
  if (!legacySlug) notFound();

  const categories = await getCategories({ fallbackToMocks: false });
  const category = flattenCategories(categories).find(
    (node) => node.slug === legacySlug,
  );

  if (!category) notFound();

  permanentRedirect(`/${category.slug}`);
}
