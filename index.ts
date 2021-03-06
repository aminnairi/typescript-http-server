import {URL} from "url";
import {createServer, IncomingMessage, Server} from "http";

type HttpServerRouteResponseStatus
  = "CONTINUE"
  | "SWITCHING_PROTOCOLS"
  | "PROCESSING"
  | "EARLY_HINTS"
  | "OK"
  | "CREATED"
  | "ACCEPTED"
  | "NON_AUTHORITATIVE_INFORMATION"
  | "NO_CONTENT"
  | "RESET_CONTENT"
  | "PARTIAL_CONTENT"
  | "MULTI_STATUS"
  | "ALREADY_REPORTED"
  | "IM_USED"
  | "MULTIPLE_CHOICE"
  | "MOVED_PERMANENTLY"
  | "FOUND"
  | "SEE_OTHER"
  | "NOT_MODIFIED"
  | "USE_PROXY"
  | "UNUSED"
  | "TEMPORARY_REDIRECT"
  | "PERMANENT_REDIRECT"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "PAYMENT_REQUIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "NOT_ACCEPTABLE"
  | "PROXY_AUTHENTICATION_REQUIRED"
  | "REQUEST_TIMEOUT"
  | "CONFLICT"
  | "GONE"
  | "LENGTH_REQUIRED"
  | "PRECONDITION_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "URI_TOO_LONG"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "RANGE_NOT_SATISFIABLE"
  | "EXPECTATION_FAILED"
  | "I_AM_A_TEAPOT"
  | "MISDIRECTED_REQUEST"
  | "UNPROCESSABLE_ENTITY"
  | "LOCKED"
  | "FAILED_DEPENDENCY"
  | "TOO_EARLY"
  | "UPGRADE_REQUIRED"
  | "PRECONDITION_REQUIRED"
  | "TOO_MANY_REQUESTS"
  | "REQUEST_HEADER_FIELDS_TOO_LARGE"
  | "UNAVAILABLE_FOR_LEGAL_REASONS"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_IMPLEMENTED"
  | "BAD_GATEWAY"
  | "SERVICE_UNAVAILABLE"
  | "GATEWAY_TIMEOUT"
  | "HTTP_VERSION_NOT_SUPPORTED"
  | "VARIANT_ALSO_NEGOCIATES"
  | "INSUFFICIENT_STORAGE"
  | "LOOP_DETECTED"
  | "NOT_EXTENDED"
  | "NETWORK_AUTHENTICATION_REQUIRED";

type MaybePromise<Something> = Something | Promise<Something>;

interface HttpServerRouteResponseOptions<HttpServerState> {
  request: Readonly<IncomingMessage>;
  state: Readonly<HttpServerState>;
  parameters: Readonly<Record<string, string>>;
  queries: Readonly<Record<string, string>>;
  hash: Readonly<string>;
  body: string;
}

interface HttpServerRouteResponse {
  status: HttpServerRouteResponseStatus;
  body: string;
  headers: Record<string, string>;
}

interface HttpServerRoute<HttpServerState> {
  prefix: string;
  version: number;
  name: string;
  path: string;
  method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
  middlewares: HttpServerMiddleware<HttpServerState>[];
  response: (options: Readonly<HttpServerRouteResponseOptions<HttpServerState>>) => MaybePromise<HttpServerRouteResponse>;
  children: Array<HttpServerRoute<HttpServerState>>;
}

interface HttpServerMiddlewareResponseOptions<HttpServerState> {
  request: Readonly<IncomingMessage>;
  state: Readonly<HttpServerState>;
  parameters: Readonly<Record<string, string>>;
  queries: Readonly<Record<string, string>>;
  hash: Readonly<string>;
  body: string;
}

interface HttpServerMiddlewareResponseNext<HttpServerState> {
  next: true;
  state: HttpServerState;
}

interface HttpServerMiddlewareResponse extends HttpServerRouteResponse {
  next: false;
}

interface HttpServerMiddleware<HttpServerState> {
  name: string;
  response: (options: Readonly<HttpServerMiddlewareResponseOptions<HttpServerState>>) => MaybePromise<HttpServerMiddlewareResponse | HttpServerMiddlewareResponseNext<HttpServerState>>;
}

interface HttpServerOptions<HttpServerState> {
  initialState: HttpServerState;
  middlewares: HttpServerMiddleware<HttpServerState>[];
  routes: HttpServerRoute<HttpServerState>[];
  fallback: (options: Readonly<HttpServerRouteResponseOptions<HttpServerState>>) => MaybePromise<HttpServerRouteResponse>;
}

interface StartHttpServerOptions {
  port: number;
  host: string;
}

const joinPaths = (paths: string[]): string => {
    const separator = "/";
    const joinedPaths = paths.join(separator);
    const normalizedPaths = `${separator}${joinedPaths}${separator}`.replace(new RegExp(`${separator}{1,}`, "gu"), separator);

    return normalizedPaths;
};

