<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

<!--
- [ ] move /nginx/README.md to /docs/guides/nginx-startup.md and re-work
- [ ] move /docs/concepts/deployment-scenarios.md (explains standard Angular setups) + link
- [ ] explain building blocks of PWA, link to features
  - SSR container
    - server-side rendering
    - SEO meta
    - Hybrid Approach
    - ...
  - nginx container
    - cache
    - compression
    - pagespeed
    - device detection
    - multi-channel
- [ ] move part /docs/concepts/configuration.md#multi-site-handling to new document, link moved nginx documentation
- [ ] explain standard setup (nginx + SSR + ICM), flow
- [ ] link to Hybrid Approach
  - explain possible usage scenarios
- [ ] link to new Multi-Channel doc
- [ ] test environment with htaccess
- [ ] maybe explain serverless deployment with function/lambda
-->

# Deployment Scenarios

## Simple Browser-Side Rendering

> :warning: This is suitable for demo servers to have a fast build chain. We do not recommend this setup for production use.

The application is built completely with Angular CLI:

![Angular-BrowserSideApp-Build-Activity](deployment-angular-browsersideapp-build-activity.jpg 'Angular-BrowserSideApp-Build-Activity')

The resulting files can be statically served using any HTTP server that is capable of doing that.
The initial page response from the browser is minimal and the application gets composed and rendered on the client side.

![Angular-BrowserSideApp-Sequence](deployment-angular-browsersideapp-sequence.jpg 'Angular-BrowserSideApp-Sequence')

Of course, this can have a significant impact on the client side if no efficient rendering power is available.
Search engine crawlers might also not be able to execute JavaScript and therefor might only see the initial minimal response.

## Browser-Side Rendering with On-Demand Server-Side Pre-Rendering (Angular Universal)

> We recommend using this approach for production use. You can use the supplied Dockerfile to build it.

The application consists of two parts, the server-side and the client-side application:

![Angular-BrowserSideApp-Sequence](deployment-angular-serversideapp-build-activity.jpg 'Angular-BrowserSideApp-Sequence')

The resulting distribution has to be executed in a node environment.
The _server.js_ executable handles client requests and pre-renders the content of the page.
The resulting response to the browser is mainly prepared and can be displayed quickly on the client side.

![Angular-ServerSideRendering-Sequence](deployment-angular-serversiderendering-sequence.jpg 'Angular-ServerSideRendering-Sequence')
