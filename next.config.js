/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.doubanio.com' }] },
};

module.exports = nextConfig;
