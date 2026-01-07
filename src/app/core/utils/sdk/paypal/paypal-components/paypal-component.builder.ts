import { Injectable, inject } from '@angular/core';
import { filter, map, switchMap, take } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalComponentTypes, PaypalPageTypes } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

import { PayPalButtons } from './buttons/paypal-buttons';
import { PayPalCardFields } from './card-fields/paypal-card-fields';
import { PayPalMessages } from './messages/paypal-messages';

/**
 * Configuration object for creating PayPal components.
 * Provides all necessary context and callbacks for component initialization.
 *
 * Different component types require different configuration properties:
 * - Buttons: Require `paypalPaymentMethod` and optionally `selectPaypalPaymentMethod`
 * - Messages: Can provide `amount` or it will be calculated based on `pageType`
 */
export interface PaypalComponentsConfig {
  /** The page context where the component is being used (e.g., 'cart', 'checkout') */
  pageType: PaypalPageTypes;
  /** Namespace used to access the PayPal SDK instance on the window object */
  scriptNamespace: string;
  /** Type of PayPal component to create ('buttons' or 'messages' or 'card fields') */
  componentType: PaypalComponentTypes;
  /** PayPal payment method configuration (required for buttons) */
  paypalPaymentMethod?: PaymentMethod;
  /** Amount to be used in the component (required for messages) */
  amount?: number;
  /** The current basket object */
  basket?: Basket;
  /** container id of rendering div */
  containerId?: string;
  /** Callback function to select PayPal as the payment method */
  selectPaypalPaymentMethod?(id: string): void;

  paymentInstrument?(paymentInstrument: PaymentInstrument): void;
}

/**
 * Builder service for creating and configuring PayPal SDK components.
 *
 * The service supports different page types:
 * - **cart/checkout**: Uses basket total for amounts
 * - **product-details**: Uses product sale price
 * - **home/product-listing**: Static or promotional content
 */
@Injectable({ providedIn: 'root' })
export class PaypalComponentBuilder {
  // payPal sdk objects
  private payPalCardFields = inject(PayPalCardFields);
  private payPalButtons = inject(PayPalButtons);
  private payPalMessages = inject(PayPalMessages);

  constructor(private checkoutFacade: CheckoutFacade, private shoppingFacade: ShoppingFacade) {}

  /**
   * Creates a PayPal component based on the provided configuration.
   */
  build(config: PaypalComponentsConfig): Promise<void> {
    switch (config.componentType) {
      case PaypalComponentTypes.Buttons:
        return this.payPalButtons.renderButtons({ ...config, basket: this.getBasket() });
      case PaypalComponentTypes.Messages:
        return this.payPalMessages.renderMessages({ ...config, amount: this.getAmount(config) });
      case PaypalComponentTypes.CardFields:
        return this.payPalCardFields.renderCardFields(config.scriptNamespace, config.paypalPaymentMethod);
      default:
        return Promise.reject(new Error(`Unsupported PayPal component type: ${config.componentType}`));
    }
  }

  private getAmount(config: PaypalComponentsConfig): number {
    let amount = 0;
    if (config.pageType === PaypalPageTypes.ProductDetails) {
      this.shoppingFacade.selectedProductId$
        .pipe(
          whenTruthy(),
          switchMap(id => this.shoppingFacade.productPrices$(id).pipe(map(prices => prices.salePrice?.value || 0))),
          take(1)
        )
        .subscribe(value => {
          amount = value;
        });
    } else if (config.pageType === PaypalPageTypes.Cart || config.pageType === PaypalPageTypes.CheckoutPayment) {
      this.checkoutFacade.basket$
        .pipe(
          filter(basket => !!basket),
          map(basket => basket.totals?.total.gross),
          take(1)
        )
        .subscribe(value => {
          amount = value;
        });
    }

    return amount;
  }

  private getBasket(): Basket {
    let basket: Basket;
    this.checkoutFacade.basket$.pipe(whenTruthy(), take(1)).subscribe(b => (basket = b));
    return basket;
  }
}
