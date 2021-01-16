# Contributing

## Requirements

- [Git](https://git-scm.com/)
- [GitHub CLI](https://cli.github.com/)
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

## Installation

```console
$ git clone https://github.com/aminnairi/typescript-http-server
```

## Fork

```console
$ gh repo fork
```

## Issue

Pick an issue to work with.

```console
$ gh issue list
```

## Branch

```console
$ git branch branch-name
$ git checkout branch-name
```

Where `branch-name` is the name of the branch to create. Choose a branch name that is relevant to the issue to resolve.

## Dependencies

```console
$ npm install
```

## Resolution

Update the project until the issue is resolved.

## Tests

```console
$ npx ts-node example/FILE
```

Where `FILE` is the name of one of the files in the [`example`](./example) folder.

## Build

```console
$ npm run build
```

## Stage

```console
$ git add .
```

## Commit

```console
$ git commit --message "MESSAGE"
```

Where `MESSAGE` is the commit message. Choose a relevant commit message according to the issue resolved.

## Push

```console
$ git push --set-upstream-to origin branch-name
```

## Pull request

```console
$ gh pr create
```
