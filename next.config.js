/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Désactiver la suppression des messages d'erreur en développement
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignorer les imports qui commencent par node:
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.js$/,
          include: [
            /node_modules\/google-logging-utils/,
            /node_modules\/gcp-metadata/,
            /node_modules\/google-auth-library/,
            /node_modules\/firebase-admin/
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                ['module-resolver', {
                  alias: {
                    "node:process": "process/browser",
                    "node:buffer": "buffer",
                    "node:util": "util",
                    "node:stream": "stream-browserify",
                    "node:url": "url",
                    "node:path": "path-browserify",
                    "node:crypto": "crypto-browserify"
                  }
                }]
              ]
            }
          }
        }
      ],
    };

    // Ajouter les fallbacks pour l'environnement du navigateur
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: require.resolve('path-browserify'),
        process: require.resolve('process/browser'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        crypto: require.resolve('crypto-browserify'),
        os: require.resolve('os-browserify/browser'),
      };

      // Ajouter les plugins nécessaires
      config.plugins = [
        ...config.plugins,
        // Définir process.browser pour les modules côté client
        new webpack.DefinePlugin({
          'process.browser': true,
        }),
        // Fournir process globalement pour les modules qui l'utilisent
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ];
    }

    return config;
  },
};

module.exports = nextConfig; 