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

- connect it to the PWA with `UPSTREAM_PWA` in the form of `http(s)://<IP>:<PORT>`

For http, the server will run on default port 80.
If https is chosen as an upstream, it will run on default port 443.
In the latter case the files `server.key` and `server.crt` have to be supplied in the container folder `/etx/nginx` (either by volume mapping with `docker run` or in the image itself by `docker build`).

If the nginx container is run without further configuration, the default Angular CLI environment properties are not overridden.
Multiple PWA channels can be set up with the following environment variables:

- use `PWA_X_SUBDOMAIN`, `PWA_X_TOPLEVELDOMAIN` or `PWA_X_DOMAIN` for the channel domain
- use `PWA_X_CHANNEL` for the channel name
- use `PWA_X_APPLICATION` for the application name
- use `PWA_X_LANG` for the default locale in the form of `lang_COUNTRY`
- use `PWA_X_FEATURES` for a comma separated list of active feature toggles
- use `PWA_X_THEME` for setting the theme of the channel

The Page Speed configuration can also be overridden:

- set the environment variable `NPSC_ENABLE_FILTERS` to a comma-separated list of active [Page Speed Filters](https://www.modpagespeed.com/examples/) to override our carefully chosen defaults. Do this at your own risk!

Built-in features can be enabled and disabled:

- use `CACHE=off` to disable caching (default `on`)
- use `PAGESPEED=off` to disable pagespeed optimizations (default `on`)
- use `COMPRESSION=off` to disable compression (default `on`)
- use `DEVICE_DETECTION=off` to disable user-agent detection (default `on`)
- use `PROMETHEUS=on` to enable [Prometheus](https://prometheus.io) metrics exports on port `9113` (default `off`)

## Features

New features can be supplied in the folder `nginx/features`.
A file named `<feature>.conf` is included if the environment variable `<feature>` is set to `on`, `1`, `true` or `yes` (checked case in-sensitive).
The feature is disabled otherwise and an optional file `<feature>-off.conf` is included in the configuration.
The feature name must be all word-characters (letters, numbers and underscore).

### Disabling Cache

If the cache feature is switched off all caching for pre-rendered pages is disabled.
If the cache should also be disabled for static resources, the pagespeed feature also has to be switched off as it caches optimized images individually.

# Further References

- [Concept - Multi-Site Handling](../concepts/multi-site-handling.md)
- [Concept - Configuration](../concepts/configuration.md)
- [Concept - Logging](../concepts/logging.md)
- [Guide - Monitoring with Prometheus](./prometheus-monitoring.md)
