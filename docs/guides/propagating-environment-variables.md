<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Propagating Environment Variables

This guide describes how to propagate additional configuration from the outside into the PWA client application to be used on the storefront.

Configuration parameters can be provided from different sources.

## Angular CLI Environment Files

If properties just have to be provided as compile time settings in the Angular CLI environment files like _src/environments/environment.ts_, you can theoretically access them in any source file directly.
However we recommend creating [InjectionTokens][angular-injectiontoken] and [providing][angular-injectiontoken-provide] them in modules like the `ConfigurationModule`.

This option provides the easiest approach.
Different configurations can be provided while building the sources with Angular CLI.

[angular-injectiontoken]: https://angular.io/api/core/InjectionToken
[angular-injectiontoken-provide]: https://angular.io/guide/dependency-injection-providers#non-class-dependencies

## URL Parameters

Specific properties can also be supplied by URL parameters (i.e. _shop.de/home;foo=bar_).
The multi-channel configuration handling basically uses this method of configuration to dynamically provision a PWA server-side rendering run for a specific channel.

Currently all of those properties are transferred into _src/app/core/store/configuration_.
If you want to add another property, add it to the `ConfigurationState` and add the extraction handling in `ConfigurationEffects`.

## Runtime Environment Properties

It gets more complicated, when properties from environment variables have to be transferred to the Angular client application.
Environment parameters from the browser cannot be accessed as the browsers basically sandbox all websites for security reasons.
What can be accessed are environment parameters of the environment the server-side rendering process is running in.
This can be the Docker environment (arguments passed by an orchestrator like Kubernetes or Docker Swarm) or the local environment for debug purposes.
See also [Guide - Building and Running Server-Side Rendering][guide-ssr]

In general the extraction is as follows:

1. The environment variable is accessed by the SSR process running with _node.js_ (via _process.env_).
2. An effect running in Angular Universal extracts these properties and puts them into the state management.
3. Upon completing the initial page response, the NgRx state is [dehydrated][dehydrated-rehydrated] and appended to the HTML document.
4. The browser boots up angular and [rehydrates][dehydrated-rehydrated] the state, effectively completing the transfer of the property.

For extracting the environment property, you can use the methods of the `StatePropertiesService`.

[guide-ssr]: ./ssr-startup.md
[dehydrated-rehydrated]: https://i.stack.imgur.com/YvHXB.gif

## Further References

- [Concept - Configuration](../concepts/configuration.md)
