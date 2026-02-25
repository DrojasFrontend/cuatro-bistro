/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudwaysapps.com",
      },
    ],
  },
};

export default nextConfig;
