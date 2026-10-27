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

interface PostSidebarRecentProps {
  posts: PostListItem[];
}

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

/**
 * Carrossel vertical com 1 card por vez — sidebar de "Mais recentes" na
 * página de post. Difere do `RecentPosts` (3 por vez horizontal) usado
 * na home.
 */
export function PostSidebarRecent({ posts }: PostSidebarRecentProps) {
  const slides = posts;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
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
  }, []);

  function goToPage(nextPage: number) {
    const clamped = Math.max(0, Math.min(nextPage, slides.length - 1));
    setPage(clamped);
    const scroller = scrollerRef.current;
    const track = scroller?.firstElementChild as HTMLElement | null;
    const slide = track?.children[clamped] as HTMLElement | undefined;
    if (!scroller || !slide) return;
    scroller.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }

  if (slides.length === 0) return null;

  return (
    <section
      aria-labelledby="sidebar-recent-heading"
      className="flex flex-col gap-[18px]"
    >
      <h2
        id="sidebar-recent-heading"
        className="font-display text-[20px] font-medium text-black"
      >
        Mais recentes
      </h2>

      <div
        ref={scrollerRef}
        className="overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        <div className="flex w-full">
          {slides.map((post, index) => (
            <div
              key={post.databaseId}
              className="w-full shrink-0 snap-start"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}`}
            >
              <SidebarRecentCard post={post} />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            aria-label="Slide anterior"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#e8e8e8] text-[#373435] disabled:opacity-40"
          >
            <AngleLeftIcon className="size-5" />
          </button>

          <div className="flex items-center gap-2" role="tablist">
            {slides.map((post, index) => {
              const isActive = index === page;
              return (
                <button
                  key={`dot-${post.databaseId}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Ir para slide ${index + 1}`}
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
            onClick={() => goToPage(page + 1)}
            disabled={page >= slides.length - 1}
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

function SidebarRecentCard({ post }: { post: PostListItem }) {
  const href = buildPostHref(post);
  const image = post.featuredImage?.node;
  const category = post.categories?.nodes[0];
  const author = post.author?.node;
  const excerpt = stripHtml(post.excerpt);
  const name = author?.name ?? "Autor desconhecido";

  return (
    <article className="flex flex-col overflow-hidden rounded-[8px] border-[0.8px] border-[#f1f1f1] bg-white drop-shadow-[0_4px_3px_rgba(16,24,40,0.02)]">
      <Link href={href} className="relative block">
        <div className="relative aspect-[362/162] w-full overflow-hidden bg-neutral-100">
          {image?.sourceUrl && (
            <Image
              src={image.sourceUrl}
              alt={image.altText ?? post.title}
              fill
              sizes="378px"
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

      <div className="flex flex-col gap-5 p-[18px]">
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
              <p className="line-clamp-2 text-[14px] leading-6 text-[#6B6D70]">
                {excerpt}
              </p>
            )}
          </div>
          <div className="h-px w-full bg-[#f1f1f1]" />
        </div>
        <div className="flex items-center gap-3">
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
