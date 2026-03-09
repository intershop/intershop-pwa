/**
 * Styling Configuration for PayPal Messages
 *
 * @see {@link https://developer.paypal.com/sdk/js/reference} PayPal Style Reference
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
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  },
};

// General Styling configuration for PayPal card fields.
export const PAYPAL_CART_FIELDS_STYLING = {
  body: {
    padding: '0',
  },
  input: {
    'font-size': '0.875rem',
    'font-weight': '400',
    'font-family': 'inherit',
    'border-radius': '0',
    'line-height': '21px',
    padding: '0.375rem 0.75rem',
    border: '1px solid #757575',
  },
  'input:focus-visible': {
    outline: 'revert !important',
  },
  'input:focus': {
    border: '1px solid #757575',
    'box-shadow': 'none',
  },
  '.invalid': { color: '#dc3545', border: '1px solid #dc3545', 'box-shadow': 'none' },
};

// Styling configuration for PayPal buttons.
export const PAYPAL_GOOGLE_PAY_BUTTON_STYLING = {
  buttonColor: 'white',
  buttonType: 'order',
  buttonSizeMode: 'fill',
};

// Styling configuration for Apple Pay button.
export const PAYPAL_APPLE_PAY_BUTTON_STYLING = {
  /** Button style: 'black', 'white', 'white-outline' */
  buttonStyle: 'black',
  /** Button type: 'plain', 'buy', 'set-up', 'donate', 'check-out', 'book', 'subscribe', 'add-money', 'top-up', 'order', 'rent', 'support', 'contribute', 'tip' */
  buttonType: 'buy',
  /** Button border radius in pixels */
  borderRadius: 4,
};
