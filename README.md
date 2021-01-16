# typescript-http-server

Typescript library for declaratively creating a HTTP server.

![Package](https://github.com/aminnairi/typescript-http-server/workflows/Package/badge.svg)

## Warning

> *Do not use this library without TypeScript since there are no JavaScript runtime type checking made when using this library after transpilation. Use it at your own risks!*

## Requirements

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

## Installation

```console
$ npm install typescript ts-node tslib @types/node
$ npm install --registry=https://npm.pkg.github.com @aminnairi/typescript-http-server
```

## Usage

```console
$ touch index.ts
```

Copy the content of [`examples/simple.ts`](./examples/simple.ts) to the `index.ts` created file.

```console
$ npx ts-node index.ts
```

Navigate to [`127.0.0.1:8000/ping`](http://127.0.0.1:8000/ping).

## Examples

See [`example`](./example).

## License

See [`LICENSE`](./LICENSE).

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).
