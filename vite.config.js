import "dotenv/config";

export default {
  server: {
    proxy: {
      "/api": {
        // No path in the target
        target: `http://localhost:${process.env.PORT_NUMBER}`,
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
