import type { Configuration } from 'webpack'

module.exports = {
  entry: { background: { import: 'src/background.ts', runtime: false } },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      url: require.resolve('url/'),
      // path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      // os: require.resolve('os'),
      process: require.resolve('process/browser'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      fs: false,
      path: false,
      os: false,
      child_process: false,
      dns: false,
      net: false,
      tls: false,
      'mock-aws-s3': false,
      nock: false,
      'aws-sdk': false,
      'timers/promises': false,
    },
  },
} as Configuration
