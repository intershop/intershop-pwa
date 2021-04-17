<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Deploy URL

This document describes how the Intershop PWA can be provisioned with a dynamic deploy URL, to set up client side retrieval for static assets and javascript chunks from a (possibly) different source than the URL, the pre-rendering is being served from.

## Built-in Angular CLI Support

By default, the Angular CLI supports setting the deploy URL of the application with the [`build`](https://angular.io/cli/build) command parameter `--deploy-url`.
As this is only supplied as a build-time setting, the required flexibility for the Intershop PWA cannot be achieved.

For example, if the Intershop PWA Docker Image is deployed in multiple environments for the [Intershop CaaS](https://support.intershop.com/kb/index.php?c=Search&qoff=0&qtext=Guide+What+is+CaaS), every environment would have to build a new PWA.

That is why we decided to not use this functionality out of the box, but supply a way to dynamically configure the deploy URL as a runtime setting to the [SSR container][guide-ssr-container].

## Setting Deploy URL dynamically

### Problem Analysis

To solve this problem, individual problems had to be solved:

1. The Angular CLI build process inserts references to the initial bundles (`main`, `common`, `polyfills` and `runtime`) in the `index.html` relatively when called without `--deploy-url`, but uses a static deploy URL if requested.

2. The `runtime` bundle loads lazy loaded chunks relatively if no `--deploy-url` is supplied and via deploy URL if built with parameter `--deploy-url`.

3. The CSS bundles contain absolute and relative references to resources in the `assets` folder.

4. The PWA code itself contains relative and absolute references to the `assets` folder (i.e. images).

### Solution Concept

The solution can be schemed as follows:

- The `ng build` process has to be triggered with a placeholder for the deploy URL.
- The placeholder can afterwards be replaced dynamically in the SSR process as a post-processing on any output
  - Placeholders are replaced with absolute deployment URLs
  - references to the `assets` folder are transformed into absolute URLs pointing to the deployment URLs

This way, the setting of the deployment URL becomes a runtime setting and can be changed without rebuilding the Intershop PWA.

### Building with dynamic deploy URL

The PWA client side application has to be built using `ng build ... --deploy-url=DEPLOY_URL_PLACEHOLDER`, which will introduce a placeholder to all deployment dependant functionality.

This placeholder is then replaced by the SSR process dynamically using the environment variable `DEPLOY_URL` (i.e. by setting it on the [SSR container][guide-ssr-container]).
If no `DEPLOY_URL` is supplied, the fallback `/` is applied.

This placeholder can also be replaced statically be running the script `npx ts-node scripts/set-deploy-url <deploy-url>`, when no SSR process is used in the deployment.
If no `<deploy-url>` is supplied, the fallback `/` is applied.

> For consistency reasons the build process must now always follow this pattern, so that all references to the `assets` folder are made absolute and all JavaScript bundles are loaded from the root of the deployment (see [related issue](https://github.com/intershop/intershop-pwa/issues/624)).
> This build process is also provided in the Docker images as default solution.

## Scenarios

With this new feature, some complex deployment scenarios can be solved out of the box with the Intershop PWA.

### CDN Support

If you want to deploy all static resources of the Intershop PWA to a [Content Delivery Network](https://en.wikipedia.org/wiki/Content_delivery_network), you can use the above build steps to set the deploy URL via script on the build output.
Serving the resources with a CDN will reduce the load on the PWA significantly, if certain pages can also be stored pre-rendered or if the experimental [Service Worker][concept-pwa-service-worker] support is used.

### Embed PWA with Proxy on Website

Consider the following deployment scenario:

You want to use the Intershop PWA as part of a bigger portal to provide a shopping experience.
However, not all of the product pages shall be handled by the PWA, as you want to use a different integration from the portal, that is already available.
Most probably all product pages have a similar URL pattern and for SEO reasons should be available from the same domain.

This scenario would mean that the portal and the Intershop PWA would share routes similar to the [Hybrid Approach][concept-hybrid-approach].
To set this up manually, a lot of rewriting for static PWA assets would have to be set up in the portal's reverse proxy, so that Intershop PWA client applications can boot up correctly.

By setting a deployment URL, only the incoming routing for server-side rendering would be targeted at the portal reverse proxy.
After parsing the response, the client side application will pull all necessary static assets and JavaScript chunks from the deployment URL directly.

# Further References

- [Concept - Hybrid Approach][concept-hybrid-approach]
- [Guide - Building and Running Server-Side Rendering][guide-ssr-container]

[guide-ssr-container]: ../guides/ssr-startup.md
[concept-hybrid-approach]: ./hybrid-approach.md
[concept-pwa-service-worker]: ./progressive-web-app.md#service-worker
