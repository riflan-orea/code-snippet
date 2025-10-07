import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generate a smaller production bundle for Docker "standalone" output
  output: "standalone",
};

export default nextConfig;
