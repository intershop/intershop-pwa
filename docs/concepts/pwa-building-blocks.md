<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Building Blocks of the Intershop PWA Public Deployment

## ICM

- provides data via REST API
- new headless application type since 0.23 (LINK to migration document)
- every other application also possible, if REST API is provided

## PWA - SSR

- combines express.js server and server-side Angular Universal application (LINK to deployment-angular)
- does not hold internal state, for ease of scalability

Features:

- SEO features (LINK)
- Dynamic configuration via URL parameters (LINK to configuration), used for multi-channel (LINK) and multi-theme (LINK).
- hybrid approach (LINK)
- growing list of thirdparty integrations (LINK see overview)

## PWA - nginx

- modified/tuned nginx

Features:

- [PageSpeed Module](https://www.modpagespeed.com/) for browser optimization
- Enabled compression for downstream services
- Caching of PWA SSR responses
- Multi Channel handling via domains with environment variables (LINK to multi-channel)
- Device type detection for pre-rendering the page fitting to the incoming user agent.
- growing list of thirdparty integrations (LINK see overview)

## Browser

- runs the bootstrapped Angular Client Application (LINK to deployment-angular)

# Default Production Deployment

- all building blocks chained together

![Current Deployment](pwa-building-blocks-production-deployment.svg)

1. The Browser requests the page by URL from the nginx.

   1. If the cache is enabled and a cached response is found, the response is returned immediately, go to 6
   2. If no cached response is available, the SSR process is triggered.

2. The node express.js server runs Angular Universal pre-rendering for the requested URL.

3. Angular Universal fills the requested page with content retrieved via ICM REST API.

4. The response is delivered to nginx, where it is also cached if caching is enabled.

5. The response is delivered to the browser.

6. The initial page response is displayed to the user and the Angular Client Application is booting up in the browser.

7. Once booted up, additional REST Calls are directed straight to the ICM and the PWA acts as a single-page application. No further HTML pages are requested.

## Deploy without nginx

- theoretically possible
- no features provided by nginx: caching, device detection, ...
- problems with service workers (experimental, LINK to progressive-web-app)

# Further References

- ssr-startup
- nginx-startup
- ...
