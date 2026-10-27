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
  description = "Encontre conteúdos por assunto e navegue pelas áreas do blog.",
}: CategoryDirectoryProps) {
  const visibleCategories = categories.filter(
    (category) => category.slug !== "uncategorized",
  );

  if (visibleCategories.length === 0) return null;

  return (
    <section
      aria-labelledby="category-directory-heading"
      className="flex flex-col gap-6 px-6"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="category-directory-heading"
          className="font-display text-[20px] font-medium text-black"
        >
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600">
          {description}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleCategories.map((category) => {
          const children = (category.children?.nodes ?? []).filter(
            (child) => child.slug !== "uncategorized",
          );

          return (
            <li
              key={category.databaseId}
              className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <Link
                  href={`/${category.slug}`}
                  className="font-display text-base font-semibold text-[color:var(--color-brand-black)] underline-offset-4 hover:underline"
                >
                  {category.name}
                </Link>
                {category.description && (
                  <p className="text-sm leading-5 text-neutral-600">
                    {category.description}
                  </p>
                )}
              </div>

              {children.length > 0 && (
                <ul className="flex flex-col gap-2 border-t border-neutral-100 pt-3">
                  {children.map((child) => (
                    <li key={child.databaseId}>
                      <Link
                        href={`/${child.slug}`}
                        className="text-sm text-neutral-700 underline-offset-4 hover:text-black hover:underline"
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
