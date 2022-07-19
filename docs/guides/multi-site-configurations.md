<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Multi Site Configurations

- [Multi Site Configurations](#multi-site-configurations)
  - [Syntax](#syntax)
  - [Examples](#examples)
    - [One domain, One Channel, Multiple Locales](#one-domain-one-channel-multiple-locales)
    - [Multiple Domains, Multiple Channels, Multiple Locales](#multiple-domains-multiple-channels-multiple-locales)
    - [Multiple Subdomains, Multiple channels, Multiple Locales](#multiple-subdomains-multiple-channels-multiple-locales)
    - [Extended Example with Many Different Configurations](#extended-example-with-many-different-configurations)
    - [Extended Example with two domains, one with basic auth (except /fr), the other without](#extended-example-with-two-domains-one-with-basic-auth-except-fr-the-other-without)
  - [Integrate your multi-site configuration with the language switch](#integrate-your-multi-site-configuration-with-the-language-switch)
- [Further References](#further-references)

As explained in [Multi-Site Handling](../concepts/multi-site-handling.md), the PWA supports dynamic configurations of a single PWA container deployment.
This guide explains the YAML syntax used to define a configuration and provides some common configuration examples, mainly focusing on different setups for handling locales and channels.
For more information about how the YAML configuration is processed, refer to [Multi-Site Handling](../concepts/multi-site-handling.md) and [Building and Running NGINX Docker Image | Multi-Site](../guides/nginx-startup.md#Multi-Site).

## Syntax

The following snippet describes the syntax used when defining a multi-site configuration, consisting of multiple domain configuration nodes and properties:

```yaml
'domain1':
  channel: channel1
  application: app1
  features: f1,f2,f3
  lang: la_CO
  theme: name
```

The domain is interpreted as a regular expression.
Subdomains (`b2b\..+`) as well as top level domains (`.+\.com`) can be supplied.
The `channel` property is also mandatory.

All other properties are optional:

- **application**: The ICM application
- **identityProvider**: The active identity provider for this site
- **features**: Comma-separated list of activated features
- **addFeatures**: Comma-separated list of additional features extending defaults
- **lang**: The default language as defined in the Angular CLI environment
- **currency**: The default currency for this channel
- **theme**: The theme used for the channel (see [Guide - Multiple Themes](./multiple-themes.md))
- **protected**: Selectively disable basic auth for a given domain and/or baseHref. Only applies in combination with globally activated nginx basic authentication.

Dynamically directing the PWA to different ICM installations can be done by using:

- **icmHost**: The domain in which the ICM instance runs (without protocol and port)
- **icmPort**: Optional, required if the port differs from 443
- **icmScheme**: Optional, required if the protocol differs from 'https'

Multiple channels can also be configured via context paths that re-configure the PWA upstream to use a different `baseHref` for each channel.

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

If the website is accessed without supplying a context path (meaning the context path is `/`), **the first entry is chosen as the default configuration**.
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

### One domain, One Channel, Multiple Locales

This setup is used by our demo application.
It uses a single channel and a static URL, while locales are changed via a context path (`baseHref`) parameter.

This results in URLs like this:
`www.pwademo.com/en`,
`www.pwademo.com/de`,
`www.pwademo.com/fr`

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

It is possible to extend this configuration to use different channels per context path - to do this, replace the `default` value with your desired channel.

### Multiple Domains, Multiple Channels, Multiple Locales

This is a common configuration, where each channel uses its own domain and assigned locale.
It works also with multi-language channels in conjunction with context paths, as seen in the Canadian example.

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

### Multiple Subdomains, Multiple channels, Multiple Locales

It is also possible to configure different subdomains by changing the regular expression that matches the domain.
This works also in conjunction with context paths.

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

### Extended Example with Many Different Configurations

To see what is possible through multi-site handling, have a look at this extended demo configuration.

```yaml
.+\.net:
  - baseHref: /de
    lang: de_DE
    channel: inSPIRED-inTRONICS-Site
    theme: b2c
  - baseHref: /us
    lang: en_US
    channel: inSPIRED-inTRONICS_Business-Site
    features: quoting,businessCustomerRegistration
.+\.de:
  channel: inSPIRED-inTRONICS-Site
  lang: de_DE
  theme: b2c
.+\.com:
  channel: inSPIRED-inTRONICS_Business-Site
  features: quoting,businessCustomerRegistration
.+\.fr:
  channel: inSPIRED-inTRONICS_Business-Site
  lang: fr_FR
  application: rest
  features: quoting
```

### Extended Example with two domains, one with basic auth (except /fr), the other without

```yaml
de.+\.com:
  lang: de_DE
  channel: inspired-inTRONICS-DE
  protected: false
ca.+\.com:
  - baseHref: /fr
    channel: inspired-inTRONICS-CA
    lang: fr_FR
    protected: false
  - baseHref: /en
    channel: inspired-inTRONICS-CA
    lang: en_US
```

## Integrate your multi-site configuration with the language switch

To construct new multi-site URLs when switching between languages, the PWA uses the `multi-site.service.ts`.
The `getLangUpdatedUrl` is called with the desired locale string, current url and current baseHref.
From this it constructs a new URL, conforming to our multi-site setup (see [One domain, one channel, multiple locales](#one-domain-one-channel-multiple-locales)).

To control the transformation of urls, the `multiSiteLocaleMap` environment variable is used.
Depending on your needs, `multiSiteLocaleMap` can be set in either the `environment.ts` or as an environment variable (`MULTI_SITE_LOCALE_MAP`).
See [`docker-compose.yml`](../../docker-compose.yml) for a commented out example or [`environment.model.ts`](../../src/environments/environment.model.ts) for the default value.

In case you want to disable this functionality, simply override the default environment variable `multiSiteLocaleMap` with `undefined` or `MULTI_SITE_LOCALE_MAP` with `false`.

In case you want to extend this functionality to work with more locales, extend the default environment variable `multiSiteLocaleMap` with your additional locales.

In case you want to transfer this functionality to work with your specific multi-site setup, override the `multi-site.service.ts` and provide an implementation that conforms to your setup (as well as configuring the environment variable for your specific use case).

# Further References

- [Guide - Building and Running nginx Docker Image](../guides/nginx-startup.md)
- [Concept - Multi-Site Handling](../concepts/multi-site-handling.md)
