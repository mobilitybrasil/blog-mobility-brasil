import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/graphql/queries/categories";
import { STORE_URL } from "@/lib/site";
import { BagShoppingIcon, SearchIcon } from "./icons";
import { HeaderDesktopNav } from "./HeaderDesktopNav";
import { HeaderMobileMenu } from "./HeaderMobileMenu";

/**
 * Header global do site. Server Component — busca as categorias uma única
 * vez e injeta no nav desktop (com dropdown) e no drawer mobile.
 */
export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 bg-[color:var(--color-brand-black)] shadow-[0_4px_2px_rgba(0,0,0,0.1)]">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between gap-6 px-8 py-4">
          <Link href="/" aria-label="Mobility Brasil — Home" className="shrink-0">
            <Image
              src="/logo-mobility-white.svg"
              alt="Mobility Brasil"
              width={124}
              height={28}
              priority
            />
          </Link>

          <nav aria-label="Categorias" className="flex-1">
            <div className="flex justify-center">
              <HeaderDesktopNav categories={categories} />
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/buscar"
              aria-label="Buscar artigos no blog"
              className="flex items-center gap-2 py-2 text-[12px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-80"
            >
              <SearchIcon className="size-[18px]" />
              Buscar
            </Link>
            <a
              href={STORE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex w-[176px] items-center justify-center gap-2 rounded border border-white px-2 py-3 text-[14px] font-bold uppercase text-white transition-colors hover:bg-white/10"
            >
              Ir para loja
              <BagShoppingIcon className="size-[18px]" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-2 px-1.5 py-2">
          <div className="w-10 shrink-0">
            <HeaderMobileMenu categories={categories} />
          </div>

          <Link
            href="/"
            aria-label="Mobility Brasil — Home"
            className="flex items-center justify-center py-1"
          >
            <Image
              src="/logo-mobility-white.svg"
              alt="Mobility Brasil"
              width={116}
              height={26}
              priority
            />
          </Link>

          <div className="flex w-[120px] shrink-0 items-center justify-end gap-2">
            <Link
              href="/buscar"
              aria-label="Buscar artigos no blog"
              className="flex size-10 items-center justify-center text-white"
            >
              <SearchIcon className="size-5" />
            </Link>
            <a
              href={STORE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded border border-white px-2 py-3 text-[14px] font-bold uppercase text-white"
            >
              Loja
              <BagShoppingIcon className="size-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
