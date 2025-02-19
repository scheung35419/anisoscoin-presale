module.exports = {
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "stream": require.resolve("stream-browserify"),
    },
  },
};
