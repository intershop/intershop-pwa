/**
 * PayPal Configuration Model
 *
 * Interface defining the configuration structure for PayPal integration features
 * This configuration controls the availability and display of PayPal Pay Later messaging across different page contexts.
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
   */
  payLaterButtonEnabled: boolean;

  /**
   * Controls the display of PayPal Pay Later messages on the different pages.
   */
  payLaterMessaging: PaypalConfigMessaging;
}
export interface PaypalConfigMessaging {
  onHomepage: boolean;
  onCategoryPage: boolean;
  onProductDetailsPage: boolean;
  onCartPage: boolean;
  onPaymentPage: boolean;
}
