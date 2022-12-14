<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication with the punchout identity provider

This document describes the main authentication mechanism if punchout is used as identity provider.
If you need an introduction to this topic, read the [Authentication Concept](../concepts/authentication.md) first.

## Configuration

The PWA must be configured in a correct way to use punchout as a identity provider.
Besides the enabled 'punchout' feature flag the following configuration can be added to the Angular CLI environment files for development purposes:

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

Additionally the PWA can be configured to use the punchout identity provider only, when the user enters the punchout route.
In that case the nginx should be configured with the OVERRIDE_IDENTITY_PROVIDERS environment variable (see [Override Identity Providers by Path][nginx-startup]).
Nevertheless the SSR process needs to be provided with the punchout identity provider configuration.

## Login

A user can login by navigating to the '/punchout' or '/login' route.
Therefore [specific query params](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts) needs to be added to the given route depending whether the oci or the cxml punchout should be used.
For the oci punchout login the user needs to add the 'HOOK_URL', 'USERNAME' and 'PASSWORD' as query parameter, while the cxml user have to include the 'sid' and 'access-token'.
In addition the [cxml punchout tester](https://punchoutcommerce.com/tools/cxml-punchout-tester) could be used to login a cxml punchout user.
The request [/customers/${CustomersKey}/punchouts/cxml1.2/setuprequest](https://support.intershop.com/kb/index.php/Display/29L952#l1142) to create a new cXML punchout session must be inserted as the url with the credentials of the cXML punchout user.
When the session is successfully created, then the punchout tester will redirect to the in the ICM configured PWA deployment punchout route.

## Registration

There is actually no possibility to register a new punchout user in the PWA.

## Token Lifetime

Each authentication token has a predefined lifetime.
That means, the token has to be refreshed to prevent it from expiring.
When 75% of the token's lifetime is gone by ( this time can be configured in the oAuth library) an info event is emitted.
This event is used to call the [refresh mechanism 'setupRefreshTokenMechanism$'](../../src/app/core/utils/oauth-configuration/oauth-configuration.service.ts) of the oAuth configuration service and the authentication token will be renewed.
Hence, the token won't expire as long as the user keeps the PWA open in the browser.

## Logout

When the user logs out by clicking the logout link or navigating to the '/logout' route, the configured [logout()](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts) function will be executed and this will call the [revokeApiToken()](../../src/app/core/services/user/user.service.ts) user service in order to inactivate the token on server side.
Besides this, the PWA removes the token and basket-id on browser side, fetches a new anonymous user token and set it as apiToken cookie.

[ssr-startup]: ../guides/ssr-startup.md
[nginx-startup]: ../guides/nginx-startup.md
