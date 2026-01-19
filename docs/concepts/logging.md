<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Logging

- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
  - [Log Format](#log-format)
  - [Log Level Configuration](#log-level-configuration)
- [NGINX](#nginx)
  - [Log Format](#log-format-1)
  - [Log Level Configuration](#log-level-configuration-1)
- [Container Log Management](#container-log-management)
- [Further References](#further-references)

## Server-Side Rendering (SSR)

The _express.js_ server that handles Angular Universal Server-Side Rendering can log extended information to the console when the environment variable `LOGGING=true` is set (default).

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

`LOG_ALL` applies only to outbound requests from the SSR application.

When commented out (default), the [Dockerfile](../../Dockerfile) default `LOG_ALL=on` is used, which causes all outbound HTTP requests to ICM to be logged.

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
- `LOGFORMAT='json'`: Uses [pino](https://github.com/pinojs/pino) for high-performance structured JSON logs compliant with the [Elastic Common Schema (ECS) v8.11](https://www.elastic.co/guide/en/ecs/current/index.html) specification, including log levels `info`, `warn`, and `error`

Both log formats include the following common log entries:

- PM2 process identifiers, automatically prefixed with `PM2`
- Redirect actions of the [Hybrid Approach](./hybrid-approach.md) are logged with `RED <url>` (in JSON mode this text is in the `"message"` field of the structured log entry)
- Uncaught `Error` objects thrown in the SSR process, including `HttpErrorResponse` and runtime errors (in JSON mode error details are included in the structured log entry)

When using the default plain text format (no `LOGFORMAT` variable), additional SSR-specific logs appear (only when `LOG_ALL=true`):

- `SSR <url>` is logged at the beginning of SSR processing
- `RES <status> <url>` is logged at the end of SSR processing

### Log Level Configuration

The `LOGLEVEL` environment variable controls which log messages are output based on severity:

- `info` - Logs all messages (info, warn, error)
- `warn` - Logs warnings and errors only (default)
- `error` - Logs errors only

When commented out (default), the log level `warn` is used.

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

When `LOG_ALL` is commented out (default), the NGINX [Dockerfile](../../nginx/Dockerfile) default `LOG_ALL=on` is used, which logs all requests.

Additionally, the environment variable `DEBUG=true` provides even more debugging output in the NGINX logs.

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
- `LOGFORMAT='json'`: The container uses nginx's built-in JSON logging compliant with the [Elastic Common Schema (ECS) v8.11](https://www.elastic.co/guide/en/ecs/current/index.html) specification

### Log Level Configuration

The `LOGLEVEL` environment variable controls which log messages are output based on HTTP status code severity:

- `info` - Logs all responses (2xx, 3xx, 4xx, 5xx)
- `warn` - Logs warnings and errors only: 4xx and 5xx (default)
- `error` - Logs errors only: 5xx

When commented out (default), the log level `warn` is used.

> **Note:** `LOGLEVEL` works in combination with `LOG_ALL`. Both filters must allow logging for a request to be logged:
>
> | LOG_ALL | LOGLEVEL | Logged Status Codes |
> | ------- | -------- | ------------------- |
> | on      | info     | 2xx, 3xx, 4xx, 5xx  |
> | on      | warn     | 4xx, 5xx            |
> | on      | error    | 5xx                 |
> | off     | info     | 4xx, 5xx            |
> | off     | warn     | 4xx, 5xx            |
> | off     | error    | 5xx                 |

## Container Log Management

The SSR and NGINX containers write all logs exclusively to stdout and stderr.
This approach replaces the former "Logging to an External Device" method.
Mounting volumes to read log files inside containers is now deprecated in favor of Docker's built-in logging mechanisms based on stdout/stderr.

## Further References

- [Guide - Building and Running Server-Side Rendering](../guides/ssr-startup.md)
- [Guide - Building and Running nginx Docker Image](../guides/nginx-startup.md)
