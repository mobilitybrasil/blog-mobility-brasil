import Link from "next/link";
import { ABOUT_URL, STORE_URL } from "@/lib/site";
import type { Category } from "@/types/wordpress";
import { BlogSearchForm } from "./BlogSearchForm";

interface BlogHeroProps {
  categories: Category[];
}

export function BlogHero({ categories }: BlogHeroProps) {
  const featuredCategories = categories
    .filter((category) => category.slug !== "uncategorized")
    .slice(0, 5);

  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-[#171020] px-5 py-8 text-white shadow-[0_18px_55px_rgba(49,20,81,0.18)] sm:rounded-3xl sm:px-9 sm:py-10 lg:px-12 lg:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-24 -top-36 size-[25rem] rounded-full bg-[#7C05F2]/35 blur-3xl" />
        <div className="absolute -bottom-48 left-[38%] size-[24rem] rounded-full bg-[#4c1d95]/55 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(255,255,255,0.12)_0,transparent_32%)]" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center lg:gap-12">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 sm:text-sm">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#b87cff]" />
            Blog Mobility Brasil
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Informação que amplia possibilidades.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            Guias, comparativos e novidades sobre cadeiras de rodas,
            acessibilidade e tecnologia assistiva, com a experiência da Mobility Brasil.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="#latest-heading"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#7C05F2] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#6504c6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explorar artigos
              <span aria-hidden="true">↘</span>
            </Link>
            <a
              href={ABOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Conheça a Mobility
            </a>
            <a
              href={STORE_URL}
              target="_blank"
              rel="noreferrer"
              className="px-2 py-3 text-sm font-semibold text-white/75 underline decoration-white/35 underline-offset-4 transition hover:text-white"
            >
              Ir para a loja
            </a>
          </div>
        </div>

        <aside aria-label="Explore assuntos do blog" className="relative rounded-2xl border border-white/15 bg-black/20 p-4 backdrop-blur-sm sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c99eff]">
                Navegue por tema
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                O que você procura?
              </h2>
            </div>
            <Link
              href="/categorias"
              className="shrink-0 text-xs font-semibold text-white/75 underline decoration-white/35 underline-offset-4 hover:text-white sm:text-sm"
            >
              Ver todas
            </Link>
          </div>

          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {featuredCategories.map((category, index) => (
              <li key={category.databaseId}>
                <Link
                  href={`/${category.slug}`}
                  className="group flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#7C05F2]/80 text-[11px] font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">{category.name}</span>
                  <span aria-hidden="true" className="text-white/50 transition group-hover:translate-x-0.5 group-hover:text-white">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="mt-7 rounded-xl border border-white/15 bg-white p-2 shadow-xl shadow-black/20 sm:mt-8 sm:p-2.5">
        <BlogSearchForm compact />
      </div>
    </section>
  );
}
