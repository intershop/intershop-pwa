<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication by the ICM Server

This document describes the main authentication mechanism if the ICM server is used as identity provider.
If you need an introduction to this topic, read the [Authentication Concept](../concepts/authentication.md) first.

## Login

If the user wants to login by clicking a login link or navigating to the `/login` route, either a popup or a page is displayed containing a login form.
After the user has entered the credentials (e-mail/user name and password) and could be verified successfully by the ICM server, a new token is fetched from the ICM `/token` REST endpoint.
The token of the registered user is saved as `apiToken` cookie and attached to the request header of the subsequent REST requests.
After logging in, the pgid of the user is requested from the ICM server (`/personalization` REST call) and the action `personalizationStatusDetermined` will be triggered.
If you want to request user-specific non-cached data from the ICM server, use the option `sendPGID` or `sendSPGID`, respectively when you call the _get_ method of the `ApiTokenService`.

## Registration

The registration of a user is similar to the login.
After the user has completed the registration form, the data are validated by the ICM server and a new user will be created.
Afterwards, the authentication token is requested from the server and the user will be logged in, see above.

## Token Lifetime

Each authentication token has a predefined lifetime.
That means, the token has to be refreshed to prevent it from expiring.
Once 75% of the token's lifetime have passed (this time can be configured in the oAuth library), an info event is emitted.
This event is used to call the [refresh mechanism `setupRefreshTokenMechanism$`](../../src/app/core/utils/oauth-configuration/oauth-configuration.service.ts) of the oAuth configuration service and the authentication token will be renewed.
Hence, the token will not expire as long as the user keeps the PWA open in the browser.

## Logout

When the user logs out by clicking the logout link or navigating to the `/logout` route, the configured [`logout()`](../../src/app/core/identity-provider/icm.identity-provider.ts) function will be executed, which will call the [`revokeApiToken()`](../../src/app/core/services/user/user.service.ts) user service in order to deactivate the token on server side.
Besides this, the PWA removes the token on browser side, fetches a new anonymous user token, and sets it as `apiToken` cookie.
