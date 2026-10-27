import { POST_LIST_FIELDS_FRAGMENT } from "@/lib/graphql/fragments/postFields";
import { SEO_FRAGMENT } from "@/lib/graphql/fragments/seo";
import { MOCK_POSTS } from "@/lib/mocks/posts";
import { cacheTags, fetchGraphQL } from "@/lib/wordpress";
import type {
  GetAllPostSlugsResponse,
  GetPostsResponse,
  GetPostsVariables,
  PageInfo,
  PostListItem,
} from "@/types/wordpress";

/**
 * Listagem genérica de posts, com filtro opcional por categoria.
 *
 * O filtro por destaque (ACF `postHighlight`) é aplicado no consumidor
 * em memória — assim evitamos dependência da extensão WPGraphQL Meta Query.
 */
export const POSTS_QUERY = /* GraphQL */ `
  ${POST_LIST_FIELDS_FRAGMENT}
  ${SEO_FRAGMENT}
  query GetPosts(
    $first: Int = 12
    $after: String
    $categorySlug: String
    $search: String
  ) {
    posts(
      first: $first
      after: $after
      where: {
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
        categoryName: $categorySlug
        search: $search
      }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ...PostListFields
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

/**
 * Query reduzida (sem ACF/Yoast) — fallback enquanto o WordPress não
 * estiver totalmente configurado. Remover quando o schema estiver pronto.
 */
const POSTS_BASIC_QUERY = /* GraphQL */ `
  query GetPostsBasic(
    $first: Int = 12
    $after: String
    $categorySlug: String
    $search: String
  ) {
    posts(
      first: $first
      after: $after
      where: {
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
        categoryName: $categorySlug
        search: $search
      }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        databaseId
        id
        slug
        uri
        title
        excerpt
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            databaseId
            name
            slug
            description
            avatar {
              url
            }
          }
        }
        categories(first: 10) {
          nodes {
            databaseId
            name
            slug
            count
            description
          }
        }
        tags(first: 10) {
          nodes {
            databaseId
            name
            slug
          }
        }
      }
    }
  }
