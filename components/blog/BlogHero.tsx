import Link from "next/link";
import { ABOUT_URL, STORE_URL } from "@/lib/site";
import { MessageCaptionsIcon } from "@/components/layout/icons";
import type { Category } from "@/types/wordpress";
import { BlogHeroCategoryMenu } from "./BlogHeroCategoryMenu";
import { BlogSearchForm } from "./BlogSearchForm";

interface BlogHeroProps {
  categories: Category[];
}

const actionButtonClass =
  "flex items-center justify-center rounded-[4px] border-[0.5px] border-[rgba(132,134,136,0.3)] bg-white px-2 py-3 text-[16px] font-medium text-black transition-colors hover:bg-neutral-50 sm:px-4";

export function BlogHero({ categories }: BlogHeroProps) {
  return (
    <section className="flex flex-col gap-[34px] px-[18px] sm:gap-4 sm:px-6">
      <div className="flex flex-col gap-[34px] sm:gap-5">
        <span className="inline-flex w-fit items-center gap-1 rounded-[4px] bg-black/6 px-3 py-1.5 text-[12px] leading-4 text-[#373435] sm:px-4 sm:py-2 sm:text-[16px]">
          <MessageCaptionsIcon className="size-3 sm:size-4" />
          Blog &amp; Artigos
        </span>

        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-[18px] font-medium leading-tight text-black sm:text-2xl">
            Blog da Mobility Brasil
          </h1>
          <p className="text-[14px] leading-[17px] text-[#373435] sm:text-lg sm:leading-normal">
            Explore nossos artigos e fique por dentro das novidades, dicas e
            análises exclusivas.
          </p>
        </div>
      </div>

      <div className="flex items-stretch justify-between gap-2 sm:justify-start sm:gap-[11px]">
        <Link href="#latest-heading" className={actionButtonClass}>
          Ler todos
        </Link>
        <a
          href={STORE_URL}
          target="_blank"
          rel="noreferrer"
          className={actionButtonClass}
        >
          Loja
        </a>
        <a
          href={ABOUT_URL}
          target="_blank"
          rel="noreferrer"
          className={actionButtonClass}
        >
          Sobre
        </a>
        <BlogHeroCategoryMenu categories={categories} />
      </div>

      <BlogSearchForm />
    </section>
  );
}
