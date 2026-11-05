import Image from "next/image";
import Link from "next/link";
import { ABOUT_URL } from "@/lib/site";
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
    <section className="mobility-home-hero relative isolate overflow-hidden rounded-[1.5rem] bg-[#f4f0f8] text-[#21162c] sm:rounded-[2rem]">
      <div aria-hidden="true" className="mobility-home-hero__glow absolute -right-24 -top-32 -z-10 size-[28rem] rounded-full bg-[#d9b8fa] opacity-70 blur-[90px]" />
      <div className="grid lg:min-h-[31rem] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 pb-4 pt-8 sm:px-10 sm:pt-12 lg:px-14 lg:py-14">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#6700c9] sm:text-sm">
            <span aria-hidden="true" className="h-px w-8 bg-[#7c05f2]" />
            Blog Mobility Brasil
          </div>
          <h1 className="mt-5 max-w-xl font-display text-[2.65rem] font-bold leading-[0.99] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">
            Compare cadeiras de rodas, scooters e outros equipamentos.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#594d62] sm:text-lg sm:leading-8">
            Entenda diferenças entre modelos manuais e motorizados, scooters e cadeiras de banho; veja orientações sobre acessórios, tecnologia assistiva, postura, cuidados e acessibilidade.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="#latest-news-heading"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#7c05f2] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(96,0,187,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#6504c6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6504c6]"
            >
              Ver artigos recentes <span aria-hidden="true">↘</span>
            </Link>
            <a
              href={ABOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center px-3 py-3 text-sm font-bold text-[#30223d] underline decoration-[#b8a5c9] underline-offset-4 transition hover:text-[#6504c6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6504c6]"
            >
              Conheça a Mobility
            </a>
          </div>
        </div>

        <div className="mobility-home-hero__visual relative min-h-[18rem] overflow-hidden sm:min-h-[25rem] lg:min-h-[31rem]">
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,#f4f0f8_0%,#e8d8f8_48%,#c8a0ef_100%)]" />
          <div aria-hidden="true" className="absolute -right-12 top-1/2 aspect-square w-[88%] -translate-y-1/2 rounded-full border border-white/55" />
          <div aria-hidden="true" className="absolute right-[8%] top-1/2 aspect-square w-[70%] -translate-y-1/2 rounded-full bg-[#7c05f2]/10" />
          <Image
            src="/images/brand/mobility-venom.jpg"
            alt="Cadeira de rodas manual Mobility Venom, modelo autoral da Mobility Brasil"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 55vw"
            className="mobility-home-hero__image object-contain object-center mix-blend-multiply px-2 pb-3 pt-0 sm:px-8 sm:pb-6 lg:px-4 lg:py-6"
          />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/70 bg-white/85 py-2 pl-2 pr-4 shadow-[0_12px_36px_rgba(42,18,61,0.12)] backdrop-blur-md sm:bottom-8 sm:left-8">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#352540] sm:text-sm">Mobility Venom · cadeira manual</span>
          </div>
          <span aria-hidden="true" className="absolute right-5 top-5 rounded-full border border-white/70 bg-white/65 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5e3484] backdrop-blur-sm sm:right-8 sm:top-8 sm:text-xs">Modelo autoral Mobility</span>
        </div>
      </div>

      <div className="relative z-10 grid gap-5 border-t border-[#d9cbe5] bg-white/70 px-5 py-5 backdrop-blur sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8 lg:px-10">
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#675776]">Acesse por categoria</p>
            <Link href="/categorias" className="shrink-0 text-xs font-bold text-[#6504c6] underline decoration-[#cbb3e2] underline-offset-4 hover:text-[#45008a]">Todas as categorias</Link>
          </div>
          <ul className="flex flex-wrap gap-2">
            {featuredCategories.map((category) => (
              <li key={category.databaseId}>
                <Link href={`/${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[#dfd3e9] bg-white px-4 py-2 text-sm font-semibold text-[#3c2b4a] transition hover:border-[#7c05f2] hover:bg-[#f8f1ff] hover:text-[#6504c6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c05f2]">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full lg:w-[23rem]">
          <BlogSearchForm compact />
        </div>
      </div>
    </section>
  );
}
