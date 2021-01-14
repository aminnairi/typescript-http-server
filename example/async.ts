import {createHttpServer} from "@aminnairi/typescript-http-server";

const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [
    {
      name: "Delay",
      response: async ({state}) => {
        await sleep(1);

        return {
          next: true,
          state
        }
      }
    }
  ],
  routes: [
    {
      // http://127.0.0.1:8000/v1/ping
      name: "Ping",
      version: 1,
      path: "/ping",
      method: "GET",
      middlewares: [
        {
          name: "More delay",
          response: async ({state}) => {
            await sleep(1);

            return {
              next: true,
              state
            };
          }
        }
      ],
      response: async () => {
        await sleep(1);

        return {
          status: "OK",
          headers: {
            "Content-Type": "text/plain"
          },
          body: "ping"
        }
      }
    }
  ],
  fallback: async () => {
    return {
      status: "NOT_FOUND",
      headers: {
        "Content-Type": "text/plain"
      },
      body: "Not found"
    }
  }
});

const main = async () => {
  await startHttpServer({
    port: 8000,
    host: "127.0.0.1"
  });

  console.log("Server started on http://127.0.0.1:8000");
};

main();
