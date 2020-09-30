<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Client-Side Error Monitoring with Sentry

We recommend using [Sentry](https://sentry.io/) for browser-side error tracking.
It is integrated with the [official Angular support dependency](https://sentry.io/for/angular/).

To activate Sentry in the PWA, set the Sentry DSN URL (_Settings_ | _Projects_ | _Your Project_ | _Client Keys (DSN)_ | _DSN_) either via Angular CLI environment file with the property `sentryDSN` or via the environment variable `SENTRY_DSN`.
Additionally, the feature toggle `sentry` has to be added to the enabled feature list.
This feature only works in Universal Rendering mode.
Prefer configuration via system environment variables.

For GDPR compliance the tracked IPs have to be anonymized.

Set your _Prevent Storing of IP Addresses_ option in your _General Settings_ of Organisation and/or Project (Sentry Webinterface).
Read more about [Security & Compliance](https://sentry.io/security/) or [Sensitive Data](https://docs.sentry.io/platforms/node/data-management/sensitive-data) in Sentry-[Docs](https://docs.sentry.io/).
