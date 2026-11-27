<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Authentication with the Punchout Identity Provider

- [Configuration](#configuration)
  - [Hook URL Validation](#hook-url-validation)
- [Login](#login)
- [Registration](#registration)
- [Token Lifetime](#token-lifetime)
- [Logout](#logout)

This document describes the authentication mechanism if punchout is used as the identity provider.
If you need an introduction to this topic, read the [Authentication Concept](../concepts/authentication.md) first.

## Configuration

The PWA must be configured in a specific way to use punchout as an identity provider.
Apart from the enabled `punchout` feature flag, the following configuration can be added to the Angular CLI _environment.ts_ files for development purposes:

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

> [!WARNING]
> This configuration enables the `Punchout` identity provider as only configured global identity provider.
> The standard ICM identity provider used for the standard login is no longer configured, so the standard login no longer works.
> As mentioned above, this configuration example is relevant only for punchout development purposes.

> [!NOTE]
> With this configuration, the `Punchout` identity provider handles every route and does not restore the session of the `apiToken` cookie, so a reload logs out the punchout user.
> To restore the session on a reload during development, add `this.apiTokenService.restore$(['user', 'order']).subscribe(noop);` to the `init()` method of the [`PunchoutIdentityProvider`](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts).
> Its `hasUserSession()` method then has to return `this.apiTokenService.hasUserApiTokenCookie()`, so that personalized content waits for the PGID of the restored user.
> The session of an existing `apiToken` cookie is then also restored in parallel to a login on the punchout route.

For production-like deployments, the PWA has to be configured to use the `Punchout` identity provider only when the user enters the `punchout` route.
This can be configured with the `OVERRIDE_IDENTITY_PROVIDERS` environment variable (see [Override Identity Providers by Path](../guides/nginx-startup.md#override-identity-providers-by-path)) for the NGINX container.
However, the SSR process needs to be provided with the punchout identity provider configuration as one of the available identity providers.
In this way, the global `identityProvider` configuration remains the default ICM configuration.

The following is a sample punchout identity provider configuration for `docker-compose` that enables the punchout identity provider on the `punchout` route only:

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

Example configuration via [PWA Helm Chart 1.0.0 or later](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
app:
  env:
    - name: IDENTITY_PROVIDERS
      value: |
        {
          "Punchout": {"type": "PUNCHOUT"}
        }

proxy:
  env:
    - name: OVERRIDE_IDENTITY_PROVIDERS
      value: |
        .+:
          - path: /punchout
            type: Punchout
```

> [!IMPORTANT]
> The `OVERRIDE_IDENTITY_PROVIDERS` matching pattern (in the example `.+`) must exactly match a `MULTI_CHANNEL` matching pattern, or it can be configured as a RegEx that matches several `MULTI_CHANNEL` matching patterns.

```yaml
proxy:
  env:
    - name: OVERRIDE_IDENTITY_PROVIDERS
      value: |
        .+:
          - path: /punchout
            type: Punchout

  multiChannel: |
    .+:
      - baseHref: /en
        channel: default
        lang: en_US
      - baseHref: /de
        channel: default
        lang: de_DE
      - baseHref: /fr
        channel: default
        lang: fr_FR
      - baseHref: /b2c
        channel: default
        theme: b2c
```

### Hook URL Validation

For the OCI punchout, the PWA submits the basket to the `HOOK_URL` given as a query parameter at login.
To prevent script injection via this form target, the PWA checks the scheme of the `HOOK_URL` before logging in, in the same way that ICM checks the OCI return URL.
The `HOOK_URL` must start with an allowed scheme.
Leading whitespace and control characters are not allowed.
By default, `http`, `https`, and `sapevent` (used by SAP systems for catalogs embedded in the SAP GUI) are allowed.
To change the allowed schemes, configure the `hookUrlSchemes` property of the punchout identity provider, e.g., to allow only `https`, so that the basket data is never transferred unencrypted.
If `hookUrlSchemes` is empty, the default is used.
The script schemes `javascript`, `data`, and `vbscript` are never allowed, even if they are configured.
If the `HOOK_URL` is not valid, the user is not logged in, the `HOOK_URL` is not stored, and the error page is displayed.

```yaml
pwa:
  environment:
    IDENTITY_PROVIDERS: |
      Punchout:
        type: PUNCHOUT
        hookUrlSchemes:
          - https
```

Example configuration via [PWA Helm Chart 1.0.0 or later](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
app:
  env:
    - name: IDENTITY_PROVIDERS
      value: |
        {
          "Punchout": {
            "type": "PUNCHOUT",
            "hookUrlSchemes": ["https"]
          }
        }
```

> [!NOTE]
> The host of the `HOOK_URL` is not restricted.
> The [Content Security Policy](./security-headers.md) directive `form-action` restricts the targets of the punchout basket transfer in the browser.
> The default `form-action 'self' https:` blocks `HOOK_URL`s with the schemes `http` and `sapevent`.
> To support them for the OCI punchout, add the schemes to the directive, e.g., `form-action 'self' https: http: sapevent:`.

## Login

A user can log in by navigating to the `/punchout` or `/login` route.
For this purpose, [specific query parameters](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts) need to be added to the given route depending on whether the OCI or the cXML punchout should be used.
For the OCI punchout login, the user needs to add the `HOOK_URL`, `USERNAME`, and `PASSWORD` as query parameters, while the cXML user needs to include the `sid` and `access-token`.
In addition, the [cXML punchout tester](https://punchoutcommerce.com/tools/cxml-punchout-tester) can be used to log in a cXML punchout user.
The request [/customers/${CustomersKey}/punchouts/cxml1.2/setuprequest](https://support.intershop.com/kb/index.php/Display/29L952#l1142) to create a new cXML punchout session must be inserted as the URL with the credentials of the cXML punchout user.
When the session is created successfully, the punchout tester redirects to the `/punchout` route of the PWA deployment configured in ICM.

The punchout user is logged in with these query parameters only.
Before the login, the session of a previous login (the `apiToken` cookie and the tokens of the OAuth library in the local storage) is removed and is not restored, even on a reload of the punchout route.
After the login, the PWA stores the new session in the `apiToken` cookie.
A reload restores this session only on routes that use another identity provider, such as the default ICM identity provider in production-like deployments (see [Configuration](#configuration)).

## Registration

The PWA currently does not support the registration of new punchout users.

## Token Lifetime

The authentication token is refreshed automatically before it expires.
For more information, see [Concept - Authentication: Token Lifetime](../concepts/authentication.md#token-lifetime).

## Logout

When the user logs out by clicking the logout link or navigating to the `/logout` route, the [`triggerLogout()`](../../src/app/extensions/punchout/identity-provider/punchout-identity-provider.ts) method of the identity provider is executed, which calls the [`logoutUser()`](../../src/app/core/services/user/user.service.ts) user service to deactivate the token on the server side.
In addition, the PWA removes the token, the `apiToken` cookie, and the `basket-id` from the session storage on the browser side; new anonymous user tokens are only fetched when a basket is created.
