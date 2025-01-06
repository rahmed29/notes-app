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
};
