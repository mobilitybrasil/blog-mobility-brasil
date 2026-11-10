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

const authoredFeatureImages: Record<string, string> = {
  "cadeira-de-rodas-de-banho-com-rodas-grandes-ou-pequenas-o-que-considerar-no-banheiro":
    "/images/brand/mobility-evo-bath.jpg",
  "preco-cadeira-de-rodas-sob-medida": "/images/brand/mobility-x1.jpg",
};

export function LatestNews({ posts }: LatestNewsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (posts.length === 0) return null;

  const activePost = posts[activeIndex];
  const image = activePost.featuredImage?.node;
  const authoredImage = authoredFeatureImages[activePost.slug];
  const imageSource = authoredImage ?? image?.sourceUrl;
  const category = activePost.categories?.nodes[0];
  const excerpt = stripHtml(activePost.excerpt);

  function goTo(index: number) {
    setActiveIndex(Math.max(0, Math.min(index, posts.length - 1)));
  }

  return (
    <section aria-labelledby="latest-news-heading" className="px-4 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5f5d59] sm:text-xs">
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
            <span className="px-1.5 text-[#aaa7a1]">/</span>
            {String(posts.length).padStart(2, "0")}
          </span>
        )}
      </div>

      <article
        key={activePost.databaseId}
        className="mobility-featured-article group relative isolate min-h-[32rem] overflow-hidden rounded-2xl border border-[#e4e2de] bg-[#f1f0ec] text-[#171717] shadow-[0_16px_42px_rgba(20,20,20,0.1)] sm:min-h-[36rem] sm:rounded-3xl lg:min-h-[34rem]"
        aria-live="polite"
        aria-roledescription="slide"
        aria-label={`Artigo ${activeIndex + 1} de ${posts.length}`}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#f1f0ec]">
          {imageSource && (
            <Image
              src={imageSource}
              alt=""
              fill
              preload={activeIndex === 0}
              unoptimized
              sizes="100vw"
              className={`mobility-featured-image ${authoredImage ? "mobility-featured-image--product object-cover object-[center_38%] sm:object-contain sm:object-right" : "mobility-featured-image--editorial object-cover object-[82%_center]"}`}
            />
          )}
        </div>

        <div className="absolute inset-x-4 bottom-4 z-10 flex flex-col rounded-xl border border-[#e8e6e2] bg-white/95 p-5 shadow-[0_8px_28px_rgba(0,0,0,0.1)] backdrop-blur-md sm:inset-x-auto sm:bottom-7 sm:left-0 sm:w-[min(76%,40rem)] sm:p-8 lg:bottom-12 lg:left-0 lg:p-9">
          <div className="mobility-featured-copy flex flex-col">
            <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#66635f] sm:text-xs">
              {category && <span>{category.name}</span>}
              {category && <span aria-hidden="true">·</span>}
              <time dateTime={activePost.date}>{formatDate(activePost.date)}</time>
            </div>
            <div className="mt-3 max-w-3xl" aria-live="polite" aria-atomic="true">
              <h3 className="font-display text-[1.55rem] font-bold leading-[1.08] tracking-[-0.035em] text-[#171717] sm:text-4xl lg:text-[2.65rem]">
                <Link
                  href={buildPostHref(activePost)}
                  className="rounded-sm decoration-[#171717]/50 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
                >
                  {activePost.title}
                </Link>
              </h3>
              {excerpt && (
                <p className="mt-3 hidden line-clamp-2 max-w-2xl text-sm leading-6 text-[#5e5b57] sm:mt-4 sm:block sm:text-base sm:leading-7">
                  {excerpt}
                </p>
              )}
            </div>
            <Link
              href={buildPostHref(activePost)}
              className="mt-4 inline-flex min-h-10 w-fit items-center gap-2 border-b border-[#171717] pb-1 text-sm font-bold text-[#171717] transition-colors hover:border-[#5d5a54] hover:text-[#5d5a54] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] sm:mt-5"
            >
              Ler artigo <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">↗</span>
            </Link>
          </div>
        </div>

        {posts.length > 1 && (
          <div className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-full border border-black/10 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm sm:right-8 sm:top-8 sm:gap-3 sm:p-2">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Ver artigo anterior"
              className="flex size-9 items-center justify-center rounded-full text-[#242321] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#171717] disabled:cursor-not-allowed disabled:opacity-35 sm:size-10"
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
                  className={`rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${index === activeIndex ? "h-2 w-7 bg-[#171717]" : "size-2 bg-[#b7b4af] hover:bg-[#77736d]"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === posts.length - 1}
              aria-label="Ver próximo artigo"
              className="flex size-9 items-center justify-center rounded-full text-[#242321] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#171717] disabled:cursor-not-allowed disabled:opacity-35 sm:size-10"
            >
              <AngleRightIcon className="size-5" />
            </button>
          </div>
        )}
      </article>
    </section>
  );
}
