import Link from "next/link";
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
    <section aria-labelledby="blog-intro-heading" className="px-4 sm:px-6">
      <div className="rounded-2xl border border-[#ece3f3] bg-white px-5 py-6 shadow-[0_8px_28px_rgba(36,16,56,0.04)] sm:rounded-3xl sm:px-8 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-end lg:gap-10">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6504c6] sm:text-xs">
              <span aria-hidden="true" className="h-px w-7 bg-[#7c05f2]" />
              Blog Mobility Brasil
            </p>
            <h1
              id="blog-intro-heading"
              className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.035em] text-[#21162c] sm:text-3xl lg:text-4xl"
            >
              Tudo sobre cadeira de rodas, scooters, e outros equipamentos
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#594d62] sm:text-base sm:leading-7">
              Guias sobre modelos manuais e motorizados, cadeiras de banho e acessórios, além de orientações sobre tecnologia assistiva, postura, cuidados e acessibilidade.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-[#594d62]">O que você quer descobrir?</p>
            <BlogSearchForm compact />
          </div>
        </div>

        {featuredCategories.length > 0 && (
          <nav aria-label="Explore por categoria" className="mt-6 border-t border-[#eee7f3] pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <span className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-[#766b7e]">
                Explore por tema
              </span>
              <ul className="flex flex-wrap gap-2">
                {featuredCategories.map((category) => (
                  <li key={category.databaseId}>
                    <Link
                      href={`/${category.slug}`}
                      className="inline-flex min-h-9 items-center rounded-full border border-[#e4d8ed] bg-[#fcfaff] px-3.5 py-1.5 text-xs font-semibold text-[#3c2b4a] transition hover:border-[#7c05f2]/60 hover:bg-[#f6effc] hover:text-[#6504c6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c05f2] sm:text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/categorias"
                className="w-fit shrink-0 text-xs font-bold text-[#6504c6] underline decoration-[#cbb3e2] underline-offset-4 hover:text-[#45008a] sm:ml-auto sm:text-sm"
              >
                Ver todas <span aria-hidden="true">→</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}
