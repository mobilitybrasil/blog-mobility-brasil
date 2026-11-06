"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AngleLeftIcon, AngleRightIcon } from "@/components/layout/icons";
import { formatDate, stripHtml } from "@/lib/format";
import type { PostListItem } from "@/types/wordpress";

interface LatestNewsProps {
  posts: PostListItem[];
}

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

export function LatestNews({ posts }: LatestNewsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (posts.length === 0) return null;

  const activePost = posts[activeIndex];
  const image = activePost.featuredImage?.node;
  const category = activePost.categories?.nodes[0];
  const excerpt = stripHtml(activePost.excerpt);

  function goTo(index: number) {
    setActiveIndex(Math.max(0, Math.min(index, posts.length - 1)));
  }

  return (
    <section aria-labelledby="latest-news-heading" className="px-4 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6504c6] sm:text-xs">
            Publicações recentes
          </p>
          <h2
            id="latest-news-heading"
            className="mt-1 font-display text-xl font-bold tracking-tight text-[#21162c] sm:text-2xl"
          >
            Em destaque
          </h2>
        </div>
        {posts.length > 1 && (
          <span className="pb-1 font-display text-xs font-semibold tabular-nums text-[#65596c] sm:text-sm">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="px-1.5 text-[#b9a9c7]">/</span>
            {String(posts.length).padStart(2, "0")}
          </span>
        )}
      </div>

      <article
        key={activePost.databaseId}
        className="mobility-featured-article relative isolate grid grid-cols-1 overflow-hidden rounded-2xl bg-[#24142f] text-white shadow-[0_18px_48px_rgba(39,19,54,0.17)] sm:rounded-3xl lg:min-h-[35rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
        aria-live="polite"
        aria-roledescription="slide"
        aria-label={`Artigo ${activeIndex + 1} de ${posts.length}`}
      >
        <div className="relative order-1 min-h-[14rem] bg-[linear-gradient(125deg,#2b1738,#7c05f2)] sm:min-h-[18rem] lg:order-2 lg:min-h-[35rem]">
          {image?.sourceUrl && (
            <Image
              src={image.sourceUrl}
              alt={image.altText?.trim() || activePost.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 1023px) 100vw, 576px"
              className="object-cover object-[78%_center]"
            />
          )}
        </div>

        <div className="order-2 flex flex-col justify-center bg-[#24142f] p-6 pb-24 sm:p-10 sm:pb-28 lg:order-1 lg:p-12 lg:pb-28">
          <div className="flex items-center gap-3 text-[11px] font-semibold text-white/80 sm:text-sm">
            {category && (
              <span className="rounded-full border border-white/35 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                {category.name}
              </span>
            )}
            <time dateTime={activePost.date}>{formatDate(activePost.date)}</time>
          </div>
          <div className="mt-5 max-w-3xl" aria-live="polite" aria-atomic="true">
            <h3 className="font-display text-[2rem] font-bold leading-[1.04] tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem]">
              <Link
                href={buildPostHref(activePost)}
                className="rounded-sm decoration-white/60 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {activePost.title}
              </Link>
            </h3>
            {excerpt && (
              <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-6 text-white/80 sm:mt-5 sm:text-base sm:leading-7">
                {excerpt}
              </p>
            )}
          </div>
          <Link
            href={buildPostHref(activePost)}
            className="mt-6 inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#24142f] transition hover:-translate-y-0.5 hover:bg-[#f2e8ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Ler artigo <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {posts.length > 1 && (
          <div className="absolute bottom-5 right-5 flex items-center gap-2.5 rounded-full border border-white/20 bg-[#17101f]/45 p-1.5 backdrop-blur-md sm:bottom-7 sm:right-8 sm:gap-3 sm:p-2">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Ver artigo anterior"
              className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 sm:size-11"
            >
              <AngleLeftIcon className="size-5" />
            </button>
            <div className="flex items-center gap-1.5" role="group" aria-label="Escolher artigo em destaque">
              {posts.map((post, index) => (
                <button
                  key={post.databaseId}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Mostrar artigo ${index + 1}: ${post.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={`rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${index === activeIndex ? "h-2 w-7 bg-white" : "size-2 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === posts.length - 1}
              aria-label="Ver próximo artigo"
              className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 sm:size-11"
            >
              <AngleRightIcon className="size-5" />
            </button>
          </div>
        )}
      </article>
    </section>
  );
}
