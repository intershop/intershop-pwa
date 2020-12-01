<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Single Sign-On (SSO) for PWA

Intershop Commerce Management supports logging in clients via SSO (see [Concept - Single Sign-On (SSO)][kb-concept-sso]).

The PWA uses the library [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc#readme) to support an easy configuration for providing access to identity providers.
After setting up the ICM side with the identity provider, an implementation for the interface [`IdentityProvider`](../../src/app/core/identity-provider/identity-provider.interface.ts), provided in the [`IdentityProviderModule`](../../src/app/core/identity-provider.module.ts), has to be added.

For development purposes the configuration can be added to the Angular CLI environment files:

```typescript
  identityProvider: 'MyProvider',
  identityProviders: {
    'MyProvider': {
      type: 'auth0',
      domain: 'some-domain.auth0.com',
      clientID: 'ASDF12345',
    }
  },
```

For production, this configuration should be provided to the SSR process via environment variables (see [Building and Running Server-Side Rendering][ssr-startup]).
The usage of identity providers can also be set in the multi-channel configuration (see [Building and Running nginx Docker Image][nginx-startup]).

# Further References

- PWA
  - [Guide - SSO with Auth0 for PWA](../guides/sso-auth0.md)
  - [Guide - Building and Running Server-Side Rendering][ssr-startup]
  - [Guide - Building and Running nginx Docker Image][nginx-startup]
- ICM
  - [Concept - Single Sign-On (SSO)][kb-concept-sso]

[kb-concept-sso]: https://support.intershop.com/kb/index.php/Display/29A407
[ssr-startup]: ../guides/ssr-startup.md
[nginx-startup]: ../guides/nginx-startup.md