`;

interface BasicPostsResponse {
  posts: {
    nodes: Array<Omit<PostListItem, "postSettings" | "seo">>;
    pageInfo: PageInfo;
  } | null;
}

export interface SearchPostsResult {
  posts: PostListItem[];
  pageInfo: PageInfo | null;
  error: boolean;
}

export interface PostsPageResult {
  posts: PostListItem[];
  pageInfo: PageInfo | null;
}

/** Página de arquivo com cursor, para manter todos os artigos acessíveis por links HTML. */
export async function getPostsPage(
  variables: Pick<GetPostsVariables, "first" | "after" | "categorySlug">,
): Promise<PostsPageResult> {
  const queryVariables: GetPostsVariables = {
    first: variables.first ?? 12,
    after: variables.after ?? null,
    categorySlug: variables.categorySlug ?? null,
  };
  const tags = [
    cacheTags.posts,
    ...(queryVariables.categorySlug
      ? [cacheTags.category(queryVariables.categorySlug)]
      : []),
  ];

  try {
    const data = await fetchGraphQL<GetPostsResponse, GetPostsVariables>(
      POSTS_QUERY,
      queryVariables,
      { tags, operationName: "GetPosts" },
    );
    if (data.posts) {
      return { posts: data.posts.nodes, pageInfo: data.posts.pageInfo };
    }
  } catch (error) {
    console.warn(
      "[wordpress] página de arquivo com ACF/Yoast falhou, tentando query básica.",
      error instanceof Error ? error.message : error,
    );
  }

  try {
    const data = await fetchGraphQL<BasicPostsResponse, GetPostsVariables>(
      POSTS_BASIC_QUERY,
      queryVariables,
      { tags, operationName: "GetPostsBasic" },
    );
    return {
      posts: (data.posts?.nodes ?? []).map((post) => ({
        ...post,
        postSettings: null,
        seo: null,
      })),
      pageInfo: data.posts?.pageInfo ?? null,
    };
  } catch (error) {
    console.error(
      "[wordpress] página de arquivo básica também falhou.",
      error instanceof Error ? error.message : error,
    );
    return { posts: [], pageInfo: null };
  }
}

/**
 * Busca artigos no WordPress sem recorrer a conteúdo de demonstração. A busca
 * é dinâmica para evitar armazenar em cache cada combinação arbitrária de
 * termos digitada por visitantes.
 */
export async function searchPosts(options: {
  query: string;
  after?: string | null;
  first?: number;
}): Promise<SearchPostsResult> {
  const search = options.query.trim().slice(0, 100);
  if (!search) return { posts: [], pageInfo: null, error: false };

  const variables: GetPostsVariables = {
    first: options.first ?? 12,
    after: options.after ?? null,
    search,
  };

  try {
    const data = await fetchGraphQL<GetPostsResponse, GetPostsVariables>(
      POSTS_QUERY,
      variables,
      { revalidate: 0, operationName: "GetPosts" },
    );
    return {
      posts: data.posts?.nodes ?? [],
      pageInfo: data.posts?.pageInfo ?? null,
      error: false,
    };
  } catch (error) {
    console.warn(
      "[wordpress] busca com ACF/Yoast falhou, tentando query básica.",
      error instanceof Error ? error.message : error,
    );
  }

  try {
    const basic = await fetchGraphQL<BasicPostsResponse, GetPostsVariables>(
      POSTS_BASIC_QUERY,
      variables,
      { revalidate: 0, operationName: "GetPostsBasic" },
    );
    return {
      posts: (basic.posts?.nodes ?? []).map((post) => ({
        ...post,
        postSettings: null,
        seo: null,
      })),
      pageInfo: basic.posts?.pageInfo ?? null,
      error: false,
    };
  } catch (error) {
    console.error(
      "[wordpress] busca básica também falhou.",
      error instanceof Error ? error.message : error,
    );
    return { posts: [], pageInfo: null, error: true };
  }
}

export async function getPosts(
  variables: GetPostsVariables = {},
): Promise<PostListItem[]> {
  const tags: string[] = [cacheTags.posts];
  if (variables.categorySlug) tags.push(cacheTags.category(variables.categorySlug));

  const queryVariables = {
    first: variables.first ?? 12,
    after: variables.after ?? null,
    categorySlug: variables.categorySlug ?? null,
    search: variables.search?.trim() || null,
  };

  let nodes: PostListItem[] | null = null;

  try {
    const data = await fetchGraphQL<GetPostsResponse, GetPostsVariables>(
      POSTS_QUERY,
      queryVariables,
      { tags, operationName: "GetPosts" },
    );
    nodes = data.posts?.nodes ?? [];
  } catch (error) {
    console.warn(
      "[wordpress] getPosts com ACF/Yoast falhou, tentando query básica.",
      error instanceof Error ? error.message : error,
    );
  }

  if (!nodes || nodes.length === 0) {
    try {
      const basic = await fetchGraphQL<BasicPostsResponse, GetPostsVariables>(
        POSTS_BASIC_QUERY,
        queryVariables,
        { tags, operationName: "GetPostsBasic" },
      );
      const basicNodes = basic.posts?.nodes ?? [];
      nodes = basicNodes.map((n) => ({ ...n, postSettings: null, seo: null }));
    } catch (error) {
      console.warn(
        "[wordpress] getPosts básica falhou, caindo para MOCK_POSTS.",
        error instanceof Error ? error.message : error,
      );
      nodes = MOCK_POSTS;
    }
  }

  if (variables.categorySlug) {
    nodes = nodes.filter((p) =>
      p.categories?.nodes.some((c) => c.slug === variables.categorySlug),
    );
  }

  if (variables.highlightedOnly) {
    return nodes.filter((p) => p.postSettings?.postHighlight === true);
  }
  return nodes;
}

/**
 * Lista compacta de slugs + categoria — usada por `generateStaticParams`
 * em `app/[category]/[slug]/page.tsx`.
 */
export const ALL_POST_SLUGS_QUERY = /* GraphQL */ `
  query GetAllPostSlugs($first: Int = 100, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        date
        modified
        categories(first: 1) {
          nodes {
            slug
          }
        }
      }
    }
  }
