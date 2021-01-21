import {startHttpServer} from "@aminnairi/typescript-http-server";
import {Server} from "http";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [],
  fallback: () => ({
    status: "OK",
    headers: {
      "Content-Type": "text/plain"
    },
    body: "Hello world!"
  })
});

const server = await startHttpServer({
  port: 8000,
  host: "127.0.0.1"
});

const close = (server: Server) => {
  return () => {
    server.close(server);
  };
}

const TEN_SECONDS_IN_MILLISECONDS = 10 * 1000;

setTimeout(close(server), TEN_SECONDS_IN_MILLISECONDS);
