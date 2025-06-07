/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'propertydetail.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      readline: false,
    };
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@ckeditor/ckeditor5-react', '@ckeditor/ckeditor5-build-classic'],
  },
}

module.exports = nextConfig 