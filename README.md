# Nest Start

## Description

Nest.js example containing technologies such as jtw auth, prisma, redis

## API Docs

{host}/swagger

## Installation

- create .env

## Running the app

```bash
# development
$ docker compose up -d --build

# production
Use ./Dockerfile
```

## Database

```bash
# DB Push
$ npx prisma db push

# DB Migrate
$ npx prisma migrate dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
