/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hostinger Web Apps espera la salida standalone (server.js + node_modules mínimo).
  output: "standalone",
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
