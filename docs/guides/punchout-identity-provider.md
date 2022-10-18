<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Punchout Configuration for PWA

The PWA implementation for the punchout identity provider is located in [`PunchoutIdentityProvider`](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts).

For development purposes the configuration can be added to the Angular CLI environment files:

```typescript
  features: [
    ...,
    'punchout'
  ],
  identityProvider: 'Punchout',
  identityProviders: {
    'Punchout': {
      type: 'PUNCHOUT',
    }
  },
```

> **_NOTE:_** The value for the identityProvider must match a key from the configured identityProviders object. Furthermore the type 'PUNCHOUT' has to be used for the identityProviders configuration to access the implemented [`PunchoutIdentityProvider`](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts).

For production, this configuration should be provided to the SSR process via environment variables (see [Building and Running Server-Side Rendering][ssr-startup]).
The usage of identity providers can also be set in the multi-channel configuration (see [Building and Running nginx Docker Image][nginx-startup]).

Additionally the PWA can be configured to use the punchout identity provider only, when the user enters the punchout route.
In that case the nginx should be configured with the OVERRIDE_IDENTITY_PROVIDERS environment variable (see [Override Identity Providers by Path][nginx-startup]).
Nevertheless the SSR process needs to be provided with the punchout identity provider configuration.

[ssr-startup]: ../guides/ssr-startup.md
[nginx-startup]: ../guides/nginx-startup.md
