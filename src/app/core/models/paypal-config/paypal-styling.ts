/**
 * PayPal Styling Configuration
 *
 * Central repository for PayPal SDK styling configurations used across different page contexts
 * within the Intershop PWA. This class provides static styling objects that ensure consistent
 * PayPal UI component appearance throughout the application.
 *
 * The styling configurations follow PayPal's official SDK documentation and are optimized
 * for the Intershop PWA's design system and user experience requirements.
 *
 *
 * @see {@link https://https://developer.paypal.com/studio/checkout/pay-later/us/customize/reference} PayPal Style Reference
 * @see {@link PaypalConfigService} for PayPal configuration management
 * @since 1.0.0
 */
export class PayPalStyling {
  static HOME_MESSAGE_STYLING = {
    layout: 'flex',
    color: 'white-no-border',
    ratio: '20x1',
  };

  /**
   * Styling configuration for PayPal Pay Later messages on category/listing pages.
   *
   * Uses a flexible layout with white border styling to integrate well with
   * product listing grids and category overview pages.
   *
   * @static
   * @readonly
   */
  static CATEGORY_MESSAGE_STYLING = {
    layout: 'flex',
    color: 'white-no-border',
  };

  /**
   * Styling configuration for PayPal Pay Later messages on Product Detail Pages (PDP).
   *
   * Features a text-based layout with inline logo positioning and black color scheme
   * to complement product information sections and maintain readability.
   *
   * @static
   * @readonly
   */
  static PDP_MESSAGE_STYLING = {
    layout: 'text',
    color: 'black',
    logo: {
      type: 'inline',
    },
  };

  /**
   * Styling configuration for PayPal Pay Later messages on cart and checkout pages.
   *
   * Optimized for cart summary and checkout flow contexts with text layout
   * and inline logo positioning for clear communication of payment options.
   *
   * @static
   * @readonly
   */
  static CART_CHECKOUT_MESSAGE_STYLING = {
    layout: 'text',
    color: 'black',
    logo: {
      type: 'inline',
    },
  };

  /**
   * Styling configuration for PayPal messages displayed near payment buttons.
   *
   * Simplified styling for messages that appear in close proximity to PayPal
   * payment buttons, ensuring visual harmony between messaging and action elements.
   *
   * @static
   * @readonly
   */
  static BUTTON_MESSAGE_STYLING = {
    layout: 'text',
    color: 'black',
  };

  /**
   * Styling configuration for PayPal checkout buttons in standard checkout flow.
   *
   * Horizontal layout with sharp corners, standardized height, and PayPal branding.
   * Tagline is disabled to maintain clean button appearance in checkout contexts.
   *
   * @static
   * @readonly
   */
  static PAYPAL_CHECKOUT_BUTTON_STYLING = {
    layout: 'horizontal',
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  };

  /**
   * Styling configuration for PayPal Express checkout buttons.
   *
   * Optimized for express checkout scenarios with sharp corners and consistent
   * branding. Omits layout specification to allow for flexible integration
   * in various express checkout contexts.
   *
   * @static
   * @readonly
   */
  static PAYPAL_EXPRESS_BUTTON_STYLING = {
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  };
}
