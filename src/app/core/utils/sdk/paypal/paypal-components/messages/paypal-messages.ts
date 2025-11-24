import { PaypalComponentsConfig } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PAYPAL_MESSAGE_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';

/**
 * Creates configuration for PayPal Messages component based on page context.
 *
 * PayPal Messages display promotional content about PayPal payment options
 * (e.g., "Pay Later", installment plans) to customers during their shopping journey.
 * The appearance and behavior of these messages vary depending on where they appear
 * in the application.
 *
 * This function maps page types to appropriate styling and configuration:
 * - **home**: Promotional banner on homepage (no amount)
 * - **product-listing**: Category page promotional content (no amount)
 * - **product-details**: Product-specific messaging with product price
 * - **checkout**: Checkout page messaging with basket total
 * - **cart** (default): Shopping cart messaging with basket total
 *
 * The function applies pre-configured styles from PAYPAL_MESSAGE_STYLING and includes
 * the amount when relevant (product-details, checkout, cart pages).
 *
 * @param config - Configuration object containing page type and optional amount
 * @returns PayPal Messages configuration object with styling, amount (if applicable), and page type
 *
 * @example
 * // Create messages for product details page
 * const messagesConfig = MESSAGES({
 *   pageType: 'product-details',
 *   amount: 99.99,
 *   scriptNamespace: 'paypal',
 *   componentType: 'messages'
 * });
 * // Returns: { amount: 99.99, style: {...}, pageType: 'product-details' }
 *
 * @example
 * // Create messages for homepage (no amount needed)
 * const homeConfig = MESSAGES({
 *   pageType: 'home',
 *   scriptNamespace: 'paypal',
 *   componentType: 'messages'
 * });
 * // Returns: { style: {...}, pageType: 'home' }
 */
export const MESSAGES = (config: PaypalComponentsConfig) => {
  let messageConfig;

  switch (config.pageType) {
    case 'home':
      messageConfig = { style: PAYPAL_MESSAGE_STYLING.home };
      break;
    case 'product-listing':
      messageConfig = { style: PAYPAL_MESSAGE_STYLING.category };
      break;
    case 'product-details':
      messageConfig = { amount: config.amount, style: PAYPAL_MESSAGE_STYLING.product };
      break;
    case 'checkout':
      messageConfig = { amount: config.amount, style: PAYPAL_MESSAGE_STYLING.checkout };
      break;
    default:
      messageConfig = { amount: config.amount, style: PAYPAL_MESSAGE_STYLING.cart };
      break;
  }

  return { ...messageConfig, pageType: config.pageType };
};
