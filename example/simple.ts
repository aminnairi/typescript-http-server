import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      name: "Ping",
      version: 1,
      path: "/ping",
      method: "GET",
      response: () => ({
        status: "OK",
        headers: {
        }
      })
    }
  ],
  fallback: {
    status: "NOT_FOUND",
    headers: {
      "Content-Type": "text/plain"
    },
    body: "Not found"
  }
});

const main = async () => {
  await startHttpServer({
    port: 8000,
    host: "127.0.0.1"
  });

  console.log("Server started on http://127.0.0.1:8000");
};
