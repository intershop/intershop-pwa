<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# SSO with Auth0 for PWA

Follow [this guide](https://manfredsteyer.github.io/angular-oauth2-oidc/docs/additional-documentation/authorization-servers/auth0.html) to set up an application in the Auth0 configuration.

The PWA implementation for this identity provider is located in [`Auth0IdentityProvider`](../../src/app/core/identity-provider/auth0.identity-provider.ts).

Use the fields "Domain" and "Client ID" for configuring the provider:

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

# Further References

- [Concept - Single Sign-On (SSO) for PWA](../concepts/sso.md)
