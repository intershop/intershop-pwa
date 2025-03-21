<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Security Standard PCI DSS 4.0

PCI DSS stands for Payment Card Industry Data Security Standard and is a comprehensive set of security guidelines designed to protect payment card information during storage, processing, and transmission.
The up-to-date document can be found in the [PCI Document Library](https://www.pcisecuritystandards.org/document_library/?category=pcidss).
These standards are established to ensure that organizations handling card data maintain a secure environment and mitigate risks associated with data breaches.

With the release of PCI DSS 4.0, organizations that handle payment card data must ensure compliance with updated security requirements.
With using the Intershop Progressive Web App (PWA), you need to incorporate security best practices to protect cardholder data and sensitive authentication data.
This guide outlines the key considerations and best practices for applying PCI DSS 4.0 to the Angular-based Intershop PWA.

## Understanding PCI DSS 4.0 Applicability

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

__Recommended Security Headers__

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

Secure Server-Side Rendering is used in the Intershop Progressive Web App when running in a Docker container.
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

## Additional Points to Consider

### Secure Data Handling

Protecting Cardholder Data (CHD) and Sensitive Authentication Data (SAD) is one of the core requirements of PCI DSS 4.0.
In the Intershop PWA, Server-Side Rendering (SSR) is used.
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
