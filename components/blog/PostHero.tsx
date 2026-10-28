import Image from "next/image";
import Link from "next/link";
import { AngleRightIcon } from "@/components/layout/icons";
import { formatDate, getReadingMinutes } from "@/lib/format";
import { STORE_URL } from "@/lib/site";
import { PostShareButton } from "./PostShareButton";

interface PostHeroProps {
  title: string;
  date: string;
  content: string;
  author: {
    name: string;
    avatarUrl: string | null;
  } | null;
  featuredImage: {
    sourceUrl: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
}

export function PostHero({
  title,
  date,
  content,
  author,
  featuredImage,
}: PostHeroProps) {
  const readingMinutes = getReadingMinutes(content);

  return (
    <section className="flex flex-col items-start gap-6 px-[18px] sm:px-[54px] sm:pt-[76px]">
      <nav
        aria-label="Breadcrumb"
        className="flex w-full max-w-full items-center gap-2 overflow-hidden whitespace-nowrap text-[14px] leading-normal"
      >
        <a
          href={STORE_URL}
          className="shrink-0 text-[#848688] transition-colors hover:text-[#373435]"
        >
          Home
        </a>
        <AngleRightIcon className="size-3 shrink-0 text-[#373435]" />
        <Link
          href="/"
          className="shrink-0 text-[#5e5e5e] transition-colors hover:text-[#373435]"
        >
          Blog da Mobility Brasil
        </Link>
        <AngleRightIcon className="size-3 shrink-0 text-[#373435]" />
        <span className="min-w-0 truncate text-[#373435]" title={title}>
          {title}
        </span>
      </nav>

      <h1 className="break-words text-[20px] font-medium leading-tight text-black font-display sm:text-[36px] sm:font-bold sm:font-sans">
        {title}
      </h1>

      <div className="flex w-full flex-col gap-[18px] sm:gap-3">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-1 sm:gap-3">
            {author?.avatarUrl && (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={36}
                height={36}
                className="size-8 shrink-0 rounded-full object-cover sm:size-9"
              />
            )}
            <div className="flex flex-col gap-1">
              {author?.name && (
                <p className="text-[12px] font-medium leading-none text-[#101828] sm:text-[14px]">
                  {author.name}
                </p>
              )}
              <p className="text-[10px] leading-none text-[#848688] sm:text-[12px]">
                {formatDate(date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[6px] sm:gap-[14px]">
            <span className="whitespace-nowrap text-[12px] text-black sm:text-[14px]">
              {readingMinutes} min de leitura
            </span>
            <span
              aria-hidden
              className="h-[23px] w-px bg-[#848688]/40"
            />
            <span className="sm:hidden">
              <PostShareButton title={title} size={28} iconSize={12} />
            </span>
            <span className="hidden sm:inline-flex">
              <PostShareButton title={title} size={34} iconSize={14} />
            </span>
          </div>
        </div>

        {featuredImage?.sourceUrl && (
          <div className="relative h-[230px] w-full overflow-hidden rounded-lg sm:h-[412px]">
            <Image
              src={featuredImage.sourceUrl}
              alt={featuredImage.altText?.trim() || title}
              fill
              priority
              sizes="(min-width: 1024px) calc(100vw - 108px), 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
import Image from "next/image";
import Link from "next/link";
import { AngleRightIcon } from "@/components/layout/icons";
import { formatDate, getReadingMinutes } from "@/lib/format";
import { STORE_URL } from "@/lib/site";
import { PostShareButton } from "./PostShareButton";

interface PostHeroProps {
  title: string;
  date: string;
  content: string;
  author: {
    name: string;
    avatarUrl: string | null;
  } | null;
  featuredImage: {
    sourceUrl: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
}

export function PostHero({
  title,
  date,
  content,
  author,
  featuredImage,
}: PostHeroProps) {
  const readingMinutes = getReadingMinutes(content);

  return (
    <section className="flex flex-col items-start gap-6 px-[18px] sm:px-[54px] sm:pt-[76px]">
      <nav
        aria-label="Breadcrumb"
        className="flex w-full max-w-full items-center gap-2 overflow-hidden whitespace-nowrap text-[14px] leading-normal"
      >
        <a
          href={STORE_URL}
          className="shrink-0 text-[#848688] transition-colors hover:text-[#373435]"
        >
          Home
        </a>
        <AngleRightIcon className="size-3 shrink-0 text-[#373435]" />
        <Link
          href="/"
          className="shrink-0 text-[#5e5e5e] transition-colors hover:text-[#373435]"
        >
          Blog da Mobility Brasil
        </Link>
        <AngleRightIcon className="size-3 shrink-0 text-[#373435]" />
        <span className="min-w-0 truncate text-[#373435]" title={title}>
          {title}
        </span>
      </nav>

      <h1 className="break-words text-[20px] font-medium leading-tight text-black font-display sm:text-[36px] sm:font-bold sm:font-sans">
        {title}
      </h1>

      <div className="flex w-full flex-col gap-[18px] sm:gap-3">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-1 sm:gap-3">
            {author?.avatarUrl && (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={36}
                height={36}
                className="size-8 shrink-0 rounded-full object-cover sm:size-9"
              />
            )}
            <div className="flex flex-col gap-1">
              {author?.name && (
                <p className="text-[12px] font-medium leading-none text-[#101828] sm:text-[14px]">
                  {author.name}
                </p>
              )}
              <p className="text-[10px] leading-none text-[#848688] sm:text-[12px]">
                {formatDate(date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[6px] sm:gap-[14px]">
            <span className="whitespace-nowrap text-[12px] text-black sm:text-[14px]">
              {readingMinutes} min de leitura
            </span>
            <span
              aria-hidden
              className="h-[23px] w-px bg-[#848688]/40"
            />
            <span className="sm:hidden">
              <PostShareButton title={title} size={28} iconSize={12} />
            </span>
            <span className="hidden sm:inline-flex">
              <PostShareButton title={title} size={34} iconSize={14} />
            </span>
          </div>
        </div>

        {featuredImage?.sourceUrl && (
          <div className="relative h-[230px] w-full overflow-hidden rounded-lg sm:h-[412px]">
            <Image
              src={featuredImage.sourceUrl}
              alt={featuredImage.altText ?? title}
              fill
              priority
              sizes="(min-width: 1024px) calc(100vw - 108px), 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
