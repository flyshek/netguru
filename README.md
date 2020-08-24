# Netguru: Recriutment Task
An simple RESTful Service in Node.js + TypeScript as a recriutment task for Netguru. This task should be send back up to **27 August 2020 12:00**.

### Usage

```bash
# You don't
```

### Required Endpoints
- POST /movies:
  - Based on passed data, other movie details should be fetched from http://www.omdbapi.com/ (or other similar, public movie database) - and saved to application database.
- GET /movies:
  - Should fetch list of all movies already present in application database.
- POST /comments:
  - Comment should be saved to application database
- GET /comments:
  - Should fetch list of all comments present in application database.

### Rules and Hints
- Please consider those requirements as basic. We value a good code structure or additional functionalities.
- During implementing the assignment use many different and appropriate layers (i.e. middleware), design patterns (i.e. serializers), and so on.
- Don’t forget to test appropriate amount of code.
- Usage of latest ECMAScript/TypeScript standard and features is encouraged.
- The application's code should be kept in a public repository so that we can read it, pull it and build it ourselves. Remember to include README file or at least basic notes on application requirements and setup - we should be able to easily and quickly get it running.
- Please dockerize your application.
- Written application must be hosted and publicly available for us online - we recommend Heroku.

## License

[MIT](./LICENSE) @ Jakub Olan
