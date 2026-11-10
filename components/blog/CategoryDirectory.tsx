import Link from "next/link";
import type { Category } from "@/types/wordpress";
import { AngleRightIcon } from "@/components/layout/icons";

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
      className="flex flex-col gap-6 px-4 sm:gap-8 sm:px-6"
    >
      <div className="max-w-3xl">
        <h2
          id="category-directory-heading"
          className="scroll-mt-24 font-display text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#514f4b] sm:text-base">
          {description}
        </p>
      </div>

      <ul className="grid border-b border-[#d9d7d3] md:grid-cols-2 md:gap-x-10">
        {visibleCategories.map((category) => {
          const children = (category.children?.nodes ?? []).filter(
            (child) => child.slug !== "uncategorized",
          );
          const categoryDescription = category.description?.trim();

          return (
            <li
              key={category.databaseId}
              className="group flex min-w-0 flex-col border-t border-[#d9d7d3] py-5 sm:py-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-xl font-bold leading-tight text-[#171717] sm:text-2xl">
                  <Link
                    href={`/${category.slug}`}
                    className="rounded-sm underline-offset-4 transition-colors hover:text-[#5b5955] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
                  >
                    {category.name}
                  </Link>
                </h3>
                <AngleRightIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[#6b6964] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </div>

              {categoryDescription && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#514f4b]">
                  {categoryDescription}
                </p>
              )}

              {children.length > 0 && (
                <ul aria-label={`Subcategorias de ${category.name}`} className="mt-3 flex flex-wrap gap-x-5 border-t border-[#e8e6e2] pt-2">
                  {children.map((child) => (
                    <li key={child.databaseId}>
                      <Link
                        href={`/${child.slug}`}
                        className="inline-flex min-h-11 items-center border-b border-transparent py-1 text-sm font-medium leading-5 text-[#514f4b] transition-colors hover:border-[#171717] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
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
