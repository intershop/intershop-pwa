import { Injectable } from '@angular/core';

import { PaypalComponentsConfig } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PAYPAL_MESSAGE_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';
import { PaypalPageTypes } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';
import { PaypalComponent } from 'ish-core/utils/sdk/paypal/paypal-model/paypal.interface';

@Injectable({ providedIn: 'root' })
export class PayPalMessages {
  private config: PaypalComponentsConfig;

  async renderMessages(config: PaypalComponentsConfig): Promise<void> {
    this.config = config;
    // Access PayPal SDK from window object
    const paypalObject = (window as unknown as Record<string, PaypalComponent>)[this.config.scriptNamespace];

    if (!paypalObject?.Messages) {
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
      case PaypalPageTypes.Home:
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.home };
        break;
      case PaypalPageTypes.ProductListing:
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.category };
        break;
      case PaypalPageTypes.ProductDetails:
        messageConfig = { amount: this.config.amount, style: PAYPAL_MESSAGE_STYLING.product };
        break;
      case PaypalPageTypes.CheckoutPayment:
        messageConfig = { amount: this.config.amount, style: PAYPAL_MESSAGE_STYLING.checkout };
        break;
      default:
        messageConfig = { amount: this.config.amount, style: PAYPAL_MESSAGE_STYLING.cart };
        break;
    }

    return messageConfig;
  }
}
