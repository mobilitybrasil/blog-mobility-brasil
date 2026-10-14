import type { Metadata } from "next";
import Link from "next/link";
import { BlogSearchForm } from "@/components/blog/BlogSearchForm";
import { PostCard } from "@/components/blog/PostCard";
import { searchPosts } from "@/lib/graphql/queries/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar artigos",
  description: "Encontre artigos, dicas e informações no Blog Mobility Brasil.",
  robots: { index: false, follow: true },
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
    after?: string | string[];
  }>;
}

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = firstValue(params.q).trim().slice(0, 100);
  const after = firstValue(params.after).slice(0, 500) || null;
  const result = query ? await searchPosts({ query, after }) : null;
  const nextPageHref =
    result?.pageInfo?.hasNextPage && result.pageInfo.endCursor
      ? "/buscar?q=" +
        encodeURIComponent(query) +
        "&after=" +
        encodeURIComponent(result.pageInfo.endCursor)
      : null;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col gap-8 px-5 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Blog &amp; Artigos
        </p>
        <h1 className="font-display text-3xl font-medium leading-tight text-neutral-950 sm:text-4xl">
          Buscar artigos
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
          Encontre informações sobre mobilidade, escolha de produtos, medidas e
          cuidados.
        </p>
      </header>

      <BlogSearchForm initialQuery={query} compact />

      {query && result?.error ? (
        <p
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-neutral-800"
        >
          Não foi possível carregar os resultados agora. Tente novamente em
          alguns instantes.
        </p>
      ) : null}

      {query && result && !result.error && result.posts.length === 0 ? (
        <section aria-live="polite" className="rounded-xl bg-white p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-neutral-900">
            Nenhum artigo encontrado para “{query}”
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Tente outros termos ou uma busca mais curta, como “cadeira de
            rodas”, “medidas” ou “manutenção”.
          </p>
        </section>
      ) : null}

      {result && !result.error && result.posts.length > 0 ? (
        <section
          aria-live="polite"
          aria-labelledby="search-results-heading"
          className="flex flex-col gap-6"
        >
          <div>
            <h2
              id="search-results-heading"
              className="text-xl font-semibold text-neutral-900"
            >
              Resultados para “{query}”
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {result.posts.length} {result.posts.length === 1 ? "artigo" : "artigos"} nesta página
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.posts.map((post, index) => (
              <PostCard
                key={post.databaseId}
                post={post}
                priority={index < 3}
              />
            ))}
          </div>

          {nextPageHref ? (
            <div className="flex justify-center pt-2">
              <Link
                href={nextPageHref}
                className="rounded border border-neutral-900 px-5 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Próximos resultados
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

      {!query ? (
        <p className="text-sm text-neutral-600">
          Digite um tema, uma dúvida ou o nome de um produto para começar.
        </p>
      ) : null}
    </main>
  );
}
