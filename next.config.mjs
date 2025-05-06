import { withContentlayer } from "next-contentlayer";

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

export default withContentlayer(nextConfig);
