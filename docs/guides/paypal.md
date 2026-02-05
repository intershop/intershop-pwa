<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# PayPal Integration

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#Architecture)
  - [Key Components](#key-components)
- [Component Types](#component-types)
  - [Buttons](#buttons)
  - [Messages](#messages)
  - [Card Fields](#card-fields)
- [Styling Customization](#styling-customization)
  - [Pay Later Message Styling](#pay-later-message-styling)
  - [Button Styling](#button-styling)
    - [Standard Checkout Buttons](#standard-checkout-buttons)
    - [Express Checkout Buttons](#express-checkout-buttons)
  - [Card Fields Styling](#card-fields-styling)
- [Page Types](#page-types)
- [Integration Points](#integration-points)
- [Script Loading](#script-loading)
- [Pay later Configuration](#pay-later-configuration)
- [Further References](#further-references)

## Overview

The PWA provides a component with the selector [`ish-payment-paypal`][payment-paypal.component.ts] that dynamically loads the PayPal SDK and renders the appropriate PayPal component based on the configured component type and current page context.
It supports:

- **Buttons**: PayPal checkout buttons for standard payments
- **Messages**: Pay Later messaging for promotional content
- **CardFields**: Hosted card input fields for credit card payments

## Prerequisites

To use PayPal payment methods in the Intershop PWA, ensure the following prerequisites are met:

1. The [Intershop PayPal Complete Payments Service Connector (PPCP Connector) version 2](https://knowledge.intershop.com/kb/index.php/Display/455B74) is installed and configured in the ICM backend.
2. The PayPal Common Configuration Service is configured in the ICM backend and the onboarding process has been successfully completed.
3. The PayPal payment methods are activated and configured in the ICM backend.

## Architecture

The PayPal integration follows a modular architecture with clear separation of concerns:

```
src/app/core/utils/sdk/paypal/
├── paypal-components/
│   ├── buttons/            # PayPal Buttons component
│   ├── card-fields/        # PayPal Card Fields component
│   ├── messages/           # PayPal Pay Later Messages component
│   ├── paypal-component.builder.ts    # Factory for creating components
│   └── paypal-component.styling.ts    # Centralized styling configuration
├── paypal-config/
│   └── paypal-config.service.ts       # SDK loading and configuration
├── paypal-data-transfer/
│   └── paypal-data-transfer.service.ts # Data communication service
└── paypal-model/
    └── paypal.interface.ts            # PayPal SDK interfaces
```

### Key Components

| Component                   | Location                                              | Purpose                                                        |
| --------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| `PaymentPaypalComponent`    | `src/app/shared/components/payment/payment-paypal/`   | Main Angular component for rendering PayPal elements           |
| `PaypalComponentBuilder`    | `src/app/core/utils/sdk/paypal/paypal-components/`    | Factory service that creates appropriate PayPal SDK components |
| `PaypalConfigService`       | `src/app/core/utils/sdk/paypal/paypal-config/`        | Handles SDK script loading and URL construction                |
| `PayPalDataTransferService` | `src/app/core/utils/sdk/paypal/paypal-data-transfer/` | Enables data communication outside NgRx store flow             |

## Component Types

The [`ish-payment-paypal`][payment-paypal.component.ts] component supports three different component types:

### Buttons

PayPal checkout buttons for initiating standard and express payments.

```typescript
export class ExampleComponent {
  paypalComponentType = PaypalComponentTypes.Buttons;
  ...
}
```

```html
<!-- exapmple.component.html -->
<ish-payment-paypal [componentType]="paypalComponentType" [selectedPaymentMethod]="paymentMethod" />
```

### Messages

Pay Later promotional messages that display financing information.
It is not necessary to set the `componentType` input for messages, as it is the default type when no `componentType` is provided.

```html
<ish-payment-paypal />
```

### Card Fields

Hosted card input fields for direct credit/debit card payments (Advanced Card Payments).

```typescript
export class ExampleComponent {
  paypalComponentType = PaypalComponentTypes.CardFields;
  ...
}
```

```html
<!-- exapmple.component.hml -->
<ish-payment-paypal [componentType]="paypalComponentType" [selectedPaymentMethod]="paymentMethod" />
```

## Page Types

The PayPal integration automatically detects the current page type based on the URL and configures the SDK accordingly:

| Page Type        | URL Pattern             | SDK `data-page-type` | Amount Source      |
| ---------------- | ----------------------- | -------------------- | ------------------ |
| Cart             | `/basket`               | `cart`               | Basket gross total |
| Checkout Payment | `checkout/payment`      | `checkout`           | Basket gross total |
| Product Details  | `-ctg` and `-prd`       | `product-details`    | Product sale price |
| Product Listing  | `-ctg` (without `-prd`) | `product-listing`    | -                  |
| Home             | `/home`                 | `home`               | -                  |

## Styling Customization

This section explains how to style PayPal components in the Intershop PWA using the styling possibilities given by PayPal JavaScript SDK.

All styling configurations are located in [`paypal-component.styling.ts`][paypal-component.styling.ts].

### Pay Later Message Styling

The styling of PayPal messages depends on the page context.

```typescript
export const PAYPAL_MESSAGE_STYLING = {
  home: { layout: 'flex', color: 'white-no-border', ratio: '20x1' },
  category: { layout: 'flex', color: 'white-no-border' },
  product: { layout: 'text', color: 'black', logo: { type: 'inline' } },
  cart: { layout: 'text', color: 'black', logo: { type: 'inline' } },
  checkout: { layout: 'text', color: 'black', logo: { type: 'inline' } },
};
```

### Button Styling

PayPal payment buttons are styled differently based on their integration context.

```typescript
export const PAYPAL_BUTTON_STYLING = {
  cart: { shape: 'sharp', label: 'paypal', height: 40, tagline: false },
  checkout: { shape: 'sharp', label: 'paypal', height: 40, tagline: false },
};
```

#### Standard Checkout Buttons

| Attribute | Value                                                 |
| --------- | ----------------------------------------------------- |
| Use Case  | Standard checkout flow on the checkout payment page   |
| Features  | Horizontal layout with consistent branding and height |

#### Express Checkout Buttons

| Attribute | Value                                                                |
| --------- | -------------------------------------------------------------------- |
| Use Case  | Express checkout scenarios (e.g., quick checkout from the cart page) |
| Features  | Flexible layout without fixed horizontal constraint                  |

### Card Fields Styling

Card fields use custom CSS styling to match the application design:

```typescript
export const PAYPAL_CART_FIELDS_STYLING = {
  body: { padding: '0' },
  input: {
    'font-size': '0.875rem',
    'font-weight': '400',
    'font-family': 'inherit',
    'border-radius': '0',
    padding: '0.375rem 0.75rem',
    border: '1px solid #757575',
  },
  '.invalid': { color: '#dc3545', border: '1px solid #dc3545' },
};
```

## Integration Points

The `ish-payment-paypal` component is used in the following locations:

| Location              | Component Type      | Purpose                                         |
| --------------------- | ------------------- | ----------------------------------------------- |
| Home Page             | Messages            | Display promotional Pay Later messaging         |
| Category Pages        | Messages            | Display Pay Later messaging in product listings |
| Product Detail Page   | Messages            | Show financing options for specific product     |
| Basket/Cart Page      | Messages, Buttons   | Pay Later info and Express Checkout button      |
| Checkout Payment Page | Buttons, CardFields | Standard checkout with PayPal or card payment   |

## Script Loading

Each PayPal SDK instance is loaded with a unique namespace to avoid conflicts when multiple instances are needed:

```typescript
// Namespace format: PPCP_<payment_method_id> or PPCP_MESSAGES
const paypalObject = window['PPCP_FAST_CHECKOUT'];
```

Loading is handled by the [`PaypalConfigService`][paypal-config.service.ts], which constructs the SDK URL with necessary parameters, and uses the [`ScriptLoaderService`][paypal-component.styling.ts] to load the script dynamically.

The [`ScriptLoaderService`][paypal-component.styling.ts] is a core utility service for dynamically loading external JavaScript files into the DOM.
It provides the following features:

- **Caching**: Prevents duplicate script loading by maintaining caches for loaded and currently loading scripts
- **Namespace support**: Uses `data-namespace` attributes as cache keys to handle scripts with dynamic URLs (e.g., PayPal SDK URLs that change with locale/currency)
- **Script attributes**: Supports `type`, `integrity`, `crossorigin`, and custom data attributes
- **Observable-based API**: Returns an `Observable<ScriptType>` for tracking load status

## Pay later Configuration

The visibility of Pay later messages or pay later buttons is controlled by the icm backend settings of the PayPal Common Configuration Service.

<a target="_blank" href="paypal-pay-later.png"><img src="paypal-pay-later.png" alt="ICM backend PayPal Pay later configuration" width="50%"/></a>

The PayPal configuration is retrieved from the ICM backend via the server settings endpoint:

```typescript
interface PaypalConfig {
  clientId: string;
  merchantId: string;
  payLaterPreferences?: {
    PayLaterEnabled: boolean;
    PayLaterMessagingCartEnabled: boolean;
    PayLaterMessagingCategoryEnabled: boolean;
    PayLaterMessagingHomeEnabled: boolean;
    PayLaterMessagingPaymentEnabled: boolean;
    PayLaterMessagingProductDetailsEnabled: boolean;
  };
}
```

Access this configuration in your code via:

```typescript
this.appFacade.serverSetting$<PaypalConfig>('payment.paypal');
```

## Further References

- [PayPal JavaScript SDK Reference](https://developer.paypal.com/docs/checkout/reference/customize-sdk/)
- [`Description of PayPal SDK components`][PayPal JavaScript SDK Reference]
- [PayPal Messages Documentation](https://developer.paypal.com/docs/checkout/pay-later/us/integrate/)
- [PayPal Advanced Card Payments](https://developer.paypal.com/docs/checkout/advanced/)
- [Intershop PayPal Complete Payments Service Connector (PPCP Connector) version 2](https://knowledge.intershop.com/kb/index.php/Display/455B74)

[payment-paypal.component.ts]: ../../src/app/shared/components/payment/payment-paypal/payment-paypal.component.ts
[paypal-component.styling.ts]: ../../src/app/core/utils/sdk/paypal/paypal-components/paypal-component.styling.ts
[paypal-config.service.ts]: ../../src/app/core/utils/sdk/paypal/paypal-config/paypal-config.service.ts
[script-loader.service.ts]: ../../src/app/core/utils/script-loader/script-loader.service.ts
[PayPal JavaScript SDK Reference]: https://developer.paypal.com/sdk/js/reference
