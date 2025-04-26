import Link from "next/link";
import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { socialInfo } from "@/constants/social-info";

type Post = {
  title: string;
  link: string;
  subtitle: string;
  pubDate: string;
  thumbnail: string;
};

const getPosts = async (): Promise<Post[]> => {
  const parser = new Parser();
  const feed = await parser.parseURL(socialInfo.medium.rss);

  return (
    feed.items?.slice(0, 5).map((item) => {
      const contentHtml = item["content:encoded"] ?? "";
      const dom = new JSDOM(contentHtml);
      const subtitle = dom.window.document.querySelector("h4")?.textContent;
      const thumbnail = dom.window.document.querySelector("img")?.src;

      return {
        title: item.title ?? "",
        link: item.link ?? "",
        subtitle: subtitle ?? "",
        pubDate: item.pubDate ?? "",
        thumbnail: thumbnail ?? "",
      };
    }) || []
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BlogPage = async () => {
  const posts = await getPosts();

  return (
    <div className="p-6">
      <h1 className="text-3xl text-zinc-100 font-mono font-bold inline-flex items-center gap-2">
        Latest Blog Posts
      </h1>

      <p className="max-w-3xl mt-2 mb-10 text-base text-zinc-400 font-mono items-center gap-2">
        Discover my recent technical insights and tutorials, featuring the five
        latest posts from{" "}
        <a
          href={socialInfo.medium.link}
          target="_blank"
          className="underline underline-offset-4 hover:text-white transition-colors duration-200"
        >
          my blog
        </a>
        .
      </p>

      <div className="max-w-3xl">
        {posts.map((post, idx) => (
          <Link key={idx} href={post.link} target="_blank" className="block">
            <div className="mb-10 bg-zinc-100 border-2 border-zinc-300 rounded-lg shadow-sm transition-all duration-200 hover:border-zinc-100 hover:bg-cyan-100 hover:scale-105">
              <div className="mx-3 mb-0 border-b border-slate-300 pt-3 pb-2 px-1">
                <span className="px-2 py-1 text-sm font-medium bg-purple-200">
                  {formatDate(post.pubDate)}
                </span>
              </div>
              <img className="mt-3 px-3 rounded-t-lg" src={post.thumbnail} />
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight">
                  {post.title}
                </h5>
                <p className="mb-3 font-normal">{post.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}

        {posts.length === 5 && (
          <div className="mt-12 mb-6 text-center">
            <a
              href={socialInfo.medium.link}
              target="_blank"
              className="text-2xl text-zinc-100 font-mono bg-black rounded-lg px-20 py-4 transition-all duration-200 hover:bg-purple-200 hover:text-black"
            >
              See more →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
