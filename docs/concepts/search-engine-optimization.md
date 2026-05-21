<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Search Engine Optimization (SEO)

- [Server-Side Rendering](#server-side-rendering)
- [robots.txt](#robotstxt)
- [Page Metadata](#page-metadata)
- [Optimized URLs](#optimized-urls)

This concept documents our approach for search engine optimization for the Intershop Progressive Web App.

## Server-Side Rendering

The PWA uses SSR for pre-rendering complete pages to tackle SEO concerns.
An Angular application without SSR support will not respond to web crawlers with complete indexable page responses.

Angular's state transfer mechanism is used to transfer properties to the client side.
We use it to de-hydrate the ngrx state in the server application and re-hydrate it on the client side.
See [Using State Transfer in Angular 17 SSR](https://medium.com/@saikiranmaddukuri22/using-state-transfer-in-angular-17-ssr-b228bd27450b) for specifics.

Follow the steps in [Guide - Getting Started](../guides/getting-started.md) to build and run the application in SSR mode.

Official documentation for Angular SSR can be found at [Angular SSR Guide](https://v19.angular.dev/guide/ssr).

## robots.txt

We use the library [express-robots-txt](https://github.com/modosc/express-robots-txt) in the express.js server (`server.ts` in the project root) to supply a response to `robots.txt` for crawlers.

By default, the SSR server provides a response with access to all pages except some restricted paths (e.g., `/error` or `/account`).
To use a custom `robots.txt`, place it as a file in the `dist` folder.

## Page Metadata

The PWA uses the [Meta service](https://angular.dev/api/platform-browser/Meta) for setting tags for title, meta description, robots, canonical links, and open graph information in the page headers.
For the resource descriptions meta data we use the [Open Graph protocol](https://ogp.me/).

Meta information can be added to the routing in form of the data property `meta`.
Have a look at [`app-routing.module`](../../src/app/pages/app-routing.module.ts) for examples.
It is also possible to use translation keys here.

[`seo.effects.ts`](../../src/app/extensions/seo/store/seo/seo.effects.ts) is the central place for customizations concerning dynamic content, e.g., names of products or categories (asynchronous data from the API).
Effects are an essential part of our [State Management](./state-management.md).

## Optimized URLs

Optimized URLs are a major factor in determining search engine rankings.
They should have a clear structure and must be readable.
By default, product, category, and content page routes contain their localized context path.
Parameters are appended to theses paths that contain localization-independent and uniquely identifiable data.

| Type         | Structure                                | Parameter                                         | Example                                                                                                 |
| ------------ | ---------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| category     | complete category path                   | **-ctg**: category id                             | /computers/notebooks-and-pcs/notebook-accessories-ctgComputers.1835.1284                                |
| product      | complete category path with product name | **-prd**: product sku, </br>**-ctg**: category id | /computers/notebooks-and-pcs/notebook-accessories/kensington-keyfolio-prd5981602-ctgComputers.1835.1284 |
| content page | complete content page path               | **-pg**: content page id                          | /help/faq/seo/how-to-pghow-to-seo                                                                       |

> [!NOTE]
> The given parameters for each url are needed to differentiate category, product, and content page routes.
> It is important to ensure that no identifier contains the specified parameter id.
> For example, a category name including a `-ctg` substring could lead to unwanted behavior.

> [!NOTE]
> Route generation and parsing for category, product, and content-page routes can be customized.
> This will require changes to the well documented [`product.route.ts`](../../src/app/core/routing/product/product.route.ts), [`category.route.ts`](../../src/app/core/routing/category/category.route.ts), or [`content-page.route.ts`](../../src/app/core/routing/content-page/content-page.route.ts) files.
> Additionally, the corresponding pipes (e.g., [`product-route.pipe.ts`](../../src/app/core/routing/product/product-route.pipe.ts)) may have to be updated to fit your needs, as will [`routing.ts`](../../src/app/core/utils/routing.ts).
