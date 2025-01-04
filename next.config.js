/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // Allow Google OAuth profile pictures
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
