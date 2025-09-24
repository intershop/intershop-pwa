export class PayPalStyling {
  static CATEGORY_MESSAGE_STYLING = { layout: 'flex', color: 'white-no-border' };

  static PDP_MESSAGE_STYLING = {
    layout: 'text',
    color: 'black',
    logo: {
      type: 'inline',
    },
  };

  static CART_CHECKOUT_MESSAGE_STYLING = {
    layout: 'text',
    color: 'black',
    logo: {
      type: 'inline',
    },
  };

  static BUTTON_MESSAGE_STYLING = {
    layout: 'text',
    color: 'black',
  };

  static PAYPAL_CHECKOUT_BUTTON_STYLING = {
    layout: 'horizontal',
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  };

  static PAYPAL_EXPRESS_BUTTON_STYLING = {
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  };
}
