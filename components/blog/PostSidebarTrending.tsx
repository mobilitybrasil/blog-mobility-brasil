import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/layout/icons";
import { formatDate, stripHtml } from "@/lib/format";
import type { PostListItem } from "@/types/wordpress";

interface PostSidebarTrendingProps {
  posts: PostListItem[];
}

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

/**
 * "Artigos em alta" — lista compacta na sidebar do post. Diferente dos
 * cards do carrossel "Mais recentes": sem imagem destacada, só
 * cabeçalho/excerpt/autor.
 */
export function PostSidebarTrending({ posts }: PostSidebarTrendingProps) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="sidebar-trending-heading"
      className="flex flex-col gap-7 rounded-[8px] border border-[rgba(132,134,136,0.3)] bg-white px-5 py-[21px] shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.02)]"
    >
      <h2
        id="sidebar-trending-heading"
        className="font-display text-[20px] font-medium text-black"
      >
        Artigos em alta
      </h2>

      <ul className="flex flex-col gap-5">
        {posts.map((post) => (
          <li key={post.databaseId}>
            <TrendingPostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TrendingPostCard({ post }: { post: PostListItem }) {
  const href = buildPostHref(post);
  const category = post.categories?.nodes[0];
  const author = post.author?.node;
  const excerpt = stripHtml(post.excerpt);
  const name = author?.name ?? "Autor desconhecido";

  return (
    <article className="flex flex-col gap-5 rounded-[8px] border-[0.8px] border-[#f1f1f1] bg-white p-[18px] drop-shadow-[0_4px_3px_rgba(16,24,40,0.02)]">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <h3 className="flex-1 font-display text-[16px] font-medium leading-tight text-[#101828]">
              <Link href={href} className="hover:underline">
                {category?.name ?? post.title}
              </Link>
            </h3>
            <Link
              href={href}
              aria-label={`Abrir ${post.title}`}
              className="shrink-0 text-[#101828]"
            >
              <ArrowUpRightIcon className="size-2" />
            </Link>
          </div>
          <p className="line-clamp-2 text-[14px] leading-6 text-[#6B6D70]">
            {excerpt || post.title}
          </p>
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
    </article>
  );
}
