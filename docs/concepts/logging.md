<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Logging

- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
  - [Enable Logging](#enable-logging)
  - [Disable Logging](#disable-logging)
  - [Log Format](#log-format)
- [NGINX](#nginx)
  - [Enable Logging](#enable-logging-1)
  - [Disable Logging](#disable-logging-1)
  - [Log Format](#log-format-1)
- [Container Log Management](#container-log-management)
- [Further References](#further-references)

## Server-Side Rendering (SSR)

The _express.js_ server that handles Angular Universal Server-Side Rendering can log extended information to the console.

```yaml
# docker-compose.yml
services:
  pwa:
    environment:
      LOGGING: 'true'
      # LOG_ALL: 'false'
      # LOGFORMAT: 'json'
      # LOGLEVEL: 'warn'
```

### Enable Logging

`LOGGING=true` enables logging.

`LOG_ALL` applies to outbound HTTP requests from the SSR application to the ICM.
When commented out (default), the [Dockerfile](../../Dockerfile) default `LOG_ALL=true` is used.

The outbound HTTP request logs are filtered by the `LOGLEVEL` setting:

| LOG_ALL | LOGLEVEL | Logged Status Codes |
| ------- | -------- | ------------------- |
| true    | info     | 2xx, 3xx, 4xx, 5xx  |
| true    | warn     | 4xx, 5xx            |
| true    | error    | 5xx                 |
| false   | info     | 4xx, 5xx            |
| false   | warn     | 4xx, 5xx            |
| false   | error    | 5xx                 |

Other SSR logs (application errors, startup messages, SSR rendering failures) are filtered by `LOGLEVEL` only, independent of `LOG_ALL`.

When `LOGLEVEL` is commented out (default), the log level `warn` is used.

### Disable Logging

`LOGGING=false` disables logging where `LOG_ALL` and `LOGLEVEL` are ignored.

To disable all SSR application logs:

```yaml
# docker-compose.yml
services:
  pwa:
    environment:
      LOGGING: 'false'
      LOG_ALL: 'false'
      # LOGFORMAT: 'json'
```

> NOTE: PM2 process manager logs will still appear as they are infrastructure-level logs.

### Log Format

The SSR application supports two log formats controlled by the environment variable `LOGFORMAT`:

- No `LOGFORMAT` variable (default): Requests to the SSR process are logged using [morgan](https://github.com/expressjs/morgan) (see configuration in _server.ts_) in the format: `<method> <url> <status> <bytes> - <duration> ms`
- `LOGFORMAT=json`: Uses [pino](https://github.com/pinojs/pino) for high-performance structured JSON logs compliant with the [Elastic Common Schema (ECS) v8.11](https://www.elastic.co/guide/en/ecs/current/index.html) specification, including log levels `info`, `warn`, and `error`

Both log formats include the following common log entries:

- PM2 process identifiers, automatically prefixed with `PM2`
- Redirect actions of the [Hybrid Approach](./hybrid-approach.md) are logged with `RED <url>` (in JSON mode this text is in the `"message"` field of the structured log entry)
- Uncaught `Error` objects thrown in the SSR process, including `HttpErrorResponse` and runtime errors (in JSON mode error details are included in the structured log entry)

When using the default plain text format (no `LOGFORMAT` variable), additional SSR-specific logs appear (only when `LOG_ALL=true`):

- `SSR <url>` is logged at the beginning of SSR processing
- `RES <status> <url>` is logged at the end of SSR processing

## NGINX

The NGINX image that provides multi-channel configuration uses the default logging capabilities of [nginx](https://www.nginx.com/).

```yaml
# docker-compose.yml
services:
  nginx:
    environment:
      # LOG_ALL: 'false'
      # LOGFORMAT: 'json'
      # LOGLEVEL: 'warn'
      # DEBUG: 1
```

### Enable Logging

`LOG_ALL=true` enables the logging of incoming requests to NGINX.
There is no `LOGGING` variable for NGINX.
When commented out (default), the NGINX [Dockerfile](../../nginx/Dockerfile) default `LOG_ALL=true` is used.

The incoming HTTP request logs are filtered by the `LOGLEVEL` setting:

| LOG_ALL | LOGLEVEL | Logged Status Codes |
| ------- | -------- | ------------------- |
| true    | info     | 2xx, 3xx, 4xx, 5xx  |
| true    | warn     | 4xx, 5xx            |
| true    | error    | 5xx                 |
| false   | info     | 4xx, 5xx            |
| false   | warn     | 4xx, 5xx            |
| false   | error    | 5xx                 |

When commented out (default), the log level `warn` is used.

> NOTE: Additionally, the environment variable `DEBUG=true` provides even more debugging output in the NGINX logs.

### Disable Logging

To disable all NGINX logs (except 4xx/5xx errors):

```yaml
# docker-compose.yml
services:
  nginx:
    environment:
      LOG_ALL: 'false'
      # LOGFORMAT: 'json'
      # LOGLEVEL: 'warn'
      # DEBUG: 1
```

### Log Format

NGINX supports two log formats controlled by the environment variable `LOGFORMAT`:

- No `LOGFORMAT` variable (default): The container uses `main` as its default format
- `LOGFORMAT=json`: The container uses nginx's built-in JSON logging compliant with the [Elastic Common Schema (ECS) v8.11](https://www.elastic.co/guide/en/ecs/current/index.html) specification

## Container Log Management

The SSR and NGINX containers write all logs exclusively to stdout and stderr.
This approach replaces the former "Logging to an External Device" method.
Mounting volumes to read log files inside containers is now deprecated in favor of Docker's built-in logging mechanisms based on stdout/stderr.

## Further References

- [Guide - Building and Running Server-Side Rendering](../guides/ssr-startup.md)
- [Guide - Building and Running nginx Docker Image](../guides/nginx-startup.md)
