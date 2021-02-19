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
  [Configuration](https://purgecss.com/configuration.html), especially [safelisting](https://purgecss.com/safelisting.html) certain classes, can be done on the plugin configuration or directly in your CSS with a special comment.

# Further References

- [Guide - Building and Running nginx Docker Image][nginx-startup]

[nginx-startup]: ./nginx-startup.md
