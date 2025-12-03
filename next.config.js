/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for react-konva and canvas - exclude canvas on server side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        canvas: 'commonjs canvas',
      });
    } else {
      // Client side - don't resolve canvas
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    
    // Ignore konva's node-specific code on server
    config.resolve.alias = {
      ...config.resolve.alias,
      'konva/lib/index-node': false,
    };
    
    return config;
  },
}

module.exports = nextConfig

