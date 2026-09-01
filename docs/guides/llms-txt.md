<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# llms.txt

- [Overview](#overview)
- [File Location and Naming](#file-location-and-naming)
- [Discoverability (`rel="describedby"`)](#discoverability-reldescribedby)
- [Single-Channel Setup](#single-channel-setup)
- [Multi-Channel Setup](#multi-channel-setup)
- [Multi-Base-Href Setup](#multi-base-href-setup)
- [Behavior by Configuration](#behavior-by-configuration)
- [Further References](#further-references)

## Overview

`llms.txt` is a proposed standard (see [llmstxt.org](https://llmstxt.org/)) that provides a curated, LLM-friendly index of a website at `/llms.txt`.
It helps large language models and AI agents discover the most relevant pages of a store without having to crawl the full HTML site.

The PWA follows the [v2 revision of the proposal (August 2026)](https://llmstxt.org/changes.html).

It is served as static content by the Nginx layer and does not require server-side rendering.

## File Location and Naming

The content files are located in the `nginx/llms/` folder.
Each file is named after the channel it belongs to, following the pattern `<channel>_llms.txt`.

This naming links every file to a channel from the [multi-channel configuration](./multi-site-configurations.md), so the correct file is served automatically for each domain.
If no file matches a domain's channel, Nginx falls back to `nginx/llms/default_llms.txt`.
For example:

| Channel                            | File                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| `default`                          | `nginx/llms/default_llms.txt`                          |
| `inSPIRED-inTRONICS_Business-Site` | `nginx/llms/inSPIRED-inTRONICS_Business-Site_llms.txt` |
| `inSPIRED-inTRONICS-Site`          | `nginx/llms/inSPIRED-inTRONICS-Site_llms.txt`          |

## Discoverability (`rel="describedby"`)

The [v2 revision](https://llmstxt.org/changes.html) adds a way for agents to find the `llms.txt` file that covers a page without guessing the URL: the page links to it with the `rel="describedby"` link relation.

The PWA declares this once in [`src/index.html`](../../src/index.html), so every route of the single-page application advertises it — in both client-side and server-side rendered responses:

```html
<link href="/llms.txt" rel="describedby" />
```

The root-relative `/llms.txt` href intentionally ignores the `<base href>`, so it always resolves to the domain root file that Nginx serves for the current channel — including in [Multi-Base-Href Setups](#multi-base-href-setup) where the base href becomes `/en`, `/de`, and so on.

> [!NOTE]
> The `rel="alternate" type="text/markdown"` relation from v2 points to a Markdown version of an individual page.
> The PWA does not publish per-page Markdown versions of its content, so this relation is intentionally omitted.

## Single-Channel Setup

For the default configuration in [`nginx/multi-channel.yaml`](../../nginx/multi-channel.yaml), where every host maps to the `default` channel, the file is:

```
nginx/llms/default_llms.txt
```

It is served at `/llms.txt` for all domains.
If you explicitly define the `default` channel, the corresponding multi-channel configuration is as follows:

```yaml
MULTI_CHANNEL: |
  .+:
    channel: default
```

However, setting `MULTI_CHANNEL` is optional for this case.

> [!NOTE]
> The `default` channel does not correspond to a real storefront.
> Therefore, `nginx/llms/default_llms.txt` is a neutral placeholder without store-specific links.
> In a concrete deployment, map its domains to real channels and provide the corresponding `<channel>_llms.txt` files.

Alternatively, set the single channel to a specific, named channel instead of `default`.
In that case, `/llms.txt` serves that channel's file — for example, `nginx/llms/inSPIRED-inTRONICS_Business-Site_llms.txt`:

```yaml
MULTI_CHANNEL: |
  intershoppwa\..+:
    channel: inSPIRED-inTRONICS_Business-Site
```

## Multi-Channel Setup

If a single deployment serves multiple domains with different channels or themes (for example, a B2B and a B2C storefront), provide one file per channel, so that every domain serves its own `/llms.txt`:

- `https://intershoppwa.azurewebsites.net/llms.txt` serves the B2B channel file `nginx/llms/inSPIRED-inTRONICS_Business-Site_llms.txt`.
- `https://intershoppwa-b2c.azurewebsites.net/llms.txt` serves the B2C channel file `nginx/llms/inSPIRED-inTRONICS-Site_llms.txt`.

The corresponding multi-channel configuration is as follows:

```yaml
MULTI_CHANNEL: |
  intershoppwa\..+:
    channel: inSPIRED-inTRONICS_Business-Site
  intershoppwa-b2c\..+:
    channel: inSPIRED-inTRONICS-Site
```

## Multi-Base-Href Setup

A single domain can also serve several channels under different base href paths (for example `/en`, `/de`, `/fr`, and `/b2c`), as configured in a list in the [multi-channel configuration](./multi-site-configurations.md).
In this case, there is only **one** `/llms.txt` at the domain root, and it uses the channel of the **first** list entry.
As with all other setups, a missing channel file falls back to `nginx/llms/default_llms.txt`.

For example, if the first list entry uses `inSPIRED-inTRONICS_Business-Site`, the domain root serves `nginx/llms/inSPIRED-inTRONICS_Business-Site_llms.txt`.
The individual base href paths (such as `/b2c`) do **not** get their own `llms.txt`.

> [!NOTE]
> When the base href paths represent different languages (for example `/en`, `/de`, `/fr` with distinct `lang` values), this affects localization.
> Because only the domain root serves `/llms.txt` and it always uses the **first** list entry's channel, there is a single file whose language is effectively determined by the first entry.

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
| Multiple domains/channels                 | Each domain serves its own channel file (e.g., B2B and B2C channels get different `llms.txt` files).                     |
| Multi base href (`/en`, `/de`, `/b2c`, …) | One `/llms.txt` at the domain root, using the first list entry's channel. Base-href sub-paths do not get their own file. |
| Missing channel file                      | Falls back to `default_llms.txt`, otherwise, returns `404`.                                                              |

## Further References

- [The /llms.txt file proposal](https://llmstxt.org/)
- [Guide - Building and Running nginx Docker Image](./nginx-startup.md)
- [Guide - Multi-Site Configurations](./multi-site-configurations.md)
- [Concept - Search Engine Optimization (SEO)](../concepts/search-engine-optimization.md)
