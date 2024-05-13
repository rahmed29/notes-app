export default {
    server: {
      proxy: {
        '/api': {
        // This is not rly intuitive but this is how it works. No path in the target
          target: 'http://localhost:5556',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    // some other configuration
  }