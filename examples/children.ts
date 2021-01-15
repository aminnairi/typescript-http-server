import {createHttpServer} from "../index";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:8000/v1/users
      name: "Users",
      prefix: "",
      version: 1,
      path: "/users",
      method: "GET",
      middlewares: [],
      response: () => ({
        status: "OK",
        headers: {
          "Content-Type": "text/plain"
        },
        body: "Users"
      }),
      children: [
        {
          // http://127.0.0.1:8000/v1/users/15
          name: "User",
          prefix: "",
          version: 1,
          path: ":user",
          method: "GET",
          middlewares: [],
          response: ({parameters: {user}}) => ({
            status: "OK",
            headers: {
              "Content-Type": "text/plain"
            },
            body: `User#${String(user)}`
          }),
          children: [
            {
              // http://127.0.0.1:8000/v1/users/15/posts
              name: "User's posts",
              prefix: "",
              version: 1,
              path: "/posts",
              method: "GET",
              middlewares: [],
              response: ({parameters: {user}}) => ({
                status: "OK",
                headers: {
                  "Content-Type": "text/plain"
                },
                body: `Users#${String(user)}'s posts`
              }),
              children: [
                {
                  // http://127.0.0.1:8000/v1/users/15/posts/3
                  name: "User's posts",
                  prefix: "",
                  version: 1,
                  path: ":post",
                  method: "GET",
                  middlewares: [],
                  children: [],
                  response: ({parameters: {user, post}}) => ({
                    status: "OK",
                    headers: {
                      "Content-Type": "text/plain"
                    },
                    body: `User#${String(user)}'s post#${String(post)}`
                  })
                }
              ]
            }
          ]
        }
      ]
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
