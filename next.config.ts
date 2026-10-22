import type { NextConfig } from "next";

const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const wordpressHostname = wordpressUrl
  ? new URL(wordpressUrl).hostname
  : "slategrey-dove-397328.hostingersite.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wordpressHostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.mobilitybrasil.com.br",
        pathname: "/upload/menu/**",
      },
    ],
  },
};

export default nextConfig;
