/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        // Optionally, you can add these:
        // port: '',
         pathname: '/api/portraits/thumb/**',
      },
    ],
  },
};

export default nextConfig;
