<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Multi Site Configurations

As explained in [multi site handling](../concepts/multi-site-handling.md), the PWA supports dynamic configurations of a single PWA deployment.
This guide will explain the YAML syntax used to define a configuration as well as show some common configuration examples, mainly focusing on different setups for handling locales and channels.
For more information about how the YAML configuration is processed, refer to [multi site handling](../concepts/multi-site-handling.md) and [nginx startup](../guides/nginx-startup.md#Multi-Site).

## Syntax

The following snippet describes the syntax used when defining a multi-site configuration, consisting of multiple domain configuration nodes and properties.

```yaml
'domain1':
  channel: channel1
  application: app1
  features: f1,f2,f3
  lang: la_CO
  theme: name|color
```

The domain is interpreted as a regular expression.
Subdomains (`b2b\..+`) as well as top level domains (`.+\.com`) can be supplied.
The `channel` property is also mandatory.

All other properties are optional:

- **application**: The ICM application
- **identityProvider**: The active identity provider for this site
- **features**: Comma-separated list of activated features
- **lang**: The default language as defined in the Angular CLI environment
- **theme**: The theme used for the channel (format: `<theme-name>(|<icon-color>)?`)

Dynamically directing the PWA to different ICM installations can by done by using:

- **icmHost**: the domain where the ICM instance is running (without protocol and port)
- **icmPort**: (optional) if the port differs from 443
- **icmScheme**: (optional) if the protocol differs from 'https'

Multiple channels can also be configured via context paths, which re-configure the PWA upstream to use a different `baseHref` for each channel.

```yaml
'domain2':
  - baseHref: /us
    channel: channelUS
    lang: en_US
  - baseHref: /de
    channel: channelDE
    lang: de_DE
```

The domain has to be supplied.
To match all domains use `.+`.
The parameters `baseHref` and `channel` are mandatory.
`baseHref` must start with `/`.
Also note that context path channels have to be supplied as a list.

**The first entry is chosen as default channel**, if the website is accessed without supplying a channel, meaning the context path `/`.
It is also possible to explicitly set a channel configuration for the `/` context path.
Such a configuration is shown in the following configuration that sets different languages for the according context paths but within the same channel.

```yaml
'domain2':
  - baseHref: /fr
    channel: channel
    lang: fr_FR
  - baseHref: /de
    channel: channel
    lang: de_DE
  - baseHref: /
    channel: channel
    lang: en_US
```

## Examples

### One domain, one channel, multiple locales

This setup is used by our demo application.
It uses a single channel and a static url, while locales are changed via a context path (`baseHref`) parameter.

This results in URLs like this:
`www.pwademo.com`,
`www.pwademo.com/en`,
`www.pwademo.com/de`

```yaml
.+:
  - baseHref: /en
    channel: default
    lang: en_US
  - baseHref: /de
    channel: default
    lang: de_DE
  - baseHref: /fr
    channel: default
    lang: fr_FR
```

It is easy to extend this configuration to use different channels per context path - simply replace the `default` value with your desired channel.

### Multiple domains, multiple channels, multiple locales

This is a common configuration, where each channel uses its own domain and assigned locale.
This also works with multi-language channels in conjunction with context paths, as seen in the canadian example.

This results in URLs like this:
`www.pwademo.com`, `www.pwademo.de`, `www.pwademo.ca/en`

```yaml
.+\.ca:
  - baseHref: /en
    lang: en_CA
    channel: inspired-inTRONICS-CA
  - baseHref: /fr
    lang: fr_CA
    channel: inspired-inTRONICS-CA
.+\.de:
  lang: de_DE
  channel: inspired-inTRONICS-DE
.+\.com:
  lang: en_US
  channel: inspired-inTRONICS-US
.+\.fr:
  lang: fr_FR
  channel: inspired-inTRONICS-FR
```

### Multiple subdomains, multiple channels, multiple locales

It's also possible to configure different subdomains by changing the regular expression that matches the domain.
This also works in conjunction with context paths.

This results in URLs like this:
`de.pwademo.com`, `fr.pwademo.com`, `ca.pwademo.com/en`

```yaml
de.+\.com:
  lang: de_DE
  channel: inspired-inTRONICS-DE
en.+\.com:
  lang: en_US
  channel: inspired-inTRONICS-US
fr.+\.com:
  lang: fr_FR
  channel: inspired-inTRONICS-FR
ca.+\.com:
  - baseHref: /en
    lang: en_US
    channel: inspired-inTRONICS-CA
  - baseHref: /fr
    lang: fr_FR
    channel: inspired-inTRONICS-CA
```

### Extended example with many different configurations

To see what is possible through multi-site handling, have a look at this extended demo configuration.

```yaml
.+\.net:
  - baseHref: /de
    lang: de_DE
    channel: inSPIRED-inTRONICS-Site
  - baseHref: /us
    lang: en_US
    channel: inSPIRED-inTRONICS_Business-Site
    features: quoting,businessCustomerRegistration,advancedVariationHandling
    theme: 'blue|688dc3'
.+\.de:
  channel: inSPIRED-inTRONICS-Site
  lang: de_DE
.+\.com:
  channel: inSPIRED-inTRONICS_Business-Site
  features: quoting,businessCustomerRegistration,advancedVariationHandling
  theme: 'blue|688dc3'
.+\.fr:
  channel: inSPIRED-inTRONICS-Site
  lang: fr_FR
  application: smb-responsive
  features: quoting
  theme: 'blue|688dc3'
```
