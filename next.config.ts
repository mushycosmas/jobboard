import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ['localhost', 'yourdomain.com'], // add domains you fetch images from
  },
};

export default nextConfig;
