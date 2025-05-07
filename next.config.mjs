import { withContentlayer } from "next-contentlayer";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    minimumCacheTTL: 2592000,
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(
  withContentlayer(nextConfig)
);
