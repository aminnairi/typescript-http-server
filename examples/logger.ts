import {createHttpServer} from "@aminnairi/typescript-http-server";
import {promises as fs} from "fs";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [
    {
      name: "Logger",
      response: async ({request, parameters, queries, hash, state}) => {
        await fs.appendFile("logs.txt", `[LOGGER]: request = ${request.url}, parameters = ${JSON.stringify(parameters)}, queries = ${JSON.stringify(queries)}, hash = ${JSON.stringify(hash)}, state = ${JSON.stringify(state)}\n`);

        return {
          next: true,
          state
        };
      }
    }
  ],
  routes: [
    {
      // http://127.0.0.1:8000/v1/ping
      name: "Ping",
      prefix: "",
      version: 1,
      path: "/ping",
      method: "GET",
      middlewares: [],
      children: [],
      response: () => ({
        status: "OK",
        headers: {
          "Content-Type": "text/plain"
        },
        body: "pong"
      })
    },
    {
      // http://127.0.0.1:8000/v1/foo
      name: "Foo",
      prefix: "",
      version: 1,
      path: "/foo",
      method: "GET",
      middlewares: [],
      children: [],
      response: () => ({
        status: "OK",
        headers: {
          "Content-Type": "text/plain"
        },
        body: "bar"
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
