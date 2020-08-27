# Netguru: Recriutment Task

I've decided to build this project on [Express]() and [TypeScript]() because I was unsure about [Fastify]() usage,
additionally I was unsure for database so I've most common solution for Node.js application - [MongoDB]().

> I was thinking about creation of Postman documentation for that API but I've realized that was out of scope and you
> provided informations about routers so you have documentation already.

> I hope Netguru like spaggetti <3

### Usage

I've prepared some automatic unit tests based on `ava`, `build` command which uses `craftpack` because of simplicity, it
doesn't differ much from `tsc` but I prefer output in single file. `start` command is also based on my own webpack-based
builder called `craftpack`, generally I'm using it with nodemon to save some time on repo setup.

```bash
$ git clone https://github.com/ZiQiLN/netguru.git netguru
$ cd netguru && yarn
$ docker-compose -f "docker-compose.yml" up -d --build
$ yarn test # Better avoid this cringe
$ yarn start
# Your application is running on http://localhost:3600
```

If you have problems with running application, I've tested it with with following specs, `Dockerfile` should work
perectly but application may depend on Node.js version - Matrix testing was never an option.

```bash
node@12.18.3
yarn@1.22.4
docker@19.03.13-beta2
docker-compose@1.26.2
```

### Documentation

There is prepared
[Postman Documentation](https://documenter.getpostman.com/view/7188078/TVCZZAzf#67303641-9acd-41ed-8ad0-885f591d57f5)
which will introduce your to all available requests and how to use them.

### Docker

Docker image is availabe on Dockerhub as `ziqiln/netguru:latest`, feel free to pull and run, it will use default port
(`3600`).

#### Tests

You can check actual code with `yarn test` or `yarn coverage`. I'm putting here coverage report from tests, at fact they
aren't much accurate but they exist - I'm not best at writting tests.

```
  4 tests passed
  4 tests todo
------------------------|---------|----------|---------|---------|------------------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|------------------------------
All files               |   76.87 |    60.71 |   55.17 |   79.53 |
 src                    |   71.43 |       50 |   38.46 |   75.56 |
  index.ts              |   71.43 |       50 |   38.46 |   75.56 | 34-35,68,72-75,86,90,101-102
 src/comments           |      68 |      100 |      60 |      68 |
  comment.model.ts      |     100 |      100 |     100 |     100 |
  comments.service.ts   |      60 |      100 |      50 |      60 | 13-41
  index.ts              |     100 |      100 |     100 |     100 |
 src/middleware         |     100 |      100 |     100 |     100 |
  winston.middleware.ts |     100 |      100 |     100 |     100 |
 src/movies             |   81.58 |       50 |   66.67 |   81.08 |
  index.ts              |     100 |      100 |     100 |     100 |
  movie.model.ts        |     100 |      100 |     100 |     100 |
  movie.service.ts      |   78.79 |       50 |    62.5 |   78.13 | 85,92-99,121-123
 src/utils              |   88.89 |       75 |     100 |     100 |
  env.ts                |     100 |     87.5 |     100 |     100 | 6
  helpers.ts            |   77.78 |       50 |     100 |     100 | 5-10
------------------------|---------|----------|---------|---------|------------------------------
```

### Required Endpoints

- POST /movies:
  - Based on passed data, other movie details should be fetched from http://www.omdbapi.com/ (or other similar, public
    movie database) - and saved to application database.
- GET /movies:
  - Should fetch list of all movies already present in application database.
- POST /comments:
  - Comment should be saved to application database
- GET /comments:
  - Should fetch list of all comments present in application database.

### Rules and Hints

- Please consider those requirements as basic. We value a good code structure or additional functionalities.
- During implementing the assignment use many different and appropriate layers (i.e. middleware), design patterns (i.e.
  serializers), and so on.
- Don’t forget to test appropriate amount of code.
- Usage of latest ECMAScript/TypeScript standard and features is encouraged.
- The application's code should be kept in a public repository so that we can read it, pull it and build it ourselves.
  Remember to include README file or at least basic notes on application requirements and setup - we should be able to
  easily and quickly get it running.
- Please dockerize your application.
- Written application must be hosted and publicly available for us online - we recommend Heroku.

## License

[MIT](./LICENSE) @ Jakub Olan
