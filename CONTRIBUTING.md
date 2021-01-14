# Contributing

## Requirements

- Git
- GitHub CLI
- Docker
- Docker Compose
- GNU/Make

## Installation

```console
$ git clone https://github.com/
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
$ make install
```

## NPM

```console
$ docker-compose run --rm npm COMMAND
```

Where `COMMAND` is the command to run with NPM.

## NPX

```console
$ docker-compose run --rm --service-ports npx ts-node example/simple.ts
```

## Update

Update the project until the issue is resolved.

## Tests

```console
$ docker-compose run --rm npx ts-node example/FILE
```

Where `FILE` is the name of one of the files in the [`example`](./example) folder.

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
