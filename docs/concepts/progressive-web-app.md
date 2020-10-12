<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Progressive Web App

In order to be a [Progressive Web Application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps), the Intershop PWA implements some advanced concepts matching those criteria.

## Web App Manifest

The Web App Manifest enables the PWA to be installable on home screens of mobile devices.
The application is easily accessible via a generated link and branding is applied to icons and browser colouring so it poses as a native application.

The manifest in the PWA is theme specific and can be customized in the file `src/assets/themes/<theme>/manifest.webmanifest`.

## Service Worker

[Service Workers](https://angular.io/guide/service-worker-intro) are automatically installed into client device browsers after the first visit to the shop and take over all the handling of the application on the client side.
Possible advanced features supplied are offline-capabilities and push notifications.
After installation, the service worker effectively disables server-side rendering for clients and invokes all rendering on the client himself.

For the Intershop PWA, offline browsing is not a suitable use-case for most customers and push notifications are not yet supplied by the Commerce Management Suite.
For now service worker integration is an **experimental** feature that can be activated for appropriate projects.

To activate the service worker run

```bash
node schematics/customization/service-worker true
```

You can also activate the service worker specifically for docker builds by supplying the build argument `serviceWorker=true`.
