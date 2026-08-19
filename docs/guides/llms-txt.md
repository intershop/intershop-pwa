<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# llms.txt

- [Overview](#overview)
- [File Location and Naming](#file-location-and-naming)
- [Single Channel Setup](#single-channel-setup)
- [Multi-Channel Setup](#multi-channel-setup)
- [Multi-Base-Href Setup](#multi-base-href-setup)
- [Behavior by Configuration](#behavior-by-configuration)
- [Further References](#further-references)

## Overview

`llms.txt` is a proposed standard (see [llmstxt.org](https://llmstxt.org/)) that provides a curated, LLM-friendly index of a website at `/llms.txt`.
It helps large language models and AI agents discover the most relevant pages of a store without crawling the full HTML site.

It is served as static content by the NGINX layer and does not require server-side rendering.

## File Location and Naming

The content files live in the `nginx/llms/` folder.
Each file is named after the channel it belongs to, following the pattern `<channel>_llms.txt`.

This naming ties every file to a channel from the [multi-channel configuration](./multi-site-configurations.md), so the correct file is served automatically for each domain.
If no file matches a domain's channel, NGINX falls back to `nginx/llms/default_llms.txt`.
For example:

| Channel                            | File                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| `default`                          | `nginx/llms/default_llms.txt`                          |
| `inSPIRED-inTRONICS_Business-Site` | `nginx/llms/inSPIRED-inTRONICS_Business-Site_llms.txt` |
| `inSPIRED-inTRONICS-Site`          | `nginx/llms/inSPIRED-inTRONICS-Site_llms.txt`          |

## Single Channel Setup

For the default configuration in [`nginx/multi-channel.yaml`](../../nginx/multi-channel.yaml), where every host maps to channel `default`, the file is:

```
nginx/llms/default_llms.txt
```

It is served at `/llms.txt` for every domain.
If you explicitly define the `default` channel, the matching multi-channel configuration looks as follows:

```yaml
MULTI_CHANNEL: |
  .+:
    channel: default
```

But setting `MULTI_CHANNEL` is optional for this case.

> [!NOTE]
> The `default` channel does not correspond to a real storefront, so `nginx/llms/default_llms.txt` is a neutral placeholder without store-specific links.
> A concrete deployment should map its domains to real channels and provide the corresponding `<channel>_llms.txt` files.

Alternatively, set the single channel to a specific named channel instead of `default`.
In that case, `/llms.txt` serves that channel's file, for example `nginx/llms/inSPIRED-inTRONICS_Business-Site_llms.txt`:

```yaml
MULTI_CHANNEL: |
  intershoppwa\..+:
    channel: inSPIRED-inTRONICS_Business-Site
```

## Multi-Channel Setup

If a single deployment serves multiple domains with different channels or themes (for example, a B2B and a B2C storefront), provide one file per channel, so every domain serves its own `/llms.txt`:

- `https://intershoppwa.azurewebsites.net/llms.txt` serves the B2B channel file `nginx/llms/inSPIRED-inTRONICS_Business-Site_llms.txt`.
- `https://intershoppwa-b2c.azurewebsites.net/llms.txt` serves the B2C channel file `nginx/llms/inSPIRED-inTRONICS-Site_llms.txt`.

The matching multi-channel configuration looks as follows:

```yaml
MULTI_CHANNEL: |
  intershoppwa\..+:
    channel: inSPIRED-inTRONICS_Business-Site
  intershoppwa-b2c\..+:
    channel: inSPIRED-inTRONICS-Site
```

## Multi-Base-Href Setup

A single domain can also serve several channels under different base href paths (for example `/en`, `/de`, `/fr`, and `/b2c`), configured as a list in the [multi-channel configuration](./multi-site-configurations.md).
In this case there is only **one** `/llms.txt` at the domain root, and it uses the channel of the **first** list entry.
As everywhere, a missing channel file falls back to `nginx/llms/default_llms.txt`.

For example, with a list whose first entry uses `inSPIRED-inTRONICS_Business-Site`, the domain root serves `nginx/llms/inSPIRED-inTRONICS_Business-Site_llms.txt`.
The individual base href paths (such as `/b2c`) do **not** get their own `llms.txt`.

The matching multi-channel configuration looks as follows:

```yaml
MULTI_CHANNEL: |
  .+:
    - baseHref: /en
      channel: inSPIRED-inTRONICS_Business-Site
      lang: en_US
    - baseHref: /b2c
      channel: inSPIRED-inTRONICS-Site
      theme: b2c
```

## Behavior by Configuration

| Configuration                             | Result                                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| No `MULTI_CHANNEL` set                    | Falls back to `nginx/multi-channel.yaml` (channel `default`) and serves `default_llms.txt` at `/llms.txt`.               |
| Single channel (`channel: default`)       | Serves `default_llms.txt` at `/llms.txt`.                                                                                |
| Multiple domains/channels                 | Each domain serves its own channel file (e.g. B2B and B2C get different `llms.txt`).                                     |
| Multi-base-href (`/en`, `/de`, `/b2c`, …) | One `/llms.txt` at the domain root, using the first list entry's channel. Base-href sub-paths do not get their own file. |
| Missing channel file                      | Falls back to `default_llms.txt`, otherwise `404`.                                                                       |

## Further References

- [The /llms.txt file proposal](https://llmstxt.org/)
- [Guide - Building and Running nginx Docker Image](./nginx-startup.md)
- [Guide - Multi-Site Configurations](./multi-site-configurations.md)
- [Concept - Search Engine Optimization (SEO)](../concepts/search-engine-optimization.md)
