<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# PayPal Styling Guide

- [Overview](#overview)
- [PayPal Styling Architecture](#paypal-styling-architecture)
  - [Core Components](#core-components)
  - [Styling Categories](#styling-categories)
- [Message Styling](#message-styling)
  - [Available Message Styles](#available-message-styles)
    - [Category/Listing Page Messages](#categorylisting-page-messages)
    - [Product Detail Page Messages](#product-detail-page-messages)
    - [Cart/Checkout Messages](#cartcheckout-messages)
    - [Button-Adjacent Messages](#button-adjacent-messages)
  - [Implementing Message Styling](#implementing-message-styling)
  - [Pay Later Message Limitations](#pay-later-message-limitations)
    - [Required Conditions](#required-conditions)
    - [Implementation Notes](#implementation-notes)
    - [Troubleshooting](#troubleshooting)
- [Button Styling](#button-styling)
  - [Available Button Styles](#available-button-styles)
    - [Standard Checkout Buttons](#standard-checkout-buttons)
    - [Express Checkout Buttons](#express-checkout-buttons)
  - [Implementing Button Styling](#implementing-button-styling)
- [Customizing PayPal Styles](#customizing-paypal-styles)
  - [Modifying Existing Styles](#modifying-existing-styles)
  - [Adding New Style Configurations](#adding-new-style-configurations)
  - [Style Configuration Options](#style-configuration-options)
    - [Button Style Options](#button-style-options)
    - [Message Style Options](#message-style-options)
- [Further Reading](#further-reading)

This guide explains how to style PayPal buttons and messages in the Intershop PWA using the centralized styling system.

## Overview

The Intershop PWA provides a centralized styling configuration system for PayPal components through the `PayPalStyling` class.
This ensures consistent appearance and optimal user experience across different page contexts while following PayPal's official design guidelines.

## PayPal Styling Architecture

### Core Components

- **`PayPalStyling`** - Central repository for all PayPal styling configurations
- **`PaypalConfigHelper`** - Manages PayPal SDK loading and configuration
- **`PaypalConfig`** - Interface defining which PayPal features are enabled
- **PayPal Components** - UI components that render PayPal buttons and messages

### Styling Categories

The styling system is organized into two main categories:

1. **Message Styling** - For PayPal Pay Later promotional messages
2. **Button Styling** - For PayPal payment buttons

## Message Styling

PayPal Pay Later messages can be displayed across different page contexts, each with optimized styling.

### Available Message Styles

#### Category/Listing Page Messages

```typescript
PayPalStyling.CATEGORY_MESSAGE_STYLING = {
  layout: 'flex',
  color: 'white-no-border',
};
```

**Use Case**: Product category pages and search result listings
**Features**: Flexible layout that integrates well with product grids

#### Product Detail Page Messages

```typescript
PayPalStyling.PDP_MESSAGE_STYLING = {
  layout: 'text',
  color: 'black',
  logo: {
    type: 'inline',
  },
};
```

**Use Case**: Individual product pages
**Features**: Text layout with inline logo for clean integration with product information

#### Cart/Checkout Messages

```typescript
PayPalStyling.CART_CHECKOUT_MESSAGE_STYLING = {
  layout: 'text',
  color: 'black',
  logo: {
    type: 'inline',
  },
};
```

**Use Case**: Shopping cart and checkout pages
**Features**: Clear messaging optimized for purchase decision contexts

#### Button-Adjacent Messages

```typescript
PayPalStyling.BUTTON_MESSAGE_STYLING = {
  layout: 'text',
  color: 'black',
};
```

**Use Case**: Messages displayed near PayPal payment buttons
**Features**: Simplified styling for visual harmony with payment elements

### Implementing Message Styling

```typescript
import { PayPalStyling } from 'ish-core/models/paypal-config/paypal-styling';

// In your component
renderPayPalMessage(containerId: string, pageType: string) {
  let styleConfig;

  switch (pageType) {
    case 'category':
      styleConfig = PayPalStyling.CATEGORY_MESSAGE_STYLING;
      break;
    case 'product-details':
      styleConfig = PayPalStyling.PDP_MESSAGE_STYLING;
      break;
    case 'cart':
    case 'checkout':
      styleConfig = PayPalStyling.CART_CHECKOUT_MESSAGE_STYLING;
      break;
    default:
      styleConfig = PayPalStyling.BUTTON_MESSAGE_STYLING;
  }

  paypal.Messages({
    style: styleConfig,
    // ... other configuration
  }).render(containerId);
}
```

### Pay Later Message Limitations

PayPal Pay Later messages have specific requirements that must be met for them to display correctly:

#### Required Conditions

1. **Active Basket Required**: A basket must exist in the current session. Pay Later messages cannot be displayed without an active shopping basket.

2. **PayPal Fast Checkout Availability**: The basket must contain PayPal Fast Checkout as an eligible payment method. This is determined by:
   - PayPal payment method configuration in the ICM backend
   - Current basket contents and total amount
   - Customer location and PayPal service availability
   - Merchant account settings and capabilities

#### Implementation Notes

The `PaymentPaypalMessagesComponent` automatically handles these conditions by:

- Filtering payment methods to ensure PayPal Fast Checkout is available
- Only rendering messages when both conditions are satisfied
- Gracefully handling cases where conditions are not met

```typescript
// The component checks for eligible payment methods
filter(([, config]) => this.paypalConfigHelper.isFundingEnabled(config, this.pageType));
```

#### Troubleshooting

**Messages not appearing?** Check that:

- An active basket exists
- PayPal Fast Checkout payment method is configured and enabled
- The basket total meets PayPal's minimum requirements
- PayPal services are available in the customer's region

## Button Styling

PayPal payment buttons are styled differently based on their integration context.

### Available Button Styles

#### Standard Checkout Buttons

```typescript
PayPalStyling.PAYPAL_CHECKOUT_BUTTON_STYLING = {
  layout: 'horizontal',
  shape: 'sharp',
  label: 'paypal',
  height: 40,
  tagline: false,
};
```

**Use Case**: Standard checkout flow
**Features**: Horizontal layout with consistent branding and height

#### Express Checkout Buttons

```typescript
PayPalStyling.PAYPAL_EXPRESS_BUTTON_STYLING = {
  shape: 'sharp',
  label: 'paypal',
  height: 40,
  tagline: false,
};
```

**Use Case**: Express checkout scenarios (e.g., product page quick checkout)
**Features**: Flexible layout without fixed horizontal constraint

### Implementing Button Styling

```typescript
import { PayPalStyling } from 'ish-core/models/paypal-config/paypal-styling';

// Standard checkout implementation
initializeCheckoutButton() {
  paypal.Buttons({
    style: PayPalStyling.PAYPAL_CHECKOUT_BUTTON_STYLING,
    createOrder: (data, actions) => {
      // Order creation logic
    },
    onApprove: (data, actions) => {
      // Approval handling logic
    }
  }).render('#paypal-checkout-button');
}

// Express checkout implementation
initializeExpressButton() {
  paypal.Buttons({
    style: PayPalStyling.PAYPAL_EXPRESS_BUTTON_STYLING,
    createOrder: (data, actions) => {
      // Express order creation logic
    },
    onApprove: (data, actions) => {
      // Express approval handling logic
    }
  }).render('#paypal-express-button');
}
```

## Customizing PayPal Styles

### Modifying Existing Styles

To customize existing styles, modify the appropriate constants in `PayPalStyling`:

```typescript
// Example: Customizing button height
static PAYPAL_CHECKOUT_BUTTON_STYLING = {
  layout: 'horizontal',
  shape: 'sharp',
  label: 'paypal',
  height: 50, // Changed from 40 to 50
  tagline: false
};
```

### Adding New Style Configurations

When adding new page contexts or PayPal integrations:

1. **Add new static property** to `PayPalStyling` class
2. **Document the new style** with JSDoc comments
3. **Update components** to use the new styling configuration
4. **Add examples** to this guide

```typescript
// Example: Adding a new style for mobile contexts
static MOBILE_BUTTON_STYLING = {
  layout: 'vertical',
  shape: 'rect',
  label: 'paypal',
  height: 45,
  tagline: true
};
```

### Style Configuration Options

PayPal provides various styling options that can be configured:

#### Button Style Options

| Property  | Description    | Options                                    |
| --------- | -------------- | ------------------------------------------ |
| `layout`  | Button layout  | `horizontal`, `vertical`                   |
| `shape`   | Button corners | `rect`, `pill`, `sharp`                    |
| `label`   | Button text    | `paypal`, `checkout`, `pay`, `installment` |
| `height`  | Button height  | Number (25-55)                             |
| `tagline` | Show tagline   | `true`, `false`                            |
| `color`   | Button color   | `gold`, `blue`, `silver`, `white`, `black` |

#### Message Style Options

| Property        | Description    | Options                                                        |
| --------------- | -------------- | -------------------------------------------------------------- |
| `layout`        | Message layout | `text`, `flex`                                                 |
| `color`         | Message color  | `black`, `white`, `monochrome`, `grayscale`, `white-no-border` |
| `logo.type`     | Logo style     | `primary`, `alternative`, `inline`, `none`                     |
| `logo.position` | Logo position  | `left`, `right`, `top`                                         |

## Further Reading

- [PayPal JavaScript SDK Reference](https://developer.paypal.com/docs/checkout/reference/customize-sdk/)
- [PayPal Messages Documentation](https://developer.paypal.com/docs/checkout/pay-later/us/integrate/)
