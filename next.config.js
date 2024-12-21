/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: ['i.scdn.co'], // Spotify 图片域名
  },
}

module.exports = nextConfig