/**
 * Styling Configuration for PayPal Messages
 *
 * @see {@link https://developer.paypal.com/docs/checkout/pay-later/us/integrate/customize-messages/} PayPal Style Reference
 */

// Styling configuration for Pay Later messages.
export const PAYPAL_MESSAGE_STYLING = {
  //  on home page
  home: {
    layout: 'flex',
    color: 'white-no-border',
    ratio: '20x1',
  },
  // on category/listing pages.
  category: {
    layout: 'flex',
    color: 'white-no-border',
  },
  // on product detail pages.
  product: {
    layout: 'text',
    color: 'black',
    logo: {
      type: 'inline',
    },
  },
  // on cart page.
  cart: {
    layout: 'text',
    color: 'black',
    logo: {
      type: 'inline',
    },
  },
  // on checkout (payment) page.
  checkout: {
    layout: 'text',
    color: 'black',
    logo: {
      type: 'inline',
    },
  },
};

// Styling configuration for PayPal buttons.
export const PAYPAL_BUTTON_STYLING = {
  // PayPal express buttons on cart page.
  cart: {
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  },
  // PayPal checkout buttons on checkout (payment) page.
  checkout: {
    layout: 'horizontal',
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  },
};
