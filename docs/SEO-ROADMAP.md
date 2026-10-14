# SEO roadmap — Blog Mobility Brasil

Updated: 2026-10-14

## Crawl and scope

- Read-only crawl of same-domain links discovered from the homepage and their linked pages. Search results (`/buscar`) and external store pages were excluded from the indexable URL set.
- 141 internal paths were discovered, including the non-page `/graphql` path. The 140 public content routes returned HTTP 200; eight initial timeouts returned HTTP 200 on retry. `/graphql`, `/robots.txt`, and `/sitemap.xml` returned HTTP 404.
- All discovered article pages had self-referencing canonicals. The homepage and category landing pages did not. Article titles and descriptions were present; the title “Almofada de ar: como regular a pressão” appears on both `/almofadas/almofada-de-ar-para-cadeira-de-rodas-como-regular-a-pressao-corretamente` and `/acessorios-para-cadeira-de-rodas/almofada-de-ar-como-regular-a-pressao-corretamente`. Review their search intent and metadata without assuming the articles themselves are duplicates.
- Article Open Graph `site_name` values use the Hostinger staging hostname. The global homepage description also describes a different business focus.
- The search page already uses `noindex, follow`; it should stay out of the sitemap.
- Content approval and date scheduling are handled by Mobility Brasil. This roadmap does not treat those editorial workflows as defects.

## Prioritized workflow

### P0 — Crawlability and consistent site identity — implemented locally

- Publish `robots.txt`, allow public crawlers including `OAI-SearchBot`, and reference the sitemap.
- Publish `sitemap.xml` with the homepage, non-empty category pages, and every published article. Paginate the WordPress GraphQL query so the sitemap does not stop at the first 100 articles. Exclude internal search results.
- Add self canonicals to the homepage and category pages.
- Align the homepage title and description with the blog's actual subject; use consistent Open Graph site identity.
- Replace incomplete homepage `BlogPosting` snippets with an `ItemList`. Map editorial email identities to the Mobility Brasil organization in structured data instead of presenting an email address as a person's name.
- The Organization author entity includes the existing brand logo, and sitemap generation avoids repository mock content when WordPress is unavailable.

### P1 — Shared footer URL — configuration change remains

- The blog reads the footer's “Sobre a Mobility” column from the Uappi menu `footer-sobre`; its public API response identifies menu 13 and the “Blog” item currently points to `https://mobilitybrasil.wordpress.com/`.
- Update that Uappi menu item to `https://blog.mobilitybrasil.com.br/`. The blog source does not hardcode the link, so changing the repository alone would not correct the store's shared footer.
- The public Uappi read endpoint is available, but the private template connector returned HTTP 404 for authentication during this audit. Make the configuration change in the Uappi admin or restore private template access, then verify the link on both the store and blog.

### P1 — Validate indexing after deployment

- Deploy the local changes, then fetch `/robots.txt` and `/sitemap.xml` from production and confirm only canonical, indexable URLs appear.
- Submit the sitemap and inspect index coverage in Google Search Console and Bing Webmaster Tools. No Search Console or CrUX data was available during this audit.
- Validate representative home, category, and article JSON-LD with Google's Rich Results Test and URL Inspection.

### P2 — Metadata coverage and AI search

- Review the duplicated article title pair found in the crawl and decide whether to differentiate metadata, consolidate, or retain both based on search intent.
- Audit per-article titles, descriptions, social titles, and hero-image availability in WordPress. The latest article's missing cover is already being addressed by Mobility Brasil.
- Keep the visible page content and structured data aligned. Google's documentation says AI Overviews and AI Mode use the same foundational SEO requirements and do not require a special AI file; OpenAI Search discovery depends on allowing `OAI-SearchBot`.
- Measure Core Web Vitals and responsive/accessibility behavior with production field data and a visual mobile pass; this was not measurable in the current crawl.

## Current code status

The P0 changes are present in the local working tree. ESLint, TypeScript, and a local production build pass. The build used loopback placeholders and repository fallbacks because the real WordPress/Uappi environment variables are not configured in this local checkout; it verifies compilation and route generation, not live CMS sitemap contents. Run a production-environment build and verify the generated data after deployment. No deployment or Uappi configuration was changed as part of this audit.

The visible article byline remains controlled by the WordPress author/avatar fields. A visible logo next to the byline is a separate follow-up so it can be previewed without overwriting the author identity you just set.
