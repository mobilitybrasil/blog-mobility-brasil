import type { Metadata } from "next";
import { CategoryDirectory } from "@/components/blog/CategoryDirectory";
import { getCategories } from "@/lib/graphql/queries/categories";
import { SITE_URL } from "@/lib/wordpress";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Todas as categorias | Blog Mobility Brasil",
  description:
    "Explore todas as categorias do Blog Mobility Brasil sobre cadeiras de rodas, postura, acessórios, inclusão, cuidados e mobilidade.",
  alternates: {
    canonical: `${SITE_URL}/categorias`,
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 py-12">
      <header className="flex flex-col gap-3 px-6">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Blog Mobility Brasil
        </p>
        <h1 className="font-display text-3xl font-semibold text-black sm:text-4xl">
          Todas as categorias
        </h1>
        <p className="max-w-2xl text-base leading-7 text-neutral-600">
          Navegue pelos nossos conteúdos de mobilidade, acessibilidade e
          tecnologia assistiva por assunto.
        </p>
      </header>

      <CategoryDirectory
        categories={categories}
        title="Escolha um assunto"
        description="Acesse uma categoria principal ou explore um dos temas relacionados."
      />
    </div>
  );
}
