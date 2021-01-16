/// <reference types="node" />
import { IncomingMessage } from "http";
declare type HttpServerRouteResponseStatus = "CONTINUE" | "SWITCHING_PROTOCOLS" | "PROCESSING" | "EARLY_HINTS" | "OK" | "CREATED" | "ACCEPTED" | "NON_AUTHORITATIVE_INFORMATION" | "NO_CONTENT" | "RESET_CONTENT" | "PARTIAL_CONTENT" | "MULTI_STATUS" | "ALREADY_REPORTED" | "IM_USED" | "MULTIPLE_CHOICE" | "MOVED_PERMANENTLY" | "FOUND" | "SEE_OTHER" | "NOT_MODIFIED" | "USE_PROXY" | "UNUSED" | "TEMPORARY_REDIRECT" | "PERMANENT_REDIRECT" | "BAD_REQUEST" | "UNAUTHORIZED" | "PAYMENT_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_ALLOWED" | "NOT_ACCEPTABLE" | "PROXY_AUTHENTICATION_REQUIRED" | "REQUEST_TIMEOUT" | "CONFLICT" | "GONE" | "LENGTH_REQUIRED" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "URI_TOO_LONG" | "UNSUPPORTED_MEDIA_TYPE" | "RANGE_NOT_SATISFIABLE" | "EXPECTATION_FAILED" | "I_AM_A_TEAPOT" | "MISDIRECTED_REQUEST" | "UNPROCESSABLE_ENTITY" | "LOCKED" | "FAILED_DEPENDENCY" | "TOO_EARLY" | "UPGRADE_REQUIRED" | "PRECONDITION_REQUIRED" | "TOO_MANY_REQUESTS" | "REQUEST_HEADER_FIELDS_TOO_LARGE" | "UNAVAILABLE_FOR_LEGAL_REASONS" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "BAD_GATEWAY" | "SERVICE_UNAVAILABLE" | "GATEWAY_TIMEOUT" | "HTTP_VERSION_NOT_SUPPORTED" | "VARIANT_ALSO_NEGOCIATES" | "INSUFFICIENT_STORAGE" | "LOOP_DETECTED" | "NOT_EXTENDED" | "NETWORK_AUTHENTICATION_REQUIRED";
declare type MaybePromise<Something> = Something | Promise<Something>;
interface HttpServerRouteResponseOptions<HttpServerState> {
    request: Readonly<IncomingMessage>;
    state: Readonly<HttpServerState>;
    parameters: Readonly<Record<string, string>>;
    queries: Readonly<Record<string, string>>;
    hash: Readonly<string>;
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
export declare const createHttpServer: <HttpServerState>(httpServerOptions: Readonly<HttpServerOptions<HttpServerState>>) => {
    startHttpServer: (startHttpServerOptions: Readonly<StartHttpServerOptions>) => Promise<void>;
};
export {};
