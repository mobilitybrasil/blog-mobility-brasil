"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AngleLeftIcon,
  AngleRightIcon,
  ArrowUpRightIcon,
} from "@/components/layout/icons";
import { formatDate, stripHtml } from "@/lib/format";
import type { PostListItem } from "@/types/wordpress";

interface RecentPostsProps {
  /** Posts já ordenados por data DESC. Serão consumidos até no máximo 9. */
  posts: PostListItem[];
}

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const DESKTOP_CARDS_PER_VIEW = 3;
const DESKTOP_GAP_PX = 24;
const DESKTOP_CARD_PERCENT = 100 / DESKTOP_CARDS_PER_VIEW;
const MAX_RECENT_POSTS = 9;

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

export function RecentPosts({ posts }: RecentPostsProps) {
  const slides = posts.slice(0, MAX_RECENT_POSTS);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [page, setPage] = useState(0);

  const cardsPerView = isDesktop ? DESKTOP_CARDS_PER_VIEW : 1;
  const pageCount = Math.max(1, Math.ceil(slides.length / cardsPerView));
  const maxPage = pageCount - 1;
  const currentPage = Math.min(page, maxPage);
  const maxSlideOffset = Math.max(0, slides.length - cardsPerView);
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

  if (slides.length === 0) return null;

  const desktopTransform = `translateX(calc(-${slideOffset * DESKTOP_CARD_PERCENT}% - ${slideOffset * DESKTOP_GAP_PX}px))`;
  const showNav = pageCount > 1;

  return (
    <section
      aria-labelledby="recent-posts-heading"
      className="flex flex-col gap-6 px-6"
    >
      <h2
        id="recent-posts-heading"
        className="font-display text-[18px] font-medium text-black lg:text-[20px]"
      >
        Mais recentes
      </h2>

      {/* Mobile: scroll-snap nativo, 1 card por vez */}
      <div
        ref={mobileScrollerRef}
        className="overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
        aria-roledescription="carousel"
      >
        <div className="flex w-full">
          {slides.map((post, index) => (
            <div
              key={`m-${post.databaseId}`}
              className="w-full shrink-0 snap-start"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}`}
            >
              <RecentPostCard post={post} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: track controlada via transform, 3 cards por página */}
      <div
        className="hidden overflow-hidden lg:block"
        aria-roledescription="carousel"
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: desktopTransform, gap: `${DESKTOP_GAP_PX}px` }}
        >
          {slides.map((post, index) => {
            const inView =
              index >= slideOffset && index < slideOffset + cardsPerView;
            return (
              <div
                key={`d-${post.databaseId}`}
                className="w-[calc((100%/3)-16px)] shrink-0"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${slides.length}`}
                aria-hidden={!inView}
              >
                <RecentPostCard post={post} />
              </div>
            );
          })}
        </div>
      </div>

      {showNav && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Slide anterior"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#e8e8e8] text-[#373435] disabled:opacity-40"
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
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#e8e8e8] text-[#373435] disabled:opacity-40"
          >
            <AngleRightIcon className="size-5" />
          </button>
        </div>
      )}
    </section>
  );
}

function RecentPostCard({ post }: { post: PostListItem }) {
  const href = buildPostHref(post);
  const image = post.featuredImage?.node;
  const category = post.categories?.nodes[0];
  const author = post.author?.node;
  const excerpt = stripHtml(post.excerpt);
  const name = author?.name ?? "Autor desconhecido";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[8px] border-[0.8px] border-[#f1f1f1] bg-white drop-shadow-[0_4px_3px_rgba(16,24,40,0.02)]">
      <Link href={href} className="relative block">
        <div className="relative aspect-[325/162] w-full overflow-hidden bg-neutral-100 lg:aspect-[420/218]">
          {image?.sourceUrl && (
            <Image
              src={image.sourceUrl}
              alt={image.altText ?? post.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        {category && (
          <span className="absolute left-2 top-3 inline-flex items-center rounded-[4px] bg-white px-2 py-1.5 text-[10px] leading-4 text-black">
            {category.name}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-5 p-[18px]">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <h3 className="flex-1 font-display text-[16px] font-medium leading-tight text-[#101828]">
                <Link href={href} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <ArrowUpRightIcon className="size-2 shrink-0 text-[#101828]" />
            </div>
            {excerpt && (
              <p className="line-clamp-2 text-[14px] leading-[24px] text-[#6B6D70]">
                {excerpt}
              </p>
            )}
          </div>
          <div className="h-px w-full bg-[#f1f1f1]" />
        </div>
        <div className="mt-auto flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-neutral-200">
            {author?.avatar?.url && (
              <Image
                src={author.avatar.url}
                alt={name}
                fill
                sizes="40px"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-[12px] font-medium leading-none text-[#101828]">
              {name}
            </span>
            <time
              dateTime={post.date}
              className="text-[10px] leading-none text-[#6B6D70]"
            >
              {formatDate(post.date)}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
}
