import {createServer, IncomingMessage} from "http";

type HttpServerRouteResponseStatus = "CONTINUE" | "SWITCHING_PROTOCOLS" | "PROCESSING" | "EARLY_HINTS" | "OK" | "CREATED" | "ACCEPTED" | "NON_AUTHORITATIVE_INFORMATION" | "NO_CONTENT" | "RESET_CONTENT" | "PARTIAL_CONTENT" | "MULTI_STATUS" | "ALREADY_REPORTED" | "IM_USED" | "MULTIPLE_CHOICE" | "MOVED_PERMANENTLY" | "FOUND" | "SEE_OTHER" | "NOT_MODIFIED" | "USE_PROXY" | "UNUSED" | "TEMPORARY_REDIRECT" | "PERMANENT_REDIRECT" | "BAD_REQUEST" | "UNAUTHORIZED" | "PAYMENT_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_ALLOWED" | "NOT_ACCEPTABLE" | "PROXY_AUTHENTICATION_REQUIRED" | "REQUEST_TIMEOUT" | "CONFLICT" | "GONE" | "LENGTH_REQUIRED" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "URI_TOO_LONG" | "UNSUPPORTED_MEDIA_TYPE" | "RANGE_NOT_SATISFIABLE" | "EXPECTATION_FAILED" | "I_AM_A_TEAPOT" | "MISDIRECTED_REQUEST" | "UNPROCESSABLE_ENTITY" | "LOCKED" | "FAILED_DEPENDENCY" | "TOO_EARLY" | "UPGRADE_REQUIRED" | "PRECONDITION_REQUIRED" | "TOO_MANY_REQUESTS" | "REQUEST_HEADER_FIELDS_TOO_LARGE" | "UNAVAILABLE_FOR_LEGAL_REASONS" | "INTERVAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "BAD_GATEWAY" | "SERVICE_UNAVAILABLE" | "GATEWAY_TIMEOUT" | "HTTP_VERSION_NOT_SUPPORTED" | "VARIANT_ALSO_NEGOCIATES" | "INSUFFICIENT_STORAGE" | "LOOP_DETECTED" | "NOT_EXTENDED" | "NETWORK_AUTHENTICATION_REQUIRED";

type MaybePromise<Something> = Something | Promise<Something>;

interface HttpServerRouteResponseOptions<HttpServerState> {
    request: Readonly<IncomingMessage>;
    state: Readonly<HttpServerState>;
    parameters: Readonly<Record<string, string>>;
}

interface HttpServerRouteResponseHeaders {
    [key: string]: string;
}

interface HttpServerRouteResponse {
    status: HttpServerRouteResponseStatus;
    body: string;
    headers: HttpServerRouteResponseHeaders;
}

interface HttpServerRoute<HttpServerState> {
    name: string;
    path: string;
    method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
    middlewares: HttpServerMiddleware<HttpServerState>[];
    response: (options: Readonly<HttpServerRouteResponseOptions<HttpServerState>>) => MaybePromise<HttpServerRouteResponse>;
}

interface HttpServerMiddlewareResponseOptions<HttpServerState> {
    request: Readonly<IncomingMessage>;
    state: Readonly<HttpServerState>;
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
    fallback: HttpServerRouteResponse;
}

interface StartHttpServerOptions {
    port: number;
    host: string;
}

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
    const pathPatternNormalized = `^${SEPARATOR}${trimRight(SEPARATOR, trimLeft(SEPARATOR, pathPattern.replace(/:(\w+)/, "(?<$1>[^\/]*)")))}$`;
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
    INTERVAL_SERVER_ERROR: 500,
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

export const createHttpServer = <HttpServerState>(httpServerOptions: Readonly<HttpServerOptions<HttpServerState>>) => {
    const startHttpServer = (startHttpServerOptions: Readonly<StartHttpServerOptions>) => {
        return new Promise<void>(resolve => {
            createServer(async (request, response) => {
                let state = httpServerOptions.initialState;

                for (const middleware of httpServerOptions.middlewares) {
                    const middlewareResponse = await middleware.response({request, state});

                    if (!middlewareResponse.next) {
                        return response.writeHead(HTTP_STATUS[middlewareResponse.status], middlewareResponse.headers).end(middlewareResponse.body);
                    }

                    state = middlewareResponse.state;
                }

                const foundRoute = httpServerOptions.routes.find(route => {
                    if (typeof request.url === "undefined") {
                        return false;
                    }

                    const requestUrl = new URL(`http://${request.headers.host || "localhost"}${request.url}`);

                    return route.method === request.method && isPathMatching(route.path, requestUrl.pathname);
                });

                if (foundRoute) {
                    for (const middleware of foundRoute.middlewares) {
                        const middlewareResponse = await middleware.response({request, state});

                        if (!middlewareResponse.next) {
                            return response.writeHead(HTTP_STATUS[middlewareResponse.status]).end(middlewareResponse.body);
                        }

                        state = middlewareResponse.state;
                    }

                    if (typeof request.url === "undefined") {
                        return response.writeHead(404).end("Not found");
                    }

                    const requestUrl = new URL(`http://${request.headers.host || "localhost"}${request.url}`);

                    const parameters = getPathParameters(foundRoute.path, requestUrl.pathname);
                    const foundRouteResponse = await foundRoute.response({request, state, parameters});

                    return response.writeHead(HTTP_STATUS[foundRouteResponse.status], foundRouteResponse.headers).end(foundRouteResponse.body);
                }

                return response.writeHead(HTTP_STATUS[httpServerOptions.fallback.status], httpServerOptions.fallback.headers).end(httpServerOptions.fallback.body);
            }).listen(startHttpServerOptions.port, startHttpServerOptions.host, () => {
                resolve();
            });
        });
    };

    return {startHttpServer};
};