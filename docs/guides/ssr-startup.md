<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Building and Running Server-Side Rendering

## Building

To **simply** build the Intershop PWA in server-side rendering mode, you can use the _package.json_ script `npm run build`, which builds the Intershop PWA with the `production` configuration of the `angular.json` with the default theme.
Afterwards you can start the application with `npm run serve` (or do both by using `npm run start`).

To build a specific theme (see [Guide - Themes][themes]), you can build (and run) via `npm` using the `--configuration=` argument.
All `configuration` options must be in the format `--configuration=<theme>,(production|development)`.

## Building Multiple Themes

The `package.json` property `config.active-themes` determines which themes should be built when running `npm run build:multi`.
This will build server and client bundles for all active themes and supply them in the `dist` folder.
The SSR process for each theme can be run individually using the generated scripts `dist/<theme>/run-standalone`.

To run multiple themes with [PM2][pm2], the script `src/ssr/server-scripts/build-ecosystem.js` can be used to generate the ecosystem.
If only one theme is active, the theme-specific SSR process will be run in cluster mode on the default port.
If more themes are active, PM2 is provisioned to run a distributor process in front of all theme-specific processes, to direct incoming traffic to the correct SSR process.

The preferred way for **production deployments** is to build the `Dockerfile` in the project root and run the created image.
This will automatically build all active themes and configure [PM2][pm2] for running multiple themes in parallel.

## Running

Overwriting configurations of the PWA is entirely done by environment variables.
This approach was chosen to have the best possible compatibility when running the PWA either from the command line or in an orchestrator.

To [set environment variables in windows](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/set_1), run, for example, `set SSR_HYBRID=true` on the command line before executing the `npm run` commands.

If the format is _any_, the environment variable has to be set to any value to be active.
Setting it to `"false"` still counts as active.
Only empty strings count as inactive.

If the format is _switch_, the property is switched on by supplying `on`, `1`, `yes` or `true` (checked case-insensitive), anything else is considered `off`.

All parameters are **case sensitive**.
Make sure to use them as written in the table below.

|                     | parameter             | format               | comment                                                                                          |
| ------------------- | --------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| **SSR Specific**    | PORT                  | number               | Port for running the application                                                                 |
|                     | CONCURRENCY_SSR       | number \| max        | Concurrency for SSR instances per theme (default: 2)                                             |
|                     | CACHE_ICM_CALLS       | recommended \| JSON  | Enable caching for ICM calls, see [Local ICM Cache](#local-icm-cache) (default: disabled)        |
| **General**         | ICM_BASE_URL          | string               | Sets the base URL for the ICM                                                                    |
|                     | ICM_CHANNEL           | string               | Overrides the default channel                                                                    |
|                     | ICM_APPLICATION       | string               | Overrides the default application                                                                |
|                     | FEATURES              | comma-separated list | Overrides active features                                                                        |
|                     | THEME                 | string               | Overrides the default theme                                                                      |
|                     | MULTI_SITE_LOCALE_MAP | JSON \| false        | Used to map locales to [url modification parameters](../guides/multi-site-configurations.md)     |
|                     | DEPLOY_URL            | string               | Set a [Deploy URL][concept-deploy-url] (default `/`)                                             |
| **Debug** :warning: | TRUST_ICM             | any                  | Use this if ICM is deployed with an insecure certificate                                         |
|                     | LOGGING               | switch               | Enables extra log output                                                                         |
|                     | SOURCE_MAPS           | switch               | Exposes source maps if activated                                                                 |
| **Hybrid Approach** | SSR_HYBRID            | any                  | Enables running PWA and ICM in the [Hybrid Approach][concept-hybrid]                             |
|                     | SSR_HYBRID_BACKEND    | URL                  | When running in K8S, this contains the ICM WA service URL. For none K8S you can use ICM_BASE_URL |
|                     | PROXY_ICM             | any \| URL           | Proxy ICM via `/INTERSHOP` (enabled if SSR_HYBRID is active)                                     |
| **Third party**     | GTM_TOKEN             | string               | Token for Google Tag Manager                                                                     |
|                     | GMA_KEY               | string               | API key for Google Maps                                                                          |
|                     | SENTRY_DSN            | string               | Sentry DSN URL for using Sentry Error Monitor                                                    |
|                     | PROMETHEUS            | switch               | Exposes Prometheus metrics                                                                       |
|                     | IDENTITY_PROVIDER     | string               | ID of the default identity provider if other than `ICM`                                          |
|                     | IDENTITY_PROVIDERS    | JSON                 | Configuration of additional identity providers besides the default `ICM`                         |
|                     | ADDRESS_DOCTOR        | JSON                 | Configuration of address doctor with login, password, maxResultCount and url                     |

## Development

For live Angular Universal (SSR) development, you have to use means provided by Angular CLI.
The following command starts an SSR development environment.

```
npm run start:ssr-dev
```

If the SSR development environment needs to run with `https`, this can be achieved like this:

```
npm run start:ssr-dev -- --ssl
```

The following is an example command for how to provide specific certificates that can be valid in your local development environment:

```
ng run intershop-pwa:serve-ssr --ssl --ssl-cert ~/work/wildcard-certificates/wildcard_localdev.de/cert.pem --ssl-key ~/work/wildcard-certificates/wildcard_localdev.de/privkey.pem --host host.localdev.de
```

## Local ICM Cache

As there are multiple calls that are always common for any SSR requests (like retrieving `/configurations`, `/localizations` and category trees), those calls can be cached for a short time inside the PWA SSR process and be reused for multiple pre-renders.
Set `CACHE_ICM_CALLS=recommended` to setup basic short-time caching for the aforementioned calls.

You can further customize the caching by supplying a JSON structure to the `CACHE_ICM_CALLS` environment variable of the PWA SSR process:

```json
{
  "/configurations": "20m",
  "/variations": "2h",
  ".*": "2m"
}
```

This example will cache `/configurations` for 20 minutes, product variations for 2 hours, and everything else for 2 minutes.

This feature can also be used to benchmark the SSR render performance locally by caching all ICM calls.

## Further References

- [Concept - Configuration](../concepts/configuration.md)
- [Concept - Deploy URL][concept-deploy-url]
- [Concept - Hybrid Approach][concept-hybrid]
- [Concept - Logging](../concepts/logging.md)
- [Guide - Themes][themes]
- [Guide - Client-Side Error Monitoring with Sentry](./sentry-error-monitoring.md)
- [Guide - Google Tag Manager](./google-tag-manager.md)
- [Guide - Monitoring with Prometheus](./prometheus-monitoring.md)
- [PM2][pm2]
- [YouTube - Server Side Rendering and Pre Rendering with Angular Universal](https://www.youtube.com/watch?v=-VDOAjzLcvQ)
- [Google Developers - Rendering on the Web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)
- [Angular Universal: a Complete Practical Guide](https://blog.angular-university.io/angular-universal/)

[concept-hybrid]: ../concepts/hybrid-approach.md
[concept-deploy-url]: ../concepts/deploy-url.md
[themes]: ./themes.md
[pm2]: https://pm2.keymetrics.io
