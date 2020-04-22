<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# URL Rewriting

The PWA allows to supply localized and SEO optimized URLs for categories and product detail pages.

## Rewriting Concept

This feature is mainly built on top of Angular's [UrlMatcher] for parsing routes and a custom pipe for generating them.

## Rewriting Artifacts

Artifacts for custom routes are accumulated in _src/app/core/routing_.

### matchXRoute

Each route must supply an implementation of [UrlMatcher] to be used in the routing module.
We recommend defining custom routes in _src/app/pages/app-last-routing.module.ts_, so they do not interfere with other routes.
The easiest approach for implementation would be to build on top of `UrlSegment`, but it is also possible to implement a custom solution with regular expressions.

### XRoutePipe

It is also important to generate the customized routes depending on entities or other configuration.
It is helpful to implement an exported `generateXRoute` helper function, that transforms said entity to a URL.

### ofXRoute (optional)

To detect routes in NgRx Effects, we recommend to also supply an operator, that filters for URLs of customized routes using the `RouteNavigation` as an input.

# Further References

- [URLMatcher Angular Documentation][urlmatcher]

[urlmatcher]: https://angular.io/api/router/UrlMatcher
