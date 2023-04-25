<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Logging

## Server-Side Rendering (SSR)

The _express.js_ image serving the Angular Universal Server-Side Rendering can be provisioned to log extended information to the console by supplying the environment variable `LOGGING=true`.

Information logged to the console contains the following:

- Requests to the SSR process are logged with [morgan](https://github.com/expressjs/morgan) (see configuration in _server.ts_) in the form of:

  `<method> <url> <status> <bytes> - <duration> ms`

- Requests handled by the SSR process are logged at the beginning with `SSR <url>` and at the end with `RES <status> <url>`.

- Further the redirect actions of the [Hybrid Approach](./hybrid-approach.md) are logged with `RED <url>`.

- Uncaught `Error` objects thrown in the SSR process, including `HttpErrorResponse` and runtime errors are printed as well.

## NGINX

The NGINX image providing multi-channel configuration uses the default logging capabilities of [nginx](https://www.nginx.com/).
You can enable `json` formatted logging by passing environment variable `LOGFORMAT=json` to the container.
When no `LOGFORMAT` variable is passed the container uses `main` as its default format.

Additionally the environment variable `DEBUG=true` will provide even more debugging output in the NGINX logs.

- [Configure Logging](https://docs.nginx.com/nginx/admin-guide/monitoring/logging/)
- [Debugging Nginx Configuration](https://easyengine.io/tutorials/nginx/debugging/)

## Logging to an External Device

Within PWA development systems, information from the SSR and NGINX containers can be stored in external log files for analysis purposes.
When launching your PWA as a Docker image/container, you can copy the log information from the containers which can be stored in the local file system using Docker volumes.
Enabled volumes allow you to write SSR and NGINX logs in local Unix/Windows directories.

The path is composed as follows:

- `d:/pwa/logs` - The local Windows/Unix directory of the development machine where the logs should be stored.
- `/var/log/` - The log location in the SSR/NGINX container.

To enable the logging to volumes copy the below examples to the according docker compose sections.

### PWA (SSR with PM2)

```yaml
volumes:
  - d:/pwa/logs:/.pm2/logs/
```

### NGINX

```yaml
volumes:
  - d:/pwa/logs:/var/log/
```

## Further References

- [Guide - Building and Running Server-Side Rendering](../guides/ssr-startup.md)
- [Guide - Building and Running nginx Docker Image](../guides/nginx-startup.md)
