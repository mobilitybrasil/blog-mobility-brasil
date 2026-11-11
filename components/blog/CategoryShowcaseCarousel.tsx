"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AngleLeftIcon, AngleRightIcon } from "@/components/layout/icons";
import { WordPressImage } from "./WordPressImage";

export interface CategoryShowcaseItem {
  title: string;
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  href: string | null;
  buttonLabel: string;
}

interface CategoryShowcaseCarouselProps {
  items: CategoryShowcaseItem[];
}

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const DESKTOP_CARDS_PER_VIEW = 4;
const DESKTOP_GAP_PX = 32;
const DESKTOP_CARD_PERCENT = 100 / DESKTOP_CARDS_PER_VIEW;

export function CategoryShowcaseCarousel({
  items,
}: CategoryShowcaseCarouselProps) {
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [page, setPage] = useState(0);

  const cardsPerView = isDesktop ? DESKTOP_CARDS_PER_VIEW : 1;
  const pageCount = Math.max(1, Math.ceil(items.length / cardsPerView));
  const maxPage = pageCount - 1;
  const currentPage = Math.min(page, maxPage);
  const maxSlideOffset = Math.max(0, items.length - cardsPerView);
  const slideOffset = Math.min(currentPage * cardsPerView, maxSlideOffset);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    function handle() {
      setIsDesktop(mql.matches);
      setPage(0);
      const scroller = mobileScrollerRef.current;
      if (scroller) scroller.scrollLeft = 0;
    }
    handle();
    mql.addEventListener("change", handle);
    return () => mql.removeEventListener("change", handle);
  }, []);

  // Mobile only: keep `page` in sync com a posição do scroll nativo.
  useEffect(() => {
    if (isDesktop) return;
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;
    const track = scroller.firstElementChild as HTMLElement | null;
    if (!track) return;

    function handleScroll() {
      if (!scroller || !track) return;
      const children = Array.from(track.children) as HTMLElement[];
      const left = scroller.scrollLeft;
      let closest = 0;
      let min = Infinity;
      children.forEach((child, idx) => {
        const d = Math.abs(child.offsetLeft - left);
        if (d < min) {
          min = d;
          closest = idx;
        }
      });
      setPage(closest);
    }

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  function goToPage(nextPage: number) {
    const clamped = Math.max(0, Math.min(nextPage, maxPage));
    setPage(clamped);
    if (isDesktop) return;
    const scroller = mobileScrollerRef.current;
    const track = scroller?.firstElementChild as HTMLElement | null;
    const slide = track?.children[clamped] as HTMLElement | undefined;
    if (!scroller || !slide) return;
    scroller.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  const desktopTransform = `translateX(calc(-${slideOffset * DESKTOP_CARD_PERCENT}% - ${slideOffset * DESKTOP_GAP_PX}px))`;

  return (
    <div className="flex flex-col gap-8">
      {/* Mobile: scroll-snap nativo, 1 card por vez */}
      <div
        ref={mobileScrollerRef}
        className="overflow-x-auto snap-x snap-mandatory scrollbar-none lg:hidden [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        <div className="flex w-full">
          {items.map((item, index) => (
            <div
              key={`m-${item.title}-${index}`}
              className="w-full shrink-0 snap-start"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${items.length}`}
            >
              <CategoryCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: track controlada via transform, 4 cards por página */}
      <div
        className="hidden overflow-hidden lg:block"
        aria-roledescription="carousel"
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: desktopTransform, gap: `${DESKTOP_GAP_PX}px` }}
        >
          {items.map((item, index) => {
            const inView =
              index >= slideOffset && index < slideOffset + cardsPerView;
            return (
              <div
                key={`d-${item.title}-${index}`}
                className="w-[calc(25%-24px)] shrink-0"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${items.length}`}
                aria-hidden={!inView}
              >
                <CategoryCard item={item} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Slide anterior"
          className="flex size-9 items-center cursor-pointer justify-center rounded-full bg-[#f1f1f1] text-[#373435] disabled:opacity-40"
        >
          <AngleLeftIcon className="size-5" />
        </button>

        <div className="flex items-center gap-2" role="tablist">
          {Array.from({ length: pageCount }).map((_, index) => {
            const isActive = index === currentPage;
            return (
              <button
                key={`dot-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Ir para página ${index + 1}`}
                onClick={() => goToPage(index)}
                className={
                  isActive
                    ? "h-2 w-8 rounded-full bg-black transition-all"
                    : "size-2 cursor-pointer rounded-full bg-[#d4d4d4] transition-all"
                }
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= maxPage}
          aria-label="Próximo slide"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#f1f1f1] text-[#373435] disabled:opacity-40"
        >
          <AngleRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

function CategoryCard({ item }: { item: CategoryShowcaseItem }) {
  const card = (
    <article className="flex h-[353px] flex-col items-center rounded-[8px] border border-[rgba(187,187,187,0.3)] bg-[#f5f5f7] px-6 pb-5 pt-6 text-center">
      <h3 className="font-display text-[16px] font-medium leading-[1.2] text-black">
        {item.title}
      </h3>

      <div className="relative mt-[14px] h-[218px] w-[245px] max-w-full">
        {item.src ? (
          <WordPressImage
            src={item.src}
            srcSet={item.srcSet}
            alt={item.alt || item.title}
            fill
            sizes={
              item.sizes ??
              "(min-width: 1024px) 297px, (min-width: 640px) 50vw, 260px"
            }
            className="object-contain"
          />
        ) : (
          <div className="h-full w-full rounded-md bg-neutral-200" />
        )}
      </div>

      <span className="mt-[18px] inline-flex items-center gap-2 rounded-[4px] border border-black bg-black px-3.5 py-2 font-display text-[16px] font-medium text-white">
        {item.buttonLabel}
        <AngleRightIcon className="size-4" />
      </span>
    </article>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {card}
      </Link>
    );
  }
  return card;
}
