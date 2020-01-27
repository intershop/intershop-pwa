# nginx Docker Image for Intershop Progressive Web App

![nginx](https://www.nginx.com/wp-content/themes/nginx-new/assets/img/logo.svg)

This subproject provides a docker image of [nginx](https://www.nginx.com/) supplying the following capabilities:

- [PageSpeed Module](https://www.modpagespeed.com/) for browser optimization
- Enabled compression for downstream services
- Caching for PWA Universal responses
- Easy to configure multi site handling via sub domains with environment variables

## Build it!

Just run `docker build -t <your_tag_name> .`

## Configure it!

Basic environment variables:

- connect it to the PWA with `UPSTREAM_PWA` in the form of `http(s)://<IP>:<PORT>`

If you want to use fully qualified names here, do not forget to also add host mappings to your orchestrator name resolution. For `docker run` this can be done with `--add-host`.

If you are using http, the server will run on default port 80.
If you use https as an upstream, it will run on default port 443.
In the latter case you will also have to supply the files `server.key` and `server.crt` in the folder `/etx/nginx` (either by volume mapping with `docker run` or in the image itself by `docker build`).

Setup at least one PWA channel configuration:

- use mandatory `PWA_X_SUBDOMAIN` for the channel sub domain
- use mandatory `PWA_X_CHANNEL` for the channel name
- use optional `PWA_X_APPLICATION` for the application name
- use optional `PWA_X_LANG` for the default locale in the form of `lang_COUNTRY`
- use optional `PWA_X_FEATURES` for a comma separated list of active feature toggles
- use optional `PWA_X_THEME` for setting the theme of the channel

Temper with the default Page Speed configuration:

- set the environment variable `NPSC_ENABLE_FILTERS` to a comma-separated list of active [Page Speed Filters](https://www.modpagespeed.com/examples/) to override our carefully chosen defaults. Do this at your own risk!

## Example

```
docker build -t my_awesome_nginx .
docker run -d --name "my-awesome-nginx" \
        --restart always \
        -p 4199:80 \
        -e UPSTREAM_PWA=http://192.168.0.10:4200 \
        -e PWA_1_SUBDOMAIN=b2b \
        -e PWA_1_CHANNEL=inSPIRED-inTRONICS_Business-Site \
        -e PWA_1_FEATURES=quoting,recently,compare \
        -e PWA_2_SUBDOMAIN=b2c \
        -e PWA_2_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_3_SUBDOMAIN=de \
        -e PWA_3_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_3_LANG=de_DE \
        -e PWA_3_FEATURES=none \
        -e PWA_4_SUBDOMAIN=smb \
        -e PWA_4_CHANNEL=inSPIRED-inTRONICS-Site \
        -e PWA_4_APPLICATION=smb-responsive \
        -e PWA_4_FEATURES=quoting \
        my_awesome_nginx
```

And then access the PWA with `http://b2b.<your-fully-qualified-machine-name>:4199`

If your DNS is not set up correctly, you have to use something like _dnsmasq_ (Linux) or _Acrylic DNS Proxy_ (Windows), or just ask your local network administrator.

## Extras

To fully release the potential of this nginx, also set `UPSTREAM_ICM` in the form of `http(s)://<IP>:<PORT>` to tunnel all ICM traffic through this PageSpeed optimized nginx. This will automatically point the `ICM_BASE_URL` of the deployed PWA on a request basis to it. This however is still experimental.
