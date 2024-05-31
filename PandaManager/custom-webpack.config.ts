import * as webpack from 'webpack'

module.exports = {
  entry: { background: { import: 'src/background.ts', runtime: false } },
  resolve: {
    fallback: {
      // child_process: false,
      // fs: false,
      // os: false,
      // url: false,
      // tls: false,
      // net: false,
      // path: false,
      // zlib: false,
      // http: false,
      // https: false,
      // nock: false,
      // 'aws-sdk': false,
      // 'mock-aws-s3': false,
      // 'timers/promises': false,
      // timers: false,
      // constants: false,
      // dns: false,
      // asserts: false,
      // assert: false,
      // process: false,
      // util: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      crypto: require.resolve('crypto-browserify'),
    },
  },
} as webpack.Configuration
