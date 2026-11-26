<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication Concept

- [Introduction](#introduction)
- [Library angular-oauth2-oidc](#library-angular-oauth2-oidc)
- [Implementation and Configuration of Identity Providers](#implementation-and-configuration-of-identity-providers)
- [PWA Initialization](#pwa-initialization)
- [Login, Registration, Token Refreshment, Logout](#login-registration-token-refreshment-logout)
- [Token Lifetime](#token-lifetime)
- [Vanishing of the apiToken Cookie](#vanishing-of-the-apitoken-cookie)
- [Further References](#further-references)

## Introduction

Several ICM REST operations require an authenticated user.
Authentication also assures enterprise information security.
In the PWA a user can be verified with the help of an identity provider.
An identity provider (IdP) is a service that stores and manages digital identities.
The following identity providers are supported: The default [ICM server](../guides/authentication_icm.md), the [SSO Auth0](../guides/authentication_sso.md), the [Punchout](../guides/authentication_punchout.md), and the [Co-Browse](../guides/authentication_co_browse.md) identity provider.

## Library angular-oauth2-oidc

There is a lot of functionality related to authentication, e.g., logging a user in and out, registering a new user, keeping the user identified even if the user opens further browser tabs, etc.

The PWA uses the library [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc#readme) to support the implementation of these functionalities.
It is used to fetch data from the [icm token endpoint service](../../src/app/core/services/token/token.service.ts) and can be configured to provide access to other identity providers.

## Implementation and Configuration of Identity Providers

To add or change the functionality of an identity provider, the following steps are necessary:

1. Create/change an `<idp>.identity-provider.ts` class that implements the interface [`IdentityProvider`](../../src/app/core/identity-provider/identity-provider.interface.ts). In this interface all methods are declared which have to be implemented in your IdP class.

   In the following code you see a typical implementation of the init method of an IdP class.

   ```typescript
   @Injectable({ providedIn: 'root' })
   export class ExampleIdentityProvider implements IdentityProvider {
     constructor(
       private router: Router,
       private apiTokenService: ApiTokenService,
       private accountFacade: AccountFacade
     ) {}

     init() {
       this.apiTokenService.restore$().subscribe(noop);

       this.apiTokenService
         .getCookieVanishes$()
         .pipe(withLatestFrom(this.accountFacade.isLoggedIn$))
         .subscribe(([, isLoggedIn]) => {
           this.accountFacade.logoutUser({ revokeApiToken: false });
           if (isLoggedIn) {
             this.router.navigate(['/login'], {
               queryParams: { returnUrl: this.router.url, messageKey: 'session_timeout' },
             });
           }
         });
     }
   }
   ```

   If the identity provider does not restore the user session from the `apiToken` cookie, implement the optional `hasUserSession()` method.
   It tells the PWA whether a user session is restored on startup, so that personalized content waits for the PGID of this user.
   Without this method, a user `apiToken` cookie indicates such a session.

> [!NOTE]
> If an identity provider uses the OAuthService for authentication, it has to create its own OAuthService instance with `InstanceCreators.getOAuthServiceInstance()` instead of injecting the OAuthService.
> Otherwise, difficult side effects with the [TokenService](../../src/app/core/services/token/token.service.ts) will occur.
> Please checkout the [Auth0IdentityProvider](../../src/app/core/identity-provider/auth0.identity-provider.ts) for an example.

2. Register the `<idp>.identity-provider.ts` with its type in the [`IdentityProviderModule`](../../src/app/core/identity-provider.module.ts) as a multi provider of the `IDENTITY_PROVIDER_IMPLEMENTOR` injection token. The [`IdentityProviderFactory`](../../src/app/core/identity-provider/identity-provider.factory.ts) creates the identity provider of the configured type and calls its `init()` method with the configuration once the configuration is loaded.

3. Configure the identity provider with the `identityProviders` and `identityProvider` properties of the Angular CLI _environment.ts_ files or the `IDENTITY_PROVIDERS` and `IDENTITY_PROVIDER` environment variables of the SSR process (see [Building and Running Server-Side Rendering](../guides/ssr-startup.md)).

## PWA Initialization

A PWA user has to be identified by the ICM server by a unique authentication token, even if it is an anonymous user.
Once an unknown user creates a basket in the PWA, an anonymous authentication token is requested by the [ICM Token REST endpoint](https://support.intershop.com/kb/index.php?c=Display&q1=U29770&q2=Text).
This happens in the [`apiToken http interceptor`](../../src/app/core/utils/api-token/api-token.service.ts) method.
Subsequently, this access token, a JSON Web Token (JWT), is added to all REST requests in the request header, e.g. (shortened):

```text
authentication-token: eyJqa3UiOiJodHRwczovL2lj.eyJhdWQiOiJJQ01DbGllbnQi.x7Qk2fZ9mP_c4Lw8
```

The refresh token of the token response is saved as `apiToken` in the `apiToken` cookie, which expires with the refresh token.
In this way, it is possible to identify users even if they are opening a new browser tab or refreshing the PWA in the browser.

If a user opens the PWA and already has an `apiToken` cookie, the PWA restores the session of the cookie by requesting new tokens with its refresh token, because the ICM accepts only refresh tokens for a token refresh.
Until the new tokens are available, the REST requests are sent without the `authentication-token` header.
A cookie with invalid content or a rejected refresh token is removed.

## Login, Registration, Token Refreshment, Logout

All these functionalities strongly depend on the implementation of the used identity provider.
This is described in the appropriate identity provider guides in more detail, see [Further References](#further-references) below.

## Token Lifetime

The ICM, punchout and co-browse identity providers use authentication tokens of the ICM, which have a predefined lifetime.
Therefore, the token must be refreshed to prevent it from expiring.
Once 50% of the access token's lifetime have passed (configured with `timeoutFactor` in the [`TokenService`](../../src/app/core/services/token/token.service.ts)), an info event is emitted.
This event is used to call the [refresh mechanism `setupRefreshTokenMechanism$`](../../src/app/core/services/token/token.service.ts) of the OAuth configuration service, and the authentication token is renewed.
If the token refresh fails due to network or server errors, it is retried up to three times with a delay of 60 seconds.
If ICM rejects it, the user is logged out.
Hence, the token remains valid as long as the user keeps the PWA open in the browser.

## Vanishing of the apiToken Cookie

The PWA needs to react if the `apiToken` cookie is no longer available.
The cookie can vanish if a PWA is opened in multiple tabs and the user logs out, if users remove the cookie themselves, or if ICM rejects the token of the cookie as invalid, e.g., when the session of the cookie is restored after a reload.
When the cookie vanishes, the PWA emits a new value for the [`getCookieVanishes$()` stream](../../src/app/core/utils/api-token/api-token.service.ts).
The identity provider implementation defines how the application behaves in such a case.
With the ICM identity provider, for example, the user is automatically logged out and, if the user was logged in, routed to the `/login` page.
An anonymous user continues without login, and the PWA requests a new anonymous token when needed.

## Further References

- [Guide - ICM Identity Provider](../guides/authentication_icm.md)
- [Guide - Punchout Identity Provider](../guides/authentication_punchout.md)
- [Guide - Co-Browse Identity Provider](../guides/authentication_co_browse.md)
- [Guide - Single Sign-On (SSO) Identity Provider](../guides/authentication_sso.md)
