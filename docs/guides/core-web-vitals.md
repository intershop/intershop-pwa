<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Core Web Vitals

With the growing importance of good Core Web Vitals (CWV) metrics the Intershop PWA includes several optimizations and functionalities that are intended to improve these metrics.
The following chapter lists aspects of the Intershop PWA that are related to the CWV and should be considered while developing an Intershop PWA based storefront.
In addition relevant configuration options that should be kept in mind when maintaining the content of the PWA in the underlying ICM are mentioned as well.

## CMS

### Enhanced Image Teaser

The rendering of the Enhanced Image Teaser component is optimized in a way that assumes that this teaser content is located on a prominent place on a page, e.g. the home page.
In this spot it is not supposed to be loaded lazily which would worsen the CWV for that page, specifically the Largest Contentful Paint (LCP) metric.
To avoid that, Enhanced Image Teaser images are loaded by default with `loading="eager"` instead of the default `loading="lazy"` for most other images in the PWA.
If `loading="lazy"` is explicitly intended for certain Enhanced Image Teaser images the class `loading-lazy` needs to be added to the Enhanced Image Teaser instances `CSS Class` configuration parameter in the ICM backend.

## Further References

- [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)
