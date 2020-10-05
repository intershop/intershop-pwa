<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Deployment Scenarios for Angular Applications

## Simple Browser-Side Rendering

> :warning: This is suitable for demo servers to have a fast build chain. We do not recommend this setup for production use.

The resulting files can be statically served using any HTTP server that is capable of doing that.
The initial page response from the browser is minimal and the application gets composed and rendered on the client side.

![Angular-BrowserSideApp-Sequence](deployment-angular-browsersideapp-sequence.jpg 'Angular-BrowserSideApp-Sequence')

Of course, this can have a significant impact on the client side if no efficient rendering power is available.
Search engine crawlers might also not be able to execute JavaScript and therefor might only see the initial minimal response.

## Browser-Side Rendering with On-Demand Server-Side Pre-Rendering (Angular Universal)

> We recommend using this approach for production use. You can use the supplied Dockerfile to build it.

The resulting distribution has to be executed in a node environment.
The _server.js_ executable handles client requests and pre-renders the content of the page.
The resulting response to the browser is mainly prepared and can be displayed quickly on the client side.

![Angular-ServerSideRendering-Sequence](deployment-angular-serversiderendering-sequence.jpg 'Angular-ServerSideRendering-Sequence')

## Impact of Service Workers

- SW turns SSR for JavaScript-enabled browsers off -> Application will be rendered on client.
- Crawlers (SEO) will still receive pre-rendered pages.
