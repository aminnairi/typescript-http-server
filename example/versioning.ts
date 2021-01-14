import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:8000/v1/ping
      name: "Ping",
      version: 1,
      path: "/ping",
      method: "GET",
      middlewares: [],
      response: () => ({
        status: "OK",
        headers: {
          "Content-Type": "text/plain"
        },
        body: "pong"
      })
    },
    {
      // http://127.0.0.1:8000/v2/ping
      name: "Ping",
      version: 2,
      path: "/ping",
      method: "GET",
      middlewares: [],
      response: () => ({
        status: "OK",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: "pong"
        })
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
  await startHttpServer({
    port: 8000,
    host: "127.0.0.1"
  });

  console.log("Server started on http://127.0.0.1:8000");
};

main();
