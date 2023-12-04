/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.nawpic.com'],
  },
  transpilePackages: ['lucide-react'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'node-fetch': require.resolve('isomorphic-fetch'),
        'stream': require.resolve('stream-browserify'),
        'util': require.resolve('util'),
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['isomorphic-fetch', 'stream-browserify', 'util'],
  },
}
module.exports = nextConfig;
