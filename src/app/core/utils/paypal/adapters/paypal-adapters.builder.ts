import { Injectable, inject } from '@angular/core';
import { Observable, filter, from, map, of, switchMap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalAdapterTypes, PaypalPageType } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

import { PayPalButtonsAdapter } from './paypal-buttons/paypal-buttons.adapter';
import { PayPalCardFieldsAdapter } from './paypal-card-fields/paypal-card-fields.adapter';
import { PayPalMessagesAdapter } from './paypal-messages/paypal-messages.adapter';

/**
 * Configuration object for creating PayPal components.
 * Provides all necessary context and callbacks for component initialization.
 *
 */
export interface PaypalComponentsConfig {
  /** The page context where the component is being used (e.g., 'cart', 'checkout') */
  pageType: PaypalPageType;
  /** Namespace used to access the PayPal SDK instance on the window object */
  scriptNamespace: string;
  /** Type of PayPal component to create ('buttons' or 'messages' or 'card fields') */
  adapterType: PaypalAdapterTypes;
  /** PayPal payment method configuration (required for buttons) */
  paypalPaymentMethod?: PaymentMethod;
  /** Amount to be used in the component (required for messages) */
  amount$?: Observable<number>;
  /** container id of rendering div */
  containerId?: string;

  paymentInstrument?(paymentInstrument: PaymentInstrument): void;
}

/**
 * Builder service for creating and configuring PayPal SDK components.
 */
@Injectable()
export class PaypalAdaptersBuilder {
  // payPal sdk objects
  private payPalCardFields = inject(PayPalCardFieldsAdapter);
  private payPalButtons = inject(PayPalButtonsAdapter);
  private payPalMessages = inject(PayPalMessagesAdapter);

  constructor(private checkoutFacade: CheckoutFacade, private shoppingFacade: ShoppingFacade) {}

  // Creates a PayPal component based on the provided configuration.
  build(config: PaypalComponentsConfig) {
    switch (config.adapterType) {
      case 'Buttons':
        return this.payPalButtons.renderButtons(config);
      case 'Messages':
        return this.payPalMessages.renderMessages({ ...config, amount$: this.getAmount(config) });
      case 'CardFields':
        return from(this.payPalCardFields.renderCardFields(config.scriptNamespace, config.paypalPaymentMethod));
      default:
        return from(Promise.reject(new Error(`Unsupported PayPal component type: ${config.adapterType}`)));
    }
  }

  // Calculates the appropriate amount to display in PayPal components based on page context.
  private getAmount(config: PaypalComponentsConfig): Observable<number> {
    let amount$: Observable<number> = of(0);
    if (config.pageType === 'product-details') {
      amount$ = this.shoppingFacade.selectedProductId$.pipe(
        whenTruthy(),
        switchMap(id => this.shoppingFacade.productPrices$(id).pipe(map(prices => prices.salePrice?.value || 0)))
      );
    } else if (config.pageType === 'cart' || config.pageType === 'checkout') {
      amount$ = this.checkoutFacade.basket$.pipe(
        filter(basket => !!basket),
        map(basket => basket.totals?.total.gross)
      );
    }

    return amount$;
  }
}
