import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [],
  fallback: ({request: {url}, parameters, fields, hash, state}) => ({
    status: "NOT_FOUND",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: `Unrecognized url: ${url}`,
      parameters: `Parameters: ${JSON.stringify(parameters)}`,
      fields: `Fields: ${JSON.stringify(fields)}`,
      hash: `Hash: ${hash}`,
      state: `State: ${JSON.stringify(state)}`,
    })
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
