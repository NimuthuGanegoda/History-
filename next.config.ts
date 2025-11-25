import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  output: 'export',
  // Remove basePath for custom domain
  // basePath: '',
  // Optionally set assetPrefix if you use a CDN or want to ensure static assets load from the root
  // assetPrefix: '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
