import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:8000/v1/ping
      name: "Ping",
      prefix: "",
      version: 1,
      path: "/ping",
      method: "GET",
      middlewares: [],
      children: [
        {
          http://127.0.0.1:8000/v1/ping/pong
          name: "Ping",
          prefix: "",
          version: 1,
          path: "/pong",
          method: "GET",
          middlewares: [],
          children: [],
          response: () => ({
            status: "OK",
            headers: {
              "Content-Type": "text/plain"
            },
            body: "pingpong"
          })
        }
      ],
      response: () => ({
        status: "OK",
        headers: {
          "Content-Type": "text/plain"
        },
        body: "ping"
      })
    }
  ],
  fallback: () => ({
    status: "NOT_FOUND",
    headers: {
      "Content-Type": "text/plain"
    },
    body: "Not found"
  })
});

const main = async () => {
  const port = 8080;
  const host = "127.0.0.1";

  await startHttpServer({
    port,
    host
  });

  console.log(`Server started on http://${host}:${port}`);
};

main().catch(console.error);
