/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['www.nawpic.com', 'api.universalprofile.cloud'],
  },
  // transpilePackages: ['lucide-react'],
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       'node-fetch': require.resolve('isomorphic-fetch'),
  //       'stream': require.resolve('stream-browserify'),
  //       'util': require.resolve('util'),
  //     };
  //   }
  //   return config;
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['ipfs-utils'],
  },
}
module.exports = nextConfig;
