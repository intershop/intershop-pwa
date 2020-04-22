<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Google Tag Manager

To enable user tracking and setting it up with [Google Tag Manager](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/gtm), the popular library [Angulartics2](https://angulartics.github.io/angulartics2/) is used.

To activate GTM tracking, set the Tag Manager Token either in the used Angular CLI environment file with the property `gtmToken` or via the environment variable `GTM_TOKEN`.
Additionally, the feature toggle `tracking` has to be added to the enabled feature list.
This feature only works in Universal Rendering mode.
Prefer configuration via system environment variables.

Please refer to the [angulartics2 documentation](https://github.com/angulartics/angulartics2#usage) for information on how to enable tracking for additional events.

For GDPR compliance the tracked IPs have to be anonymized.
See [How to turn on IP Anonymization in Google Analytics and Google Tag Manager](https://www.optimizesmart.com/how-to-turn-on-ip-anonymization-in-google-analytics-and-google-tag-manager/).
