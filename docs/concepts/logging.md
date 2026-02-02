<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Logging

- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
  - [Log Level](#log-level)
  - [Log Format](#log-format)
  - [Log Details](#log-details)
- [NGINX](#nginx)
  - [Log Level](#log-level-1)
  - [Log Format](#log-format-1)
  - [Log Debug](#log-debug)
- [Container Log Management](#container-log-management)
- [Request Tracing](#request-tracing)
- [Further References](#further-references)

## Server-Side Rendering (SSR)

The _express.js_ server that handles Angular Universal server-side rendering can log extended information.

```yaml
# docker-compose.yml
services:
  pwa:
    environment:
      LOGLEVEL: 'info' # trace, debug, info, warn, error, fatal - default: error
      LOGFORMAT: 'json' # text, json - default: json (ECS-compatible)
```

### Log Level

The log level is controlled by the environment variable `LOGLEVEL` with the levels `trace`, `debug`, `info`, `warn`, `error` (default) and `fatal`.

When HTTP requests and responses are logged, the log level is determined by the response status code:

- 2xx and 3xx: `info`
- 4xx: `warn`
- 5xx: `error` (default)

### Log Format

The SSR application supports two log formats controlled by the environment variable `LOGFORMAT`:

- `json` (default): Uses [pino](https://github.com/pinojs/pino) for high-performance structured JSON logs compliant with the [Elastic Common Schema (ECS)](https://www.elastic.co/guide/en/ecs/current/index.html) specification
- `text`: Uses pino with [pino-pretty](https://github.com/pinojs/pino-pretty) for human-readable text logs

### Log Details

SSR request processing produces two separate log entries with different `message` field values:

- `SSR`: Logged when SSR starts processing a request (always at `info` level)
- `RES`: Logged when SSR finishes processing and sends the response (log level depends on response status code)

Redirect actions of the [Hybrid Approach](./hybrid-approach.md) are logged with `RED (Hybrid redirect)`.

PM2 process manager logs will still appear regardless of the `LOGLEVEL` configuration, as they are infrastructure-level logs.

## NGINX

The NGINX image that provides multi-channel configuration uses custom logging formats for structured output.

```yaml
# docker-compose.yml
services:
  nginx:
    environment:
      LOGLEVEL: 'info' # info (all), warn (4xx+5xx), error (5xx) - default: error
      LOGFORMAT: 'json' # text, json - default: json (ECS-compatible)
      # DEBUG: 1
```

### Log Level

The log level is controlled by the environment variable `LOGLEVEL` with the levels `info`, `warn` and `error` (default).

HTTP requests and responses are logged with log levels based on the response status code:

- 2xx and 3xx: `info`
- 4xx: `warn`
- 5xx: `error` (default)

### Log Format

NGINX supports two log formats controlled by the environment variable `LOGFORMAT`:

- `json` (default): Uses a custom-defined JSON log format compliant with the [Elastic Common Schema (ECS)](https://www.elastic.co/guide/en/ecs/current/index.html) specification
- `text`: Uses a plain text log format

### Log Debug

The environment variable `DEBUG=1` enables verbose debugging output in the NGINX logs.

## Container Log Management

Both the SSR and NGINX containers write all logs exclusively to stdout.

## Request Tracing

Both NGINX and SSR logs include a `trace.id` field that allows correlating all log entries for a single request across the entire stack.

1. When a request arrives at NGINX, it either uses an incoming `X-Request-ID` header (from an upstream proxy/CDN) or generates a new UUID.
2. NGINX forwards this ID to SSR via the `X-Request-ID` header.
3. SSR includes the trace ID in all its logs (SSR start, ICM API calls, response).
4. The `X-Request-ID` is returned in the response header for client-side debugging.

Simplified log sequence with the same `trace.id` and `LOGLEVEL=info`:

| timestamp      | trace.id | logger            | message                          | url                     |
| -------------- | -------- | ----------------- | -------------------------------- | ----------------------- |
| 15:00:57.040   | 2f832... | Server            | SSR                              | /en/home;lang=en_US;... |
| 15:00:57.284   | 2f832... | SSRLogInterceptor | GET                              | .../configurations      |
| ...            | ...      | SSRLogInterceptor | GET                              | (more ICM API calls)    |
| 15:00:57.696   | 2f832... | Server            | RES                              | /en/home;lang=en_US;... |
| 15:00:57.696   | 2f832... | Server            | GET                              | /en/home;lang=en_US;... |
| 15:00:57+00:00 | 2f832... | nginx             | GET /en/home 200 16555 - 0.661 s | /en/home                |

When NGINX serves a cached response (`nginx.cache.status` field indicates `HIT`), only the NGINX log entry appears (SSR is not involved).

The nginx logs include a `nginx.timestamp_ms` field containing the Unix epoch timestamp in milliseconds, which can be useful for precise timing analysis and log correlation.

## Further References

- [Guide - Building and Running Server-Side Rendering](../guides/ssr-startup.md)
- [Guide - Building and Running nginx Docker Image](../guides/nginx-startup.md)
