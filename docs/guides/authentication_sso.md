<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication with Single Sign-On (SSO)

- [SSO with Auth0 for PWA](#sso-with-auth0-for-pwa)
- [Business Cases](#business-cases)
  - [Create New User](#create-new-user)
  - [User Forgot Password](#user-forgot-password)
- [Further References](#further-references)

Intershop Commerce Management supports logging in clients via SSO (see [Concept - Single Sign-On (SSO)][kb-concept-sso]).

The PWA uses the library [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc#readme) to support an easy configuration for providing access to identity providers.
After setting up the ICM side with the identity provider, an implementation for the interface [`IdentityProvider`](../../src/app/core/identity-provider/identity-provider.interface.ts), provided in the [`IdentityProviderModule`](../../src/app/core/identity-provider.module.ts), has to be added.

The Intershop PWA contains a working example implementation for SSO with [Auth0](https://auth0.com/) that can be used for B2B and B2C.

For development purposes the configuration can be added to the Angular CLI `environment.ts` files:

```typescript
  identityProvider: 'Auth0',
  identityProviders: {
    'Auth0': {
      type: 'auth0',
      domain: 'some-domain.auth0.com',
      clientID: 'ASDF12345',
    }
  },
```

For production, this configuration should be provided to the SSR process via environment variables (see [Building and Running Server-Side Rendering][ssr-startup]).
The usage of identity providers can also be set in the multi-channel configuration (see [Building and Running nginx Docker Image][nginx-startup]).

Example for the Auth0 identity provider configuration via `docker-compose.yaml` file:

```yaml
pwa:
  environment:
    IDENTITY_PROVIDER: 'Auth0'
    IDENTITY_PROVIDERS: |
      Auth0:
        type: auth0
        domain: some-domain.auth0.com
        clientID: ASDF12345
```

Example for the Auth0 identity provider configuration via [PWA Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
environment:
  - name: IDENTITY_PROVIDER
    value: 'Auth0'
  - name: IDENTITY_PROVIDERS
    value: |
      {
        "Auth0": {"type": "auth0", "domain": "some-domain.auth0.com", "clientID": "ASDF12345"}
      }
```

## SSO with Auth0 for PWA

Follow [this guide](https://manfredsteyer.github.io/angular-oauth2-oidc/docs/additional-documentation/authorization-servers/auth0.html) to set up an application in the Auth0 configuration.

The PWA contains a default SSO with Auth0 identity provider implementation located in the [`Auth0IdentityProvider`](../../src/app/core/identity-provider/auth0.identity-provider.ts).

Use the configuration fields `domain` and `clientID` for configuring the provider.

## Business Cases

### Create New User

| Authentication Provider | Route in ICM e-mail | Behavior of PWA                            |
| ----------------------- | ------------------- | ------------------------------------------ |
| ICM                     | /invite             | Redirect to /forgotPassword/updatePassword |
| SSO                     | /invite             | Redirect to SSO provider                   |

### User Forgot Password

| Authentication Provider | Route in ICM e-mail            | Behavior of PWA             |
| ----------------------- | ------------------------------ | --------------------------- |
| ICM                     | /forgotPassword/updatePassword | Show _change password_ form |
| SSO                     | /forgotPassword/updatePassword | Redirect to SSO provider    |

## Further References

Example for an Auth0 identity provider configuration via [ICM Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/icm-as):

```yaml
icm-as:
  environment:
    ISH_ENV_IDENTITYPROVIDER: |
      intershop.identityProvider.remote = supported,
      intershop.authentication.identityprovider.localICM.type=local,
      intershop.authentication.identityprovider.auth0.type=oidc,
      intershop.authentication.identityprovider.auth0.name=Auth0 SSO ICM,
      intershop.authentication.identityprovider.auth0.configuration={"issuer": "https://some-domain.auth0.com"",""client_id": "ASDF12345"",""client_secret": "53CR37"},
      intershop.authentication.inSPIRED-inTRONICS-Anonymous.externalname=inTRONICS,
      intershop.authentication.inSPIRED-inTRONICS-Anonymous.identityproviders=auth0"," localICM,
      intershop.authentication.inSPIRED-inTRONICS_Business-Anonymous.externalname=inTRONICS-b2b,
      intershop.authentication.inSPIRED-inTRONICS_Business-Anonymous.identityproviders=auth0"," localICM
```

- PWA
  - [Concept - Authentication](../concepts/authentication.md)
  - [Guide - Building and Running Server-Side Rendering][ssr-startup]
  - [Guide - Building and Running nginx Docker Image][nginx-startup]
- ICM
  - [Concept - Single Sign-On (SSO)][kb-concept-sso]
- General
  - [SSO with OAuth 2 and OpenId Connect](https://angular.de/artikel/oauth-odic-plugin/) (in German)

[kb-concept-sso]: https://support.intershop.com/kb/index.php/Display/29A407
[ssr-startup]: ../guides/ssr-startup.md
[nginx-startup]: ../guides/nginx-startup.md
