import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  iif,
  map,
  of,
  switchMap,
} from 'rxjs';

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
 * Features:
 * - Supports multiple page types: product details, cart, checkout, and product listing
 * - Automatically calculates display amounts based on context (product price, basket total)
 * - Handles PayPal script loading and error states
 * - Provides proper cleanup to prevent memory leaks
 * - Responsive styling based on page context
 *
 * @example
 * ```html
 * <!-- Product details page -->
 * <ish-payment-paypal-messages pageType="product-details" [productSKU]="product.sku"></ish-payment-paypal-messages>
 *
 * <!-- Cart page -->
 * <ish-payment-paypal-messages pageType="cart"></ish-payment-paypal-messages>
 *
 * <!-- Checkout page -->
 * <ish-payment-paypal-messages pageType="checkout"></ish-payment-paypal-messages>
 * ```
 */
@Component({
  selector: 'ish-payment-paypal-messages',
  templateUrl: './payment-paypal-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalMessagesComponent implements OnInit, OnDestroy {
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

  /** Reference to PayPal messages component instance for proper cleanup */
  private paypalMessagesComponent: { close?(): void } | undefined;

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
   * Initializes the component and sets up the amount observable based on page type.
   *
   * This method:
   * 1. Configures the amount$ observable based on pageType:
   *    - For product-details: Gets product price from shopping facade
   *    - For cart/checkout: Gets basket total from checkout facade
   *    - For other pages: Uses default value of 0
   * 2. Initiates the PayPal script loading process
   *
   * The amount is used to display contextually relevant PayPal financing messages
   * that show potential payment options based on the current transaction value.
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

  private loadScript() {
    combineLatest([
      this.checkoutFacade.paypalPaymentMethod$(
        this.pageType !== 'checkout' ? 'FastCheckout' : 'RedirectBeforeCheckout'
      ),
      this.appFacade.payPalConfig$,
      this.amount$,
    ])
      .pipe(
        filter(([, config]) => this.paypalConfigHelper.isFundingEnabled(config, this.pageType)),
        distinctUntilChanged(
          ([prevMethod, , prevAmount], [currMethod, , currAmount]) =>
            prevMethod?.id === currMethod?.id && prevAmount === currAmount
        ),
        switchMap(([paymentMethod, , amount]) => {
          if (paymentMethod?.hostedPaymentPageParameters?.length) {
            return this.paypalConfigHelper
              .loadPayPalScript({
                paymentMethod,
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
            this.renderPaypalMessages(data.amount, data.nameSpace);
          }
        },
        error: () => {
          this.scriptLoaded$.next(false);
        },
      });
  }

  private renderPaypalMessages(amount: number, nameSpace: string) {
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
    const paypalObject = (window as any)[nameSpace];
    this.paypalMessagesComponent = paypalObject
      .Messages(messageConfig)
      .render(this.paypalMessagesContainerId)
      .catch((error: string) => {
        console.error('PayPal Messages render failed:', error);
      });
  }

  /**
   * Cleanup method called when the component is destroyed.
   *
   * Performs proper cleanup of PayPal messages component to prevent memory leaks
   * and avoid zoid errors that can occur when PayPal components are not properly
   * disposed of before script removal.
   *
   * This method:
   * 1. Safely closes the PayPal messages component if it exists
   * 2. Handles any cleanup errors gracefully to prevent application crashes
   * 3. Logs warnings for diagnostic purposes without throwing errors
   *
   * Note: Cleanup errors are intentionally caught and logged rather than thrown,
   * as the PayPal component may already be destroyed by external factors.
   */
  ngOnDestroy(): void {
    // Clean up PayPal messages component before removing the script to prevent zoid errors
    try {
      if (this.paypalMessagesComponent?.close) {
        this.paypalMessagesComponent.close();
      }
    } catch (error) {
      // Ignore cleanup errors - component may already be destroyed
      console.warn('PayPal messages component cleanup warning:', error);
    }
  }
}
