/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudwaysapps.com",
      },
      {
        protocol: "https",
        hostname: "**.hostingersite.com",
      },
    ],
  },
};

export default nextConfig;
