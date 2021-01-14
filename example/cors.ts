import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: {
    allowedOrigins: ["http://127.0.0.1:8000", "https://www.google.fr"],
    acceptedOrigin: ""
  },
  middlewares: [
    {
      name: "Cross-Origin Resources Sharing",
      response: ({request: {headers: {origin}}, state: {allowedOrigins, acceptedOrigin}}) => ({
        next: true,
        state: {
          allowedOrigins,
          acceptedOrigin: typeof origin === "string" && allowedOrigins.includes(origin) ? origin : acceptedOrigin
        }
      })
    }
  ],
  routes: [
    {
      // http://127.0.0.1:8000/v1/ping
      version: 1,
      path: "/ping",
      name: "Ping",
      method: "GET",
      middlewares: [],
      response: ({state: {acceptedOrigin}}) => ({
        status: "OK",
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": acceptedOrigin
        },
        body: "pong"
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

  console.log("Http server started on http://127.0.0.1:8000");
};

main();
