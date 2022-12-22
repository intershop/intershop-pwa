<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication Concept

## Introduction

Several ICM REST operations require an authenticated user.
Authentication also assures enterprise information security.
In the PWA a user can be verified with the help of an identity provider.
An identity provider (IdP) is a service that stores and manages digital identities.
The following identity providers are supported: The default [ICM server](../guides/authentication_icm.md), the [SSO Auth0](../guides/authentication_sso.md) and the [Punchout](../guides/authentication_punchout.md) identity provider.

## Library angular-oauth2-oidc

There is a lot of functionality related to authentication, e.g., logging a user in and out, registering a new user, keeping the user identified even if the user opens further browser tabs, etc.

The PWA uses the library [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc#readme) to support the implementation of these functionalities.
It can be configured to provide access to identity providers.
You can find the initialization of this library in the [oauth-configuration-service.ts](../../src/app/shared/../core/utils/oauth-configuration/oauth-configuration.service.ts).

## Implementation and Configuration of Identity Providers

To add or change the functionality of an identity provider, the following steps are necessary:

1. Create/change an `<idp>.identity-provider.ts` class that implements the interface [`IdentityProvider`](../../src/app/core/identity-provider/identity-provider.interface.ts). In this interface all methods are declared which have to be implemented in your IdP class.

   In the following code you see a typical implementation of the init method of an IdP class.

   Note that all authentication-related functionality must not be executed before the oAuth service has been configured.

   ```typescript
   @Injectable({ providedIn: 'root' })
   export class ExampleIdentityProvider implements IdentityProvider {
     private configured$ = new BehaviorSubject<boolean>(false);

     constructor(private oAuthService: OAuthService, private configService: OAuthConfigurationService) {}

     init() {
       this.configService.config$.subscribe(config => {
         this.oAuthService.configure(config);
         this.configured.next(true);
       });

       this.configured
         .pipe(
           whenTruthy(),
           switchMap(() => from(this.oAuthService.fetchTokenUsingGrant('anonymous')))
         )
         .subscribe();
     }
   }
   ```

2. Register the `<idp>.identity-provider.ts` in the [`IdentityProviderModule`](../../src/app/core/identity-provider.module.ts). The `APP_INITIALIZER` injection token is used to configure and initialize the identity provider before app initialization.

3. Set the environment variables `IdentityProviders` and `IdentityProvider` accordingly.

## PWA Initialization

A PWA user has to be identified by the ICM server by a unique authentication token, even if it is an anonymous user.
Once a user opens the PWA for the first time, an authentication token is requested by the [ICM Token REST endpoint](https://support.intershop.com/kb/index.php?c=Display&q1=U29770&q2=Text).
This happens in the [`init()`](../../src/app/core/identity-provider/icm.identity-provider.ts) method of the active identity provider.
Subsequently, this token will be saved as `apiToken` cookie and added to all REST requests in the request header, e.g.:

```typescript
authentication-token: encryption0@PBEWithMD5AndTripleDES:1D7T8HyFqQ0=|k3PQLgujzUq0tudtw+6HLjWnExiwrd4o9/jVU7ZH74kTfTy3RS7/sYadsg7ODRM2
```

This way it is possible to identify users even they are opening a new browser tab or refreshing the PWA in the browser.

If a user opens the PWA and already has a valid apiToken cookie, no new token is requested by the ICM server but this token is used in the header of the REST requests.

## Login, Registration, Token Refreshment, Logout

All these functionalities strongly depend on the implementation of the used identity provider.
This is described in the appropriate identity provider guides in more detail, see [Further References](#further-references) below.

## Vanishing of the apiToken Cookie

The PWA needs to react in case the `apiToken` cookie is not available anymore.
This could happen if a PWA is opened in many tabs and the user logs out, or when users remove the cookie themselves.
When the cookie vanishes, the PWA emits a new value for the [`cookieVanishes$` subject](../../src/app/core/utils/api-token/api-token.service.ts).
The identity provider implementation defines how the application should behave in such a case.
With the ICM identity provider, for example, the user is then automatically logged out and routed to the `/login` page.

## Further References

- [Guide - ICM Identity Provider](../guides/authentication_icm.md)
- [Guide - Punchout Identity Provider](../guides/authentication_punchout.md)
- [Guide - Single Sign-On (SSO) Identity Provider](../guides/authentication_sso.md)
