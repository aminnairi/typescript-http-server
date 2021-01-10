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

## TODO

- Fields of the URI in the response callback
- Hash of the URI in the response callback
