import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalPageType } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

import { BUTTONS } from './buttons/paypal-buttons';
import { PayPalCardFieldsService } from './card-fields/card-fields';
import { PayPalCardFieldsComponentCreateOrder } from './card-fields/paypal-card-fields.interface';
import { MESSAGES } from './messages/paypal-messages';

/**
 * Represents a rendered PayPal component (buttons, messages, marks, etc.).
 * All PayPal SDK components implement this interface to provide a consistent API.
 */
export interface PaypalComponent {
  /** Renders the component into the specified DOM selector */
  render(selector?: string): Promise<void>;
}

/**
 * Represents the PayPal JavaScript SDK object loaded from the PayPal CDN.
 * This interface defines the factory methods available on the SDK for creating various PayPal components.
 *
 * The SDK is loaded dynamically and accessed via a namespace on the window object.
 * Each method creates a specific type of PayPal component that can be rendered into the DOM.
 *
 * @see {@link https://developer.paypal.com/docs/checkout/reference/sdk-reference/}
 */
export interface PaypalSdk extends PayPalCardFieldsComponentCreateOrder {
  /** Creates PayPal payment buttons with checkout functionality */
  Buttons(options: unknown): PaypalComponent;
  /** Creates PayPal promotional messages (optional, not all SDK versions include this) */
  Messages?(options: unknown): PaypalComponent;
  /** Creates PayPal payment marks for alternative payment methods */
  Marks(options: unknown): PaypalComponent;
  /** Creates PayPal hosted card input fields */
  CardFields?(options?: unknown): PaypalComponent;
}

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
  pageType: PaypalPageType;
  /** Namespace used to access the PayPal SDK instance on the window object */
  scriptNamespace: string;
  /** Type of PayPal component to create ('buttons' or 'messages' or 'hostedFields') */
  componentType: string;
  /** PayPal payment method configuration (required for buttons) */
  paypalPaymentMethod?: PaymentMethod;
  /** Amount to be used in the component (required for messages) */
  amount?: number;
  /** Callback function to select PayPal as the payment method */
  selectPaypalPaymentMethod?(id: string): void;
}

/**
 * Builder service for creating and configuring PayPal SDK components.
 *
 * This service acts as a bridge between the PayPal JavaScript SDK and the Angular application.
 * It handles the creation of PayPal components (buttons, messages) with proper configuration
 * based on the current application context (page type, basket state, product details).
 *
 * Key responsibilities:
 * - Access the PayPal SDK from the window object using the configured namespace
 * - Create PayPal buttons with checkout functionality and basket integration
 * - Create PayPal promotional messages with dynamic amount calculation
 * - Calculate amounts based on page context (product price, cart total, etc.)
 * - Provide basket data for payment processing
 * - Ensure Angular zone integration for proper change detection
 *
 * The service supports different page types:
 * - **cart/checkout**: Uses basket total for amounts
 * - **product-details**: Uses product sale price
 * - **home/product-listing**: Static or promotional content
 */
@Injectable({ providedIn: 'root' })
export class PaypalComponentBuilder {
  constructor(
    private ngZone: NgZone,
    private router: Router,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private payPalCardFieldsService: PayPalCardFieldsService
  ) {}

  /**
   * Creates a PayPal component based on the provided configuration.
   */
  get(config: PaypalComponentsConfig): PaypalComponent {
    const paypalObject = (window as unknown as Record<string, PaypalSdk>)[config.scriptNamespace];

    if (!paypalObject) {
      throw new Error(`PayPal SDK not found on window object with namespace: ${config.scriptNamespace}`);
    }

    switch (config.componentType) {
      case 'buttons':
        return paypalObject.Buttons(BUTTONS(config, this.getBasket(), this.checkoutFacade, this.ngZone, this.router));
      case 'messages':
        return paypalObject.Messages(MESSAGES({ ...config, amount: this.getAmount(config) }));
      case 'cardFields':
        this.render(config.scriptNamespace, config.paypalPaymentMethod);
        return <PaypalComponent>{};
      default:
        return <PaypalComponent>{};
    }
  }

  render(scriptNamespace: string, paymentMethod: PaymentMethod): Promise<void> {
    return this.payPalCardFieldsService.renderCardFields(scriptNamespace, paymentMethod);
  }

  private getAmount(config: PaypalComponentsConfig): number {
    let amount = 0;
    if (config.pageType === 'product-details') {
      this.shoppingFacade.selectedProductId$
        .pipe(
          whenTruthy(),
          switchMap(id => this.shoppingFacade.productPrices$(id).pipe(map(prices => prices.salePrice?.value || 0))),
          take(1)
        )
        .subscribe(value => {
          amount = value;
        });
    } else if (config.pageType === 'cart' || config.pageType === 'checkout') {
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
