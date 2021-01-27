import {createHttpServer} from "../index";
import {URLSearchParams} from "url";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:8000/
      name: "Registration",
      prefix: "",
      version: 0,
      path: "/",
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
              <meta name="description" content="Registration page">
              <title>Registration</title>
            </head>
            <body>
              <h1>Registration</h1>
              <form method="POST" action="/">
                <input name="email" placeholder="email" required autofocus>
                <input name="password" placeholder="password" required>
                <input type="submit">
              </form>
            </body>
          </html>
        `
      })
    },
    {
      // POST http://127.0.0.1:8000/
      name: "Registration",
      prefix: "",
      version: 0,
      path: "/",
      method: "POST",
      middlewares: [],
      children: [],
      response: ({body}) => {
        const searchParameters = new URLSearchParams(body);
        const email = searchParameters.get("email") ?? "john@doe.com";
        const password = searchParameters.get("password") ?? "johndoe";

        return {
          status: "OK",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email, password})
        };
      }
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
