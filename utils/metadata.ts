import { Metadata } from "next";

const baseUrl = "https://yuni.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Yeonhee Kim | Software Engineer",
    template: "%s | Yeonhee Kim | Software Engineer",
  },
  description: "Building software with a love for cats and the cosmos",
  openGraph: {
    title: "Yeonhee Kim | Software Engineer",
    description: "Building software with a love for cats and the cosmos",
    url: baseUrl,
    siteName: "Yeonhee Kim | Software Engineer",
    images: [
      {
        url: "/images/thumbnail.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Yeonhee Kim | Software Engineer",
    card: "summary_large_image",
    images: ["/images/thumbnail.png"],
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
