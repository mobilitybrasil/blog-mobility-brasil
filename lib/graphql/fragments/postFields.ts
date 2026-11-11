/**
 * Fragments reaproveitados pelas queries de Post.
 *
 * `POST_LIST_FIELDS_FRAGMENT` é usado em listagens (sem `content`).
 * Para o post individual, faça spread + `content` na query.
 *
 * O Field Group ACF se chama "Post Settings" (graphql_field_name:
 * `postSettings`). Quando os campos no WP estão em snake_case
 * (`post_highlight`, `post_cta_url`, ...), o WPGraphQL ACF expõe os mesmos
 * em camelCase automaticamente.
 */
export const POST_LIST_FIELDS_FRAGMENT = /* GraphQL */ `
  fragment PostListFields on Post {
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
        sourceUrl(size: LARGE)
        srcSet(size: FULL)
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
    postSettings {
      postHighlight
      postThemeColor
      authorBio
      postCtaLabel
      postCtaUrl
    }
  }
`;
