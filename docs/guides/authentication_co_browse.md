<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Introduction

The co-browse functionality is needed for the Intershop Customer Engagement Center (CEC).
In this application a contact center agent can start a "co-browsing" storefront session.
That means, the agent is logged in to the PWA on behalf of the user.
Technically a special identity provider (the co-browse identity provider) is needed to handle the authentication of the user with the help of an authentication token that is provided by the CEC as an URL parameter.

# Authentication with the Co-Browse Identity Provider

This document describes the authentication mechanism if the co-browse identity provider is used to enable an agent to log in on behalf of a user.
If you need an introduction regarding authentication in the PWA, read the [Authentication Concept](../concepts/authentication.md) first.

## Configuration

The PWA must be configured in a specific way to use co-browse as an identity provider.
The following configuration can be added to the Angular CLI `environment.ts` files for development purposes:

```typescript
identityProvider: 'CoBrowse',
identityProviders: {
  'CoBrowse': {
    type: 'cobrowse',
  }
},
```

> :warning: **NOTE:** This configuration enables the `Co-Browse` identity provider as the one and only configured global identity provider, meaning the standard ICM identity provider used for the standard login is no longer configured and the standard login will no longer work. As said this configuration example is only relevant for development purposes.

For production like deployments, the PWA has to be be configured to use the `Co-Browse` identity provider only when the user enters the `cobrowse` route.
This can be configured with the `OVERRIDE_IDENTITY_PROVIDERS` environment variable (see [Override Identity Providers by Path][nginx-startup]) for the NGINX container.
Nevertheless, the SSR process needs to be provided with the co-browse identity provider configuration as one of the available identity providers.
This way the global `identityProvider` configuration is left to be the default ICM configuration.

The following is an example co-browse identity provider configuration for `docker-compose` that enables the co-browse identity provider on the `cobrowse` route only.

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
          type: cobrowse
```

For the current PWA Helm Chart that is also used in the PWA Flux deployments the same co-browse configuration would look like this.

```yaml
environment:
  - name: IDENTITY_PROVIDERS
    value: |
      {
        "CoBrowse": {"type": "cobrowse"}
      }

cache:
  extraEnvVars:
    - name: OVERRIDE_IDENTITY_PROVIDERS
      value: |
        .+:
          - path: /cobrowse
            type: cobrowse
```

> :exclamation: **NOTE:** Be aware that the `OVERRIDE_IDENTITY_PROVIDERS` configuration has to match a potentially used `multiChannel` configuration.

```yaml
environment:
  - name: IDENTITY_PROVIDERS
    value: |
      {
        "CoBrowse": {"type": "cobrowse"}
      }

cache:
  extraEnvVars:
    - name: OVERRIDE_IDENTITY_PROVIDERS
      value: |
        .+:
          - path: /en/cobrowse
            type: cobrowse
          - path: /de/cobrowse
            type: cobrowse
          - path: /fr/cobrowse
            type: cobrowse

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

A user can login by navigating to the `/cobrowse` route.
For this purpose the query param `access-token` needs to be added to the given route.
When the login is successful the call center agent user is logged in on behalf of a customer.
The catalogs and products, prices, promotions, content etc. are displayed to the agent in the same way as to the user.

## Token Lifetime

Each authentication token has a predefined lifetime.
That means, the token has to be refreshed to prevent it from expiring.
Once 75% of the token's lifetime have passed ( this time can be configured in the oAuth library), an info event is emitted.
This event is used to call the [refresh mechanism `setupRefreshTokenMechanism$`](../../src/app/core/services/token/token.service.ts) of the oAuth configuration service and the authentication token will be renewed.
Hence, the token will not expire as long as the user keeps the PWA open in the browser.

## Logout

When the user logs out by clicking the logout link or navigating to the `/logout` route, the configured [`logout()`](../../src/app/core/identity-provider/co-browse.identity-provider.ts) function will be executed, which will call the [`revokeApiToken()`](../../src/app/core/services/user/user.service.ts) user service in order to deactivate the token on server side.
Besides this, the PWA removes the token, the apiToken cookie and basket-id on browser side.

[ssr-startup]: ../guides/ssr-startup.md
[nginx-startup]: ../guides/nginx-startup.md
