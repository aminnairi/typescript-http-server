# typescript-http-server

Typescript library for declaratively creating a HTTP server.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

## Installation

```console
$ npm install @aminnairi/typescript-http-server@0.1.0
```

## Usage

### Simple


```typescript
import {createHttpServer} from "@aminnairi/typescript-http-server";

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      name: "ping",
      method: "GET",
      path: "/v1/ping",
      middlewares: [],
      response: () => ({
        status: "OK",
        headers: {},
        body: "ping"
      })
    }
  ],
  fallback: {
    status: "NOT_FOUND",
    headers: {},
    body: "Not found"
  }
});

const main = async () => {
  await startHttpServer({port: 8000, host: "127.0.0.1"});

  console.log("Http server started on http://127.0.0.1:8000.");
};

main().catch(({message}) => {
  console.error(message);
});
```

## Complex

```typescript
import {createHttpServer} from "@aminnairi/typescript-http-server";

interface State {
  secret: string | null;
}

const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const {startHttpServer} = createHttpServer<State>({
  initialState: {
    secret: null
  },
  middlewares: [
    {
      name: "Maintenance",
      response: async ({request, parameters, fields, hash, state}) => {
        await sleep(1);

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
      name: "Users",
      method: "GET",
      path: "/v1/users/:id/test",
      middlewares: [
        {
          name: "Authentication",
          response: async ({request, parameters, fields, hash, state}) => {
            await sleep(1);

            if (parameters.id === "0") {
              return {
                next: true,
                state: {
                  secret: "administrator"
                }
              };
            }

            return {
              next: false,
              status: "UNAUTHORIZED",
              headers: {
                "Content-Type": "application/json"
              },
              body: "Unauthorized"
            };
          }
        }
      ],
      response: async ({request, parameters, fields, hash, state}) => {
        await sleep(1);

        return {
          status: "OK",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: `The request url is ${request.url}`,
            identifier: `The identifier is ${parameters.id}`,
            fields: `If there are fields, here they are: ${JSON.stringify(fields)}`,
            hash: `If there is a hash, here it is: ${hash}`,
            state: `And here is our state: ${state.secret}`
          })
        };
      }
    }
  ],
  fallback: {
    status: "NOT_FOUND",
    headers: {
      "Content-type": "text/plain"
    },
    body: "Not found"
  }
});

const main = async () => {
  await startHttpServer({port: 8000, host: "127.0.0.1"});

  console.log("Http server started on http://127.0.0.1:8000.");
};

main().catch(({message}) => {
  console.error(message);
});
```
