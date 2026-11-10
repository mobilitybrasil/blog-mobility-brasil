import Link from "next/link";
import type { Category } from "@/types/wordpress";
import { AngleDownIcon } from "@/components/layout/icons";
import { BlogSearchForm } from "./BlogSearchForm";

interface BlogHeroProps {
  categories: Category[];
}

export function BlogHero({ categories }: BlogHeroProps) {
  const hasCategories = categories.some(
    (category) => category.slug !== "uncategorized",
  );

  return (
    <section aria-labelledby="blog-intro-heading" className="px-4 sm:px-6">
      <div className="border-y border-[#d9d7d3] py-5 sm:py-7">
        <div className="max-w-4xl">
          <h1
            id="blog-intro-heading"
            className="font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-[#171717] sm:text-3xl lg:text-4xl"
          >
            Tudo sobre cadeira de rodas, scooters, e outros equipamentos
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#514f4b] sm:text-base sm:leading-7">
            Guias sobre modelos manuais e motorizados, cadeiras de banho e acessórios, além de orientações sobre tecnologia assistiva, postura, cuidados e acessibilidade.
          </p>
        </div>

        <div className="mt-4 sm:mt-5">
          <p className="mb-2 text-xs font-semibold text-[#514f4b]">O que você quer descobrir?</p>
          <BlogSearchForm compact />
        </div>

        {hasCategories && (
          <Link
            href="#category-directory-heading"
            className="group mt-3 inline-flex min-h-10 items-center gap-2 border-b border-[#171717] pb-1 text-sm font-bold text-[#171717] transition-colors hover:text-[#5b5955] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
          >
            Ver categorias e subcategorias
            <AngleDownIcon aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
          </Link>
        )}
      </div>
    </section>
  );
}
