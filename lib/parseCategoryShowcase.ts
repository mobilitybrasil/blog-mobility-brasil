/**
 * Extrai os itens da seção "Leia por categoria" do HTML renderizado de uma
 * página Gutenberg. Cada item é composto por três blocos consecutivos no
 * editor do WordPress:
 *
 * 1. Heading `<h3>` — título do card.
 * 2. `<figure class="wp-block-image">` — imagem da categoria.
 * 3. `<div class="wp-block-button">` com `<a class="wp-block-button__link">`
 *    — botão com link para a categoria.
 *
 * Como Gutenberg pode embrulhar esses blocos em groups/columns variados,
 * fazemos uma varredura linear no HTML coletando cada tipo separadamente e
 * casamos por posição (1º h3 com 1ª imagem com 1º botão, e assim por diante).
 * Itens incompletos (sem trio correspondente) são descartados.
 */
export interface CategoryShowcaseGalleryItem {
  title: string;
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  href: string | null;
  buttonLabel: string;
}

const H3_RE = /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi;
const FIGURE_RE =
  /<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>([\s\S]*?)<\/figure>/gi;
// Casamos o wrapper `wp-block-button` para extrair o link, que no editor do
// WP atual está saindo como `id` (HTML anchor) no wrapper, e não como `href`
// no `<a>` interno. Suportamos os dois cenários.
const BUTTON_WRAPPER_RE =
  /<div\b[^>]*class="[^"]*wp-block-button\b[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
const BUTTON_INNER_LINK_RE =
  /<a\b[^>]*class="[^"]*wp-block-button__link[^"]*"[^>]*>([\s\S]*?)<\/a>/i;
const IMG_SRC_RE = /<img[^>]*\bsrc=["']([^"']+)["']/i;
const IMG_SRCSET_RE = /<img[^>]*\bsrcset=["']([^"']+)["']/i;
const IMG_SIZES_RE = /<img[^>]*\bsizes=["']([^"']+)["']/i;
const IMG_ALT_RE = /<img[^>]*\balt=["']([^"']*)["']/i;
const HREF_RE = /\bhref=["']([^"']+)["']/i;
const ID_RE = /\bid=["']([^"']+)["']/i;

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").trim();
}

export function parseCategoryShowcaseFromContent(
  html: string | null | undefined,
): CategoryShowcaseGalleryItem[] {
  if (!html) return [];

  const titles = Array.from(html.matchAll(H3_RE)).map((m) => stripTags(m[1]));

  const images = Array.from(html.matchAll(FIGURE_RE)).map((m) => {
    const inner = m[1];
    return {
      src: inner.match(IMG_SRC_RE)?.[1] ?? "",
      srcSet: inner.match(IMG_SRCSET_RE)?.[1],
      sizes: inner.match(IMG_SIZES_RE)?.[1],
      alt: inner.match(IMG_ALT_RE)?.[1] ?? "",
    };
  });

  const buttons = Array.from(html.matchAll(BUTTON_WRAPPER_RE)).map((m) => {
    const wrapperTag = m[0].slice(0, m[0].indexOf(">") + 1);
    const inner = m[1];
    const innerLink = inner.match(BUTTON_INNER_LINK_RE);
    const innerHref = innerLink?.[0].match(HREF_RE)?.[1] ?? null;
    const wrapperId = wrapperTag.match(ID_RE)?.[1] ?? null;
    return {
      href: innerHref ?? wrapperId,
      label: innerLink ? stripTags(innerLink[1]) : "",
    };
  });

  const count = Math.min(titles.length, images.length, buttons.length);
  const items: CategoryShowcaseGalleryItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      title: titles[i],
      src: images[i].src,
      alt: images[i].alt || titles[i],
      href: buttons[i].href,
      buttonLabel: buttons[i].label || "Explorar",
    });
  }
  return items;
}
