import "@/styles/global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import SpaceBackground from "@/components/space-background";

export const metadata: Metadata = {
  title: {
    default: "Yeonhee Kim | Software Engineer",
    template: "%s | Yeonhee Kim | Software Engineer",
  },
  description: "Building software with a love for cats and the cosmos",
  openGraph: {
    title: "Yeonhee Kim | Software Engineer",
    description: "Building software with a love for cats and the cosmos",
    url: "devyeony.github.io",
    siteName: "Yeonhee Kim | Software Engineer",
    images: [
      {
        url: "https://yuni.vercel.app/images/thumbnail.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
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
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
      </head>
      <body>
        <SpaceBackground
          className="fixed inset-0 -z-10 min-h-screen"
          quantity={100}
        />
        <div className="flex flex-col min-h-screen">  
          <Header className="my-10" />
          <main className="flex-grow flex flex-col items-center justify-center">
            {children}
          </main>
          <Footer className="my-6" />
        </div>
      </body>
    </html>
  );
}
