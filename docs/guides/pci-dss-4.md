<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Security Standard PCI DSS 4.0

- [Introduction](#introduction)
  - [Transition Deadline](#transition-deadline)
  - [Scope of PCI DSS 4.0](#scope-of-pci-dss-40)
  - [Guide Structure and Coverage](#guide-structure-and-coverage)
- [PCI DSS 4.0 Applicability](#pci-dss-40-applicability)
- [Secure Angular PWA Code \& Dependencies](#secure-angular-pwa-code--dependencies)
  - [Prevent Cross-Site Scripting (XSS) Attacks](#prevent-cross-site-scripting-xss-attacks)
  - [Secure API Calls \& Prevent CORS Attacks](#secure-api-calls--prevent-cors-attacks)
  - [Use Secure HTTP Headers to Prevent Browser Attacks](#use-secure-http-headers-to-prevent-browser-attacks)
  - [Enforce Secure Authentication \& Session Management](#enforce-secure-authentication--session-management)
  - [Secure Server-Side Rendering (SSR)](#secure-server-side-rendering-ssr)
  - [Regular Testing \& Harden Dependency Management](#regular-testing--harden-dependency-management)
- [Add Custom Trusted Resources for PWA Extensions](#add-custom-trusted-resources-for-pwa-extensions)
  - [Relevance to PCI DSS 4.0](#relevance-to-pci-dss-40)
  - [PWA CSP Configuration](#pwa-csp-configuration)
  - [Step-by-Step: Adding a Trusted Resource](#step-by-step-adding-a-trusted-resource)
    - [1. Identify the Required Origins](#1-identify-the-required-origins)
    - [2. Extend the NGINX CSP Configuration](#2-extend-the-nginx-csp-configuration)
    - [3. Use Subresource Integrity (SRI) Where Possible](#3-use-subresource-integrity-sri-where-possible)
    - [4. Maintain a Script Inventory](#4-maintain-a-script-inventory)
  - [Common Extension Scenarios](#common-extension-scenarios)
  - [What to Avoid](#what-to-avoid)
  - [Summary](#summary)
- [Additional Points to Consider](#additional-points-to-consider)
  - [Secure Data Handling](#secure-data-handling)
  - [Secure Authentication \& Access Control](#secure-authentication--access-control)
  - [Logging \& Monitoring](#logging--monitoring)
  - [Password Autocomplete](#password-autocomplete)

## Introduction

PCI DSS, the **Payment Card Industry Data Security Standard**, is a set of security requirements defined by the major card networks (Visa, Mastercard, Amex, etc.) to protect payment card data during storage, processing, and transmission.
Any organization that accepts, processes, or transmits credit card payments must comply with these standards.
The authoritative specification is published in the [PCI Document Library](https://www.pcisecuritystandards.org/document_library/?category=pcidss).

### Transition Deadline

If your Intershop storefront handles online payments, PCI DSS applies to you, and most likely to your technology partners and system integrators as well.
With **PCI DSS version 4.0**, the requirements were significantly updated, with stricter rules specifically targeting **web application security** and the browser environment.
The transition deadline for all organizations was **March 31, 2025**: from that date onward, PCI DSS 4.0 is the only accepted version.

The most impactful new requirements for frontend developers and solution architects are:

| Requirement | What It Means in Practice                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **6.4.3**   | Every script running on a payment page must be explicitly authorized, its integrity verified, and documented in an inventory. Wildcard or inline script approvals are not permitted. |
| **11.6.1**  | A mechanism must be in place to detect unauthorized changes to HTTP headers and scripts on payment pages.                                                                            |

These two requirements directly affect how an Angular-based PWA is built, configured, and operated.

### Scope of PCI DSS 4.0

Not every page of your storefront automatically falls under the strictest PCI DSS rules.
The scope is primarily determined by pages where **cardholder data (CHD)** or **sensitive authentication data (SAD)** is entered or transmitted. In practice, this applies to checkout and payment pages.

However, because a single-page application (SPA) like the Intershop PWA loads a shared JavaScript bundle across all pages, the security measures described in this guide apply to the **entire storefront**, not only the payment step.

### Guide Structure and Coverage

This guide explains the specific measures that are already implemented in the Intershop PWA by default, and what developers, system integrators, or merchants need to additionally configure or verify in their own projects to achieve PCI DSS 4.0 compliance.
It is structured along the main risk areas relevant for a PWA:

- Preventing script injection (XSS) and enforcing Content Security Policy (CSP)
- Securing API communication and HTTP headers
- Protecting authentication and session management
- Safely handling cardholder data via compliant payment providers
- Logging, monitoring, and dependency management

> **A note on responsibility:**
> The Intershop PWA provides a secure baseline.
> However, every customization, third-party integration, or infrastructure decision made in a project can affect the compliance status.
> Achieving and maintaining PCI DSS 4.0 compliance is a shared responsibility between Intershop, the system integrator, and the merchant.

## PCI DSS 4.0 Applicability

PCI DSS 4.0 requires securing data at REST, data in transit, authentication mechanisms, and application security.
Since the PWA operates on both client-side and server-side, compliance must address:

| Topic                                      | Angular PWA | SSR in Express | ICM |
| ------------------------------------------ | ----------- | -------------- | --- |
| Frontend Security                          | x           |                |     |
| Backend Security                           |             | x              | x   |
| Data Transmission                          | x           |                | x   |
| Data Storage                               |             |                | x   |
| Access Control and Authentication          |             |                | x   |
| Logging, Monitoring, and Incident Response |             |                | x   |

## Secure Angular PWA Code & Dependencies

Securing the codebase of a web application is critical to achieving PCI DSS compliance, especially requirement 6.
Given that the frontend often presents a tempting target for attackers, it is mandatory to ensure secure coding practices, dependency management, and protection against common web vulnerabilities.

The following sections provide a detailed breakdown of how to harden your PWA against exploits, data breaches, and injection attacks.

### Prevent Cross-Site Scripting (XSS) Attacks

PCI DSS 4.0 requires protection against cross-site scripting and injection attacks.
A Content Security Policy (CSP) helps by restricting the sources from which scripts, styles, and other resources can be loaded.
A way how to implement CSP in the PWA is described in [Building and Running NGINX Docker Image - Add Additional Headers - Content Security Policy](nginx-startup.md#content-security-policy).
In summary, this means you have to:

- Define strict CSP rules to allow only trusted sources
- Avoid using unsafe-inline and unsafe-eval in scripts

To protect the PWA from cross-site scripting attacks, Angular's built-in security mechanisms such as DomSanitizer and template escaping are used.
In addition, dynamic content injection is disabled, and user-generated input is escaped/sanitized.

### Secure API Calls & Prevent CORS Attacks

Of course, the PWA communicates extensively with the ICM and other systems to fulfill certain requests.
Especially during the preparation and payment of an order, sensitive data is handled.
It is imperative that this communication is always secure.
Make sure that all API requests are sent over HTTPS (TLS 1.2 or 1.3), as it is done in the default implementation of the Intershop PWA.

### Use Secure HTTP Headers to Prevent Browser Attacks

To comply with PCI DSS 4.0, your PWA’s productive environment (Node.js + Express) must enforce security headers.

**Recommended Security Headers**

| Header                    | Purpose                      | Example                                        |
| ------------------------- | ---------------------------- | ---------------------------------------------- |
| Strict-Transport-Security | Enforces HTTPS               | `max-age=31536000; includeSubDomains; preload` |
| X-Frame-Options           | Prevents clickjacking        | `DENY`                                         |
| X-Content-Type-Options    | Prevents MIME-type sniffing  | `nosniff`                                      |
| Referrer-Policy           | Limits referrer info leakage | `strict-origin`                                |
| Permissions-Policy        | Restricts browser features   | `geolocation=(), microphone=()`                |
| Content Security Policy   | Limits allowed resources     | `default-src 'self';`                          |

### Enforce Secure Authentication & Session Management

PCI DSS requires secure authentication and session handling to protect user credentials.
One best practice is to use Secure cookies, which helps prevent unauthorized access to session data.
Another recommendation is to implement automatic session timeouts and log out users after periods of inactivity, reducing the risk of session hijacking.

### Secure Server-Side Rendering (SSR)

Secure server-side rendering is used in the Intershop Progressive Web App when running in a Docker container.
To secure SSR, it is important to sanitize any user input before rendering dynamic content, ensuring that malicious data is not processed.
Additionally, preventing SSR template injection is vital; this can be achieved by avoiding direct DOM manipulation during the rendering process.
Finally, using only trusted sources for dynamic content further minimizes the risk of introducing vulnerabilities.
These points are fulfilled by default.
For instance, the CMS HTML component uses `insertAdjacentHTML` to render the server-side content within the PWA.
This method does not interpret JavaScript to prevent attacks.
It is highly recommended to keep this functionality this way to reduce attack vectors of your storefront.

### Regular Testing & Harden Dependency Management

Maintaining security is not a one-time task; it is a continuous process.
This is why the PCI DSS requirements address it.
For the PWA, we have implemented automated testing and vulnerability scanning.
While the automated tests support overall stability, `npm audit` (PWA) and Dependabot (ICM) are used to automatically identify and remediate vulnerabilities in third-party packages.
The package-lock file (`package-lock.json`) is tracked in Git to prevent dependency tampering.

## Add Custom Trusted Resources for PWA Extensions

When extending the Intershop PWA with custom features, such as third-party analytics, tag managers, fonts, payment widgets, or other external integrations, explicitly declare every additional external resource as a trusted source in the Content Security Policy (CSP).
Failing to do so either breaks the functionality of your extension or forces insecure fallbacks, such as `unsafe-inline` or wildcard (`*`) directives, both of which directly violate PCI DSS 4.0 Requirement 6.4.3.

### Relevance to PCI DSS 4.0

PCI DSS 4.0 Requirement 6.4.3 mandates that **all scripts loaded and executed on a payment page must be authorized, their integrity must be verified, and an inventory of all such scripts must be maintained**.
This applies not only to JavaScript but also to stylesheets, fonts, images, and connection endpoints loaded from external origins.

Any custom PWA extension that introduces an external resource therefore requires:

1. An explicit CSP directive for the resource origin
2. Where possible, Subresource Integrity (SRI) verification
3. Documentation of the resource in your script inventory

### PWA CSP Configuration

The Intershop PWA manages its CSP via the NGINX configuration layer.
Custom CSP directives are set through environment variable `ADDITIONAL_HEADERS` or in NGINX templates.
Refer to the [NGINX Startup Guide](../guides/nginx-startup.md#content-security-policy) for the baseline setup.

The relevant directives and their purpose:

| Directive     | Controls                                 |
| ------------- | ---------------------------------------- |
| `script-src`  | JavaScript sources (highest risk)        |
| `style-src`   | CSS stylesheets                          |
| `font-src`    | Web fonts (e.g., Google Fonts)           |
| `img-src`     | Images and tracking pixels               |
| `connect-src` | Fetch / XHR / WebSocket endpoints        |
| `frame-src`   | Embedded iframes (e.g., payment widgets) |
| `worker-src`  | Service workers and web workers          |

### Step-by-Step: Adding a Trusted Resource

#### 1. Identify the Required Origins

Before adding a CSP entry, determine **all** origins the resource loads from.
Many third-party scripts load sub-resources from additional domains at runtime.
Use browser developer tools (Network tab, CSP violation reports) or the vendor's documentation to compile a complete list.

**Example -- Google Tag Manager:**

```
script-src: https://www.googletagmanager.com
connect-src: https://www.google-analytics.com https://analytics.google.com
img-src:     https://www.google-analytics.com
```

**Example -- Sparque over policy enforcer:**

```
connect-src: https://policy-int.cloud.intershop.com
```

#### 2. Extend the NGINX CSP Configuration

Add the identified origins to the corresponding CSP directives.
In Intershop PWA, provide the `ADDITIONAL_HEADERS` configuration, which is recommended for containerized and Helm-based deployments.

```yaml
nginx:
  environment:
    ADDITIONAL_HEADERS: |
      headers:
        - Content-Security-Policy: "default-src 'self'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://policy-int.cloud.intershop.com; img-src 'self' data: https://www.google-analytics.com; style-src 'self'; font-src 'self' https://fonts.gstatic.com;"
```

For Helm deployments, use `cache.additionalHeaders` with the same header content.
See the [NGINX Startup Guide](../guides/nginx-startup.md#content-security-policy) for the exact syntax and deployment-specific examples.

> **Important:**
> Never use `unsafe-inline` or `unsafe-eval` for `script-src`.
> If a third-party script requires inline execution, evaluate whether the vendor provides a nonce-compatible or SRI-compatible alternative, or consider whether this vendor meets your PCI DSS obligations.

#### 3. Use Subresource Integrity (SRI) Where Possible

For statically versioned third-party scripts (i.e., scripts loaded from a fixed, versioned URL), add an `integrity` attribute to enforce cryptographic verification.
This directly satisfies the PCI DSS 4.0 Requirement 6.4.3 integrity verification mandate.
It can be achieved by handing in the SRI hash together with the script link into the `ScriptLoaderService`.
It will generate an HTML snippet like this.

```html
<script
  src="https://example.com/widget.v2.3.1.min.js"
  integrity="sha384-<base64-encoded-hash>"
  crossorigin="anonymous"
></script>
```

In most cases the payment provider offer the SRI hash for their scripts.
If not available you can generate the SRI hash using the [SRI Hash Generator](https://www.srihash.org/) or via CLI:

```bash
curl -s https://example.com/widget.v2.3.1.min.js | openssl dgst -sha384 -binary | openssl base64 -A
```

> **Note:**
> SRI is not compatible with dynamically generated scripts (e.g., scripts whose content changes on every request).
> For such cases, ensure the origin is strictly scoped in the CSP and document the risk acceptance in your compliance records.

#### 4. Maintain a Script Inventory

PCI DSS 4.0 Requirement 6.4.3 explicitly requires an **inventory of all authorized scripts**.
For each custom trusted resource added to your PWA extension, document the following:

| Field                  | Description                                    |
| ---------------------- | ---------------------------------------------- |
| Script/Resource        | Name and purpose of the resource               |
| Origin URL             | Full domain(s) the resource is loaded from     |
| SRI Hash               | SHA-384 hash (if applicable)                   |
| Business Justification | Why this resource is required                  |
| Owner                  | Team or person responsible for the integration |
| Last Reviewed          | Date of last security review                   |

Store this inventory in a version-controlled file alongside your codebase so it is auditable.
An example file can be found at `docs/examples/script-inventory.md`.

### Common Extension Scenarios

| Extension Type           | Directives Typically Needed              | SRI Applicable |
| ------------------------ | ---------------------------------------- | -------------- |
| Google Tag Manager       | `script-src`, `connect-src`, `img-src`   | No (dynamic)   |
| Google Fonts             | `style-src`, `font-src`                  | No (dynamic)   |
| Stripe.js Payment Widget | `script-src`, `frame-src`, `connect-src` | Yes            |
| Custom Font CDN          | `font-src`, `style-src`                  | Yes            |

### What to Avoid

- **Wildcard origins** (`script-src *`) -- explicitly prohibited by PCI DSS 4.0 on payment pages.
- **`unsafe-inline`** in `script-src` -- negates XSS protection and violates Requirement 6.4.3.
- **`unsafe-eval`** -- required by some older libraries; evaluate alternatives before accepting this risk.
- **Undocumented additions** -- every origin added to the CSP must be reflected in your script inventory and reviewed during audits.
- **Skipping SRI for versioned scripts** -- even if optional technically, it is required by Requirement 6.4.3 where feasible.

### Summary

Adding custom trusted resources to a PCI DSS 4.0-compliant PWA is straightforward when following a structured process:

1. Identify all origins required by the extension
2. Add them explicitly to the NGINX CSP configuration
3. Apply SRI hashes for statically versioned resources
4. Document all additions in the script inventory
5. Monitor violations via CSP reporting

Following these steps ensures that PWA extensions remain compliant with PCI DSS 4.0 Requirement 6.4.3 without compromising the storefront's security posture.

## Additional Points to Consider

### Secure Data Handling

Protecting Cardholder Data (CHD) and Sensitive Authentication Data (SAD) is one of the core requirements of PCI DSS 4.0.
In the Intershop PWA, server-side rendering (SSR) is used.
The data is processed on the client-side (Angular PWA) as well as in ICM and third-party system like the payment processor.
To comply with PCI DSS, you need to secure data storage, transmission, and ensure proper encryption mechanisms.
The requirements mandate that SAD must never be stored after authorization.
This includes:

- Full Magnetic Stripe Data
- Card Verification Code (CVV, CVC, CID, CAV2, etc.)
- PINs and PIN Blocks

The primary goal is to minimize the scope of your Cardholder Data Environment (CDE).
This is achieved by the default implementation by using third-party PCI DSS-compliant payment providers like Stripe or Payone to avoid handling raw card data.
When processing payments, the payment processor integrations rely on redirecting to the provider for entering the CHD or using JavaScript SDKs provided by the payment processor to directly capture card details without exposing them to the PWA.

### Secure Authentication & Access Control

Ensuring strong authentication and access control is critical in securing the PWA, especially when dealing with payment transactions and cardholder data.
Since the handling of these CHD is completely in the hands of the integrated payment providers, these sensitive data are never handled with the PWA, and the PCI DSS requirements are fulfilled.
All custom payment integrations must use the same approach to not break these requirements in a customization.

### Logging & Monitoring

Logging and monitoring are the backbone of an effective security strategy.
Comprehensive logging and monitoring is essential for detecting, analyzing, and responding to security events.
PCI DSS requires the use of several best practices, including:

- Authentication & Authorization: Log all login attempts (successful and failed), account lockouts, password changes, and MFA events.
- System & Application Errors: Log unexpected errors, exceptions, and system failures that could indicate an attack or misconfiguration.
- File Integrity: Manage and monitor changes to critical files or configurations using Git repositories.
- Sensitive Data: Cardholder data, full PAN, or sensitive authentication data is never logged.
- Structured Logging: ICM uses a consistent log format (JSON) to facilitate automated parsing, aggregation, and analysis.
- Automated Alerts: Alerts can be configured for anomalous behavior such as repeatedly failed logins, unexpected IP address changes, or high volumes of error logs.
- Dashboards & Visualization: Use dashboards to visualize trends and quickly identify security incidents.

### Password Autocomplete

The Intershop PWA keeps password autocomplete enabled with appropriate attributes to comply with WCAG 2.2 accessibility requirements.
While some PCI DSS interpretations suggest disabling autocomplete for password fields, Intershop prioritized accessibility in the baseline PWA implementation, see the [Accessibility in UX: Patterns and Rationale](accessibility-ux-pattern.md#password-autocomplete) guide.

PCI DSS compliance for password autocomplete must be enforced through project-level security measures while maintaining accessibility features in the core PWA.
For the technical implementation approach, see [PR #1956](https://github.com/intershop/intershop-pwa/pull/1956).
