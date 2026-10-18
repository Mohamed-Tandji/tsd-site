import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

// Les routes api, admin, media et les fichiers (avec un point) ne passent pas par la langue
export const config = {
  matcher: "/((?!api|trpc|admin|media|_next|_vercel|.*\\..*).*)",
};
