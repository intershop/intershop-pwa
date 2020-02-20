# Third Party Integrations

## Google Tag Manager

To enable user tracking and setting it up with [Google Tag Manager](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/gtm), the popular library [Angulartics2](https://angulartics.github.io/angulartics2/) is used.

To activate GTM tracking, set the Tag Manager Token either in the used Angular CLI environment file with the property `gtmToken` or via the environment variable `GTM_TOKEN`. Additionally, the feature toggle `tracking` has to be added to the enabled feature list. This feature only works in Universal Rendering Mode. Prefer configuration via system environment variables.

Please refer to the [angulartics2 documentation](https://github.com/angulartics/angulartics2#usage) for information on how to enable tracking for additional events.

For GDPR compliance the tracked IPs have to be anonymized. See [How to turn on IP Anonymization in Google Analytics and Google Tag Manager](https://www.optimizesmart.com/how-to-turn-on-ip-anonymization-in-google-analytics-and-google-tag-manager/) .

## Sentry

We recommend using [Sentry](https://sentry.io/) for browser-side error tracking. It is integrated with the [official Angular support dependency](https://sentry.io/for/angular2/).

To activate Sentry in the PWA, set the Sentry DSN URL (_Settings_ | _Projects_ | _Your Project_ | _Client Keys (DSN)_ | _DSN_) either via Angular CLI environment file with the property `sentryDSN` or via the environment variable `SENTRY_DSN`. Additionally, the feature toggle `sentry` has to be added to the enabled feature list. This feature only works in Universal Rendering Mode. Prefer configuration via system environment variables.

For GDPR compliance the tracked IPs have to be anonymized.  
Set your _Prevent Storing of IP Addresses_ option in your _General Settings_ of Organisation and/or Project (Sentry Webinterface).  
Read more about [Security & Compliance](https://sentry.io/security/) or [Sensitive Data](https://docs.sentry.io/data-management/sensitive-data/) in Sentry-[Docs](https://docs.sentry.io/).
