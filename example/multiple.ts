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
  await Promise.all([
    startHttpServer({port: 7000, host: "127.0.0.1"}),
    startHttpServer({port: 8000, host: "127.0.0.1"}),
    startHttpServer({port: 9000, host: "127.0.0.1"})
  ]);

  console.log("Servers started on ports 7000, 8000 & 9000");
};

main();
