import { Injectable } from '@angular/core';

import { PaypalComponentsConfig } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PAYPAL_MESSAGE_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';
import { PaypalPageTypes } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';
import { PaypalComponent } from 'ish-core/utils/sdk/paypal/paypal-model/paypal.interface';

@Injectable({ providedIn: 'root' })
export class PayPalMessages {
  renderMessages(config: PaypalComponentsConfig): Promise<void> {
    const paypalObject = (window as unknown as Record<string, PaypalComponent>)[config.scriptNamespace];
    const containerId = config.containerId;

    // Verify element still exists right before rendering
    if (!document.getElementById(containerId)) {
      throw new Error(`Container element '${containerId}' no longer exists in DOM`);
    }

    if (!paypalObject?.Messages) {
      throw new Error(
        `PayPal Messages not available in loaded paypal sdk script with namespace '${config.scriptNamespace}'`
      );
    }

    return paypalObject.Messages(this.getMessagesConfig(config)).render(`#${containerId}`);
  }

  private getMessagesConfig(config: PaypalComponentsConfig) {
    let messageConfig;

    switch (config.pageType) {
      case PaypalPageTypes.Home:
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.home };
        break;
      case PaypalPageTypes.ProductListing:
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.category };
        break;
      case PaypalPageTypes.ProductDetails:
        messageConfig = { amount: config.amount, style: PAYPAL_MESSAGE_STYLING.product };
        break;
      case PaypalPageTypes.CheckoutPayment:
        messageConfig = { amount: config.amount, style: PAYPAL_MESSAGE_STYLING.checkout };
        break;
      default:
        messageConfig = { amount: config.amount, style: PAYPAL_MESSAGE_STYLING.cart };
        break;
    }

    return messageConfig;
  }
}
