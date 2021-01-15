import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:8000/users
      name: "Ping",
      prefix: "",
      version: 0,
      path: "/users",
      method: "GET",
      middlewares: [],
      response: () => ({
        status: "OK",
        headers: {
          "Content-Type": "text/html"
        },
        body: `
          <!DOCTYPE html>
          <html lang="en-US">
            <head>
              <meta charset="UTF-8">
              <title>Users</title>
            </head>
            <body>
              <h1>Users</h1>
              <script>
                "use strict";

                const main = async () => {
                  const response = await fetch("http://127.0.0.1:8000/api/v1/users", {
                    headers: {
                      "Accept": "application/json"
                    }
                  });

                  if (!response.ok) {
                    throw new Error("I be dead, send halp");
                  }

                  const users = await response.json();

                  console.log("Users");
                  console.log(users);
                };

                main().catch(console.error);
              </script>
            </body>
          </html>
        `
      })
    },
    {
      // http://127.0.0.1:8000/api/v1/users
      name: "Ping",
      prefix: "/api",
      version: 1,
      path: "/users",
      method: "GET",
      middlewares: [
        {
          name: "Accept",
          response: ({request: {headers: {accept}}, state}) => {
            if (accept === "application/json") {
              return {
                next: true,
                state
              };
            }

            return {
              next: false,
              status: "BAD_REQUEST",
              headers: {
                "Content-Type": "text/plain"
              },
              body: "You should accept application/json responses in order to request this url"
            };
          }
        }
      ],
      response: () => ({
        status: "OK",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify([
          {
            id: 1,
            username: "foo"
          },
          {
            id: 2,
            username: "bar"
          },
          {
            id: 3,
            username: "foobar"
          }
        ])
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
