export default {
    server: {
      proxy: {
        '/api': {
        // No path in the target
          target: 'http://localhost:5556',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }