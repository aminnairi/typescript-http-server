import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:8000/v1/echo/helloworld
      // http://127.0.0.1:8000/v1/echo/howareyou
      // http://127.0.0.1:8000/v1/echo/anyone
      name: "Echo",
      prefix: "",
      version: 1,
      path: "/echo/:anything",
      method: "GET",
      middlewares: [],
      children: [],
      response: ({parameters: {anything}}) => ({
        status: "OK",
        headers: {
          "Content-Type": "text/plain"
        },
        body: anything || "echo"
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
  const port = 8000;
  const host = "127.0.0.1";

  await startHttpServer({
    port,
    host
  });

  console.log(`Server started on http://${host}:${port}`);
};

main().catch(console.error);
