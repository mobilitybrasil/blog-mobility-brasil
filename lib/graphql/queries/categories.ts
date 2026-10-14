import { MOCK_CATEGORIES } from "@/lib/mocks/posts";
import { cacheTags, fetchGraphQL } from "@/lib/wordpress";
import type { Category, GetCategoriesResponse } from "@/types/wordpress";

/**
 * Lista categorias raiz (sem pai) com seus filhos diretos — usada no header
 * (desktop: dropdown no hover; mobile: drawer expansível). Inclui também
 * categorias vazias para evitar "quebrar" o menu quando uma seção ainda não
 * tem posts publicados.
 */
export const CATEGORIES_QUERY = /* GraphQL */ `
  query GetCategories($first: Int = 100) {
    categories(
      first: $first
      where: { parent: 0, hideEmpty: false, orderby: NAME, order: ASC }
    ) {
      nodes {
        databaseId
        name
        slug
        count
        description
        uri
        children(first: 50) {
          nodes {
            databaseId
            name
            slug
            count
            description
            uri
          }
        }
      }
    }
  }
`;

export async function getCategories(options: {
  fallbackToMocks?: boolean;
} = {}): Promise<Category[]> {
  try {
    const data = await fetchGraphQL<GetCategoriesResponse>(
      CATEGORIES_QUERY,
      { first: 100 },
      { tags: [cacheTags.categories], operationName: "GetCategories" },
    );
    const nodes = (data.categories?.nodes ?? []).filter(
      (category) => category.slug !== "uncategorized",
    );
    if (nodes.length > 0) return nodes;
    return options.fallbackToMocks === false ? [] : MOCK_CATEGORIES;
  } catch (error) {
    if (options.fallbackToMocks === false) {
      console.warn(
        "[wordpress] getCategories falhou; retornando lista vazia para o sitemap.",
        error instanceof Error ? error.message : error,
      );
      return [];
    }

    console.warn(
      "[wordpress] getCategories falhou, usando MOCK_CATEGORIES.",
      error instanceof Error ? error.message : error,
    );
    return MOCK_CATEGORIES;
  }
}
