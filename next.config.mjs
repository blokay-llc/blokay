/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    PROJECT_ROOT: import.meta.dirname,
  },
};

export default nextConfig;
