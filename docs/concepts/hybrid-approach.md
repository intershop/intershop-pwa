# Concept - Hybrid Approach

This document describes how to run PWA and ICM in hybrid mode, so that pages from the Intershop Progressive Web App and pages from the classic Storefront can be run in parallel.

A possible scenario would be to have the shopping experience with all its SEO optimizations be handled with the PWA and having heavily customized parts of the checkout or my-account be delegated to the ICM.

## Requirements

- ICM 7.10.16.6
- PWA 0.18

## Architectural Concept

![Hybrid Approach Architecture](hybrid-approach-architecture.svg)

For a minimal-invasive implementation, the mechanics for the hybrid approach are mainly implemented outside of the ICM and in deployment-specific components of the PWA.

The ICM is proxied in the express.js server of the server-side rendering process and hereby made available to the outside. A newly introduced mapping table is also used to decide when an incoming request should be handled by the PWA or the ICM. This mapping table is also used in the PWA for switching from the context of the single page application to the ICM.

## Configuration

### Intershop Commerce Management

The ICM must be run with [Secure URL-only Server Configuration](https://docs.intershop.com/icm/7.10/olh/oma/en/search.html?searchQuery=SecureAccessOnly), which can be done by adding `SecureAccessOnly=true` to the appserver configuration.

Furthermore the synchronization of the `apiToken` cookie must be switched on, so that users and baskets are synchronized between PWA and ICM. See [Concept - Integration of Progressive Web App and inSPIRED Storefront](https://support.intershop.com/kb/index.php/Display/2928F6).

If you also want to support the correct handling for links generated in E-Mails, the property `intershop.WebServerSecureURL` must point to the nginx.

_\$SERVER/share/system/config/cluster/appserver.properties_:

```properties
SecureAccessOnly=true
intershop.apitoken.cookie.enabled=true
intershop.apitoken.cookie.sslmode=true
intershop.WebServerSecureURL=https://<nginx>
```

### Intershop Progressive Web App

The server-side rendering process must be started with `SSR_HYBRID=1`.

Also, the **Service Worker must be disabled** for the PWA, as it installs itself into the browser of the client device and takes over the routing process, making it impossible to break out of the PWA and delegate to the ICM.

### Mapping Table

The mapping table resides in the PWA source code and provides the page-specific mapping configuration for the hybrid approach.

```typescript
  {
    id: "Product Detail Page",
    icm: `${ICM_CONFIG_MATCH}/ViewProduct-Start.*(\\?|&)SKU=(?<sku>[\\w-]+).*$`,
    pwaBuild: `product/$<sku>${PWA_CONFIG_BUILD}`,
    pwa: `^.*/product/([\\w-]+).*$`,
    icmBuild: `ViewProduct-Start?SKU=$1`,
    handledBy: "icm"
  }
```

Each entry contains:

- a regular expression to detect a specific incoming URL as ICM or PWA URL (`icm` and `pwa`)
- corresponding instructions to build the matching URL of the counterpart (`pwaBuild` and `icmBuild`)
- a property `handledBy` (either `icm` or `pwa`) to decide on the target upstream

The properties `icm` and `pwaBuild` can use [named capture groups](<https://2ality.com/2017/05/regexp-named-capture-groups.html#replace()-and-named-capture-groups>) and are only used in the node.js process running on the server. However, `pwa` and `icmBuild` are used in the client application where [named capture groups are not yet supported by all browsers](https://github.com/tc39/proposal-regexp-named-groups#implementations).

# Further References

- [Guide - Building and Running Server-Side Rendering](../guides/ssr-startup.md)
- [Guide - Handle rewritten ICM URLs in Hybrid Mode](../guides/hybrid-approach-icm-url-rewriting.md)
