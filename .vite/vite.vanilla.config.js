export default {
  root: "src",
  server: {
    port: 5125,
  },
  plugins: [
    {
      name: "custom-html-file",
      configureServer(server) {
        server.middlewares.use(
          (req, res, next) => {
            if (req.url === '/') {
              req.url = '/index-vanilla.html';
            }

            next();
          },
        );
      },
    },
  ],
}
