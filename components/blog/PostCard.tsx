import Image from "next/image";
import Link from "next/link";
import { formatDate, safeColor, stripHtml } from "@/lib/format";
import type { PostListItem } from "@/types/wordpress";

interface PostCardProps {
  post: PostListItem;
  /** Prioriza o carregamento da imagem (ex.: primeiro card visível). */
  priority?: boolean;
}

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const href = buildPostHref(post);
  const themeColor = safeColor(post.postSettings?.postThemeColor ?? null);
  const featured = post.featuredImage?.node;
  const category = post.categories?.nodes[0];

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      style={themeColor ? { borderTopColor: themeColor, borderTopWidth: 4 } : undefined}
    >
      <Link
        href={href}
        className="relative block aspect-[16/9] overflow-hidden bg-neutral-100"
      >
        {featured?.sourceUrl ? (
          <Image
            src={featured.sourceUrl}
            alt={featured.altText?.trim() || post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            Sem imagem
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {category && (
          <Link
            href={`/${category.slug}`}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
          >
            {category.name}
          </Link>
        )}

        <h3 className="text-lg font-semibold leading-snug text-neutral-900">
          <Link href={href} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="line-clamp-3 text-sm text-neutral-600">
            {stripHtml(post.excerpt)}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between text-xs text-neutral-500">
          <span>{post.author?.node?.name ?? "Autor desconhecido"}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </div>
    </article>
  );
}
