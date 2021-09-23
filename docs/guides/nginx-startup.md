<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Building and Running NGINX Docker Image

We provide a docker image based on [nginx](https://www.nginx.com/) for the [PWA deployment](../concepts/pwa-building-blocks.md#pwa---nginx).

## Building

The docker image can be built by running a docker build with the `Dockerfile` located in the `nginx` folder.

## Configuration

Mandatory environment variables:

- Connect it to the PWA with `UPSTREAM_PWA` in the form of `http(s)://<IP>:<PORT>`

For HTTP, the server will run on default port 80.
If HTTPS is chosen as an upstream, it will run on default port 443.
In the latter case the files `server.key` and `server.crt` have to be supplied in the container folder `/etx/nginx` (either by volume mapping with `docker run` or in the image itself by `docker build`).

### Basic Auth

For deploying to test environments that should not be indexed by search bots or should not be accessible by the public, the nginx container can be set up with basic authentication.
Just supply a single user-password combination as environment variable, i.e. `BASIC_AUTH=<user>:<password>`.
You can also whitelist IPs by supplying a YAML list to the environment variable `BASIC_AUTH_IP_WHITELIST`:

```yaml
nginx:
  environment:
    BASIC_AUTH: 'developer:!InterShop00!'
    BASIC_AUTH_IP_WHITELIST: |
      - 172.22.0.1
      - 1.2.3.4
```

Entries of the IP whitelist are added to the nginx config as [`allow`](http://nginx.org/en/docs/http/ngx_http_access_module.html) statements, which also supports IP ranges.
Please refer to the linked nginx documentation on how to configure this.

After activating basic authentication for your setup globally you can also selectively deactivate it per site.
See [Multi-Site Configurations](../guides/multi-site-configurations.md#Examples) for examples on how to do that.

### Multi-Site

If the nginx container is run without further configuration, the default Angular CLI environment properties are not overridden.
Multiple PWA channels can be set up by supplying a [YAML](https://yaml.org) configuration listing all domains the PWA should work for.

For more information on the multi-site syntax, refer to [Multi-Site Configurations](../guides/multi-site-configurations.md#Syntax)

The configuration can be supplied simply by setting the environment variable `MULTI_CHANNEL`.
Alternatively, the source can be supplied by setting `MULTI_CHANNEL_SOURCE` in any [supported format by gomplate](https://docs.gomplate.ca/datasources/).
If no environment variables for multi-channel configuration are given, the configuration will fall back to the content of [`nginx/multi-channel.yaml`](../../nginx/multi-channel.yaml), which can also be customized.

> :warning: Multi-Channel configuration with context paths does not work in conjunction with [service workers](../concepts/progressive-web-app.md#service-worker)

An extended list of examples can be found in the [Multi-Site Configurations](../guides/multi-site-configurations.md#Syntax) guide.

### Ignore parameters during caching

Often, nginx receives requests from advertising networks or various user agents that append unused query parameters when making a request, for example `gclid` or `utm_source`. <br>
These parameters can lead to inefficient caching because even if the same URL is requested multiple times, if it is accessed with different query parameters, the cached version will not be used.

To prevent this, you can define any number of blacklisted parameters that will be ignored by nginx during caching.

As with multi-site handling above, the configuration can be supplied simply by setting the environment variable `CACHING_IGNORE_PARAMS`. <br>
Alternatively, the source can be supplied by setting `CACHING_IGNORE_PARAMS_SOURCE` in any [supported format by gomplate](https://docs.gomplate.ca/datasources/).
Be aware that the supplied list of parameters must be declared under a `params` property.

If no environment variables for ignoring parameters are given, the configuration will fall back to the content of [`nginx/caching-ignore-params.yaml`](../../nginx/caching-ignore-params.yaml), which can also be customized.

### Other

The page speed configuration can also be overridden:

- Set the environment variable `NPSC_ENABLE_FILTERS` to a comma-separated list of active [Page Speed Filters](https://www.modpagespeed.com/examples/) to override our carefully chosen defaults. Do this at your own risk.

Built-in features can be enabled and disabled:

- `CACHE=off` disables caching (default `on`)
- `PAGESPEED=off` disables pagespeed optimizations (default `on`)
- `COMPRESSION=off` disables compression (default `on`)
- `DEVICE_DETECTION=off` disables user-agent detection (default `on`)
- `PROMETHEUS=on` enables [Prometheus](https://prometheus.io) metrics exports on port `9113` (default `off`)

## Features

New features can be supplied in the folder `nginx/features`.
A file named `<feature>.conf` is included if the environment variable `<feature>` is set to `on`, `1`, `true` or `yes` (checked case in-sensitive).
The feature is disabled otherwise and an optional file `<feature>-off.conf` is included in the configuration.
The feature name must be all word-characters (letters, numbers and underscore).

### Cache

If the cache feature is switched off, all caching for pre-rendered pages is disabled.
If the cache should also be disabled for static resources, the page speed feature has to be switched off as well as it caches optimized images individually.

The cache duration for pre-rendered pages can be customized using `CACHE_DURATION_NGINX_OK` (for successful responses) and `CACHE_DURATION_NGINX_NF` (for 404 responses).
The value supplied must be in the `time` format that is supported by [nginx proxy_cache_valid](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid)

# Further References

- [Concept - Multi-Site Handling](../concepts/multi-site-handling.md)
- [Concept - Configuration](../concepts/configuration.md)
- [Concept - Logging](../concepts/logging.md)
- [Concept - Single Sign-On (SSO) for PWA](../concepts/sso.md)
- [Guide - Monitoring with Prometheus](./prometheus-monitoring.md)
