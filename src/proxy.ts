import createProxy from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createProxy(routing);

export const config = {
  // Skip API routes, Next.js internals, and files with an extension
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
