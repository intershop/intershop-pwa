# Inventory of scripts used on payment page (PCI DSS 4.0 Requirement 6.4.3)

This file documents externally loaded payment-related scripts currently used in the PWA codebase.

## Inventory

| Script/Resource                   | Origin URL / Pattern                                                  | SRI Hash                                                         | Business Justification                                                                  | Owner | Last Reviewed |
| --------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----- | ------------- |
| Payone Hosted IFrames SDK         | `https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js`        |                                                                  | Required for Payone credit card hosted fields/tokenization in checkout                  |       |               |
| Concardis Payengine SDK (LIVE)    | `https://pp.payengine.de/bridge/1.0/payengine.min.js`                 |                                                                  | Required for Concardis hosted payment forms and tokenization                            |       |               |
| Concardis Payengine SDK (TEST)    | `https://pptest.payengine.de/bridge/1.0/payengine.min.js`             |                                                                  | Required for Concardis hosted payment forms and tokenization in test/sandbox context    |       |               |
| PayPal JavaScript SDK             | `https://www.paypal.com/sdk/js` (with query params)                   |                                                                  | Required for PayPal checkout, card fields, pay-later messaging, and alternative wallets |       |               |
| Google Pay SDK (via PayPal flows) | `https://pay.google.com/gp/p/js/pay.js`                               |                                                                  | Required for PayPal Google Pay adapter and eligibility/rendering checks                 |       |               |
| Apple Pay SDK (via PayPal flows)  | `https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js`      |                                                                  | Required for PayPal Apple Pay adapter and eligibility/rendering checks                  |       |               |
| Cybersource Flex client library   | Runtime value from `ctxData.clientLibrary` (decoded from `flexkeyId`) | Dynamic: loaded with `integrity: ctxData.clientLibraryIntegrity` | Required for Cybersource Microform tokenization of card data                            |       |               |
