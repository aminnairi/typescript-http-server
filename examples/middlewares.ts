import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: {
    luckyNumber: 0
  },
  middlewares: [
    {
      name: "Maintenance",
      response: ({state}) => {
        if (Math.random() > 0.5) {
          return {
            next: false,
            status: "SERVICE_UNAVAILABLE",
            headers: {
              "Content-Type": "text/plain"
            },
            body: "Maintenance"
          };
        }

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
      name: "Lucky number",
      prefix: "",
      version: 1,
      path: "/number/lucky",
      method: "GET",
      children: [],
      middlewares: [
        {
          name: "Lucky number generator",
          response: () => ({
            next: true,
            state: {
              luckyNumber: Math.round((Math.random() % 100 * 100))
            }
          })
        } 
      ],
      response: ({state: {luckyNumber}}) => ({
        status: "OK",
        headers: {
          "Content-Type": "text/plain"
        },
        body: String(luckyNumber)
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
