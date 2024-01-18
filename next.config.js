/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.doubanio.com' }],
    unoptimized: true,
  },
  // output: 'export',
};

module.exports = nextConfig;
