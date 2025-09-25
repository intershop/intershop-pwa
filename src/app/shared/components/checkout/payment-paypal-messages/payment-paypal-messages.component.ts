/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatLatestFrom } from '@ngrx/effects';
import { BehaviorSubject, Observable, distinctUntilChanged, filter, iif, map, of, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PaypalConfigHelper } from 'ish-core/models/paypal-config/paypal-config.helper';
import { PayPalStyling } from 'ish-core/models/paypal-config/paypal-styling';

/**
 * Component for displaying PayPal Pay Later messages on different pages.
 *
 * This component dynamically loads PayPal SDK and renders promotional messages
 * that inform customers about PayPal financing options (Pay Later/Pay in 3/Pay in 4).
 * The messages are contextual and can display different content based on the page type
 * and current amount.
 *
 * @example
 * <!-- Product listing page -->
 * <ish-payment-paypal-messages pageType="product-listing"></ish-payment-paypal-messages>
 *
 * <!-- Product details page -->
 * <ish-payment-paypal-messages
 *   pageType="product-details"
 *   [productSKU]="product.sku">
 * </ish-payment-paypal-messages>
 *
 * <!-- Cart/Checkout page -->
 * <ish-payment-paypal-messages pageType="cart"></ish-payment-paypal-messages>
 */
@Component({
  selector: 'ish-payment-paypal-messages',
  templateUrl: './payment-paypal-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalMessagesComponent implements OnInit {
  /**
   * The type of page where the component is displayed.
   * Determines which PayPal message styling and configuration to use.
   */
  @Input() pageType: 'product-details' | 'cart' | 'checkout' | 'product-listing' = 'cart';

  /**
   * Product SKU for product detail pages.
   * Required when pageType is 'product-details' to calculate the correct amount.
   */
  @Input() productSKU: string;

  /** DOM selector for the PayPal messages container element */
  private readonly paypalMessagesContainerId = '#paypal-messages-container';

  /** Observable indicating whether the PayPal script has been loaded and messages rendered */
  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);

  /** Observable stream for the current amount to display in messages */
  private amount$: Observable<number>;

  /** DestroyRef for handling component cleanup */
  private destroyRef = inject(DestroyRef);

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private paypalConfigHelper: PaypalConfigHelper
  ) {}

  /**
   * Initializes the component by setting up the amount observable and loading the PayPal script.
   * The amount is determined based on the page type:
   * - Product details: Uses the product's sale price
   * - Cart/Checkout: Uses the basket's total amount
   * - Product listing: Uses 0 (no specific amount)
   */
  ngOnInit(): void {
    this.amount$ = iif(
      () => this.pageType === 'product-details' && !!this.productSKU,
      this.shoppingFacade.productPrices$(this.productSKU).pipe(map(prices => prices?.salePrice?.value ?? 0)),
      iif(
        () => this.pageType === 'cart' || this.pageType === 'checkout',
        this.checkoutFacade.basket$.pipe(map(basket => basket?.totals?.total?.gross ?? 0)),
        of(0)
      )
    );

    this.loadScript();
  }

  /**
   * Loads the PayPal script and initializes the message rendering process.
   *
   * This method:
   * 1. Gets the appropriate PayPal payment method based on page type
   * 2. Combines it with PayPal configuration and current amount
   * 3. Filters based on funding eligibility for the current page
   * 4. Loads the PayPal script using PaypalConfigHelper
   * 5. Renders the messages when script loading is complete
   */
  private loadScript() {
    this.checkoutFacade
      .paypalPaymentMethod$(this.pageType !== 'checkout' ? 'FastCheckout' : 'RedirectBeforeCheckout')
      .pipe(
        concatLatestFrom(() => [this.appFacade.payPalConfig$, this.amount$]),
        filter(([, config]) => this.paypalConfigHelper.isFundingEnabled(config, this.pageType)),
        distinctUntilChanged(
          ([prevMethod, , prevAmount], [currMethod, , currAmount]) =>
            prevMethod?.id === currMethod?.id && prevAmount === currAmount
        ),
        switchMap(([paymentMethod, , amount]) => {
          if (paymentMethod?.hostedPaymentPageParameters?.length) {
            return this.paypalConfigHelper
              .loadPayPalScript({
                hostedPaymentPageParameters: paymentMethod?.hostedPaymentPageParameters ?? [],
                page: this.pageType,
                type: 'message',
              })
              .pipe(
                map(nameSpace => ({
                  nameSpace,
                  amount,
                }))
              );
          }
          return of({ nameSpace: '', amount });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: data => {
          if (data.nameSpace) {
            this.renderPaypalMessages(data.amount);
          }
        },
        error: () => {
          this.scriptLoaded$.next(false);
        },
      });
  }

  /**
   * Renders PayPal messages using the loaded PayPal SDK.
   *
   * @param amount The current amount to display in the message (used for product details, cart, checkout)
   * @param nameSpace The PayPal SDK namespace loaded dynamically (e.g., 'paypal', 'paypal_sdk')
   */
  private renderPaypalMessages(amount: number) {
    let messageConfig;

    switch (this.pageType) {
      case 'product-listing':
        messageConfig = { style: PayPalStyling.CATEGORY_MESSAGE_STYLING };
        break;
      case 'product-details':
        messageConfig = { amount, style: PayPalStyling.PDP_MESSAGE_STYLING };
        break;
      default:
        messageConfig = { amount, style: PayPalStyling.CART_CHECKOUT_MESSAGE_STYLING };
        break;
    }
    this.scriptLoaded$.next(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypalObject = (window as any).PayPal_iframe_message;
    paypalObject
      .Messages(messageConfig)
      .render(this.paypalMessagesContainerId)
      .catch((error: string) => {
        console.error('PayPal Messages render failed:', error);
      });
  }
}
