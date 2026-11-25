<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication by the ICM Server

- [Login](#login)
- [Registration](#registration)
- [Token Lifetime](#token-lifetime)
- [Logout](#logout)

This document describes the main authentication mechanism if the ICM server is used as the identity provider.
If you need an introduction to this topic, read the [Authentication Concept](../concepts/authentication.md) first.

## Login

If the user wants to login by clicking a login link or navigating to the `/login` route, either a pop-up or a page is displayed containing a login form.
After the user has entered the credentials (e-mail address or username and password) and the ICM server has verified them successfully, a new token is fetched from the ICM `/token` REST endpoint.
The refresh token of the registered user is saved in the the `apiToken` cookie, and the access token is attached to the request header of subsequent REST requests.
After logging in, the pgid of the user is requested from the ICM server (`/personalization` REST call), and the `personalizationStatusDetermined` action is triggered.
To request user-specific, non-cached data from the ICM server, use the `sendPGID` or `sendSPGID` option, respectively, when you call the _get_ method of the `ApiTokenService`.

## Registration

The registration of a user is similar to the login.
After the user has completed the registration form, the data is validated by the ICM server, and a new user is created.
Afterward, the authentication token is requested from the server, and the user will be logged in, as described in [Login](#login).

## Token Lifetime

The authentication token is refreshed automatically before it expires.
For more information, see [Concept - Authentication: Token Lifetime](../concepts/authentication.md#token-lifetime).

## Logout

When the user logs out by clicking the logout link or navigating to the `/logout` route, the configured [`logout()`](../../src/app/core/identity-provider/icm.identity-provider.ts) function is executed, which calls the [`revokeApiToken()`](../../src/app/core/services/user/user.service.ts) user service to deactivate the token on the server side.
In addition, the PWA removes the tokens and the `apiToken` cookie on the browser side; new anonymous user tokens are only fetched when a basket is created.
If the `/logout` route is opened directly, e.g., by a bookmark, the session of the the `apiToken` cookie is not restored but only removed on browser side.
