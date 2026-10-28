import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/graphql/queries/post";
import { SITE_URL } from "@/lib/wordpress";

/**
 * Resolve URLs do formato legado do WordPress.com (mobilitybrasil.wordpress.com)
 * — /YYYY/MM/DD/slug/ — para a URL canônica /{categoria}/{slug}/ deste site.
 *
 * O blog antigo aponta pra cá via "Site Redirect" (WordPress.com), que só
 * troca o domínio preservando o path — por isso essa rota existe: cobre
 * posts futuros automaticamente, sem precisar manter uma lista de
 * redirects estática por post.
 *
 * Os nomes dos parâmetros (`category`, `slug`) são os mesmos usados por
 * `app/[category]/[slug]/page.tsx` só porque o Next.js exige que segmentos
 * dinâmicos na mesma posição da árvore de rotas compartilhem o nome — não
 * têm relação com o significado real aqui (que é ano/mês).
 */
export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      category: string; // ano (ex.: "2026")
      slug: string; // mês (ex.: "08")
      day: string;
      postslug: string; // slug real do post
    }>;
  },
) {
  const { category: year, slug: month, day, postslug } = await params;

  const isValidDate =
    /^\d{4}$/.test(year) && /^\d{2}$/.test(month) && /^\d{2}$/.test(day);
  const cleanSlug = postslug.replace(/[​-‏﻿￼]/g, "");

  const post =
    isValidDate && cleanSlug
      ? await getPostBySlug(cleanSlug, { fallbackToMocks: false })
      : null;
  const postCategory = post?.categories?.nodes[0]?.slug;

  if (!post || !postCategory) return new Response(null, { status: 404 });

  return NextResponse.redirect(
    new URL(`/${postCategory}/${post.slug}`, SITE_URL),
    308,
  );
}
