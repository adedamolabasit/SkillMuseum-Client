/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://adaptable-creativity-production-aeee.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;