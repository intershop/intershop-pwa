<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Progressive Web App

- [Web App Manifest](#web-app-manifest)

In order to be a [Progressive Web Application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps), the Intershop PWA implements some advanced concepts matching those criteria.

## Web App Manifest

The Web App Manifest enables the PWA to be installable on home screens of mobile devices.
The application is easily accessible via a generated link, and branding is applied to icons and browser coloring so it poses as a native application.

The manifest in the PWA is theme-specific and can be customized in the file `src/assets/themes/<theme>/manifest.webmanifest`.
