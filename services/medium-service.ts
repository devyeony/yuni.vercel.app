import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { Post } from "@/types/post";
import { socialInfo } from "@/constants/social-info";

export const getMediumPosts = async (limit = 5): Promise<Post[]> => {
  const parser = new Parser();
  const feed = await parser.parseURL(socialInfo.medium.rss);

  return (
    feed.items?.slice(0, limit).map((item) => {
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