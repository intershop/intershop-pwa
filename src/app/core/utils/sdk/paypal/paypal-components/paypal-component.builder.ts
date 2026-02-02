import { Injectable, inject } from '@angular/core';
import { Observable, filter, from, map, of, switchMap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
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
  amount$?: Observable<number>;
  /** container id of rendering div */
  containerId?: string;

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
   *
   * This method acts as a factory that creates the appropriate PayPal SDK component
   * (Buttons, Messages, or CardFields) based on the component type specified in the config.
   * Each component type requires different configuration properties and has different
   * initialization requirements.
   *
   * Component-specific behavior:
   * - **Buttons**: Renders PayPal payment buttons for checkout, requires basket data
   * - **Messages**: Renders Pay Later promotional messages, calculates amount based on page context
   * - **CardFields**: Renders advanced card input fields for credit/debit card payments
   *
   * @param config - Configuration object containing all necessary component settings
   * @returns Observable that completes when the component is successfully rendered
   * @throws Error if an unsupported component type is provided
   */
  build(config: PaypalComponentsConfig) {
    switch (config.componentType) {
      case PaypalComponentTypes.Buttons:
        return this.payPalButtons.renderButtons(config);
      case PaypalComponentTypes.Messages:
        return this.payPalMessages.renderMessages({ ...config, amount$: this.getAmount(config) });
      case PaypalComponentTypes.CardFields:
        return from(this.payPalCardFields.renderCardFields(config.scriptNamespace, config.paypalPaymentMethod));
      default:
        return from(Promise.reject(new Error(`Unsupported PayPal component type: ${config.componentType}`)));
    }
  }

  /**
   * Calculates the appropriate amount to display in PayPal components based on page context.
   *
   * The amount calculation logic varies by page type:
   * - **Product Details**: Uses the product's sale price from the currently selected product
   * - **Cart/Checkout**: Uses the basket's gross total including all items, taxes, and shipping
   * @param config - Component configuration containing the page type
   * @returns The calculated amount as a number, or 0 if no amount can be determined
   */
  private getAmount(config: PaypalComponentsConfig): Observable<number> {
    let amount$: Observable<number> = of(0);
    if (config.pageType === PaypalPageTypes.ProductDetails) {
      amount$ = this.shoppingFacade.selectedProductId$.pipe(
        whenTruthy(),
        switchMap(id => this.shoppingFacade.productPrices$(id).pipe(map(prices => prices.salePrice?.value || 0)))
      );
    } else if (config.pageType === PaypalPageTypes.Cart || config.pageType === PaypalPageTypes.CheckoutPayment) {
      amount$ = this.checkoutFacade.basket$.pipe(
        filter(basket => !!basket),
        map(basket => basket.totals?.total.gross)
      );
    }

    return amount$;
  }
}
