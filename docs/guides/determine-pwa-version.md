<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Determining the PWA Version

- [In the Project Source Code](#in-the-project-source-code)
- [In a Deployed Application](#in-a-deployed-application)

## In the Project Source Code

If you have access to the source code, you can find the Intershop PWA version in the _package.json_ file under the `version` property.
The project's _CHANGELOG.md_ can also help determine the Intershop PWA version.

## In a Deployed Application

The helper function `version()` returns an object with PWA version information, such as `displayVersion` and `pwaVersion`.
To use it, open the browser developer tools, navigate to the _Console_ tab, and execute `version()` to display the returned value.

Intershop PWA introduced a specific `pwa-version` meta tag in the HTML header that contains the PWA version information.
The `version()` function fetches the information from this meta tag.
You can find and adapt the `version()` function in the [_polyfills.ts_](../../src/polyfills.ts).
