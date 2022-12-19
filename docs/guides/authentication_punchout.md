<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication with the Punchout Identity Provider

This document describes the main authentication mechanism if punchout is used as identity provider.
If you need an introduction to this topic, read the [Authentication Concept](../concepts/authentication.md) first.

## Configuration

The PWA must be configured in a correct way to use punchout as an identity provider.
Apart from the enabled `punchout` feature flag, the following configuration can be added to the Angular CLI environment files for development purposes:

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

For production, this configuration should be provided to the SSR process via environment variables (see [Building and Running Server-Side Rendering][ssr-startup]).
The usage of identity providers can also be set in the multi-channel configuration (see [Building and Running nginx Docker Image][nginx-startup]).

Additionally, the PWA can be configured to use the punchout identity provider only, when the user enters the punchout route.
In that case the nginx should be configured with the `OVERRIDE_IDENTITY_PROVIDERS` environment variable (see [Override Identity Providers by Path][nginx-startup]).
Nevertheless, the SSR process needs to be provided with the punchout identity provider configuration.

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

## Login

A user can login by navigating to the `/punchout` or `/login` route.
For this purpose [specific query params](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts) need to be added to the given route depending on whether the OCI or the cXML punchout should be used.
For the OCI punchout login the user needs to add the `HOOK_URL`, `USERNAME` and `PASSWORD` as query parameters, while the cXML user has to include the `sid` and `access-token`.
In addition, the [cXML punchout tester](https://punchoutcommerce.com/tools/cxml-punchout-tester) could be used to log in a cXML punchout user.
The request [/customers/${CustomersKey}/punchouts/cxml1.2/setuprequest](https://support.intershop.com/kb/index.php/Display/29L952#l1142) to create a new cXML punchout session must be inserted as the URL with the credentials of the cXML punchout user.
When the session is created successfully, the punchout tester will redirect to the ICM configured PWA deployment `/punchout` route.

## Registration

There is currently no possibility to register a new punchout user in the PWA.

## Token Lifetime

Each authentication token has a predefined lifetime.
That means, the token has to be refreshed to prevent it from expiring.
Once 75% of the token's lifetime have passed ( this time can be configured in the oAuth library), an info event is emitted.
This event is used to call the [refresh mechanism `setupRefreshTokenMechanism$`](../../src/app/core/utils/oauth-configuration/oauth-configuration.service.ts) of the oAuth configuration service and the authentication token will be renewed.
Hence, the token will not expire as long as the user keeps the PWA open in the browser.

## Logout

When the user logs out by clicking the logout link or navigating to the `/logout` route, the configured [`logout()`](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts) function will be executed, which will call the [`revokeApiToken()`](../../src/app/core/services/user/user.service.ts) user service in order to deactivate the token on server side.
Besides this, the PWA removes the token and basket-id on browser side, fetches a new anonymous user token, and sets it as `apiToken` cookie.

[ssr-startup]: ../guides/ssr-startup.md
[nginx-startup]: ../guides/nginx-startup.md
