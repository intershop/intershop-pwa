<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Core Web Vitals

- [CMS](#cms)
  - [Enhanced Image Teaser](#enhanced-image-teaser)
- [Further References](#further-references)

With the growing importance of good Core Web Vitals (CWV) metrics, the Intershop PWA includes several optimizations and functionalities that are intended to improve these metrics.
The following chapter lists aspects of the Intershop PWA that are related to the CWV and should be considered while developing an Intershop PWA based storefront.
In addition, you will find relevant configuration options to keep in mind when maintaining the content of the PWA in the underlying Intershop Commerce Management.

## CMS

### Enhanced Image Teaser

The rendering of the Enhanced Image Teaser component is optimized in a way that assumes that this teaser content is located on a prominent place on a page, e.g., the home page.
In this spot, the component is not supposed to be loaded lazily which would worsen the CWV for that page, specifically the Largest Contentful Paint (LCP) metric.
To avoid that, Enhanced Image Teaser images are loaded by default with `loading="eager"` instead of the default `loading="lazy"` used for most other images in the PWA.
If `loading="lazy"` is explicitly intended for certain Enhanced Image Teaser images, the class `loading-lazy` needs to be added to the Enhanced Image Teaser instances `CSS Class` configuration parameter in the ICM back office.

The CMS does not provide image dimensions, so the space of an Enhanced Image Teaser image is unknown until the image is loaded, which can cause layout shifts (Cumulative Layout Shift (CLS) metric).
To avoid this for the top teaser of the home page, [`homepage.scss`](../../src/styles/pages/homepage/homepage.scss) reserves its space with fallback aspect ratios that are defined by the theme variables `$homepage-teaser-aspect-ratio` and `$homepage-teaser-aspect-ratio-xs` (screens below 768px) in the theme's `variables.scss`.
The default values match the images of the demo content.
The fallback is only used while the image is loading, so images with a different aspect ratio are not distorted.
Adjust these variables to the teaser images of your home page.
If a theme does not define these variables, no space is reserved, as before.

## Further References

- [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)
