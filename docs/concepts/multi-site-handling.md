<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Multi-Site Handling

## Motivation

Imagine running an Europe-wide shop with Intershop, where the website is available in 16 different countries with different languages and a varying selection of products, but only little modification of the website appearance over all.
This would be set up by having 16 channels with one headless application each on the ICM side.

In a setup before the PWA 0.9 release this would have lead to a deployment with 16 PWA instances combined with one nginx for caching each.
Of course, a fail-over setup would increase the number of required deployment containers even more.

Therefore, starting from version 0.9, the PWA features means to dynamically configure ICM channel and application to determine the correct REST endpoint for each incoming top level request.

The aforementioned scenario can now be run with just one PWA instance and a reverse proxy running in front, implementing this dynamic configuration.

## Configuration

To set ICM channels and applications dynamically, you have to use URL rewriting in a reverse proxy running in front of the PWA instances.
The values have to be provided as URL parameters (not to be confused with query parameters).

**nginx URL rewrite snippet**

```text
rewrite ^(.*)$ "$1;channel=inSPIRED-inTRONICS_Business-Site;application=-" break;
```

The above example configuration snippet shows an [nginx](https://en.wikipedia.org/wiki/Nginx) rewrite rule on how to map an incoming top level request URL to a dynamically configured URL for the downstream PWA instance.
It shows both the PWA parameters `channel`, `application` and their fixed example values.
The parameters of each incoming request are then read by the PWA upon initialization and used for the composition of the initial HTML response on the server side.
Afterwards they are propagated to the client side and re-used for subsequent REST requests.

In the source code of the project we provide an [extended nginx](./pwa-building-blocks.md#pwa---nginx) Docker image for easy configuration of multiple channels via sub-domains.

## Multi-Site Production Deployment

These steps should give an overview of the internal workings:

![Current Deployment](pwa-building-blocks-production-deployment.svg)

1. The browser requests the page by URL from the reverse proxy. Nginx appends URL parameters to the incoming request URL for channel, application, etc depending on the incoming domain.

2. The node _express.js_ server runs Angular Universal pre-rendering for the requested URL. Angular Universal dynamically configures itself with the incoming parameters.

3. The requested page is filled with content retrieved via ICM REST API for this dynamically configured channel.

4. The configuration parameters are persisted for the client application via state transfer. Afterwards, the response is delivered to Nginx.

5. The response is delivered to the browser.

6. The initial page response is displayed to the user and the Angular Client application is booting up in the browser, configuring itself with the transferred parameters for channel, application, etc.

7. Once booted up, additional REST calls are directed to the matching ICM endpoint for the configured channel.
