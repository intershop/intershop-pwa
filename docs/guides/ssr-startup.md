<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Building and Running Server-Side Rendering

## Building

To **simply** build the Intershop PWA in server-side rendering mode, you can use the _package.json_ script `npm run build`, which builds the Intershop PWA with the `production` configuration of the `angular.json`.
Afterwards you can start the application with `npm run serve` (or do both by using `npm run start`).

The preferred way for **production deployments** is to build the `Dockerfile` in the project root and run the created image.
While building, you can provide a build argument (i.e. via `--build-arg`) `configuration` and build a different configuration from _angular.json_.
By default the `production` configuration is built.

All `configuration` options can also be multiple configurations like `--configuration=brand,production`, where production should always come last.

## Running

Overwriting configurations of the PWA is entirely done by environment variables.
This approach was chosen to have the best possible compatibility when running the PWA either from the command line or in an orchestrator.

To [set environment variables in windows](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/set_1) run for example `set SSR_HYBRID=true` on the command line before executing the `npm run` commands.

If the format is _any_, then the environment variable has to be set to any value to be active.
Setting it to `"false"` still counts as active.
Only empty strings count as inactive.

If the format is _switch_, the property is switched on by supplying `on`, `1`, `yes` or `true` (checked case-insensitive), anything else is considered `off`.

All parameters are **case sensitive**.
Make sure to use them as written in the table below.

|                     | parameter             | format               | comment                                                      |
| ------------------- | --------------------- | -------------------- | ------------------------------------------------------------ |
| **SSR Specific**    | PORT                  | number               | Port for running the application                             |
|                     | SSL                   | any                  | Enables SSL/TLS                                              |
| **General**         | ICM_BASE_URL          | string               | Sets the base URL for the ICM                                |
|                     | ICM_CHANNEL           | string               | Overrides the default channel                                |
|                     | ICM_APPLICATION       | string               | Overrides the default application                            |
|                     | FEATURES              | comma-separated list | Overrides active features                                    |
|                     | THEME                 | string               | Overrides the default theme                                  |
| **Debug** :warning: | TRUST_ICM             | any                  | Use this if ICM is deployed with an insecure certificate     |
|                     | LOGGING               | switch               | Enables extra log output                                     |
| **Hybrid Approach** | SSR_HYBRID            | any                  | Enables running PWA and ICM in [Hybrid Mode][concept-hybrid] |
|                     | PROXY_ICM             | any \| URL           | Proxy ICM via `/INTERSHOP` (enabled if SSR_HYBRID is active) |
| **Third party**     | GTM_TOKEN             | string               | Token for Google Tag Manager                                 |
|                     | SENTRY_DSN            | string               | Sentry DSN URL for using Sentry Error Monitor                |
|                     | PROMETHEUS            | switch               | Exposes Prometheus metrics                                   |
|                     | ICM_IDENTITY_PROVIDER | string               | ID of Identity Provider for [SSO][concept-sso]               |
|                     | IDENTITY_PROVIDERS    | JSON                 | Configuration of Identity Providers for [SSO][concept-sso]   |

## Running with https

We deliver a selfsigned x509 certifciate for local development/deployment purposes only.
For obvious reasons (e.g we do not know your hostname) we cannot deliver a certificate that is accepted by web browsers.
Therefore be prepared for security questions when first accessing the site.

Our image build process is expecting files `server.crt` and `server.key` in folder `dist`.
Extension `crt` is the certifcate and `key` represents the private key.

# Further References

- [Concept - Configuration](../concepts/configuration.md)
- [Concept - Hybrid Approach][concept-hybrid]
- [Concept - Logging](../concepts/logging.md)
- [Concept - Single Sign-On (SSO) for PWA][concept-sso]
- [Guide - Client-Side Error Monitoring with Sentry](./sentry-error-monitoring.md)
- [Guide - Google Tag Manager](./google-tag-manager.md)
- [Guide - Monitoring with Prometheus](./prometheus-monitoring.md)
- [Youtube - Server Side Rendering and Pre Rendering with Angular Universal](https://youtu.be/-VDOAjzLcvQ)
- [Google Developers - Rendering on the Web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)

[concept-sso]: ../concepts/sso.md
[concept-hybrid]: ../concepts/hybrid-approach.md