`;

/**
 * Pega os N posts mais recentes excluindo, opcionalmente, um slug específico
 * (útil para sidebars de post individual, onde não queremos repetir o post
 * atual na lista de "Mais recentes").
 */
export async function getRecentPosts(
  options: { excludeSlug?: string | null; first?: number } = {},
): Promise<PostListItem[]> {
  const limit = options.first ?? 5;
  // Pega um a mais para ainda termos `limit` após excluir o atual.
  const fetchSize = options.excludeSlug ? limit + 1 : limit;
  const posts = await getPosts({ first: fetchSize });
  const filtered = options.excludeSlug
    ? posts.filter((p) => p.slug !== options.excludeSlug)
    : posts;
  return filtered.slice(0, limit);
}

/**
 * "Artigos em alta" — usa o ACF `postHighlight` como sinalizador editorial
 * (não há contagem de views no WordPress sem plugin). Se não houver
 * destaques suficientes, completa com os mais recentes para a lista nunca
 * ficar vazia em produção.
 */
export async function getTrendingPosts(
  options: { excludeSlug?: string | null; first?: number } = {},
): Promise<PostListItem[]> {
  const limit = options.first ?? 4;

  const highlighted = await getPosts({ highlightedOnly: true, first: 20 });
  let nodes = options.excludeSlug
    ? highlighted.filter((p) => p.slug !== options.excludeSlug)
    : highlighted;

  if (nodes.length < limit) {
    const recent = await getPosts({ first: limit + 6 });
    const seen = new Set(nodes.map((p) => p.databaseId));
    const filler = recent.filter(
      (p) =>
        !seen.has(p.databaseId) &&
        (!options.excludeSlug || p.slug !== options.excludeSlug),
    );
    nodes = [...nodes, ...filler];
  }

  return nodes.slice(0, limit);
}

/**
 * Posts relacionados — mesma categoria do post atual, excluindo-o.
 * Se não houver itens suficientes na categoria, completa com os mais
 * recentes (também excluindo o post atual) para o carrossel nunca ficar
 * vazio em produção.
 */
export async function getRelatedPosts(options: {
  excludeSlug: string;
  categorySlug?: string | null;
  first?: number;
}): Promise<PostListItem[]> {
  const limit = options.first ?? 6;
  const collected: PostListItem[] = [];
  const seen = new Set<number>();

  function push(items: PostListItem[]) {
    for (const item of items) {
      if (collected.length >= limit) break;
      if (item.slug === options.excludeSlug) continue;
      if (seen.has(item.databaseId)) continue;
      seen.add(item.databaseId);
      collected.push(item);
    }
  }

  if (options.categorySlug) {
    const same = await getPosts({
      categorySlug: options.categorySlug,
      first: limit + 1,
    });
    push(same);
  }

  if (collected.length < limit) {
    const recent = await getPosts({ first: limit + collected.length + 1 });
    push(recent);
  }

  return collected;
}

export async function getAllPostSlugs(options: {
  fallbackToMocks?: boolean;
} = {}): Promise<
  Array<{
    slug: string;
    category: string;
    date: string;
    modified: string | null;
  }>
> {
  try {
    const allPosts: Array<{
      slug: string;
      category: string;
      date: string;
      modified: string | null;
    }> = [];
    let after: string | null = null;
    const seenCursors = new Set<string>();

    while (true) {
      const data: GetAllPostSlugsResponse = await fetchGraphQL<
        GetAllPostSlugsResponse,
        { first: number; after: string | null }
      >(
        ALL_POST_SLUGS_QUERY,
        { first: 100, after },
        { tags: [cacheTags.posts], operationName: "GetAllPostSlugs" },
      );
      const page: GetAllPostSlugsResponse["posts"] = data.posts;

      for (const node of page?.nodes ?? []) {
        if (!node.slug) continue;
        allPosts.push({
          slug: node.slug,
          category: node.categories?.nodes[0]?.slug ?? "sem-categoria",
          date: node.date,
          modified: node.modified,
        });
      }

      const nextCursor: string | null | undefined = page?.pageInfo.endCursor;
      if (!page?.pageInfo.hasNextPage || !nextCursor || seenCursors.has(nextCursor)) {
        break;
      }
      seenCursors.add(nextCursor);
      after = nextCursor;
    }

    return allPosts;
  } catch (error) {
    if (options.fallbackToMocks === false) {
      console.warn(
        "[wordpress] getAllPostSlugs falhou; retornando lista vazia para o sitemap.",
        error instanceof Error ? error.message : error,
      );
      return [];
    }

    console.warn(
      "[wordpress] getAllPostSlugs falhou, usando MOCK_POSTS para generateStaticParams.",
      error instanceof Error ? error.message : error,
    );
    return MOCK_POSTS.map((p) => ({
      slug: p.slug,
      category: p.categories?.nodes[0]?.slug ?? "sem-categoria",
      date: p.date,
      modified: p.modified,
    }));
  }
}
