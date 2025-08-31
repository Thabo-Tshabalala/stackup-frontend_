import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <-- ESLint errors won't fail Vercel builds
  },
    reactStrictMode: true,
  experimental: {
   
  },
   appDir: true,
  // you can add other Next.js config options here
};



export default nextConfig;
