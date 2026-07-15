import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { Post } from "@/types/post";
import { contactInfo } from "@/constants/contact-info";

const getRssFeed = async (rssUrl: string) => {
  const parser = new Parser({ 
    headers: { 
      Accept: 'application/rss+xml, application/xml, text/xml; q=0.1' 
    } 
  });
  const feed = await parser.parseURL(rssUrl);
  return feed;
};

export const getMediumPosts = async (limit = 5): Promise<Post[]> => {
  const feed = await getRssFeed(contactInfo.medium.rss);
  
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

export const getTistoryPosts = async (limit = 5): Promise<Post[]> => {
  const feed = await getRssFeed(contactInfo.tistory.rss);

  const filteredItems = feed.items?.filter((item) => {
    const pubDate = item.pubDate ? new Date(item.pubDate) : null;
    return pubDate && pubDate >= new Date("2025-01-01T00:00:00Z");
  }) || [];

  return (
    filteredItems.slice(0, limit).map((item) => {
    const dom = new JSDOM(item.content);
    const imgElement = dom.window.document.querySelector("img");
    const thumbnail = imgElement ? imgElement.src : "";

    return {
      title: item.title ?? "",
      link: item.link ?? "",
      subtitle: "",
      pubDate: item.pubDate ?? "",
      thumbnail: thumbnail ?? "",
    };
  }) || []
  );
};