import Link from "next/link";
import type { Category } from "@/types/wordpress";

interface CategoryDirectoryProps {
  categories: Category[];
  title?: string;
  description?: string;
}

export function CategoryDirectory({
  categories,
  title = "Explore todas as categorias",
  description = "Encontre orientações sobre mobilidade, equipamentos e acessibilidade organizadas pelos temas que fazem parte do seu dia a dia.",
}: CategoryDirectoryProps) {
  const visibleCategories = categories.filter(
    (category) => category.slug !== "uncategorized",
  );

  if (visibleCategories.length === 0) return null;

  return (
    <section
      aria-labelledby="category-directory-heading"
      className="flex flex-col gap-7 rounded-2xl border border-[#e9ddf8] bg-[#f6f1fc] px-5 py-8 sm:gap-8 sm:rounded-3xl sm:px-8 sm:py-10 lg:px-10"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6504c6]">Encontre seu caminho</span>
          <h2
            id="category-directory-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-[#171020] sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#51445f] sm:text-base">
            {description}
          </p>
        </div>
        <Link
          href="/categorias"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-[#7C05F2]/25 bg-white px-4 py-2.5 text-sm font-bold text-[#6504c6] shadow-sm transition hover:border-[#7C05F2] hover:bg-[#7C05F2] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C05F2]"
        >
          Ver diretório completo <span aria-hidden="true">→</span>
        </Link>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {visibleCategories.map((category, index) => {
          const children = (category.children?.nodes ?? []).filter(
            (child) => child.slug !== "uncategorized",
          );
          const descriptionText = category.description?.trim()
            || `Artigos e orientações sobre ${category.name.toLocaleLowerCase("pt-BR")}.`;

          return (
            <li
              key={category.databaseId}
              className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e8e0ef] bg-white p-5 shadow-[0_5px_18px_rgba(36,16,56,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#c9a8ed] hover:shadow-[0_14px_34px_rgba(54,20,88,0.12)] sm:p-6"
            >
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7C05F2] via-[#9c4df4] to-[#d8b8fb]" />
              <div className="flex items-start gap-4">
                <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#f2e8ff] font-display text-base font-bold text-[#6504c6] ring-1 ring-inset ring-[#7C05F2]/10 sm:size-14 sm:text-lg">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/${category.slug}`}
                      className="font-display text-lg font-bold leading-tight text-[#171020] underline-offset-4 group-hover:text-[#6504c6] group-hover:underline sm:text-xl"
                    >
                      {category.name}
                    </Link>
                    <span aria-hidden="true" className="shrink-0 text-lg text-[#7C05F2] transition group-hover:translate-x-0.5">↗</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#62596a]">{descriptionText}</p>
                </div>
              </div>

              {children.length > 0 && (
                <ul aria-label={`Subcategorias de ${category.name}`} className="mt-5 flex flex-wrap gap-2 border-t border-[#f0eaf5] pt-4">
                  {children.map((child) => (
                    <li key={child.databaseId}>
                      <Link
                        href={`/${child.slug}`}
                        className="inline-flex min-h-9 items-center rounded-full border border-[#e9e0f2] bg-[#fbf9fd] px-3 py-1.5 text-xs font-semibold leading-4 text-[#51445f] transition hover:border-[#7C05F2]/40 hover:bg-[#f2e8ff] hover:text-[#4a1285] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C05F2] sm:text-sm"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
