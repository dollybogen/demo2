// vue.config.js

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.100:3000',
        changeOrigin: true,
      },
    },
  },
};