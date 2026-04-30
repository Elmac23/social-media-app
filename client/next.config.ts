import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Needed in local development when localhost resolves to ::1 / 127.0.0.1.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/public/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/public/**",

        search: "",
      },
    ],
  },
};

export default nextConfig;
