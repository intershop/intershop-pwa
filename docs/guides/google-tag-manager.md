<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Google Tag Manager

To enable user tracking and setting it up with [Google Tag Manager](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/gtm), the popular library [Angulartics2](https://angulartics.github.io/angulartics2/) is used.

> [!NOTE]
> The standard Intershop PWA Google Tag Manager integration is very basic and currently only supports the tracking of route changes.
>
> Please refer to the [angulartics2 documentation](https://github.com/angulartics/angulartics2#usage) for information on how to enable tracking for additional events (e.g. e-commerce events).

This feature only works in combination with Server Side Rendering, where the initial tracking configuration is set if the feature is enabled.

> [!IMPORTANT]
> The actual tracking on the client side will only work if the user has given his consent for `tracking` via the cookie banner or setting the according cookie preferences.

To activate GTM tracking, set the Tag Manager Token either in the used Angular CLI environment file with the property `gtmToken` or via the environment variable `GTM_TOKEN`.
Additionally, the feature toggle `tracking` has to be added to the enabled feature list.

The configuration via system environment variables is recommended since it is more flexible for different deployments and it does not require to add tokens to the PWA source code.

Example via `environment.ts` file:

```typescript
features: ['tracking'],
gtmToken: 'GTM-ABCDEFG',
```

Example via `docker-compose.yml` configuration:

```yaml
pwa:
  environment:
    - FEATURES=tracking
    - GTM_TOKEN=GTM-ABCDEFG
```

Example via PWA Helm Chart:

```yaml
environment:
  - name: FEATURES
    value: tracking
  - name: GTM_TOKEN
    value: GTM-ABCDEFG
```

> [!IMPORTANT]
> For GDPR compliance the tracked IPs have to be anonymized, see [How to turn on IP anonymization in Google Analytics and Google Tag Manager](https://www.optimizesmart.com/how-to-turn-on-ip-anonymization-in-google-analytics-and-google-tag-manager/).
