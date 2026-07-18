import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'annapurna-mewa.vercel.app',
          },
        ],
        destination: 'https://annapurnamewa.com/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
