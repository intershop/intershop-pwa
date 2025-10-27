import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  concatMap,
  filter,
  firstValueFrom,
  map,
  race,
  shareReplay,
  take,
  timer,
} from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PayPalStyling } from 'ish-core/models/paypal-config/paypal-styling';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalButtonsPageType, PaypalConfigService } from 'ish-core/utils/paypal-config/paypal-config.service';

/**
 * PayPal Payment Component for handling PayPal button integration and checkout flow.
 *
 * This component manages the PayPal SDK integration for both standard checkout and express
 * checkout flows. It dynamically loads PayPal scripts, renders payment buttons, and handles
 * the complete payment process including order creation, payment approval, and error handling.
 *
 * Key Features:
 * - Dynamic PayPal script loading using centralized PaypalConfigService
 * - Support for both checkout and express checkout flows
 * - Consistent styling through PayPalStyling constants
 * - Dynamic namespace handling for multiple PayPal integrations
 * - Comprehensive error handling and user feedback
 * - PayPal Messages integration for payment method promotion
 *
 * The component integrates with the checkout process by:
 * 1. Loading appropriate PayPal scripts based on payment method configuration
 * 2. Rendering PayPal buttons in designated containers
 * 3. Handling payment flow through PayPal's hosted checkout
 * 4. Managing basket updates and navigation upon completion
 *
 * @example
 * ```html
 * <ish-payment-paypal [pageType]="cart" (selectPaypalPaymentMethod)="onPaymentMethodSelected($event)">
 * </ish-payment-paypal>
 * ```
 *
 * @see {@link CheckoutPaymentPageComponent} - Main checkout page integration
 * @see {@link PaymentPaypalMessagesComponent} - PayPal messaging component
 * @see {@link PaypalConfigService} - PayPal configuration and script loading
 * @see {@link PayPalStyling} - Centralized PayPal styling constants
 */
