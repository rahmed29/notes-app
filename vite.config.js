export default {
  server: {
    proxy: {
      "/api": {
        // No path in the target
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       // Define the multiple HTML entry points
  //       main: resolve(__dirname, 'index.html'),
  //       canvas: resolve(__dirname, 'canvas.html'),
  //     }
  //   }
  // }
};
