<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Building and Running Server-Side Rendering

## Building

To **simply** build the Intershop PWA in server-side rendering mode, you can use the _package.json_ script `npm run build`, which will build the Intershop PWA with the `production` configuration of the `angular.json`.
Afterwards you can start the application with `npm run serve` (or do both by using `npm run start`).

The preferred way for **production deployments** is to build the `Dockerfile` in the project root and run the created image.
While building you can provide a build argument (i.e. via `--build-arg`) `configuration` and build a different configuration from _angular.json_.
By default the `production` configuration is built.

## Running

Overwriting configurations of the PWA is entirely done by environment variables.
We chose this approach to have the best compatibility with running the PWA from the command line or in an orchestrator.

To [set environment variables in windows](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/set_1) just run for example `set SSR_HYBRID=true` on the command line before the `npm run` commands.

If the format is _any_, then the environment variable just has to be set to any value to be active.
Setting it to `"false"` still counts as active.
Only empty strings count as inactive.

|                     | parameter       | format               | comment                                                                     |
| ------------------- | --------------- | -------------------- | --------------------------------------------------------------------------- |
| **SSR Specific**    | PORT            | number               | port for running the application                                            |
|                     | SSL             | any                  | enable TLS (expects `server.crt` and `server.key` in `dist` folder)         |
| **General**         | ICM_BASE_URL    | string               | sets the base URL for the ICM                                               |
|                     | ICM_CHANNEL     | string               | overrides the default channel                                               |
|                     | ICM_APPLICATION | string               | overrides the default application                                           |
|                     | FEATURES        | comma-separated list | overrides active features                                                   |
|                     | THEME           | string               | overrides the default theme                                                 |
| **Debug** :warning: | TRUST_ICM       | any                  | use this if ICM is deployed with an insecure certificate                    |
|                     | LOGGING         | any                  | enable extra log output                                                     |
| **Hybrid Approach** | SSR_HYBRID      | any                  | enable running PWA and ICM in [Hybrid Mode](../concepts/hybrid-approach.md) |
|                     | PROXY_ICM       | any                  | proxy ICM via `/INTERSHOP` (enabled if SSR_HYBRID is active)                |
| **Third party**     | GTM_TOKEN       | string               | token for Google Tag Manager                                                |
|                     | SENTRY_DSN      | string               | Sentry DSN URL for using Sentry Error Monitor                               |

## References

- [Concept - Configuration](../concepts/configuration.md)
- [Concept - Hybrid Approach](../concepts/hybrid-approach.md)
- [Guide - Client-Side Error Monitoring with Sentry](./sentry-error-monitoring.md)
- [Guide - Google Tag Manager](./google-tag-manager.md)