const trimLeft = (character: string, text: string) => {
  if (text.startsWith(character)) {
    return text.slice(1);
  }

  return text;
};

const trimRight = (character: string, text: string) => {
  if (text.endsWith(character)) {
    return text.slice(0, -1);
  }

  return text;
};

const matchPath = (pathPattern: string, path: string) => {
  const SEPARATOR = "/";
  const pathNormalized = `${SEPARATOR}${trimRight(SEPARATOR, trimLeft(SEPARATOR, path))}`;
  const pathPatternNormalized = `^${SEPARATOR}${trimRight(SEPARATOR, trimLeft(SEPARATOR, pathPattern.replace(/:(\w+)/gu, "(?<$1>[^\/]*)")))}$`;
  const pattern = new RegExp(pathPatternNormalized, "gu");
  const result = pattern.exec(pathNormalized);

  return result;
};

const getPathParameters = (pathPattern: string, path: string): Record<string, string> => {
  const result = matchPath(pathPattern, path);

  if (result === null) {
    return {};
  }

  if ("undefined" === typeof result.groups) {
    return {};
  }

  return result.groups;
};

const isPathMatching = (pathPattern: string, path: string) => {
  return matchPath(pathPattern, path) !== null;
};

const HTTP_STATUS: Record<HttpServerRouteResponseStatus, number> = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  EARLY_HINTS: 103,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  ALREADY_REPORTED: 208,
  IM_USED: 226,
  MULTIPLE_CHOICE: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  UNUSED: 306,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  I_AM_A_TEAPOT: 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOCIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
const allRoutes = <HttpServerState>(routes: Array<HttpServerRoute<HttpServerState>>) => {
  return routes.reduce((previousRoutes: Array<HttpServerRoute<HttpServerState>>, route: HttpServerRoute<HttpServerState>): Array<HttpServerRoute<HttpServerState>> => {
    if (route.children.length > 0) {
      return [
        ...previousRoutes,
        route,
        ...allRoutes(route.children.map(child => {
          return {
            ...child,
            middlewares: [...route.middlewares, ...child.middlewares],
            prefix: joinPaths([route.prefix, child.prefix]),
            path: joinPaths([route.path, child.path])
          };
        }))
      ];
    }

    return [...previousRoutes, route];
  }, [] as Array<HttpServerRoute<HttpServerState>>);
};

const getRequestBody = (request: Readonly<IncomingMessage>): Promise<string> => {
  return new Promise(resolve => {
    let body = "";

    request.on("data", (data: Buffer): void => {
      body += data.toString();
    });

    request.on("error", () => resolve(body));

    request.on("end", () => {
      resolve(body);
    });
  });
};

export const createHttpServer = <HttpServerState>(httpServerOptions: Readonly<HttpServerOptions<HttpServerState>>) => {
  const startHttpServer = (startHttpServerOptions: Readonly<StartHttpServerOptions>) => {
    return new Promise<Server>(resolve => {
      const server: Server = createServer(async (request, response) => {
        const fallbackRoute = {prefix: "", name: "Not found", version: 0, path: request.url || "", method: "GET", middlewares: [], response: httpServerOptions.fallback};

        const flattenRoutes = allRoutes(httpServerOptions.routes);

        const foundRoute = flattenRoutes.find(route => {
          if (typeof request.url === "undefined") {
            return false;
          }

          const requestUrl = new URL(`http://${request.headers.host || "localhost"}${request.url}`);
          return route.method === request.method && isPathMatching(joinPaths([route.prefix, `/${route.version ? `v${route.version}` : ""}/`, route.path]), requestUrl.pathname);
        }) || fallbackRoute;
        
        let state = httpServerOptions.initialState;

        const requestUrl = new URL(`http://${request.headers.host || "127.0.0.1"}${request.url}`);
        const parameters = getPathParameters(joinPaths([foundRoute.prefix, `/${foundRoute.version ? `v${foundRoute.version}` : ""}/`, foundRoute.path]), requestUrl.pathname);
        const queries = Object.fromEntries([...requestUrl.searchParams]);
        const hash = requestUrl.hash;
        const body = await getRequestBody(request);

        for (const middleware of [...httpServerOptions.middlewares, ...foundRoute.middlewares]) {
          const middlewareResponse = await middleware.response({request, state, parameters, queries, hash, body});

          if (!middlewareResponse.next) {
            return response.writeHead(HTTP_STATUS[middlewareResponse.status]).end(middlewareResponse.body);
          }

          state = middlewareResponse.state;
        }

        if (typeof request.url === "undefined") {
          return response.writeHead(404).end("Not found");
        }

        const foundRouteResponse = await foundRoute.response({request, state, parameters, queries, hash, body});
        return response.writeHead(HTTP_STATUS[foundRouteResponse.status], foundRouteResponse.headers).end(foundRouteResponse.body);
      }).listen(startHttpServerOptions.port, startHttpServerOptions.host, () => {
        resolve(server);
      });
    });
  };

  return {startHttpServer};
};
