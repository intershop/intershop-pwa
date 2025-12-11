import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, switchMap, take } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalPageType } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

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
  pageType: PaypalPageType;
  /** Namespace used to access the PayPal SDK instance on the window object */
  scriptNamespace: string;
  /** Type of PayPal component to create ('buttons' or 'messages' or 'hostedFields') */
  componentType: string;
  /** PayPal payment method configuration (required for buttons) */
  paypalPaymentMethod?: PaymentMethod;
  /** Amount to be used in the component (required for messages) */
  amount?: number;
  /** container id of rendering div */
  containerId?: string;
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
    private paymentService: PaymentService,
    private translateService: TranslateService
  ) {}

  /**
   * Creates a PayPal component based on the provided configuration.
   */
  build(config: PaypalComponentsConfig): Promise<void> {
    switch (config.componentType) {
      case 'buttons':
        return new PayPalButtons(
          config,
          this.getBasket(),
          this.checkoutFacade,
          this.ngZone,
          this.router
        ).renderButtons();
      case 'messages':
        return new PayPalMessages({ ...config, amount: this.getAmount(config) }).renderMessages();
      case 'cardFields':
        return new PayPalCardFields(this.ngZone, this.paymentService, this.translateService).renderCardFields(
          config.scriptNamespace,
          config.paypalPaymentMethod
        );
      default:
        return Promise.reject(new Error(`Unsupported PayPal component type: ${config.componentType}`));
    }
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
