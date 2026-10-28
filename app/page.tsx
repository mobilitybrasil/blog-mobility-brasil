import { BlogHero } from "@/components/blog/BlogHero";
import { CategoryDirectory } from "@/components/blog/CategoryDirectory";
import { LatestNews } from "@/components/blog/LatestNews";
import { RecentPosts } from "@/components/blog/RecentPosts";
import { JsonLd } from "@/components/seo/JsonLd";
import { VideoShowcase } from "@/components/blog/VideoShowcase";
import { getCategories } from "@/lib/graphql/queries/categories";
import { getPageByUri } from "@/lib/graphql/queries/pages";
import { getPosts } from "@/lib/graphql/queries/posts";
import { buildBlogHomeJsonLd } from "@/lib/structuredData";
import { COMPONENTS_HOME_URI } from "@/components/blog/CategoryShowcase";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, posts, showcasePage] = await Promise.all([
    getCategories(),
    getPosts({ first: 12 }),
    getPageByUri(COMPONENTS_HOME_URI),
  ]);

  const latestPosts = posts.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 py-12">
      <JsonLd data={buildBlogHomeJsonLd(posts)} />
      <BlogHero categories={categories} />

      {latestPosts.length > 0 && <LatestNews posts={latestPosts} />}

      <CategoryDirectory categories={categories} />

      <VideoShowcase page={showcasePage} />

      <RecentPosts posts={posts.slice(latestPosts.length)} />
    </div>
  );
}
