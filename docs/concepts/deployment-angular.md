<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Deployment Scenarios for Angular Applications

## Simple Browser-Side Rendering

Angular Applications are by default built for a [static deployment][angular-deployment].
When running `ng build` in any shape or form, the build output is aggregated in the `dist` folder and the resulting files can be statically served using any HTTP server that is capable of doing that (only a [fallback](https://angular.io/guide/deployment#routed-apps-must-fallback-to-indexhtml) for `index.html` has to be configured).

When the application is served this way, the initial page response for the browser is minimal (`index.html` with scripts inserted) and the application gets composed and rendered on the client side.

![Angular-BrowserSideApp-Sequence](deployment-angular-browsersideapp-sequence.jpg 'Angular-BrowserSideApp-Sequence')

Of course, this can have a significant impact on the client side if no efficient rendering power is available.
Search engine crawlers might also not be able to execute JavaScript and therefor might only see the initial minimal response.

This method of deployment is suitable for demo servers supplying a fast build chain.
However, we do not recommend this setup for production use.

> This setup is also used for the Angular CLI built-in webpack-dev-server and should not be confused with a standard production setup.

## Browser-Side Rendering with On-Demand Server-Side Pre-Rendering (Angular Universal)

To tackle sophisticated SEO requirements, the [Angular Universal][angular-universal] package was introduced.
In a second step in the build process, a server-side application can be built by the Angular CLI after building the client-side application.
The resulting distribution has to be executed in a node environment.
The _server.js_ executable handles client requests on the server and pre-renders the content of the page, basically executing everything in a Node.js environment.
The resulting initial page response to the browser is mainly prepared and can be displayed quickly on the client side while the client-side application is booting up.

![Angular-ServerSideRendering-Sequence](deployment-angular-serversiderendering-sequence.jpg 'Angular-ServerSideRendering-Sequence')

This method is the default setup for the Intershop PWA.
We provide a `Dockerfile` for building the [SSR Image][concept-building-blocks].

## Impact of Service Workers

If the Intershop PWA is run with an enabled [Service Worker][concept-progressive-web-app], the SSR process is only triggered for the first visit to the web page.
After that, the Service Worker makes the Application behave like a simple browser-side application, where certain additional caching can lead to an improved client experience.

Browsers and Crawlers that don't support JavaScript execution will however continue to get fully pre-rendered page responses from the SSR process.

# Further References

- [Concept - Building Blocks][concept-building-blocks]
- [Concept - Progressive Web App][concept-progressive-web-app]
- [Angular - Deployment][angular-deployment]
- [Angular - Universal][angular-universal]

[angular-deployment]: https://angular.io/guide/deployment
[angular-universal]: https://angular.io/guide/universal
[concept-building-blocks]: ./pwa-building-blocks.md
[concept-progressive-web-app]: ./progressive-web-app.md#service-worker
