/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    PROJECT_ROOT: import.meta.dirname,
  },
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
  },
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
