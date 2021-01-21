import {createHttpServer} from "../index";
import {describe, it} from "mocha";
import {expect} from "chai";
import fetch from "node-fetch";

describe("typescript-http-server", () => {
  it("should expose a function named createHttpServer", () => {
    expect(createHttpServer).to.be.a("function"); 
  });

  describe("createHttpServer", () => {
    it("should return a function named startHttpServer", () => {
      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [],
        fallback: () => ({
          status: "OK",
          headers: {
            "Content-Type": "text/plain"
          },
          body: "Hello world!"
        })
      });

      expect(startHttpServer).to.be.a("function");
    });
  });

  describe("startHttpServer", () => {
    it("should start the server on port 8080 and listen for hosts on 127.0.0.1", async () => {
      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [],
        fallback: () => ({
          status: "OK",
          headers: {
            "Content-Type": "text/plain"
          },
          body: "Hello world!"
        })
      });

      const server = await startHttpServer({
        port: 8080,
        host: "127.0.0.1"
      });

      server.close();
    });


    it("should expose a fallback route that respond to request on the exposed port & host", async () => {
      const body = "Hello world!";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [],
        fallback: () => ({
          status: "OK",
          headers: {
            "Content-Type": "text/plain"
          },
          body
        })
      });

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a fallback route that respond to a not found route", async () => {
      const body = "Hello world!";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [],
        fallback: () => ({
          status: "OK",
          headers: {
            "Content-Type": "text/plain"
          },
          body
        })
      });

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/api/v1/users/15/posts/3`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a route that respond to requests", async () => {
      const body = "ping";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [
          {
            name: "Ping",
            prefix: "",
            version: 0,
            method: "GET",
            path: "/ping",
            middlewares: [],
            children: [],
            response: () => ({
              status: "OK",
              headers: {
                "Content-Type": "text/plain"
              },
              body
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

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/ping`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a route that respond to requests even with a trailing slash", async () => {
      const body = "ping";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [
          {
            name: "Ping",
            prefix: "",
            version: 0,
            method: "GET",
            path: "/ping",
            middlewares: [],
            children: [],
            response: () => ({
              status: "OK",
              headers: {
                "Content-Type": "text/plain"
              },
              body
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

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/ping/`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a route that respond to requests with a prefix", async () => {
      const body = "ping";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [
          {
            name: "Ping",
            prefix: "api",
            version: 0,
            method: "GET",
            path: "/ping",
            middlewares: [],
            children: [],
            response: () => ({
              status: "OK",
              headers: {
                "Content-Type": "text/plain"
              },
              body
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

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/api/ping`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a route that respond to requests with a version", async () => {
      const body = "ping";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [
          {
            name: "Ping",
            prefix: "",
            version: 1,
            method: "GET",
            path: "/ping",
            middlewares: [],
            children: [],
            response: () => ({
              status: "OK",
              headers: {
                "Content-Type": "text/plain"
              },
              body
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

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/v1/ping`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a route that respond to requests with a middleware that interupt the response chain", async () => {
      const body = "pong";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [
          {
            name: "Ping",
            prefix: "",
            version: 0,
            method: "GET",
            path: "/ping",
            middlewares: [
              {
                name: "Pong",
                response: () => ({
                  next: false,
                  status: "OK",
                  headers: {
                    "Content-Type": "text/plain"
                  },
                  body
                })
              }
            ],
            children: [],
            response: () => ({
              status: "OK",
              headers: {
                "Content-Type": "text/plain"
              },
              body: "ping"
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

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/ping`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a route that respond to requests with a middleware that does not interupt the response chain", async () => {
      const body = "ping";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [
          {
            name: "Ping",
            prefix: "",
            version: 0,
            method: "GET",
            path: "/ping",
            middlewares: [
              {
                name: "Pong",
                response: ({state}) => ({
                  next: true,
                  state
                })
              }
            ],
            children: [],
            response: () => ({
              status: "OK",
              headers: {
                "Content-Type": "text/plain"
              },
              body
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

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/ping`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a route that has children", async () => {
      const body = "pong";

      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [
          {
            name: "Ping",
            prefix: "",
            version: 0,
            method: "GET",
            path: "/ping",
            middlewares: [],
            response: () => ({
              status: "OK",
              headers: {
                "Content-Type": "text/plain"
              },
              body: "ping"
            }),
            children: [
              {
                name: "Pong",
                prefix: "",
                version: 0,
                method: "GET",
                path: "/pong",
                middlewares: [],
                children: [],
                response: () => ({
                  status: "OK",
                  headers: {
                    "Content-Type": "text/plain"
                  },
                  body
                })
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

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/ping/pong`);
      const textResponse = await response.text();

      expect(textResponse).to.equal(body);
      server.close();
    });

    it("should expose a route that has parameters", async () => {
      const {startHttpServer} = createHttpServer({
        initialState: null,
        middlewares: [],
        routes: [
          {
            name: "Users' details",
            prefix: "",
            version: 0,
            method: "GET",
            path: "/users/:user",
            middlewares: [],
            children: [],
            response: ({parameters: {user}}) => ({
              status: "OK",
              headers: {
                "Content-Type": "text/plain"
              },
              body: `The user id is ${String(user)}`
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

      const port = 8080;
      const host = "127.0.0.1";

      const server = await startHttpServer({
        port,
        host
      });

      const response = await fetch(`http://${host}:${port}/users/15`);
      const textResponse = await response.text();

      expect(textResponse).to.equal("The user id is 15");
      server.close();
    });
  });
});
