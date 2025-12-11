import { PaypalComponentsConfig } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PAYPAL_MESSAGE_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';
import { PaypalComponent } from 'ish-core/utils/sdk/paypal/paypal-model/paypal.interface';

export class PayPalMessages {
  constructor(private config: PaypalComponentsConfig) {}

  async renderMessages(): Promise<void> {
    // Access PayPal SDK from window object
    const paypalObject = (window as unknown as Record<string, PaypalComponent>)[this.config.scriptNamespace];

    if (!paypalObject?.Buttons) {
      return Promise.reject(new Error(`PayPal Messages not available on namespace '${this.config.scriptNamespace}'`));
    }

    try {
      // Verify element still exists right before rendering
      const container = document.getElementById(this.config.containerId);
      if (!container) {
        throw new Error(`Container element '${this.config.containerId}' no longer exists in DOM`);
      }

      const messages = paypalObject.Messages(this.getMessages());

      // Render outside Angular zone - PayPal SDK needs direct DOM access
      await messages.render(`#${this.config.containerId}`);

      return Promise.resolve();
    } catch (error) {
      console.error('PayPal messages rendering failed:', error);
      return Promise.reject(error);
    }
  }

  private getMessages() {
    let messageConfig;

    switch (this.config.pageType) {
      case 'home':
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.home };
        break;
      case 'product-listing':
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.category };
        break;
      case 'product-details':
        messageConfig = { amount: this.config.amount, style: PAYPAL_MESSAGE_STYLING.product };
        break;
      case 'checkout':
        messageConfig = { amount: this.config.amount, style: PAYPAL_MESSAGE_STYLING.checkout };
        break;
      default:
        messageConfig = { amount: this.config.amount, style: PAYPAL_MESSAGE_STYLING.cart };
        break;
    }

    return messageConfig;
  }
}
