import "@/styles/global.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { metadata } from "@/utils/metadata";
import { Analytics } from "@/components/analytics";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import SpaceBackground from "@/components/space-background";

export { metadata };

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

type Params = Promise<{ locale: never }>;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
      </head>
      <body>
        <SpaceBackground
          className="fixed inset-0 -z-10 min-h-screen"
          quantity={100}
        />
        <div className="flex flex-col min-h-screen">
          <NextIntlClientProvider messages={messages}>
            <Header className="my-10" />
            <main className="flex-grow flex flex-col items-center justify-center">
              {children}
            </main>
            <Footer className="my-6" />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
