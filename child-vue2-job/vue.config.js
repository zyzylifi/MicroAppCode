module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin':'*'
    },
    proxy: {
      '/api': {
        target: 'http://hrotest.huokesaas.com'
      }
    }
  }
}