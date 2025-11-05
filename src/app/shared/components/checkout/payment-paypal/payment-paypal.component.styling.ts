/**
 * Styling Configuration for PayPal Buttons
 *
 * @see {@link https://https://developer.paypal.com/sdk/js/reference/#buttons} PayPal Style Reference
 */

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
