/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.doubanio.com' }] },
  // output: 'export',
};

module.exports = nextConfig;
