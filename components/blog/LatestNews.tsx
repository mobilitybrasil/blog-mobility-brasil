import Image from "next/image";
import Link from "next/link";
import { formatDate, stripHtml } from "@/lib/format";
import type { PostListItem } from "@/types/wordpress";
import { LatestNewsMobileCarousel } from "./LatestNewsMobileCarousel";
import { NewsletterCard } from "./NewsletterCard";
import { SecondaryNewsCard } from "./SecondaryNewsCard";

interface LatestNewsProps {
  /**
   * Posts mais recentes em ordem decrescente. Desktop usa `posts[0]` como
   * destaque e `posts[1]` no card lateral. Mobile usa todos como slides do
   * carrossel.
   */
  posts: PostListItem[];
}

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

function FeaturedNewsCard({ post }: { post: PostListItem }) {
  const href = buildPostHref(post);
  const image = post.featuredImage?.node;
  const excerpt = stripHtml(post.excerpt);
  const author = post.author?.node;
  const name = author?.name ?? "Autor desconhecido";

  return (
    <article className="flex flex-col gap-5">
      <Link
        href={href}
        className="relative block aspect-[870/366] overflow-hidden rounded-[8px] bg-neutral-100"
      >
        {image?.sourceUrl && (
          <Image
            src={image.sourceUrl}
            alt={image.altText?.trim() || post.title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            priority
          />
        )}
      </Link>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-[18px] font-medium leading-tight text-[#101828]">
              <Link href={href} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            {excerpt && (
              <p className="line-clamp-2 text-[14px] leading-[24px] text-[#6B6D70]">
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

export function LatestNews({ posts }: LatestNewsProps) {
  if (posts.length === 0) return null;

  const featured = posts[0];
  const secondary = posts[1] ?? null;

  return (
    <section
      aria-labelledby="latest-news-heading"
      className="flex flex-col gap-4 px-6 lg:gap-6"
    >
      <h2
        id="latest-news-heading"
        className="font-display text-[18px] font-medium text-black lg:text-[20px]"
      >
        Leia nossas notícias mais recentes
      </h2>

      {/* Mobile: carrossel + newsletter empilhada */}
      <div className="flex flex-col gap-4 lg:hidden">
        <LatestNewsMobileCarousel posts={posts} />
        <NewsletterCard />
      </div>

      {/* Desktop: card grande + sidebar (secondary + newsletter) */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_452px] lg:items-start">
        <FeaturedNewsCard post={featured} />
        <aside className="flex flex-col gap-3 lg:pl-[18px] lg:pr-[32px]">
          {secondary && <SecondaryNewsCard post={secondary} />}
          <NewsletterCard />
        </aside>
      </div>
    </section>
  );
}
import Image from "next/image";
import Link from "next/link";
import { formatDate, stripHtml } from "@/lib/format";
import type { PostListItem } from "@/types/wordpress";
import { LatestNewsMobileCarousel } from "./LatestNewsMobileCarousel";
import { NewsletterCard } from "./NewsletterCard";
import { SecondaryNewsCard } from "./SecondaryNewsCard";

interface LatestNewsProps {
  /**
   * Posts mais recentes em ordem decrescente. Desktop usa `posts[0]` como
   * destaque e `posts[1]` no card lateral. Mobile usa todos como slides do
   * carrossel.
   */
  posts: PostListItem[];
}

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

function FeaturedNewsCard({ post }: { post: PostListItem }) {
  const href = buildPostHref(post);
  const image = post.featuredImage?.node;
  const excerpt = stripHtml(post.excerpt);
  const author = post.author?.node;
  const name = author?.name ?? "Autor desconhecido";

  return (
    <article className="flex flex-col gap-5">
      <Link
        href={href}
        className="relative block aspect-[870/366] overflow-hidden rounded-[8px] bg-neutral-100"
      >
        {image?.sourceUrl && (
          <Image
            src={image.sourceUrl}
            alt={image.altText ?? post.title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            priority
          />
        )}
      </Link>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-[18px] font-medium leading-tight text-[#101828]">
              <Link href={href} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            {excerpt && (
              <p className="line-clamp-2 text-[14px] leading-[24px] text-[#6B6D70]">
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

export function LatestNews({ posts }: LatestNewsProps) {
  if (posts.length === 0) return null;

  const featured = posts[0];
  const secondary = posts[1] ?? null;

  return (
    <section
      aria-labelledby="latest-news-heading"
      className="flex flex-col gap-4 px-6 lg:gap-6"
    >
      <h2
        id="latest-news-heading"
        className="font-display text-[18px] font-medium text-black lg:text-[20px]"
      >
        Leia nossas notícias mais recentes
      </h2>

      {/* Mobile: carrossel + newsletter empilhada */}
      <div className="flex flex-col gap-4 lg:hidden">
        <LatestNewsMobileCarousel posts={posts} />
        <NewsletterCard />
      </div>

      {/* Desktop: card grande + sidebar (secondary + newsletter) */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_452px] lg:items-start">
        <FeaturedNewsCard post={featured} />
        <aside className="flex flex-col gap-3 lg:pl-[18px] lg:pr-[32px]">
          {secondary && <SecondaryNewsCard post={secondary} />}
          <NewsletterCard />
        </aside>
      </div>
    </section>
  );
}
