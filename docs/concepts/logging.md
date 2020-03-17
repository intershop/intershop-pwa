# Concept - Logging

## nginx

The nginx image providing [PageSpeed](https://www.modpagespeed.com/) and Multi-Channel configuration uses the default logging capabilities of [nginx](https://www.nginx.com/).

- [Configure Logging](https://docs.nginx.com/nginx/admin-guide/monitoring/logging/)
- [Debugging Nginx Configuration](https://easyengine.io/tutorials/nginx/debugging/)

## Server-Side Rendering

The express.js image serving the Angular Universal Server-Side Rendering can be provisioned to log extended information to the console by supplying the environment variable `LOGGING=true`.

Information logged to the console contains the following:

- Requests to the SSR process are logged with [morgan](https://github.com/expressjs/morgan) (see configuration in `server.ts`) in the form of:

  `<method> <url> <status> <bytes> - <duration> ms`

- Requests handled by the SSR process are logged at the beginning with `SSR <url>` and at the end with `RES <status> <url>`

- Further the redirect actions of the [Hybrid Approach](./hybrid-approach.md) are logged with `RED <url>`

- Also printed are uncaught `Error` objects thrown in the SSR process, including `HttpErrorResponse` and runtime errors.
