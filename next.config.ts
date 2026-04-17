import type { NextConfig } from 'next';

// Live URL after deploy: https://GnandeepVenigalla.github.io/gd-matrix/
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/gd-matrix',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
