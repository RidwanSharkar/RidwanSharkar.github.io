/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.ignoreWarnings = [/Module\.issuer/];
    return config;
  },
};

export default nextConfig;