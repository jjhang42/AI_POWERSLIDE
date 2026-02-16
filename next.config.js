/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack: (config, { isServer }) => {
    // 클라이언트 측에서 Node.js 모듈 폴백 설정
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        util: false,
        os: false,
      };

      // node: prefix 스킴 처리
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:fs': false,
        'node:path': false,
        'node:stream': false,
        'node:crypto': false,
        'node:buffer': false,
        'node:util': false,
        'node:os': false,
        'node:process': false,
      };
    }

    // pptxgenjs를 외부 모듈로 처리 (서버에서만)
    if (isServer) {
      config.externals = [...(config.externals || []), 'pptxgenjs'];
    }

    return config;
  },
};

module.exports = nextConfig;
