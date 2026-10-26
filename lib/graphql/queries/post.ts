import { POST_LIST_FIELDS_FRAGMENT } from "@/lib/graphql/fragments/postFields";
import { SEO_FRAGMENT } from "@/lib/graphql/fragments/seo";
import { MOCK_POST, MOCK_POSTS } from "@/lib/mocks/posts";
import { cacheTags, fetchGraphQL } from "@/lib/wordpress";
import type {
  GetPostBySlugResponse,
  GetPostBySlugVariables,
  Post,
} from "@/types/wordpress";

/**
 * Busca um post pelo `slug`, incluindo `content` (HTML do editor) e os
 * dados de SEO do Yoast.
 */
export const POST_BY_SLUG_QUERY = /* GraphQL */ `
  ${POST_LIST_FIELDS_FRAGMENT}
  ${SEO_FRAGMENT}
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostListFields
      content
      seo {
        ...SeoFields
      }
    }
  }
`;

/**
 * Query mínima (sem ACF/Yoast) — usada como fallback enquanto o Field Group
 * `postFields` e o plugin WPGraphQL for Yoast SEO não estão configurados.
 * Pode ser removida assim que o schema do WP estiver completo.
 */
const POST_BY_SLUG_BASIC_QUERY = /* GraphQL */ `
  query GetPostBySlugBasic($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      id
      slug
      uri
      title
      excerpt
      content
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
`;

interface BasicPostResponse {
  post: Omit<Post, "postSettings" | "seo"> | null;
}

export async function getPostBySlug(
  slug: string,
  options: { fallbackToMocks?: boolean } = {},
): Promise<Post | null> {
  try {
    const data = await fetchGraphQL<
      GetPostBySlugResponse,
      GetPostBySlugVariables
    >(
      POST_BY_SLUG_QUERY,
      { slug },
      {
        tags: [cacheTags.posts, cacheTags.post(slug)],
        operationName: "GetPostBySlug",
      },
    );
    return data.post;
  } catch (error) {
    console.warn(
      `[wordpress] getPostBySlug(${slug}) com ACF/Yoast falhou, tentando query básica.`,
      error instanceof Error ? error.message : error,
    );
  }

  try {
    const basic = await fetchGraphQL<BasicPostResponse, GetPostBySlugVariables>(
      POST_BY_SLUG_BASIC_QUERY,
      { slug },
      {
        tags: [cacheTags.posts, cacheTags.post(slug)],
        operationName: "GetPostBySlugBasic",
      },
    );
    if (basic.post) {
      return {
        ...basic.post,
        postSettings: null,
        seo: null,
      };
    }
  } catch (error) {
    console.warn(
      `[wordpress] getPostBySlug(${slug}) básica falhou, caindo para MOCK.`,
      error instanceof Error ? error.message : error,
    );
  }

  if (options.fallbackToMocks === false) return null;

  const mock = MOCK_POSTS.find((p) => p.slug === slug);
  if (!mock) return null;
  return { ...MOCK_POST, ...mock };
}
