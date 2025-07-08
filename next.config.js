/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "nvmjfvxaehroofhpyzfg.supabase.co",
        pathname: "/storage/v1/object/public/form-assets/form-logos/**",
      },
    ],
  },
};

export default nextConfig;
