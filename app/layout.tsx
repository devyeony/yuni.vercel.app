import "@/styles/global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Analytics } from "@/components/analytics";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import SpaceBackground from "@/components/space-background";
import { metadata } from "@/utils/metadata";

export { metadata };

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
