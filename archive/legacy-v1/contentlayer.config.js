import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  locale: {
    type: "string",
    resolve: (doc) => {
      const parts = doc._raw.sourceFilePath.split("/");
      return parts[1];
    }
  },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
  }
};

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "**/projects/**/*.mdx",
  contentType: "mdx",

  fields: {
    published: {
      type: "boolean",
      required: true,
    },
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    thumbnail: {
      type: "string",
    },
    weight : {
      type: "number",
      required: true,
    },
    startDate: {
      type: "date",
      required: true,
    },
    endDate: {
      type: "date",
    },
    url: {
      type: "string",
    },
    demo: {
      type: "string",
    },
    presentation: {
      type: "string",
    },
    repository: {
      type: "string",
    },
    tags: {
      type: "list",
      of: { type: "string" },
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
