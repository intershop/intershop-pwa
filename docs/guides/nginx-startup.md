<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Building and Running nginx Docker Image

We provide a docker image based on [nginx](https://www.nginx.com/) for the [PWA deployment](../concepts/pwa-building-blocks.md#pwa---nginx).

## Building

The docker image can be built by running a docker build with the `Dockerfile` located in the `nginx` folder.

## Configuration

Mandatory environment variables:

- Connect it to the PWA with `UPSTREAM_PWA` in the form of `http(s)://<IP>:<PORT>`

For HTTP, the server will run on default port 80.
If HTTPS is chosen as an upstream, it will run on default port 443.
In the latter case the files `server.key` and `server.crt` have to be supplied in the container folder `/etx/nginx` (either by volume mapping with `docker run` or in the image itself by `docker build`).

### Multi-Site

If the nginx container is run without further configuration, the default Angular CLI environment properties are not overridden.
Multiple PWA channels can be set up by supplying a [YAML](https://yaml.org) configuration listing all domains the PWA should work for.

For more information on the multi-site syntax, refer to [Multi-Site Configurations](../guides/multi-site-configurations.md#Syntax)

The configuration can be supplied simply by setting the environment variable `MULTI_CHANNEL`.
Alternatively, the source can be supplied by setting `MULTI_CHANNEL_SOURCE` in any [supported format by gomplate](https://docs.gomplate.ca/datasources).
If no environment variables for multi-channel configuration are given, the configuration will fall back to the content of [`nginx/multi-channel.yaml`](../../nginx/multi-channel.yaml), which can also be customized.

> :warning: Multi-Channel configuration with context paths does not work in conjunction with [service workers](../concepts/progressive-web-app.md#service-worker)

An extended list of examples can be found in the [Multi-Site Configurations](../guides/multi-site-configurations.md#Syntax) guide.

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

### Disabling Cache

If the cache feature is switched off, all caching for pre-rendered pages is disabled.
If the cache should also be disabled for static resources, the page speed feature has to be switched off as well as it caches optimized images individually.

# Further References

- [Concept - Multi-Site Handling](../concepts/multi-site-handling.md)
- [Concept - Configuration](../concepts/configuration.md)
- [Concept - Logging](../concepts/logging.md)
- [Concept - Single Sign-On (SSO) for PWA](../concepts/sso.md)
- [Guide - Monitoring with Prometheus](./prometheus-monitoring.md)
