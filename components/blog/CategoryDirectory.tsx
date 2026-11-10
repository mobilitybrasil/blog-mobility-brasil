import Image from "next/image";
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
      className="mx-4 overflow-hidden bg-white sm:mx-6"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] bg-[#020205] text-white sm:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex flex-col justify-center px-4 py-5 sm:px-8 sm:py-7">
          <h2
            id="category-directory-heading"
            className="scroll-mt-24 max-w-2xl font-display text-2xl font-bold italic leading-[1.02] tracking-[-0.025em] sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-5 text-white/80 sm:text-[15px]">
            {description}
          </p>
        </div>
        <div className="relative min-h-36 bg-white sm:min-h-40">
          <Image
            src="/images/brand/mobility-venom.jpg"
            alt="Cadeira de rodas manual Mobility Venom"
            fill
            unoptimized
            sizes="288px"
            className="object-contain p-2"
          />
        </div>
      </div>

      <ul className="grid border-b border-[#d2d2d2] sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-9">
        {visibleCategories.map((category) => {
          const children = (category.children?.nodes ?? []).filter(
            (child) => child.slug !== "uncategorized",
          );
          const categoryDescription = category.description?.trim();

          return (
            <li
              key={category.databaseId}
              className="group flex min-w-0 flex-col border-t border-[#d2d2d2] py-3.5 sm:py-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-[17px] font-bold uppercase italic leading-tight tracking-[-0.015em] text-[#171717] sm:text-lg">
                  <Link
                    href={`/${category.slug}`}
                    className="rounded-sm underline-offset-4 transition-colors hover:text-[#5b5955] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
                  >
                    {category.name}
                  </Link>
                </h3>
                <AngleRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-[#6b6964] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </div>

              {categoryDescription && (
                <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-[#514f4b]">
                  {categoryDescription}
                </p>
              )}

              {children.length > 0 && (
                <ul
                  aria-label={`Subcategorias de ${category.name}`}
                  className="mt-2 flex flex-wrap gap-x-3 border-t border-[#e1e1e1] pt-1"
                >
                  {children.map((child) => (
                    <li key={child.databaseId}>
                      <Link
                        href={`/${child.slug}`}
                        className="inline-flex min-h-9 items-center border-b border-transparent py-1 text-[13px] font-medium leading-5 text-[#454545] transition-colors hover:border-[#171717] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
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
