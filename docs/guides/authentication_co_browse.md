<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication with the Co-Browse Identity Provider

- [Introduction](#introduction)
- [Configuration](#configuration)
- [Login](#login)
- [Token Lifetime](#token-lifetime)
- [Logout](#logout)

> [!IMPORTANT]
> To use the co-browse functionality, ICM version 11.8.0 or later is needed.

This document describes the authentication mechanism if the co-browse identity provider is used to enable a call center agent to log in on behalf of a user.
If you need an introduction to authentication in the PWA, read the [Authentication Concept](../concepts/authentication.md) first.

## Introduction

The co-browse functionality is needed for the Intershop Customer Engagement Center (CEC).
In this application, a call center agent can start a "co-browsing" storefront session.
That means the call center agent is logged in to the PWA on behalf of the user.
Technically, a special identity provider (the co-browse identity provider) is needed to handle the authentication of the user with the help of an authentication token that is provided by the CEC as a URL parameter.

## Configuration

The PWA must be configured in a specific way to use co-browse as an identity provider.
The following configuration can be added to the Angular CLI _environment.ts_ files for development purposes:

```typescript
identityProvider: 'CoBrowse',
identityProviders: {
  'CoBrowse': {
    type: 'cobrowse',
  }
},
```

> [!WARNING]
> This configuration enables the `Co-Browse` identity provider as the only configured global identity provider.
> The standard ICM identity provider used for the standard login is no longer configured, so the standard login no longer works.
> This configuration example is relevant only for development purposes.

> [!NOTE]
> With this configuration, the `Co-Browse` identity provider handles every route and does not restore the session of the `apiToken` cookie, so a reload logs out the user.
> To restore the session on a reload during development, add `this.apiTokenService.restore$(['user', 'order']).subscribe(noop);` to the `init()` method of the [`CoBrowseIdentityProvider`](../../src/app/core/identity-provider/co-browse.identity-provider.ts).
> Its `hasUserSession()` method then has to return `this.apiTokenService.hasUserApiTokenCookie()`, so that personalized content waits for the PGID of the restored user.
> The session of an existing `apiToken` cookie is then also restored in parallel to a login on the `cobrowse` route.

For production-like deployments, the PWA has to be configured to use the `Co-Browse` identity provider only when the user enters the `cobrowse` route.
This can be configured with the `OVERRIDE_IDENTITY_PROVIDERS` environment variable (see [Override Identity Providers by Path](../guides/nginx-startup.md#override-identity-providers-by-path)) for the NGINX container.
However, the SSR process needs to be provided with the co-browse identity provider configuration as one of the available identity providers.
In this way, the global `identityProvider` configuration remains the default ICM configuration.

The following is a sample co-browse identity provider configuration for `docker-compose` that enables the co-browse identity provider on the `cobrowse` route only:

```yaml
pwa:
  environment:
    IDENTITY_PROVIDERS: |
      CoBrowse:
        type: cobrowse

nginx:
  environment:
    OVERRIDE_IDENTITY_PROVIDERS: |
      .+:
        - path: /cobrowse
          type: CoBrowse
```

Example configuration via [PWA Helm Chart 1.0.0 or later](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
app:
  env:
    - name: IDENTITY_PROVIDERS
      value: |
        {
          "CoBrowse": {"type": "cobrowse"}
        }

proxy:
  env:
    - name: OVERRIDE_IDENTITY_PROVIDERS
      value: |
        .+:
          - path: /cobrowse
            type: CoBrowse
```

> [!IMPORTANT]
> The `OVERRIDE_IDENTITY_PROVIDERS` matching pattern (in the example `.+`) must exactly match a `MULTI_CHANNEL` matching pattern, or it can be configured as a RegEx that matches several `MULTI_CHANNEL` matching patterns.

```yaml
proxy:
  env:
    - name: OVERRIDE_IDENTITY_PROVIDERS
      value: |
        .+:
          - path: /cobrowse
            type: CoBrowse

  multiChannel: |
    .+:
      - baseHref: /en
        channel: default
        lang: en_US
      - baseHref: /de
        channel: default
        lang: de_DE
      - baseHref: /fr
        channel: default
        lang: fr_FR
      - baseHref: /b2c
        channel: default
        theme: b2c
```

## Login

A user can log in by navigating to the `/cobrowse` route.
For this purpose, the query parameter `access-token` needs to be added to the given route.
When the login is successful, the call center agent user is logged in on behalf of a customer.
The catalogs and products, prices, promotions, content, and so on are displayed to the call center agent in the same way as to the user.

The user is logged in with the `access-token` query parameter only.
Before the login, the session of a previous login (the `apiToken` cookie and the tokens of the OAuth library in the local storage) is removed and is not restored, even on a reload of the `/cobrowse` route.
After the login, the PWA stores the new session in the `apiToken` cookie.
A reload restores this session only on routes that use a different identity provider, such as the default ICM identity provider in production-like deployments (see [Configuration](#configuration)).

## Token Lifetime

The authentication token is refreshed automatically before it expires.
For more information, see [Concept - Authentication: Token Lifetime](../concepts/authentication.md#token-lifetime).

## Logout

When the user logs out by clicking the logout link or navigating to the `/logout` route, the [`triggerLogout()`](../../src/app/core/identity-provider/co-browse.identity-provider.ts) method of the identity provider is executed, which calls the [`logoutUser()`](../../src/app/core/services/user/user.service.ts) user service to deactivate the token on the server side.
In addition, the PWA removes the token, the `apiToken` cookie, and the `basket-id` from the session storage on the browser side.
