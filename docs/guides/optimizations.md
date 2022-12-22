<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Optimizations

## Nginx Optimizations

The Nginx building block applies:

- Compression of responses
- PageSpeed optimization

for further information, please refer to the [Guide - Building and Running nginx][nginx-startup].

## Custom Webpack Build

The PWA uses a customized webpack build, that opens the doors to additional optimizations.
The build can be customized in the file [`webpack.custom.ts`](../../templates/webpack/webpack.custom.ts).

If the PWA is built using `production` configuration. (Either by building with `--configuration=<other>,production` or by building the docker image with `--build-arg configuration=<other>,production`), the following optimizations are applied:

- Angular CLI [build-optimizer](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/build_optimizer#angular-build-optimizer)
- Webpack [SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/) is instructed to produce only `main`, `vendor`, `polyfills` and one `common` bundle for the code for optimized compression and download of the application.
- All `data-testing` attributes are removed from the HTML templates to reduce output.
- [PurgeCSS](https://purgecss.com) is used to remove unused CSS classes from the CSS output.

## PurgeCSS

> PurgeCSS is a tool to remove unused CSS. It can be part of your development workflow. When you are building a website, you might decide to use a CSS framework like TailwindCSS, Bootstrap, MaterializeCSS, Foundation, etc... But you will only use a small set of the framework, and a lot of unused CSS styles will be included.

> This is where PurgeCSS comes into play. PurgeCSS analyzes your content and your CSS files. Then it matches the selectors used in your files with the one in your content files. It removes unused selectors from your CSS, resulting in smaller CSS files.

While the described function for deleting unused CSS styles is very helpful, the mechanism for determining which styles are used is not without problems.
PurgeCSS can only analyze the strings in the actual source code of the project for used styles.

So, styles that get added to the rendered HTML by third-party libraries (e.g. Bootstrap, Swiper) would not be found.
The same applies for styles used in server-loaded content (e.g. CMS, product descriptions).
Also style selectors that are dynamically generated would not be found.

### Safelisting

To solve this problem PurgeCSS provides different [options for safelisting](https://purgecss.com/safelisting.html) specific styles.
This can either be done in the plugin configuration or directly in your SCSS/CSS files with special comments.

The PurgeCSS plugin configuration can be found in the project's [`webpack.custom.ts`](https://github.com/intershop/intershop-pwa/blob/3.1.0/templates/webpack/webpack.custom.ts#L231-L246).
This method is used and recommended to include required styles of the third-party libraries used, which would otherwise be purged.
For the different [configuration options](https://purgecss.com/configuration.html), refer to the PurgeCSS documentation.

To protect styles defined in the Intershop PWA project source code, Intershop recommends safelisting them directly in your SCSS/CSS with [special comments](https://purgecss.com/safelisting.html#in-the-css-directly).
To include nested SCSS definitions, use `/* purgecss start ignore */` and `/* purgecss end ignore */`.

### Development

When using the standard way of developing the PWA with `ng s`, PurgeCSS is not activated and styling should work as expected.
This way missing styling issues because of PurgeCSS often first show up in deployed environments.
To test or develop with enabled PurgeCSS, the development server needs to be started with `ng s -c=b2b,production` (or your desired theme instead of `b2b`).

In this startup process the following line can be read, indicating the usage of PurgeCSS similar to the deployed builds:

```
serve@b2b,production: setting up purgecss CSS minification
```

# Further References

- [Guide - Building and Running nginx Docker Image][nginx-startup]

[nginx-startup]: ./nginx-startup.md
