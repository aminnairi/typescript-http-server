import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:7000/v1/ping
      // http://127.0.0.1:8000/v1/ping
      // http://127.0.0.1:9000/v1/ping
      name: "Ping",
      prefix: "",
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
  const port1 = 7000;
  const port2 = 8000;
  const port3 = 9000;
  const host = "127.0.0.1";

  await Promise.all([
    startHttpServer({port: port1, host}),
    startHttpServer({port: port2, host}),
    startHttpServer({port: port3, host})
  ]);

  console.log(`Server started on ports ${port1}, ${port2} & ${port3}`);
};

main().catch(console.error);
