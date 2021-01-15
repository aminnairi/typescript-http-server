# typescript-http-server

Typescript library for declaratively creating a HTTP server.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

## Installation

```console
$ npm install typescript @types/node ts-node tslib
$ git clone https://github.com/aminnairi/typescript-http-server typescript_modules/aminnairi/typescript-http-server
```

## Usage

```console
$ touch main.ts
```

```typescript
import {createHttpServer} from "./typescript_modules/aminnairi/typescript-http-server";

// ...
```

```console
$ touch tsconfig.json
```

```json
{
  "compilerOptions": {
    "downlevelIteration": true,
    "lib": ["es2019"]
  }
}
```

```console
$ npx ts-node main.ts
Server started on http://127.0.0.1:8000
```

## Examples

See [`example`](./example).

## License

See [`LICENSE`](./LICENSE).

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## TODO

- Custom `join` function.
