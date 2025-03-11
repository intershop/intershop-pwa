<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# PCI DSS 4.0 in Intershop PWA

PCI DSS stands for Payment Card Industry Data Security Standard and is a comprehensive set of security guidelines designed to protect payment card information during storage, processing, and transmission.
These standards are established to ensure that organizations handling card data maintain a secure environment and mitigate risks associated with data breaches.

With the release of PCI DSS 4.0, organizations that handle payment card data must ensure compliance with updated security requirements.
With using the Intershop Progressive Web Application (PWA), you need to incorporate security best practices to protect cardholder data and sensitive authentication data.
This guide outlines the key considerations and best practices for applying PCI DSS 4.0 to the Angular-based Intershop PWA.

# References

- [PCI DSS: v4.0.1](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0_1.pdf)

# Understanding PCI DSS 4.0 Applicability

PCI DSS 4.0 requires securing data at rest, data in transit, authentication mechanisms, and application security.
Since the PWA operates on both client-side and server-side, compliance must address:

- Frontend Security (Angular PWA)
- Backend Security (SSR in Express, ICM)
- Data Storage and Transmission
- Access Control and Authentication
- Logging, Monitoring, and Incident Response

# Secure Data Handling (PCI DSS Requirement 3 & 4)

Protecting Cardholder Data (CHD) and Sensitive Authentication Data (SAD) is one of the core requirements of PCI DSS 4.0.
In the Intershop PWA Server-Side Rendering (SSR) is used.
The data are processed both on the client-side (Angular PWA) and server-side (Express framework).
To comply with PCI DSS, you need to secure data storage, transmission, and ensure proper encryption mechanisms.
The requirements mandate that SAD must never be stored after authorization.
This includes:

- Full Magnetic Stripe Data
- Card Verification Code (CVV, CVC, CID, CAV2, etc.)
- PINs and PIN Blocks
  The primary goal is to minimize the scope of your Cardholder Data Environment (CDE).
  This is achieved by the default implementation by using Third-party PCI DSS-compliant payment provider like Stripe, or Payone to avoid handling raw card data.
  When processing payments the payment processor integrations rely on redirecting to the provider for entering the CHD or using JavaScript SDKs provided by the payment processor to directly capture card details without exposing them to the PWA.

# Secure Authentication & Access Control (Requirement 8 & 9)

Ensuring strong authentication and access control is critical in securing the PWA, especially when dealing with payment transactions and cardholder data.
Since the handling of these CHD is completely in the hands of the integrated payment providers these sensitive data are never handled with the PWA and the requirements are fulfilled.
All custom payment integrations must use the same approach to not break these requirements in a customization.

# Secure Angular PWA Code & Dependencies (Requirement 6)

Securing the codebase of a Web App is critical to achieving PCI DSS compliance.
Given that the frontend often presents a tempting target for attackers, it is mandatory to ensure secure coding practices, dependency management, and protection against common web vulnerabilities.

The following sections provide a detailed breakdown of how to harden your PWA against exploits, data breaches, and injection attacks.

## Prevent Cross-Site Scripting (XSS) Attacks

PCI DSS 4.0 requires protection against cross-site scripting (XSS) and injection attacks.
A Content Security Policy (CSP) helps by restricting the sources from which scripts, styles, and other resources can be loaded.
A way how to implement CSP in the PWA was described in the document "[Building and Running NGINX Docker Image](nginx-startup.md)".
Summarized this means you have to

- Define strict CSP rules to allow only trusted sources.
- Avoid using unsafe-inline and unsafe-eval in scripts.
  In order to protect the PWA against cross-site scripting attacks the Angular built-in security mechanisms like DomSanitizer and template escaping are used.
  Additionally, is the injection of dynamic content is disabled, and user-generated input is escaped/sanitized.

## Secure API Calls & Prevent CORS Attacks

Of course, the PWA communicates extensively with the ICM and other systems to fulfill certain requests.
Especially during the preparation and payment of an order, sensitive data is handled.
It is imperative that this communication is always secure.
Make sure that all API requests are sent over HTTPS (TLS 1.2 or 1.3), as is done in the default implementation of the Intershop PWA.

