import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_MESSAGE_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

/**
 * Representation of the PayPal SDK Messages object, responsible for rendering PayPal messages.
 * Life cycle of this component ends with destroying of parent component PaymentPaypalComponent.
 **/
@Injectable()
export class PaypalMessagesAdapter {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private paypalConfigService: PaypalConfigService,
    private ngZone: NgZone
  ) {}

  private destroyRef = inject(DestroyRef);

  /**
   * Renders PayPal Messages in the specified container.
   * @param config
   * @returns
   */
  renderMessages(config: PaypalComponentsConfig): Promise<void> {
    const paypalObject = this.paypalConfigService.getPaypalComponent();
    const containerId = config.containerId;

    // Verify element exists at initialization
    if (!document.getElementById(containerId)) {
      throw new Error(`Container element '${containerId}' not found in DOM at initialization`);
    }

    if (!paypalObject?.Messages) {
      throw new Error(
        `PayPal Messages not available in loaded paypal sdk script with namespace '${config.scriptNamespace}'`
      );
    }

    // Run subscription outside Angular zone to prevent blocking app stability
    this.ngZone.runOutsideAngular(() => {
      config.amount$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(amount => {
        // Check if element still exists before each render attempt
        if (!this.document.getElementById(containerId)) {
          // Element has been removed from DOM, skip rendering silently
          return;
        }

        if (amount) {
          return paypalObject.Messages(this.getMessagesConfig(config, amount)).render(`#${containerId}`);
        }
        return paypalObject.Messages(this.getMessagesConfig(config)).render(`#${containerId}`);
      });
    });
    return Promise.resolve();
  }

  private getMessagesConfig(config: PaypalComponentsConfig, amount?: number) {
    let messageConfig;

    switch (config.pageType) {
      case 'home':
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.home };
        break;
      case 'product-listing':
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.category };
        break;
      case 'product-details':
        messageConfig = { amount, style: PAYPAL_MESSAGE_STYLING.product };
        break;
      case 'checkout':
        messageConfig = { amount, style: PAYPAL_MESSAGE_STYLING.checkout };
        break;
      default:
        messageConfig = { amount, style: PAYPAL_MESSAGE_STYLING.cart };
        break;
    }

    return messageConfig;
  }
}
