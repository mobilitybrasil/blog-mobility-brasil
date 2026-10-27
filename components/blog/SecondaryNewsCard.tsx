import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/layout/icons";
import { formatDate, stripHtml } from "@/lib/format";
import type { PostListItem } from "@/types/wordpress";

interface SecondaryNewsCardProps {
  post: PostListItem;
}

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

/**
 * Card de notícia secundário — usado tanto na sidebar do bloco "Leia nossas
 * notícias mais recentes" (desktop) quanto como slide do carrossel mobile.
 * O aspect da imagem se adapta ao contexto via classes responsivas.
 */
export function SecondaryNewsCard({ post }: SecondaryNewsCardProps) {
  const href = buildPostHref(post);
  const image = post.featuredImage?.node;
  const category = post.categories?.nodes[0];
  const author = post.author?.node;
  const excerpt = stripHtml(post.excerpt);
  const name = author?.name ?? "Autor desconhecido";

  return (
    <article className="flex flex-col overflow-hidden rounded-[8px] border-[0.8px] border-[#f1f1f1] bg-white drop-shadow-[0_4px_3px_rgba(16,24,40,0.02)]">
      <Link href={href} className="block">
        <div className="relative aspect-[339/162] w-full overflow-hidden bg-neutral-100 lg:aspect-[402/137]">
          {image?.sourceUrl && (
            <Image
              src={image.sourceUrl}
              alt={image.altText ?? post.title}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover"
            />
          )}
          {category && (
            <span className="absolute left-2 top-3 inline-flex items-center rounded-[4px] border border-white bg-white px-2 py-1.5 text-[10px] leading-4 text-black">
              {category.name}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-5 px-[18px] py-[18px] lg:gap-3 lg:py-3">
        <div className="flex flex-col gap-4 lg:gap-2.5">
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
