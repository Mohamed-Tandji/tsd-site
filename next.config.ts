import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Image Docker de production : serveur autonome (.next/standalone)
  output: "standalone",
  experimental: {
    // Formulaires d'administration avec images (5 Mo maximum chacune)
    serverActions: { bodySizeLimit: "25mb" },
  },
};

export default withNextIntl(nextConfig);
