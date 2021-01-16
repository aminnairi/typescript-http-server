import {createHttpServer} from "../index";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:8000/users
      name: "Home",
      prefix: "",
      version: 0,
      path: "/users",
      method: "GET",
      middlewares: [],
      children: [],
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
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="description" content="Get an overview of all the users currently registred.">
              <meta name="theme-color" content="#ffffff">
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
      name: "Api",
      prefix: "/api",
      version: 2,
      path: "/users",
      method: "GET",
      children: [
        {
          // http://127.0.0.1/api/admin/v1/users
          name: "Admin",
          prefix: "/admin",
          version: 2,
          path: "/",
          method: "GET",
          children: [],
          middlewares: [],
          response: () => ({
            status: "OK",
            headers: {
              "Content-Type": "text/plain"
            },
            body: "Admin only"
          })
        }
      ],
      middlewares: [

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
  const port = 8080;
  const host = "127.0.0.1";

  await startHttpServer({
    port,
    host
  });

  console.log(`Server started on http://${host}:${port}`);
};

main().catch(console.error);
