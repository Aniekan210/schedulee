/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        // Optionally, you can add these:
        // port: '',
        // pathname: '/**',
      },
    ],
  },
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
