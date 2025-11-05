<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# PayPal

- [Styling](#styling)
  - [Styling Categories](#styling-categories)
  - [Pay Later Message Styling](#pay-later-message-styling)
    - [Limitations](#limitations)
    - [Troubleshooting](#troubleshooting)
  - [Button Styling](#button-styling)
    - [Standard Checkout Buttons](#standard-checkout-buttons)
    - [Express Checkout Buttons](#express-checkout-buttons)
- [Further References](#further-references)

The Intershop PWA provides a payment integration with PayPal via the [Intershop PayPal Complete Payments Service Connector (PPCP Connector) version 2](https://knowledge.intershop.com/kb/index.php/Display/27P833).

## Styling

This guide explains how to style PayPal buttons and messages in the Intershop PWA using the centralized styling system.

### Styling Categories

The styling system is organized in two main categories:

- **Pay Later Message Styling**: For PayPal Pay Later promotional messages
- **Button Styling**: For PayPal payment buttons

### Pay Later Message Styling

The styling of PayPal messages depends on the page context in the `payment-paypal-messages.component.styling.ts`.

#### Limitations

PayPal Pay Later messages have specific requirements that must be met for them to be displayed correctly:

1. **Active Basket Required**: A basket must exist in the current session. Pay Later messages cannot be displayed without an active shopping basket.

2. **PayPal Payment Method Availability**: The basket must contain a PayPal Checkout payment method as an eligible payment method. This is determined by:
   - PayPal payment method configuration in the ICM backend
   - Current basket contents and total amount
   - Customer location and PayPal service availability
   - Merchant account settings and capabilities

> [!Note]
> The `PaymentPaypalMessagesComponent` only renders messages when both conditions are satisfied.

#### Troubleshooting

Messages are not appearing? Check that:

- An active basket exists
- A PayPal payment method is configured (with `client-id` and `merchant-id` as `hostedPaymentPageParameters`) and enabled
- The basket total meets PayPal's minimum requirements
- PayPal services are available in the customer's region

### Button Styling

PayPal payment buttons are styled differently based on their integration context in the `payment-paypal.component.styling.ts`.

#### Standard Checkout Buttons

**Use Case**: Standard checkout flow on the checkout payment page<br/>
**Features**: Horizontal layout with consistent branding and height

#### Express Checkout Buttons

**Use Case**: Express checkout scenarios (e.g., product page quick checkout) on the cart page<br/>
**Features**: Flexible layout without fixed horizontal constraint

## Further References

- [PayPal JavaScript SDK Reference](https://developer.paypal.com/docs/checkout/reference/customize-sdk/)
- [PayPal Messages Documentation](https://developer.paypal.com/docs/checkout/pay-later/us/integrate/)
- [Intershop PayPal Complete Payments Service Connector (PPCP Connector) version 2](https://knowledge.intershop.com/kb/index.php/Display/27P833)
