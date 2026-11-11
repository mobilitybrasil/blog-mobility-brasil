import { MOCK_CATEGORY_SHOWCASE } from "@/lib/mocks/componentsHome";
import { parseCategoryShowcaseFromContent } from "@/lib/parseCategoryShowcase";
import type { PageContent } from "@/types/wordpress";
import {
  CategoryShowcaseCarousel,
  type CategoryShowcaseItem,
} from "./CategoryShowcaseCarousel";

export const COMPONENTS_HOME_URI = "/components-home/";

interface CategoryShowcaseProps {
  page: PageContent | null;
}

export function CategoryShowcase({ page }: CategoryShowcaseProps) {
  const parsed = parseCategoryShowcaseFromContent(page?.content);
  const source = parsed.length > 0 ? parsed : MOCK_CATEGORY_SHOWCASE;

  const items: CategoryShowcaseItem[] = source.map((item) => ({
    title: item.title,
    src: item.src,
    srcSet: item.srcSet,
    sizes: item.sizes,
    alt: item.alt || item.title,
    href: item.href,
    buttonLabel: item.buttonLabel,
  }));

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="category-showcase-heading"
      className="flex flex-col gap-6 px-6"
    >
      <h2
        id="category-showcase-heading"
        className="font-display text-[20px] font-medium text-black"
      >
        Leia por categoria
      </h2>
      <CategoryShowcaseCarousel items={items} />
    </section>
  );
}
