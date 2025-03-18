<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Hybrid Approach

- [Requirements](#requirements)
- [Architectural Concept](#architectural-concept)
- [Configuration](#configuration)
  - [Intershop Commerce Management (ICM)](#intershop-commerce-management-icm)
  - [Intershop Progressive Web App (PWA)](#intershop-progressive-web-app-pwa)
  - [Mapping Table](#mapping-table)
- [PWA Adaptions](#pwa-adaptions)
  - [Preparing the PWA for the Hybrid Approach with the Responsive Starter Store](#preparing-the-pwa-for-the-hybrid-approach-with-the-responsive-starter-store)
- [Development Environment](#development-environment)
  - [Configuration of a Development Domain](#configuration-of-a-development-domain)
  - [ICM](#icm)
  - [PWA](#pwa)
  - [NGINX](#nginx)
  - [Docker Compose for PWA/NGINX](#docker-compose-for-pwanginx)
- [Further References](#further-references)

This document describes how to run PWA and ICM using the Hybrid Approach, so that pages from the Intershop Progressive Web App and pages from the classic storefront (Responsive Starter Store) can be run in parallel.

A possible scenario would be to have the shopping experience with all its SEO optimizations handled by the PWA and to delegate highly customized parts of the checkout or My Account area to the ICM.

## Requirements

The minimum version requirements for the involved systems are the following:

- PWA 3.2.0
- ICM 7.10.38.6-LTS

The following guide though is written with a current PWA 5.x and ICM 11+ in mind.
Examples for older ICM versions are included where it seems helpful.

> [!NOTE]
> This feature relies on the PWA and ICM being able to read and write each other's `apiToken` cookies.
>
> This means that cookies written by the PWA and ICM must have the same domain and the same path. This works since all Responsive Starter Store requests and responses are proxied through the PWA SSR, simulating a common domain (an actual common domain for PWA and ICM is not required).
>
> It is also important that the cookie must not be set to [`HttpOnly`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies).
> Instead, the `apiToken` cookie should be set with `Secure` and `SameSite=Strict`.

The secure access required for the PWA/NGINX deployments in production-like environments is handled by the Ingress controller, so the PWA and the NGINX container itself can be deployed without SSL.
ICM only needs to be deployed with secure access anyway.

## Architectural Concept

![Hybrid Approach Architecture](hybrid-approach-architecture.svg)

For a minimally invasive implementation, the mechanics for the Hybrid Approach are mainly implemented outside of ICM and in deployment-specific components of the PWA.

The ICM is proxied in the _express.js_ server of the server-side rendering (SSR) process and hereby made available to the outside.
A newly introduced mapping table is used in the SSR to decide whether an incoming request should be handled by the PWA or the ICM.
This mapping table is also used in the browser-side PWA to switch from the single-page application context to the ICM.

## Configuration

### Intershop Commerce Management (ICM)

The ICM must be run with [Secure URL-only Server Configuration](https://docs.intershop.com/icm/7.10/olh/oma/en/topics/managing_site_settings/topic_secure_url-only_server_configuration.html), which can be done by adding `SecureAccessOnly=true` to the appserver configuration.
This is the default for ICM 11+ deployments.

Furthermore, the synchronization of the `apiToken` cookie must be switched on, so that users and baskets are synchronized between PWA and ICM.
See [Concept - Integration of Progressive Web App and inSPIRED Storefront](https://support.intershop.com/kb/index.php/Display/2928F6).

If you also want to support the correct handling for links generated in e-mails, the property `intershop.WebServerSecureURL` must point to NGINX.

_configuration via `icm_as` Helm chart_:

```yaml
INTERSHOP_APITOKEN_COOKIE_ENABLED: true
INTERSHOP_APITOKEN_COOKIE_SSLMODE: true
INTERSHOP_WEBSERVERSECUREURL: https://<NGINX>
```

_configuration via icm.properties (ICM 11+ in a docker container)_:

```properties
intershop.environment.HYBRID=intershop.apitoken.cookie.enabled=true,intershop.apitoken.cookie.sslmode=true
intershop.WebServerSecureURL=https://<NGINX>
```

_configuration via \$SERVER/share/system/config/cluster/appserver.properties (ICM 7.10)_:

```properties
SecureAccessOnly=true
intershop.apitoken.cookie.enabled=true
intershop.apitoken.cookie.sslmode=true
intershop.WebServerSecureURL=https://<NGINX>
```

### Intershop Progressive Web App (PWA)

The server-side rendering process must be started with `SSR_HYBRID=1`.

> [!WARNING]
>
> **Only for development environments**
>
> The PWA must also be run with secure URLs if no NGINX is deployed to handle `https` access to the PWA.
>
> See [SSR Startup - Development](../guides/ssr-startup.md#development) for a reference on how to achieve this locally.

> [!WARNING]
>
> **Only for development environments**
>
> It might be necessary to set `TRUST_ICM=1` if the used development ICM is deployed with an insecure certificate.

Also, the **Service Worker must be disabled** for the PWA, as it installs itself in the browser of the client device and takes over the routing process, making it impossible to break out of the PWA and delegate to the ICM.
The Service Worker is disabled by default.

### Mapping Table

The mapping table resides in the PWA source code and provides the page-specific mapping configuration for the Hybrid Approach.

```typescript
  {
    id: "Product Detail Page",
    icm: `${ICM_CONFIG_MATCH}/ViewProduct-Start.*(\\?|&)SKU=(?<sku>[\\w-]+).*$`,
    pwaBuild: `product/$<sku>${PWA_CONFIG_BUILD}`,
    pwa: `^.*/product/([\\w-]+).*$`,
    icmBuild: `ViewProduct-Start?SKU=$1`,
    handledBy: "icm"
  }
```

Each entry contains:

- A regular expression to detect a specific incoming URL as ICM or PWA URL (`icm` and `pwa`)
- Corresponding instructions to build the matching URL of the counterpart (`pwaBuild` and `icmBuild`)
- A property `handledBy` (either `icm` or `pwa`) to decide on the target upstream

The properties `icm` and `pwaBuild` can use [named capture groups](<https://2ality.com/2017/05/regexp-named-capture-groups.html#replace()-and-named-capture-groups>).
They are only used in the _node.js_ process running on the server.
However, `pwa` and `icmBuild` are used in the client application where [named capture groups are not yet supported by all browsers](https://github.com/tc39/proposal-regexp-named-groups#implementations).

## PWA Adaptions

With version 0.23.0 the PWA has been changed to no longer reuse the Responsive Starter Store application types, but rather to be based on the newly introduced headless application type for REST clients - `intershop.REST`.
This application type is completely independent of the Responsive Starter Store.
For this reason, the PWA must be configured to know which application to use to work with the Responsive Starter Store again (`hybridApplication`).

### Preparing the PWA for the Hybrid Approach with the Responsive Starter Store

- Use a recent PWA version
- Configure `icmApplication` setting in the `environment` files to denote the `intershop.REST`-based application used by the PWA (usually `rest` in the inSPIRED demo scenario).
- Configure `hybridApplication` setting in the `environment` files to denote the Responsive Starter Store application (usually `-` in the inSPIRED demo scenario).
- Follow the Hybrid configuration setup

> [!NOTE]
> If for some reason the CMS content of the Responsive Starter Store is to be reused directly in the PWA in a Hybrid Approach, the PWA needs some code adaptions and has to use the same application as the Responsive Starter Store. For more details, see the older version of this documentation - [Hybrid Approach - PWA Adaptions (3.0.0)](https://github.com/intershop/intershop-pwa/blob/3.0.0/docs/concepts/hybrid-approach.md#pwa-adaptions).

## Development Environment

This section describes how to develop and test a PWA using the Hybrid Approach in a local development environment.

This development environment includes a local installation of ICM with the Responsive Starter Store, the PWA, and the NGINX.

After successful configuration and deployment, you can access the different systems with these URLs:

|                                | URL                                                                                                       | Comment                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| PWA (via NGINX)                | https://pwa.example.com                                                                                   | with `https` access and NGINX features |
| PWA                            | http://pwa.example.com:4200                                                                               | direct access to the SSR rendering     |
| ICM (Responsive Starter Store) | https://icm.example.com:8443/INTERSHOP/web/WFS/inSPIRED-inTRONICS_Business-Site/en_US/-/USD/Default-Start | direct access, no Hybrid Approach      |
| ICM (Backoffice)               | https://icm.example.com:8443/INTERSHOP/web/WFS/SLDSystem                                                  |                                        |

### Configuration of a Development Domain

For a more realistic Hybrid Approach environment, it is not a good idea to use `localhost` as the development domain or `127.0.0.1` as the IP address.
For this reason, a different domain - `example.com` for this guide - must be configured in the operating system's `etc/hosts` file, pointing to the real IP address of your computer.
For better distinction we use separate subdomains for `pwa` and `icm`.

```
192.168.178.77 pwa.example.com
192.168.178.77 icm.example.com
```

The different parts of the server will then listen on different ports.
For this guide ICM will listen on port `8443` and the PWA SSR process will listen on port `4200` while the NGINX will respond on the default HTTPS port `443`.

### ICM

The ICM needs to be set up like a regular ICM development environment with the Responsive Starter Store (icm-responsive).

The `icm.properties` needs to contain:

```
intershop.WebServerURL = http://pwa.example.com
intershop.WebServerSecureURL = https://pwa.example.com

webserver.http.port = 8080
webserver.https.port = 8443

intershop.environment.HYBRID=SecureAccessOnly=true,intershop.apitoken.cookie.enabled=true,intershop.apitoken.cookie.sslmode=true
```

- ICM must point to NGINX, in this case `https://pwa.example.com`
- The synchronization of the `apiToken` cookie must be enabled
- ICM must run in secure-only mode

### PWA

The configurations relevant to the Hybrid Approach for running the PWA are:

- `ICM_BASE_URL` points to ICM https port - `https://icm.example.com:8443`
- For development scenarios with a self-signed certificate for ICM, this means that you have to set `TRUST_ICM=true`
- To enable the Hybrid Approach functionality in the SSR process, `SSR_HYBRID=true` must be set
- `LOGGING=true` helps with analysis and debugging

> [!NOTE]
> The PWA SSR process itself does not need to run with SSL/https.
> This is taken care of by the NGINX container to provide the secure access to the PWA.

A local PWA built from the current PWA project sources can be run in a number of ways:

**Via Docker**

```bash
docker build -t dev_pwa . && docker run -it -p 4200:4200 -e ICM_BASE_URL=https://icm.example.com:8443 -e TRUST_ICM=true -e SSR_HYBRID=true -e LOGGING=true --name hybrid-pwa dev_pwa
```

**Via bash**

```bash
ICM_BASE_URL=https://icm.example.com:8443 TRUST_ICM=true SSR_HYBRID=true LOGGING=true npm run start
```

**Via bash with SSR development server with auto compile**

```bash
ICM_BASE_URL=https://icm.example.com:8443 TRUST_ICM=true SSR_HYBRID=true LOGGING=true npm run start:ssr-dev
```

> [!NOTE]
> A development Hybrid Approach setup can also be tested without NGINX.
> In this case, the PWA SSR process must run with SSL.
> This can be achieved by using `--ssl` as an additional parameter.
> The PWA with Hybrid Approach would then be reachable at `https://pwa.example.com:4200`.

```bash
ICM_BASE_URL=https://icm.example.com:8443 TRUST_ICM=true SSR_HYBRID=true LOGGING=true npm run start:ssr-dev -- --ssl
```

### NGINX

The configurations relevant to the Hybrid Approach for running the NGINX are:

- `UPSTREAM_PWA` points to the PWA SSR process - `http://pwa.example.com:4200`
- `ICM_BASE_URL` points to ICM https port - `https://icm.example.com:8443`
- For secure access, set `SSL=true`
- To avoid unexpected caching side effects, set `CACHE=false`
- Set NGINX to respond to the default https port `443`

To start the NGINX container from the project sources with Docker:

```bash
docker build -t dev_nginx nginx && docker run -it -p 443:443 -e UPSTREAM_PWA=http://pwa.example.com:4200 -e SSL=true -e CACHE=false --name hybrid-nginx dev_nginx
```

### Docker Compose for PWA/NGINX

Alternatively, the PWA and NGINX can also be started with `docker compose`.
This is probably the easiest way to start and test the PWA part of a development Hybrid Approach environment.
For actual development on the PWA side starting the SSR development server with auto compile might be more efficient.

```yaml
# save this to a file named 'docker-compose_hybrid.yml' and run it with:
# docker compose -f docker-compose_hybrid.yml up --build

services:
  pwa:
    image: intershophub/intershop-pwa-ssr
    build:
      context: .
    ports:
      - '4200:4200'
    environment:
      ICM_BASE_URL: 'https://icm.example.com:8443'
      SSR_HYBRID: 'true'
      TRUST_ICM: 'true'
      LOGGING: 'true'

  nginx:
    image: intershophub/intershop-pwa-nginx
    build: nginx
    depends_on:
      - pwa
    ports:
      - '443:443'
    environment:
      UPSTREAM_PWA: 'http://pwa:4200'
      ICM_BASE_URL: 'https://icm.example.com:8443'
      SSL: 1
      CACHE: 0
```

## Further References

- [Guide - Building and Running Server-Side Rendering](../guides/ssr-startup.md)
- [Guide - Handle rewritten ICM URLs in the Hybrid Approach](../guides/hybrid-approach-icm-url-rewriting.md)
- [Concept - Multi-site handling](multi-site-handling.md)
