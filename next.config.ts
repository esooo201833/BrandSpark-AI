import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  async rewrites() {
    return [
      // Map root routes to en locale by default
      {
        source: '/login',
        destination: '/en/login',
      },
      {
        source: '/signup',
        destination: '/en/signup',
      },
      {
        source: '/docs',
        destination: '/en/docs',
      },
      {
        source: '/admin',
        destination: '/en/admin',
      },
      {
        source: '/dashboard/:path*',
        destination: '/en/dashboard/:path*',
      },
      {
        source: '/dashboard',
        destination: '/en/dashboard',
      },
      {
        source: '/settings',
        destination: '/en/settings',
      },
      {
        source: '/verify-email',
        destination: '/en/verify-email',
      },
    ];
  },
};

export default nextConfig;
