<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# PayPal Styling Guide

- [PayPal Styling Architecture](#paypal-styling-architecture)
  - [Core Components](#core-components)
  - [Styling Categories](#styling-categories)
  - [Pay Later Message Limitations](#pay-later-message-limitations)
    - [Required Conditions](#required-conditions)
    - [Implementation Notes](#implementation-notes)
    - [Troubleshooting](#troubleshooting)
- [Button Styling](#button-styling)
  - [Available Button Styles](#available-button-styles)
    - [Standard Checkout Buttons](#standard-checkout-buttons)
    - [Express Checkout Buttons](#express-checkout-buttons)
- [Further Reading](#further-reading)

This guide explains how to style PayPal buttons and messages in the Intershop PWA using the centralized styling system.

## PayPal Styling Architecture

### Core Components

- **`PaypalConfigService`** - Manages PayPal SDK loading and configuration
- **`PaypalConfig`** - Interface defining which PayPal features are enabled
- **PayPal Components** - UI components that render PayPal buttons and messages

### Styling Categories

The styling system is organized into two main categories:

1. **Message Styling** - For PayPal Pay Later promotional messages
2. **Button Styling** - For PayPal payment buttons

### Pay Later Message Limitations

PayPal Pay Later messages have specific requirements that must be met for them to display correctly:

#### Required Conditions

1. **Active Basket Required**: A basket must exist in the current session. Pay Later messages cannot be displayed without an active shopping basket.

2. **PayPal Fast Checkout Availability**: The basket must contain a PayPal Checkout payment method as an eligible payment method. This is determined by:
   - PayPal payment method configuration in the ICM backend
   - Current basket contents and total amount
   - Customer location and PayPal service availability
   - Merchant account settings and capabilities

#### Implementation Notes

The `PaymentPaypalMessagesComponent` automatically handles these conditions by:

- Filtering payment methods to ensure PayPal Fast Checkout is available
- Only rendering messages when both conditions are satisfied
- Gracefully handling cases where conditions are not met

#### Troubleshooting

**Messages not appearing?** Check that:

- An active basket exists
- A PayPal payment method is configured and enabled
- The basket total meets PayPal's minimum requirements
- PayPal services are available in the customer's region

## Button Styling

PayPal payment buttons are styled differently based on their integration context.

### Available Button Styles

#### Standard Checkout Buttons

**Use Case**: Standard checkout flow
**Features**: Horizontal layout with consistent branding and height

#### Express Checkout Buttons

**Use Case**: Express checkout scenarios (e.g., product page quick checkout)
**Features**: Flexible layout without fixed horizontal constraint

## Further Reading

- [PayPal JavaScript SDK Reference](https://developer.paypal.com/docs/checkout/reference/customize-sdk/)
- [PayPal Messages Documentation](https://developer.paypal.com/docs/checkout/pay-later/us/integrate/)
