import "server-only";

import { uappiGet } from "@/lib/uappi";
import { MOCK_FOOTER } from "@/lib/mocks/footer";
import type {
  FooterColumn,
  FooterData,
  FooterLink,
  FooterLegalLink,
  FooterNewsletter,
  FooterSocial,
  FooterSocialNetwork,
} from "@/types/wordpress";

interface UappiMenuItem {
  label: string;
  link?: string;
  target?: string;
  icone?: string;
  rota?: { path?: string } | Record<string, never>;
}

interface UappiMenu {
  hash: string;
  nome: string;
  menu: UappiMenuItem[];
}

const FOOTER_CACHE_TAG = "footer";
const FOOTER_REVALIDATE = 60 * 60;
const STORE_URL = (process.env.NEXT_PUBLIC_STORE_URL ?? "").replace(/\/$/, "");
const CURRENT_YEAR = new Date().getFullYear();

function toAbsoluteUrl(raw: string | null | undefined): string {
  if (!raw) return STORE_URL || "#";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return "mailto:" + raw;
  if (/^https?:\/\/mobilitybrasil\.wordpress\.com\/?$/i.test(raw)) return "https://blog.mobilitybrasil.com.br/";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
    return raw;
  }
  if (!STORE_URL) return raw;
  return STORE_URL + "/" + raw.replace(/^\/+/, "");
}

async function safeGetMenu(slug: string): Promise<UappiMenu | null> {
  try {
    const data = await uappiGet<UappiMenu>("/v2/front/struct/menus/" + slug, {
      tags: [FOOTER_CACHE_TAG],
      revalidate: FOOTER_REVALIDATE,
    });
    if (!data || !Array.isArray(data.menu)) return null;
    return data;
  } catch (error) {
    console.error(
      "[uappi] getFooter: falha no menu \"" + slug + "\"",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

function resolveItemUrl(item: UappiMenuItem): string {
  const rotaPath =
    item.rota && "path" in item.rota && item.rota.path ? item.rota.path : null;
  return toAbsoluteUrl(rotaPath ?? item.link ?? null);
}

function mapMenuToColumn(menu: UappiMenu): FooterColumn {
  const links: FooterLink[] = menu.menu
    .filter((item) => Boolean(item.label))
    .map((item) => ({
      label: item.label,
      url: resolveItemUrl(item),
      abrirEmNovaAba: item.target === "_blank",
    }));
  return { titulo: menu.nome, links };
}

const SOCIAL_NETWORK_HINTS: Array<{
  network: FooterSocialNetwork;
  patterns: string[];
}> = [
  { network: "instagram", patterns: ["instagram", "instagr.am"] },
  { network: "facebook", patterns: ["facebook", "fb.com"] },
  { network: "tiktok", patterns: ["tiktok"] },
  { network: "youtube", patterns: ["youtube", "youtu.be"] },
  { network: "linkedin", patterns: ["linkedin"] },
  { network: "whatsapp", patterns: ["whatsapp", "wa.me", "api.whatsapp"] },
];

function inferSocialNetwork(
  label: string,
  link: string,
): FooterSocialNetwork | null {
  const haystack = (link + " " + label).toLowerCase();
  for (const { network, patterns } of SOCIAL_NETWORK_HINTS) {
    if (patterns.some((p) => haystack.includes(p))) return network;
  }
  return null;
}

function mapSocialMenu(menu: UappiMenu | null): FooterSocial[] {
  if (!menu) return [];
  const seen = new Set<FooterSocialNetwork>();
  const result: FooterSocial[] = [];
  for (const item of menu.menu) {
    if (!item.link) continue;
    const network = inferSocialNetwork(item.label ?? "", item.link);
    if (!network || seen.has(network)) continue;
    seen.add(network);
    result.push({
      rede: network,
      url: toAbsoluteUrl(item.link),
      label: item.label,
      icone: item.icone || null,
      abrirEmNovaAba: item.target === "_blank",
    });
  }
  return result;
}

function mapCopyrightMenu(menu: UappiMenu | null): FooterData["bottom"] {
  if (!menu) return MOCK_FOOTER.bottom;

  let logoUrl: string | null = null;
  let logoAlt: string | null = null;
  const linksLegais: FooterLegalLink[] = [];

  for (const item of menu.menu) {
    if (item.icone) {
      logoUrl = item.icone;
      logoAlt = item.label === "Logo Mobility" ? "Mobility Brasil" : item.label;
      continue;
    }
    if (item.label) {
      // O item Copyright do painel da Uappi é um link para a política de privacidade.
      linksLegais.push({ label: item.label, url: resolveItemUrl(item) });
    }
  }

  return {
    logoUrl,
    logoAlt,
    copyright: "© " + CURRENT_YEAR + ", Mobility Brasil Importação e Comércio de Cadeiras de Rodas Ltda. Todos os direitos reservados.",
    linksLegais,
    textoTecnologia: "Tecnologia de e-commerce",
    urlTecnologia: "https://uappi.com.br",
    textoDesenvolvido: "Desenvolvido por",
    urlDesenvolvedor: "https://tec4udigital.com",
  };
}

function extractPolicyUrl(terms: string): string | null {
  if (terms.toLowerCase().includes("política de privacidade")) {
    return toAbsoluteUrl("/politica-de-privacidade");
  }
  return null;
}

function mapNewsletterContent(
  menu: UappiMenu | null,
): FooterNewsletter | null {
  if (!menu) return MOCK_FOOTER.newsletter;
  const map: Record<string, string> = {};
  for (const item of menu.menu) {
    if (item.label && item.link) map[item.label] = item.link;
  }

  const terms = map.Terms ?? null;
  return {
    titulo: map.Title ?? "Newsletter",
    textoPrincipal: map.Subtitle ?? null,
    textoSecundario: map.Description ?? null,
    placeholderEmail: "E-mail",
    ctaLabel: "Inscrever-se",
    textoPrivacidade: terms,
    urlPoliticaPrivacidade: terms ? extractPolicyUrl(terms) : null,
  };
}

export async function getFooter(): Promise<FooterData> {
  const [
    sobre,
    areaCliente,
    contato,
    politica,
    icons,
    copyright,
    newsletterContent,
  ] = await Promise.all([
    safeGetMenu("footer-sobre"),
    safeGetMenu("footer-area-do-cliente"),
    safeGetMenu("footer-contato"),
    safeGetMenu("footer-politica"),
    safeGetMenu("icons-footer"),
    safeGetMenu("copyright-footer"),
    safeGetMenu("content-newsletter"),
  ]);

  const colunas: FooterColumn[] = [
    sobre,
    areaCliente,
    contato,
    politica,
  ]
    .filter((m): m is UappiMenu => m !== null)
    .map(mapMenuToColumn);

  return {
    newsletter: mapNewsletterContent(newsletterContent),
    colunas: colunas.length > 0 ? colunas : MOCK_FOOTER.colunas,
    redesSociais:
      icons === null ? MOCK_FOOTER.redesSociais : mapSocialMenu(icons),
    bottom: mapCopyrightMenu(copyright),
  };
}
