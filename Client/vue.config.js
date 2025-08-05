const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
    },
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'HASHED-POTATO',
    },
  },
  devServer: {
    port: 8080,
    host: 'localhost',
  },
});
