import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getMediumPosts, getTistoryPosts } from "@/services/rss-service";
import { getBlogLink } from "@/utils/links";
import { formatFullDate } from "@/utils/date-util";

export const revalidate = 3600;

const BlogPage = async () => {
  const locale = await getLocale();
  const t = await getTranslations("Blog");

  const posts = locale === "en" ? await getMediumPosts() : await getTistoryPosts();
  const blogLink = getBlogLink(locale);

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl text-zinc-100 font-mono font-bold inline-flex items-center gap-2">
          {t("title")}
        </h1>

        <p className="mt-3 mb-10 text-base text-zinc-400 font-mono">
          {t("description")}{" "}
          <Link
            href={blogLink}
            target="_blank"
            className="underline underline-offset-4 text-purple-300 hover:text-purple-500 transition-colors duration-200"
          >
            {t("guide")}
          </Link>
        </p>

        <div className="grid gap-10">
          {posts.map((post, idx) => (
            <Link key={idx} href={post.link} target="_blank" className="block">
              <div className="bg-zinc-100 border-2 border-zinc-300 rounded-lg shadow-sm transition-all duration-200 hover:border-zinc-100 hover:bg-cyan-100 hover:scale-105">
                <div className="mx-3 mb-0 border-b border-slate-300 pt-3 pb-2 px-1">
                  <span className="px-2 py-1 text-sm font-medium bg-purple-200">
                    {formatFullDate(post.pubDate, locale)}
                  </span>
                </div>

                {post.thumbnail ? (
                  <div className="relative w-full h-0 pb-[56.25%]">
                    <img
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                      src={post.thumbnail}
                      alt={post.title}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-0 pb-[56.25%] bg-black flex items-center justify-center rounded-t-lg">
                    <h5 className="text-white text-2xl font-bold text-center absolute inset-0 flex items-center justify-center">
                      {post.title}
                    </h5>
                  </div>
                )}

                <div className="p-5">
                  <h5 className="mb-1 text-2xl font-bold tracking-tight">
                    {post.title}
                  </h5>
                  {post.subtitle && (
                    <p className="mb-1 font-normal">{post.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {posts.length === 5 && (
            <div className="text-center mt-12 mb-6">
              <Link
                href={blogLink}
                target="_blank"
                className="text-2xl text-zinc-100 font-mono bg-black rounded-lg px-20 py-4 transition-all duration-200 hover:bg-purple-200 hover:text-black"
              >
                {t("more")} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
