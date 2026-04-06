/** @type {import('next').NextConfig} */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseHost = SUPABASE_URL
  ? new URL(SUPABASE_URL).hostname
  : "placeholder.supabase.co";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
