<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# How to Determine the Version of a PWA

- [In the Project Source Code](#in-the-project-source-code)
- [In a Deployed Application](#in-a-deployed-application)

## In the Project Source Code

The Intershop PWA version can be determined if you have access to the source code.

In this case, the version can be found in the _package.json_ file under the `version` property.
The project's _CHANGELOG.md_ can also help determine the Intershop PWA version.

## In a Deployed Application

The helper function `version()` returns an object with PWA version information, for example `displayVersion` and `pwaVersion`.
To use it, open the browser developer tools, navigate to the _Console_ tab, and execute `version()` to display the returned value.

Intershop PWA introduced a specific `pwa-version` meta tag in the HTML header that contains the PWA version information.
This is the place where the mentioned `version()` function fetches the information from.
The `version()` function itself can be found and adapted in the [`polyfills.ts`](../../src/polyfills.ts).
