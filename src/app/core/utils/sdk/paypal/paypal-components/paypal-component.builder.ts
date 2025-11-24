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
import { MESSAGES } from './messages/paypal-messages';

/**
 * Represents a rendered PayPal component (buttons, messages, marks, etc.).
 * All PayPal SDK components implement this interface to provide a consistent API.
 */
export interface PaypalComponent {
  /** Renders the component into the specified DOM selector */
  render(selector: string): Promise<void>;
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
export interface PaypalSdk {
  /** Creates PayPal payment buttons with checkout functionality */
  Buttons(options: unknown): PaypalComponent;
  /** Creates PayPal promotional messages (optional, not all SDK versions include this) */
  Messages?(options: unknown): PaypalComponent;
  /** Creates PayPal payment marks for alternative payment methods */
  Marks(options: unknown): PaypalComponent;
  /** Creates PayPal hosted card input fields */
  CardFields(options: unknown): PaypalComponent;
  /** Creates PayPal hosted payment input fields */
  PaymentFields(options: unknown): PaypalComponent;
  /** Internal flag indicating if the SDK instance has been destroyed */
  _destroyed?: boolean;
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
  /** Type of PayPal component to create ('buttons' or 'messages') */
  componentType: string;
  /** PayPal payment method configuration (required for buttons) */
  paypalPaymentMethod?: PaymentMethod;
  /** Amount to be used in the component (required for messages) */
  amount?: number;
  /** Callback function to select PayPal as the payment method */
  selectPaypalPaymentMethod?(id: string): void;
}

/**
 * Factory service for creating and configuring PayPal SDK components.
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
 *
 * @example
 * // Create PayPal buttons for checkout page
 * const buttons = this.paypalComponentBuilder.get({
 *   pageType: 'checkout',
 *   scriptNamespace: 'paypal_checkout',
 *   componentType: 'buttons',
 *   paypalPaymentMethod: this.paymentMethod,
 *   selectPaypalPaymentMethod: (id) => this.selectPayment(id)
 * });
 * await buttons.render('#paypal-button-container');
 *
 * @example
 * // Create PayPal promotional messages for product page
 * const messages = this.paypalComponentBuilder.get({
 *   pageType: 'product-details',
 *   scriptNamespace: 'paypal_pdp',
 *   componentType: 'messages'
 * });
 * await messages.render('#paypal-message-container');
 */
@Injectable({ providedIn: 'root' })
export class PaypalComponentBuilder {
  constructor(
    private ngZone: NgZone,
    private router: Router,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade
  ) {}

  /**
   * Creates a PayPal component based on the provided configuration.
   *
   * This method acts as a factory that:
   * 1. Retrieves the PayPal SDK from the window object using the namespace
   * 2. Determines which component type to create (buttons or messages)
   * 3. Gathers necessary context data (basket, amount, etc.)
   * 4. Calls the appropriate PayPal SDK factory method with configuration
   * 5. Returns a component that can be rendered into the DOM
   *
   * Component types:
   * - **buttons**: Payment buttons with full checkout flow integration
   * - **messages**: Promotional messages showing payment options and offers
   *
   * @param config - Configuration object containing page type, component type, and payment method
   * @returns A PaypalComponent instance ready to be rendered
   *
   * @example
   * const component = this.paypalComponentBuilder.get({
   *   pageType: 'cart',
   *   scriptNamespace: 'paypal_cart',
   *   componentType: 'buttons',
   *   paypalPaymentMethod: this.paymentMethod
   * });
   */
  get(config: PaypalComponentsConfig): PaypalComponent {
    const paypalObject = (window as unknown as Record<string, PaypalSdk>)[config.scriptNamespace];

    switch (config.componentType) {
      case 'buttons':
        return paypalObject.Buttons(BUTTONS(config, this.getBasket(), this.checkoutFacade, this.ngZone, this.router));
      case 'messages':
        return paypalObject.Messages(MESSAGES({ ...config, amount: this.getAmount(config) }));
      default:
        return <PaypalComponent>{};
    }
  }

  /**
   * Calculates the amount to display in PayPal components based on page context.
   *
   * This method determines the appropriate amount to show in PayPal messages or other
   * components by examining the current page type and retrieving relevant pricing data:
   *
   * - **product-details**: Fetches the selected product's sale price
   * - **cart/checkout**: Uses the basket's total gross amount
   * - **other pages**: Returns 0 (for promotional content without specific amounts)
   *
   * The method uses synchronous subscriptions with `take(1)` to get the current value
   * immediately, as PayPal component initialization requires the amount upfront.
   *
   * @param config - Configuration object containing page type and optional pre-calculated amount
   * @returns The calculated amount, or 0 if no amount can be determined
   */
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

  /**
   * Retrieves the current basket synchronously for PayPal button configuration.
   *
   * This method fetches the current basket state using a synchronous subscription
   * with `take(1)` to get the immediate value. This is necessary because PayPal
   * buttons need basket data during initialization to set up the payment flow.
   *
   * The basket is required for PayPal buttons to:
   * - Create the order with correct line items and totals
   * - Calculate shipping and tax during checkout
   * - Display accurate payment information to the user
   *
   * @returns The current basket, or undefined if no basket exists
   */
  private getBasket(): Basket {
    let basket: Basket;
    this.checkoutFacade.basket$.pipe(whenTruthy(), take(1)).subscribe(b => (basket = b));
    return basket;
  }
}