@Component({
  selector: 'ish-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The type of page where the component is displayed.
   * Determines which PayPal message styling and configuration to use.
   */
  @Input() pageType: PaypalButtonsPageType = 'cart';

  /**
   * Event emitted when a PayPal payment method is selected.
   * Emits the payment instrument ID for the selected PayPal payment method.
   */
  @Output() selectPaypalPaymentMethod = new EventEmitter<string>();

  private readonly paypalButtonsContainerId = '#paypal-buttons-container';

  isPaypalPaymentMethodSelected$: Observable<boolean>;
  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);

  private basket$ = this.checkoutFacade.basket$.pipe(shareReplay(1));
  private paypalPaymentMethod$: Observable<PaymentMethod>;

  /** References to PayPal component instances for proper cleanup */
  private paypalButtonsComponent: { close?(): void } | undefined;

  private destroyRef = inject(DestroyRef);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private ngZone: NgZone,
    private router: Router,
    private paypalConfigService: PaypalConfigService
  ) {}

  ngOnInit(): void {
    this.paypalPaymentMethod$ = this.checkoutFacade
      .paypalPaymentMethod$(this.pageType === 'cart' ? 'FastCheckout' : 'RedirectBeforeCheckout')
      .pipe(shareReplay(1));
    this.isPaypalPaymentMethodSelected$ = combineLatest({
      method: this.paypalPaymentMethod$,
      basket: this.basket$,
    }).pipe(map(({ method, basket }) => method?.paymentInstruments[0]?.id === basket?.payment?.paymentInstrument?.id));
  }

  ngAfterViewInit() {
    this.loadScript();
  }

  /**
   * Loads PayPal SDK script and initializes payment buttons.
   */
  private loadScript() {
    combineLatest({
      basket: this.basket$.pipe(whenTruthy()),
      paypalPaymentMethod: this.paypalPaymentMethod$.pipe(whenTruthy()),
    })
      .pipe(
        take(1),
        concatMap(
          ({
            basket,
            paypalPaymentMethod,
          }): Observable<{
            basket: Basket;
            paypalPaymentMethod: PaymentMethod;
          }> => {
            if (paypalPaymentMethod.hostedPaymentPageParameters?.length) {
              return this.paypalConfigService
                .loadPayPalScript({
                  paymentMethod: paypalPaymentMethod,
                  page: this.pageType,
                  type: 'button',
                })
                .pipe(
                  map(() => ({
                    basket,
                    paypalPaymentMethod,
                  }))
                );
            }
            return new Observable(observer => observer.complete());
          }
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ basket, paypalPaymentMethod }) => {
          this.pageType !== 'checkout'
            ? this.initializePaypalExpressButton(paypalPaymentMethod)
            : this.initializePaypalCheckoutButton(basket, paypalPaymentMethod);
        },
        error: () => {
          this.scriptLoaded$.next(false);
        },
      });
  }

  /**
   * Initializes PayPal checkout button for standard checkout flow.
   *
   * Creates and renders PayPal payment buttons with proper event handlers for:
   * - Order creation with basket totals
   * - Payment approval and processing
   * - Shipping address change handling
   * - Error and cancellation scenarios
   *
   * Also optionally renders PayPal Messages for payment method promotion.
   *
   * @param basket - Current shopping basket
   * @param paypalPaymentMethod - PayPal payment method configuration
   * @param displayMessage - Whether to show promotional PayPal messages
   * @private
   */
  private initializePaypalCheckoutButton(basket: Basket, paypalPaymentMethod: PaymentMethod) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypalObject = (window as any)['PayPal_iframe_'.concat(paypalPaymentMethod.id, '_button')];
    if (paypalObject?.Buttons) {
      this.scriptLoaded$.next(true);

      let isShippingAddressChanged = false;

      const paypalButtonsConfig = paypalObject.Buttons({
        style: PayPalStyling.PAYPAL_CHECKOUT_BUTTON_STYLING,
        // Call your server to set up the transaction after the user has clicked the button
        createOrder: (data: { paymentSource: string }) => {
          isShippingAddressChanged = false;
          this.selectPaypalPaymentMethod.emit(
            paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId
          );
          // eslint-disable-next-line no-console
          console.log('createOrder', data);
          return firstValueFrom(this.getPaypalOrderId$().pipe(take(1)));
        },
        // after the user has submitted the payment in the paypal overlay
        onApprove: (data: { payerID: string; orderID: string }) => {
          // eslint-disable-next-line no-console
          console.log('onApprove', data);
          // ngZone is needed to navigate outside of the Angular zone in a callback function
          this.ngZone.run(() => {
            this.router.navigate(['/checkout/review'], {
              queryParams: {
                redirect: 'success',
                token: data.orderID,
                PayerID: data.payerID,
                shippingAddressChanged: isShippingAddressChanged,
              },
            });
          });
        },
        // in case the shipping address was changed in the paypal overlay
        onShippingAddressChange: (data: {
          shippingAddress: { city: string; countryCode: string; postalCode: string; state: string };
        }) => {
          // eslint-disable-next-line no-console
          console.log('onShippingAddressChange', data);

          const normalize = (val: string) => val?.trim()?.toLowerCase();
          const basketAddress = basket?.commonShipToAddress;
          const shippingAddress = data?.shippingAddress;

          isShippingAddressChanged =
            normalize(basketAddress?.country) !== normalize(shippingAddress?.countryCode) &&
            normalize(basketAddress?.postalCode) !== normalize(shippingAddress?.postalCode) &&
            normalize(basketAddress?.city) !== normalize(shippingAddress?.city);
          // no state comparison, because it is not available in the basket and also not always provided by paypal
        },
        // after the user has cancelled the payment in the paypal overlay
        onCancel: () => {
          this.checkoutFacade.deleteBasketPayment(paypalPaymentMethod.paymentInstruments[0]);
          this.ngZone.run(() => {
            this.router.navigate(['/checkout/payment'], { queryParams: { redirect: 'cancel' } });
          });
        },
        // show a generic error message in case of an error
        onError: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/checkout/payment'], { queryParams: { redirect: 'failure' } });
          });
        },
      });
      this.paypalButtonsComponent = paypalButtonsConfig.render(this.paypalButtonsContainerId);
    }
  }

  /**
   * Initializes PayPal express checkout button for quick payment from product/basket pages.
   *
   * Creates and renders PayPal express payment buttons that allow customers to:
   * - Make payments without going through full checkout process
   * - Handle order creation and payment approval
   * - Navigate directly to basket upon completion
   * - Display appropriate error messages for failures
   *
   * Also optionally renders PayPal Messages for cart-specific payment promotion.
   *
   * @param paypalPaymentMethod - PayPal payment method configuration
   * @param displayMessage - Whether to show promotional PayPal messages
   * @private
   */
  private initializePaypalExpressButton(paypalPaymentMethod: PaymentMethod) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypalObject = (window as any)['PayPal_iframe_'.concat(paypalPaymentMethod.id, '_button')];
    if (paypalObject?.Buttons) {
      this.scriptLoaded$.next(true);

      const paypalExpressButtonsConfig = paypalObject.Buttons({
        style: PayPalStyling.PAYPAL_EXPRESS_BUTTON_STYLING,
        // Call your server to set up the transaction after the user has clicked the button
        createOrder: (data: { paymentSource: string }) => {
          this.selectPaypalPaymentMethod.emit(
            paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId
          );
          // eslint-disable-next-line no-console
          console.log('createOrder', data);
          return firstValueFrom(this.getPaypalOrderId$().pipe(take(1)));
        },
        // after the user has submitted the payment in the paypal overlay
        onApprove: (data: { payerID: string; orderID: string }) => {
          // eslint-disable-next-line no-console
          console.log('onApprove', data);
          // ngZone is needed to navigate outside of the Angular zone in a callback function
          this.ngZone.run(() => {
            this.router.navigate(['/checkout/review'], {
              queryParams: {
                redirect: 'success',
                token: data.orderID,
                PayerID: data.payerID,
                shippingAddressChanged: true, // always true, because shipping address is not known before
              },
            });
          });
        },
        // after the user has cancelled the payment in the paypal overlay
        onCancel: () => {
          this.checkoutFacade.deleteBasketPayment(paypalPaymentMethod.paymentInstruments[0]);
          this.ngZone.run(() => {
            this.router.navigate(['/basket'], { queryParams: { redirect: 'cancel' } });
          });
        },
        // show a generic error message in case of an error
        onError: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/basket'], { queryParams: { redirect: 'failure' } });
          });
        },
      });
      this.paypalButtonsComponent = paypalExpressButtonsConfig.render(this.paypalButtonsContainerId);
    }
  }

  private getPaypalOrderId$(): Observable<string> {
    return race(
      this.checkoutFacade.basket$.pipe(
        whenTruthy(),
        filter(
          basket =>
            basket.payment?.capabilities?.includes('PaypalCheckout') && basket.payment.redirectUrl?.includes('token=')
        ),
        map(basket => basket.payment.redirectUrl.split('token=')[1]),
        take(1)
      ),
      timer(4000).pipe(map(() => ''))
    );
  }

  /**
   * Component cleanup lifecycle hook.
   *
   * Properly cleans up PayPal components and removes the loaded script from the DOM
   * when the component is destroyed. This prevents memory leaks, zoid errors, and
   * ensures clean component lifecycle management.
   *
   * The cleanup process:
   * 1. Closes active PayPal button components to prevent zoid destruction errors
   * 2. Closes active PayPal message components to clean up rendering state
   * 3. Removes the PayPal script from the DOM to free memory
   *
   * This is especially important for PayPal scripts which can be large and contain
   * global state that should be cleaned up properly to avoid conflicts.
   */
  ngOnDestroy(): void {
    // Clean up PayPal components before removing the script to prevent zoid errors
    try {
      if (this.paypalButtonsComponent?.close) {
        this.paypalButtonsComponent.close();
      }
    } catch (error) {
      // Ignore cleanup errors - components may already be destroyed
      console.warn('PayPal component cleanup warning:', error);
    }
  }
}