## Harden Dependency Security & Package Management

Since the PWA uses Angular and therefor uses Node.js and NPM, keeping dependencies secure is essential.
There are a few points to do/consider in order to prevent to prevent supply chain attacks by detecting and fixing vulnarable packages.
These are

- Perform regular security audits (`npm audit`).
- Use a package-lock file (`package-lock.json`) to prevent dependency tampering.
- Automatically update vulnerable dependencies (e.g. with Dependabot in ICM).
- Ensure dependencies come from trusted sources.

## Use Secure HTTP Headers to Prevent Browser Attacks

To comply with PCI DSS 4.0, your PWA’s productive environment (Node.js + Express) must enforce security headers.

Recommended Security Headers

| Header                    | Purpose                      | Example                                        |
| ------------------------- | ---------------------------- | ---------------------------------------------- |
| Strict-Transport-Security | Enforces HTTPS               | `max-age=31536000; includeSubDomains; preload` |
| X-Frame-Options           | Prevents clickjacking        | `DENY`                                         |
| X-Content-Type-Options    | Prevents MIME-type sniffing  | `nosniff`                                      |
| Referrer-Policy           | Limits referrer info leakage | `strict-origin`                                |
| Permissions-Policy        | Restricts browser features   | `geolocation=(), microphone=()`                |
| Content Security Policy   | Limits allowed resources     | `default-src 'self';`                          |

## Enforce Secure Authentication & Session Management

PCI DSS requires secure authentication and session handling to protect user credentials.
One best practice is to use Secure, HttpOnly cookies for session storage instead of local storage, which helps prevent unauthorized access to session data.
Another recommendation is to implement automatic session timeouts and logout users after periods of inactivity, reducing the risk of session hijacking.

## Implement Security Logging & Intrusion Detection

PCI DSS 4.0 mandates that applications log and monitor security events to detect suspicious activity.
To implement effective security logging, organizations should log all authentication events, including failed logins and account changes.
Because the check of the credentials is done in ICM the logging of these kind of activities is also done there.

## Secure Server-Side Rendering (SSR)

Secure Server-Side Rendering is used in the Intershop Progressive Web App when running in a Docker container.
To secure SSR, it is important to sanitize any user input before rendering dynamic content, ensuring that malicious data is not processed.
Additionally, preventing SSR template injection is vital; this can be achieved by avoiding direct DOM manipulation during the rendering process.
Finally, using only trusted sources for dynamic content further minimizes the risk of introducing vulnerabilities.
By default these points are fulfilled.
For instance uses the CMS HTML component InsertAdjacentHTML to render the server-side content within the PWA.
This method however does not interpret content (https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML#security_considerations) to prevent attacks.
It is highly recommended to keep this functionality this way to reduce attack vectors of your storefront.

# Logging & Monitoring (PCI DSS Requirements 10 & 11)

Logging and monitoring are the backbone of an effective security strategy.
Comprehensive logging and monitoring is essential for detecting, analyzing, and responding to security events.
The PWA, along with the ICM, employs several best practices, such as

- Authentication & Authorization: Logs all login attempts (successful and failed), account lockouts, password changes, and MFA events.
- System & Application Errors: Log unexpected errors, exceptions, and system failures that could indicate an attack or misconfiguration.
- File Integrity: Changes to critical files or configurations are managed and monitored through Git repositories.
- Sensitive Data: Cardholder data, full PAN, or sensitive authentication data are never logged.
- Structured Logging: ICM uses a consistent log format (JSON) to facilitate automated parsing, aggregation, and analysis.
- Automated Alerts: Alerts can be configured for anomalous behavior such as repeated failed logins, unexpected IP address changes, or high volumes of error logs.
- Dashboards & Visualization: Use dashboards to visualize trends and quickly identify security incidents.

# Regular Testing & Continuous Compliance (PCI DSS Requirements 11 & 12)

Maintaining security isn’t a one-time task; it’s a continuous process.
For the PWA we implemented automated testing and vulnarability scans.
While the automated tests support the general stability, `npm audit` (PWA) and Dependabot (ICM) are used o automatically identify and remediate vulnerabilities in third-party packages.
