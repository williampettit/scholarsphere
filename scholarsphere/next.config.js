/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    optimizeCss: true,
    swcMinify: true,
    serverActionsBodySizeLimit: 10_000_000,
    // typedRoutes: true,
  },

  transpilePackages: [
    //
    "zod",
    "openai",
    "next/cache",
    "@anatine/zod-openapi",
    //
  ],
};

module.exports = nextConfig;
