export default {
  root: "src",
  server: {
    port: 5126,
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  plugins: [
    {
      name: "custom-html-file",
      configureServer(server) {
        server.middlewares.use(
          (req, res, next) => {
            if (req.url === '/') {
              req.url = '/index-web-worker.html';
            }

            next();
          },
        );
      },
    },
  ],
}
