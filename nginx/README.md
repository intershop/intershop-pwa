# nginx Docker Image for Intershop Progressive Web App

This sub project provides a docker image of [nginx](https://www.nginx.com/) supplying the following capabilities:

- [PageSpeed Module](https://www.modpagespeed.com/) for browser optimization
- Enabled compression for downstream services
- Caching for PWA Universal responses
- Easy to configure multi site handling via sub domains with environment variables
- Device type detection for pre-rendering the page fitting to the incoming user agent.

## Build it!

Just run `docker build -t <your_tag_name> .`

## Configure it!

Basic environment variables:

- connect it to the PWA with `UPSTREAM_PWA` in the form of `http(s)://<IP>:<PORT>`

If you want to use fully qualified names here, do not forget to also add host mappings to your orchestrator name resolution. For `docker run` this can be done with `--add-host`.

If you are using http, the server will run on default port 80.
If you use https as an upstream, it will run on default port 443.
In the latter case you will also have to supply the files `server.key` and `server.crt` in the folder `/etx/nginx` (either by volume mapping with `docker run` or in the image itself by `docker build`).

If you run nginx without further configuration, the defaults for channel, application, ... are not overridden. You can setup multiple PWA channels with the following environment variables:

- use `PWA_X_SUBDOMAIN`, `PWA_X_TOPLEVELDOMAIN` or `PWA_X_DOMAIN` for the channel domain
- use `PWA_X_CHANNEL` for the channel name
- use `PWA_X_APPLICATION` for the application name
- use `PWA_X_LANG` for the default locale in the form of `lang_COUNTRY`
- use `PWA_X_FEATURES` for a comma separated list of active feature toggles
- use `PWA_X_THEME` for setting the theme of the channel

Temper with the default Page Speed configuration:

- set the environment variable `NPSC_ENABLE_FILTERS` to a comma-separated list of active [Page Speed Filters](https://www.modpagespeed.com/examples/) to override our carefully chosen defaults. Do this at your own risk!

Enable and disable features:

- use `CACHE=off` to disable caching (default `on`)
- use `PAGESPEED=off` to disable pagespeed optimizations (default `on`)
- use `COMPRESSION=off` to disable compression (default `on`)
- use `DEVICE_DETECTION=off` to disable user-agent detection (default `on`)
- use `PROMETHEUS=on` to enable [Prometheus](https://prometheus.io) metrics exports on port `9113` (default `off`)

## Example

```
docker build -t my_awesome_nginx .
docker run -d --name "my-awesome-nginx" \
        --restart always \
        -p 4199:80 \
        -e UPSTREAM_PWA=http://192.168.0.10:4200 \
        -e CACHE=off \
        -e PAGESPEED=off \
        -e PWA_1_TOPLEVELDOMAIN=net \
        -e PWA_1_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_1_LANG=en_US \
        -e PWA_2_TOPLEVELDOMAIN=de \
        -e PWA_2_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_2_LANG=de_DE \
        -e PWA_3_TOPLEVELDOMAIN=com \
        -e PWA_3_CHANNEL=inSPIRED-inTRONICS_Business-Site \
        -e PWA_3_FEATURES=quoting,recently,compare,businessCustomerRegistration,advancedVariationHandling \
        -e PWA_3_THEME="blue|688dc3" \
        -e PWA_4_TOPLEVELDOMAIN=fr \
        -e PWA_4_LANG=fr_FR \
        -e PWA_4_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_4_APPLICATION=smb-responsive \
        -e PWA_4_FEATURES=quoting \
        -e PWA_4_THEME="blue|688dc3" \
        my_awesome_nginx
```

And then access the PWA with `http://b2b.<your-fully-qualified-machine-name>:4199`

If your DNS is not set up correctly, you have to use something like _dnsmasq_ (Linux) or _Acrylic DNS Proxy_ (Windows), or just ask your local network administrator.

## Features

Features can be supplied in the folder `nginx/features`. A file named `<feature>.conf` is included if the environment variable `<feature>` is set to `on`, `1`, `true` or `yes` (checked case in-sensitive). The feature is disabled otherwise and an optional file `<feature>-off.conf` is included in the configuration. The feature name must be all word-characters (letters, numbers and underscore).

### Disabling Cache

If the cache feature is switched off all caching for pre-rendered pages is disabled. If the cache should also be disabled for static resources, the pagespeed feature also has to be switched off as it caches optimized images individually.
