/**
 * PayPal Configuration Model
 *
 * Interface defining the configuration structure for PayPal integration features
 * within the Intershop PWA. This configuration controls the availability and
 * display of PayPal Pay Later messaging across different page contexts.
 *
 * The configuration is typically loaded from the backend and used to determine
 * which PayPal features should be enabled and where Pay Later messages should
 * be displayed throughout the application.
 *
 * @example
 * ```typescript
 * const paypalConfig: PaypalConfig = {
 *   payLaterEnabled: true,
 *   payLaterMessagingHome: true,
 *   payLaterMessagingCategory: false,
 *   payLaterMessagingProductDetails: true,
 *   payLaterMessagingCart: true,
 *   payLaterMessagingPayment: false
 * };
 *
 * // Usage in service
 * if (paypalConfig.payLaterEnabled && paypalConfig.payLaterMessagingProductDetails) {
 *   // Render PayPal Pay Later message on product detail page
 * }
 * ```
 *
 * @see {@link PaypalConfigHelper} for PayPal configuration management
 * @see {@link PayPalStyling} for PayPal styling configurations
 * @since 1.0.0
 */
export interface PaypalConfig {
  /**
   * Global flag controlling whether PayPal Pay Later functionality is enabled.
   *
   * When set to `false`, all PayPal Pay Later features should be disabled
   * regardless of individual page-specific settings. When `true`, individual
   * page settings determine where Pay Later messages are displayed.
   *
   * @example
   * ```typescript
   * if (config.payLaterEnabled) {
   *   // PayPal Pay Later features are available
   *   initializePayPalIntegration();
   * }
   * ```
   */
  payLaterEnabled: boolean;

  /**
   * Controls display of PayPal Pay Later messages on the home/landing page.
   *
   * When enabled, PayPal Pay Later promotional messages will be rendered
   * on the homepage to inform visitors about flexible payment options
   * available throughout the site.
   *
   * @example
   * ```typescript
   * if (config.payLaterEnabled && config.payLaterMessagingHome) {
   *   renderPayPalMessage('#home-paypal-message', 'home');
   * }
   * ```
   */
  payLaterMessagingHome: boolean;

  /**
   * Controls display of PayPal Pay Later messages on category/listing pages.
   *
   * When enabled, Pay Later messages will appear on product category pages
   * and search result listings, typically integrated within the product grid
   * or category overview sections.
   *
   * @example
   * ```typescript
   * if (config.payLaterEnabled && config.payLaterMessagingCategory) {
   *   renderPayPalMessage('#category-paypal-message', 'category');
   * }
   * ```
   */
  payLaterMessagingCategory: boolean;

  /**
   * Controls display of PayPal Pay Later messages on Product Detail Pages (PDP).
   *
   * When enabled, Pay Later messages will be shown on individual product pages,
   * typically near pricing information or add-to-cart functionality to inform
   * customers about flexible payment options for specific products.
   *
   * @example
   * ```typescript
   * if (config.payLaterEnabled && config.payLaterMessagingProductDetails) {
   *   renderPayPalMessage('#product-paypal-message', 'product-details');
   * }
   * ```
   */
  payLaterMessagingProductDetails: boolean;

  /**
   * Controls display of PayPal Pay Later messages on cart/basket pages.
   *
   * When enabled, Pay Later messages will appear in the shopping cart,
   * typically in the cart summary or near checkout buttons to inform
   * customers about payment flexibility for their current cart contents.
   *
   * @example
   * ```typescript
   * if (config.payLaterEnabled && config.payLaterMessagingCart) {
   *   renderPayPalMessage('#cart-paypal-message', 'cart');
   * }
   * ```
   */
  payLaterMessagingCart: boolean;

  /**
   * Controls display of PayPal Pay Later messages on payment/checkout pages.
   *
   * When enabled, Pay Later messages will be displayed during the checkout
   * process, typically near payment method selection or order summary sections
   * to provide final payment option information before order completion.
   *
   * @example
   * ```typescript
   * if (config.payLaterEnabled && config.payLaterMessagingPayment) {
   *   renderPayPalMessage('#checkout-paypal-message', 'checkout');
   * }
   * ```
   */
  payLaterMessagingPayment: boolean;
}
