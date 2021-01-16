"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpServer = void 0;
var url_1 = require("url");
var http_1 = require("http");
var path_1 = require("path");
var trimLeft = function (character, text) {
    if (text.startsWith(character)) {
        return text.slice(1);
    }
    return text;
};
var trimRight = function (character, text) {
    if (text.endsWith(character)) {
        return text.slice(0, -1);
    }
    return text;
};
var matchPath = function (pathPattern, path) {
    var SEPARATOR = "/";
    var pathNormalized = "" + SEPARATOR + trimRight(SEPARATOR, trimLeft(SEPARATOR, path));
    var pathPatternNormalized = "^" + SEPARATOR + trimRight(SEPARATOR, trimLeft(SEPARATOR, pathPattern.replace(/:(\w+)/gu, "(?<$1>[^\/]*)"))) + "$";
    var pattern = new RegExp(pathPatternNormalized, "gu");
    var result = pattern.exec(pathNormalized);
    return result;
};
var getPathParameters = function (pathPattern, path) {
    var result = matchPath(pathPattern, path);
    if (result === null) {
        return {};
    }
    if ("undefined" === typeof result.groups) {
        return {};
    }
    return result.groups;
};
var isPathMatching = function (pathPattern, path) {
    return matchPath(pathPattern, path) !== null;
};
var HTTP_STATUS = {
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
var allRoutes = function (routes) {
    return routes.reduce(function (previousRoutes, route) {
        if (route.children.length > 0) {
            return __spread(previousRoutes, [
                route
            ], allRoutes(route.children.map(function (child) {
                return __assign(__assign({}, child), { middlewares: __spread(route.middlewares, child.middlewares), path: path_1.join(route.path, child.path) });
            })));
        }
        return __spread(previousRoutes, [route]);
    }, []);
};
var createHttpServer = function (httpServerOptions) {
    var startHttpServer = function (startHttpServerOptions) {
        return new Promise(function (resolve) {
            http_1.createServer(function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
                var fallbackRoute, flattenRoutes, foundRoute, state, requestUrl, parameters, queries, hash, _a, _b, middleware, middlewareResponse, e_1_1, foundRouteResponse;
                var e_1, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            fallbackRoute = { prefix: "", name: "Not found", version: 0, path: request.url || "", method: "GET", middlewares: [], response: httpServerOptions.fallback };
                            flattenRoutes = allRoutes(httpServerOptions.routes);
                            foundRoute = flattenRoutes.find(function (route) {
                                if (typeof request.url === "undefined") {
                                    return false;
                                }
                                var requestUrl = new url_1.URL("http://" + (request.headers.host || "localhost") + request.url);
                                return route.method === request.method && isPathMatching(path_1.join(route.prefix, "/" + (route.version ? "v" + route.version : "") + "/", route.path), requestUrl.pathname);
                            }) || fallbackRoute;
                            state = httpServerOptions.initialState;
                            requestUrl = new url_1.URL("http://" + (request.headers.host || "127.0.0.1") + request.url);
                            parameters = getPathParameters(path_1.join(foundRoute.prefix, "/" + (foundRoute.version ? "v" + foundRoute.version : "") + "/", foundRoute.path), requestUrl.pathname);
                            queries = Object.fromEntries(__spread(requestUrl.searchParams));
                            hash = requestUrl.hash;
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 6, 7, 8]);
                            _a = __values(__spread(httpServerOptions.middlewares, foundRoute.middlewares)), _b = _a.next();
                            _d.label = 2;
                        case 2:
                            if (!!_b.done) return [3 /*break*/, 5];
                            middleware = _b.value;
                            return [4 /*yield*/, middleware.response({ request: request, state: state, parameters: parameters, queries: queries, hash: hash })];
                        case 3:
                            middlewareResponse = _d.sent();
                            if (!middlewareResponse.next) {
                                return [2 /*return*/, response.writeHead(HTTP_STATUS[middlewareResponse.status]).end(middlewareResponse.body)];
                            }
                            state = middlewareResponse.state;
                            _d.label = 4;
                        case 4:
                            _b = _a.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _d.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8:
                            if (typeof request.url === "undefined") {
                                return [2 /*return*/, response.writeHead(404).end("Not found")];
                            }
                            return [4 /*yield*/, foundRoute.response({ request: request, state: state, parameters: parameters, queries: queries, hash: hash })];
                        case 9:
                            foundRouteResponse = _d.sent();
                            return [2 /*return*/, response.writeHead(HTTP_STATUS[foundRouteResponse.status], foundRouteResponse.headers).end(foundRouteResponse.body)];
                    }
                });
            }); }).listen(startHttpServerOptions.port, startHttpServerOptions.host, function () {
                resolve();
            });
        });
    };
    return { startHttpServer: startHttpServer };
};
exports.createHttpServer = createHttpServer;
