import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * The previous site's routes, kept alive so existing links and any
   * indexed pages land on the section that replaced them.
   */
  async redirects() {
    return [
      { source: "/who-we-are", destination: "/company", permanent: true },
      { source: "/what-we-do", destination: "/products", permanent: true },
      {
        source: "/how-we-build-trust",
        destination: "/how-we-work",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
