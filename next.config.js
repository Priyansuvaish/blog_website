/** @type {import('next').NextConfig} */
const nextConfig = {
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
  images: {
    domains: [
      'drive.google.com',
      'lh3.googleusercontent.com',
      'googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['@ckeditor/ckeditor5-react', '@ckeditor/ckeditor5-build-classic'],
  async redirects() {
    return [
      {
        source: '/about',
        destination: 'https://www.earthfields.in/about',
        permanent: true,
      },
      {
        source: '/contact',
        destination: 'https://www.earthfields.in/contact',
        permanent: true,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_TINYMCE_API_KEY: 'o0q8r2ws35jmycxt4sj4au4pvm6yklcmjj8adgadu5i37fnt',
  },
}

module.exports = nextConfig 