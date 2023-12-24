<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication with the Punchout Identity Provider

This document describes the authentication mechanism if punchout is used as identity provider.
If you need an introduction to this topic, read the [Authentication Concept](../concepts/authentication.md) first.

## Configuration

The PWA must be configured in a specific way to use punchout as an identity provider.
Apart from the enabled `punchout` feature flag, the following configuration can be added to the Angular CLI `environment.ts` files for development purposes:

```typescript
features: [
  'punchout'
],
identityProvider: 'Punchout',
identityProviders: {
  'Punchout': {
    type: 'PUNCHOUT',
  }
},
```

> [!WARNING]
> This configuration enables the `Punchout` identity provider as the one and only configured global identity provider, meaning the standard ICM identity provider used for the standard login is no longer configured and the standard login will no longer work. As mentioned above, this configuration example is only relevant for punchout development purposes.

For production-like deployments, the PWA has to be configured to use the `Punchout` identity provider only when the user enters the `punchout` route.
This can be configured with the `OVERRIDE_IDENTITY_PROVIDERS` environment variable (see [Override Identity Providers by Path][nginx-startup]) for the NGINX container.
Nevertheless, the SSR process needs to be provided with the punchout identity provider configuration as one of the available identity providers.
In this way, the global `identityProvider` configuration is left to be the default ICM configuration.

The following is a sample punchout identity provider configuration for `docker-compose` that enables the punchout identity provider on the `punchout` route only.

```yaml
pwa:
  environment:
    IDENTITY_PROVIDERS: |
      Punchout:
        type: PUNCHOUT

nginx:
  environment:
    OVERRIDE_IDENTITY_PROVIDERS: |
      .+:
        - path: /punchout
          type: Punchout
```

For the current PWA Helm Chart that is also used in the PWA Flux deployments, the same punchout configuration would look like this:

```yaml
environment:
  - name: IDENTITY_PROVIDERS
    value: |
      {
        "Punchout": {"type": "PUNCHOUT"}
      }

cache:
  extraEnvVars:
    - name: OVERRIDE_IDENTITY_PROVIDERS
      value: |
        .+:
          - path: /punchout
            type: Punchout
```

> [!IMPORTANT]  
> Be aware that the `OVERRIDE_IDENTITY_PROVIDERS` configuration has to match a potentially used `multiChannel` configuration.

```yaml
environment:
  - name: IDENTITY_PROVIDERS
    value: |
      {
        "Punchout": {"type": "PUNCHOUT"}
      }

cache:
  extraEnvVars:
    - name: OVERRIDE_IDENTITY_PROVIDERS
      value: |
        .+:
          - path: /en/punchout
            type: Punchout
          - path: /de/punchout
            type: Punchout
          - path: /fr/punchout
            type: Punchout

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

A user can log in by navigating to the `/punchout` or `/login` route.
For this purpose, [specific query params](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts) need to be added to the given route depending on whether the OCI or the cXML punchout should be used.
For the OCI punchout login, the user needs to add the `HOOK_URL`, `USERNAME` and `PASSWORD` as query parameters, while the cXML user has to include the `sid` and `access-token`.
In addition, the [cXML punchout tester](https://punchoutcommerce.com/tools/cxml-punchout-tester) could be used to log in a cXML punchout user.
The request [/customers/${CustomersKey}/punchouts/cxml1.2/setuprequest](https://support.intershop.com/kb/index.php/Display/29L952#l1142) to create a new cXML punchout session must be inserted as the URL with the credentials of the cXML punchout user.
When the session is created successfully, the punchout tester will redirect to the ICM configured PWA deployment `/punchout` route.

## Registration

There is currently no possibility to register a new punchout user in the PWA.

## Token Lifetime

Each authentication token has a predefined lifetime.
That means, the token has to be refreshed to prevent it from expiring.
Once 75% of the token's lifetime have passed ( this time can be configured in the oAuth library), an info event is emitted.
This event is used to call the [refresh mechanism `setupRefreshTokenMechanism$`](../../src/app/core/services/token/token.service.ts) of the oAuth configuration service and the authentication token will be renewed.
Hence, the token will not expire as long as the user keeps the PWA open in the browser.

## Logout

When the user logs out by clicking the logout link or navigating to the `/logout` route, the configured [`logout()`](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts) function will be executed, which will call the [`revokeApiToken()`](../../src/app/core/services/user/user.service.ts) user service in order to deactivate the token on server side.
Besides this, the PWA removes the token and basket-id on browser side, fetches a new anonymous user token, and sets it as `apiToken` cookie.

[ssr-startup]: ../guides/ssr-startup.md
[nginx-startup]: ../guides/nginx-startup.md
